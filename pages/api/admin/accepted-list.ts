import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient"; // <- cek relative path!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("pendaftaran_magang")
      .select("id, nama, unit_kerja, tanggal_start, tanggal_end, status")
      .eq("status", "accepted");

    if (error) throw error;

    return res.status(200).json({ data });
  } catch (err: any) {
    console.error("API Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
