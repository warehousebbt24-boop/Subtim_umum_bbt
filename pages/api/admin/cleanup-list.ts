import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD

  // ambil yang status = rejected ATAU periode < hari ini
  const { data, error } = await supabase
    .from("pendaftaran_magang")
    .select("*")
    .or(`status.eq.rejected,tanggal_end.lt.${today}`);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}
