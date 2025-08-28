// pages/api/admin/pendaftaran/[id]/accept.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend"; // ✅ ganti nodemailer jadi Resend

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!); // ✅ pakai API key dari .env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID tidak valid." });
  }

  try {
    // 🔹 Ambil data pendaftar
    const { data: pendaftar, error: getErr } = await supabase
      .from("pendaftaran_magang")
      .select("id, nama, email, unit_kerja, tanggal_start, periode")
      .eq("id", id)
      .single();

    if (getErr) throw getErr;
    if (!pendaftar) return res.status(404).json({ error: "Pendaftaran tidak ditemukan." });

    // 🔹 Kalau unit_kerja bukan Umum → cek kuota
    if (pendaftar.unit_kerja !== "Umum") {
      const { data: accepted, error: accErr } = await supabase
        .from("pendaftaran_magang")
        .select("tanggal_start, periode")
        .eq("unit_kerja", pendaftar.unit_kerja)
        .eq("status", "accepted");

      if (accErr) throw accErr;

      function expandDates(startStr: string | null, periode: string | number | null): string[] {
        if (!startStr || !periode) return [];
        const start = new Date(startStr);
        if (isNaN(start.getTime())) return [];

        const p =
          typeof periode === "number"
            ? periode
            : parseInt(String(periode).match(/\d+/)?.[0] ?? "0", 10);

        if (!p || p < 1) return [];

        const dates: string[] = [];
        for (let i = 0; i < p; i++) {
          const d = new Date(start);
          d.setDate(d.getDate() + i);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
          ).padStart(2, "0")}`;
          dates.push(key);
        }
        return dates;
      }

      const targetDates = expandDates(pendaftar.tanggal_start, pendaftar.periode);

      const countPerDay: Record<string, number> = {};
      accepted.forEach((row) => {
        expandDates(row.tanggal_start, row.periode).forEach((date) => {
          countPerDay[date] = (countPerDay[date] || 0) + 1;
        });
      });

      const bentrok = targetDates.find((d) => (countPerDay[d] || 0) >= 5);
      if (bentrok) {
        return res.status(400).json({
          error: `Kuota penuh. Pada tanggal ${bentrok} sudah ada 5 peserta diterima di bagian ${pendaftar.unit_kerja}.`,
        });
      }
    }

    // 🔹 Update status jadi accepted
    const { data, error } = await supabase
      .from("pendaftaran_magang")
      .update({ status: "accepted" })
      .eq("id", id)
      .select("id, nama, email")
      .single();

    if (error) throw error;

    // 🔹 Kirim email dengan Resend API
    await resend.emails.send({
      from: "Admin Magang <onboarding@resend.dev>", // ⚠️ ganti pakai domain verified
      to: data.email,
      subject: "Pendaftaran Magang Diterima ✅",
      html: `
        <h2>Halo ${data.nama},</h2>
        <p>Selamat! Pendaftaran magang Anda telah <strong>DITERIMA</strong>.</p>
        <p>Silakan hubungi kami untuk informasi lebih lanjut.</p>
        <br/>
        <p>Terima kasih,</p>
        <p>Tim Admin Magang</p>
      `,
    });

    res.status(200).json({
      message: "Pendaftaran berhasil di-ACC dan email terkirim.",
      data,
    });
  } catch (error: any) {
    console.error("Error di /accept:", error);
    res.status(500).json({ error: error.message || "Terjadi kesalahan internal." });
  }
}
