// /pages/api/admin/cleanup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Ambil semua data expired atau rejected
    const { data, error } = await supabase
      .from("pendaftaran_magang")
      .select("id, file_path,status,tanggal_end")
      .or(`status.eq.rejected,tanggal_end.lt.${new Date().toISOString()}`);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(200).json({ message: "Tidak ada data expired / rejected" });
    }

    // Hapus file dari storage
    const filePaths = data.map((row) => row.file_path).filter(Boolean);
    if (filePaths.length > 0) {
      const { error: storageError } = await supabase
        .storage
        .from("dokumen_magang") // ganti dengan nama bucket kamu
        .remove(filePaths);

      if (storageError) throw storageError;
    }

    // Hapus record dari database
    const ids = data.map((row) => row.id);
    const { error: deleteError } = await supabase
      .from("pendaftaran_magang")
      .delete()
      .in("id", ids);

    if (deleteError) throw deleteError;

    res.status(200).json({
      message: "Cleanup berhasil",
      deleted_count: ids.length,
      deleted_ids: ids,
    });
  } catch (err) {
    console.error("Cleanup error:", err);
    res.status(500).json({ error: "Cleanup failed" });
  }
}
