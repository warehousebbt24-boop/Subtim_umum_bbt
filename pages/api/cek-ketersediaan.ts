// pages/api/cek-ketersediaan.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

/**
 * Body JSON: { startISO: string(YYYY-MM-DD), periode: number, unitKerja: string }
 * Return: { ok: boolean, reason?: string, firstBlocked?: string }
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { startISO, periode, unitKerja } = req.body as { startISO: string; periode: number; unitKerja: string };

    if (!startISO || !periode || !unitKerja) {
      return res.status(400).json({ ok: false, reason: "Bad payload: startISO, periode, dan unitKerja wajib diisi" });
    }

    // Ambil data pendaftaran yang approved dan sesuai unit kerja
    const { data, error } = await supabase
      .from("pendaftaran_magang")
      .select("tanggal_start, periode, status, unit_kerja")
      .eq("status", "accepted")
      .eq("unit_kerja", unitKerja); // Filter per unit kerja

    if (error) throw error;

    const countPerDay: Record<string, number> = {};

    data?.forEach((row: any) => {
      if (!row.tanggal_start || !row.periode) return;

      const s = new Date(row.tanggal_start);
      if (isNaN(s.getTime())) return;

      const p =
        typeof row.periode === "number"
          ? row.periode
          : parseInt(String(row.periode).match(/\d+/)?.[0] ?? "0", 10);
      if (!p || p < 1) return;

      for (let i = 0; i < p; i++) {
        const d = new Date(s);
        d.setDate(s.getDate() + i);
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
        countPerDay[key] = (countPerDay[key] || 0) + 1;
      }
    });
      const quotaPerUnit: Record<string, number> = {
        "Subtim Umum": 10,
        default: 5,
      };
      const fullSet = new Set<string>();
      Object.keys(countPerDay).forEach((k) => {
        const quota = quotaPerUnit[unitKerja] ?? quotaPerUnit.default;
        if (countPerDay[k] >= quota) {
          fullSet.add(k);
        }
      });

    // Cek apakah rentang user menabrak tanggal penuh
    const start = new Date(startISO);
    for (let i = 0; i < periode; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      if (fullSet.has(key)) {
        return res.status(200).json({
          ok: false,
          reason: "Periode bertabrakan dengan tanggal penuh",
          firstBlocked: key,
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("cek-ketersediaan error:", e);
    return res.status(500).json({ ok: false, reason: e.message ?? "Internal server error" });
  }
}