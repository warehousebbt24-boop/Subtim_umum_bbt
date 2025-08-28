// pages/api/tanggal-tersedia.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Row = {
  tanggal_start: string | null;
  periode: string | number | null;
  unit_kerja: string;
  status: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { unitKerja } = req.body as { unitKerja: string };

  if (!unitKerja) {
    return res.status(400).json({ error: "unitKerja wajib diisi" });
  }

  try {
    const { data, error } = await supabase
      .from("pendaftaran_magang")
      .select("tanggal_start, periode, unit_kerja, status")
      .eq("unit_kerja", unitKerja)
      .eq("status", "accepted");

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Gagal mengambil data dari database" });
    }

    const countPerDay: Record<string, number> = {};

    (data as Row[]).forEach((row) => {
      if (!row.tanggal_start || !row.periode) return;

      const start = new Date(row.tanggal_start);
      if (isNaN(start.getTime())) return;

      // Ekstrak angka dari periode (support "30 hari", 30, dll)
      const p =
        typeof row.periode === "number"
          ? row.periode
          : parseInt(String(row.periode).match(/\d+/)?.[0] ?? "0", 10);

      if (!p || p < 1) return;

      // Loop setiap hari dalam rentang
      for (let i = 0; i < p; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);

        // ✅ Format lokal: YYYY-MM-DD
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        countPerDay[key] = (countPerDay[key] || 0) + 1;
      }
    });

    // Ambil tanggal yang sudah penuh (>=5 pendaftar)
    const fullDates = Object.keys(countPerDay).filter((date) => countPerDay[date] >= 5);

    return res.status(200).json({ fullDates });
  } catch (e: any) {
    console.error("tanggal-tersedia error:", e);
    return res.status(500).json({ error: e.message ?? "Internal server error" });
  }
}