
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    console.error("Auth Error:", userError);
    return res.status(401).json({ error: "Invalid token" });
  }

  // Ambil data dari tabel pendaftaran_magang
  const { data, error } = await supabase
    .from("pendaftaran_magang")
    .select("nama, email, nama_sekolah_universitas, jurusan")
    .eq("supabase_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Query Error:", error);
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "User data not found in database" });
  }

  res.status(200).json(data);
}
