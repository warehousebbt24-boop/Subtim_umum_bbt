import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client with service role like the working cleanup.ts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role
);

// Definisikan tipe data
type PendaftaranMagang = {
  id: string;
  dokumen_url: string | null;
};

// Definisikan tipe untuk hasil penyimpanan
type StorageResult = {
  success: boolean;
  error: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    // ✅ 1. Ambil data dari Supabase
    const { data, error: fetchError } = await supabase
      .from("pendaftaran_magang")
      .select("id, dokumen_url")
      .or(`status.eq.rejected,tanggal_end.lt.${today}`);

    if (fetchError) {
      console.error("Gagal ambil data:", fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    const pendaftaranList = data as PendaftaranMagang[];

    if (!pendaftaranList || pendaftaranList.length === 0) {
      return res.status(200).json({ message: "Tidak ada data untuk dibersihkan." });
    }

    // ✅ 2. Ekstrak nama file dari dokumen_url
    const filesToDelete = pendaftaranList
      .map((row: PendaftaranMagang) => {
        if (!row.dokumen_url) return null;
        const match = row.dokumen_url.trim().match(/dokumen-magang\/(.+)$/);
        return match ? match[1] : null; // Ensure match is not null
      })
      .filter(Boolean) as string[];

    console.log("Files to delete:", filesToDelete); // Log files to delete
    let storageResult: StorageResult = { success: true, error: null };
    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase
        .storage
        .from("dokumen-magang") // Try with underscore like working version
        .remove(filesToDelete);

      if (storageError) {
        console.error("Gagal hapus file dari storage:", storageError);
        storageResult = { success: false, error: storageError };
      }
    }

    // ✅ 4. Hapus data dari database pakai list id (bukan or di delete)
    const idsToDelete = pendaftaranList.map((row) => row.id);

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("pendaftaran_magang")
        .delete()
        .in("id", idsToDelete);

      if (deleteError) {
        console.error("Gagal hapus dari database:", deleteError);
        return res.status(500).json({
          error: "Gagal menghapus data dari database",
          details: deleteError,
        });
      }
    }

    return res.status(200).json({
      message: "Pembersihan selesai: data dan file dihapus.",
      deletedCount: pendaftaranList.length,
      filesDeleted: filesToDelete.length,
      storageResult: storageResult.success ? "Berhasil" : "Gagal sebagian",
      storageError: storageResult.error,
    });
  } catch (err: any) {
    console.error("Error during cleanup:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
