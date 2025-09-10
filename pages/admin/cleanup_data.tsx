"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClientAnon"; // sesuaikan path client

export default function CleanupOldData() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const cleanup = async () => {
    setLoading(true);
    const newLog: string[] = [];

    try {
      // Tentukan tanggal 2 tahun lalu
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 2);

      // ====== 1. Hapus dari tabel-tabel ======
      const tables = ["peminjaman_kendaraan","peminjaman_peralatan","permintaan_pemeliharaan","peminjaman_ruangan", "pendaftaran_magang"]; // sesuaikan
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .lt("created_at", cutoffDate.toISOString());

        if (error) {
          newLog.push(`❌ Error hapus dari ${table}: ${error.message}`);
        } else {
          newLog.push(`✅ Data lama dihapus dari ${table}`);
        }
      }

      // ====== 2. Hapus dari Storage ======
      // Ambil semua file di bucket "user"
      const { data: files, error: listError } = await supabase.storage
        .from("dokumen-magang")
        .list("", { limit: 1000 }); // jika banyak file, bisa looping per folder

      if (listError) {
        newLog.push(`❌ Error ambil file storage: ${listError.message}`);
      } else {
        if (files && files.length > 0) {
          const oldFiles = files.filter(
            (f) =>
              f.created_at &&
              new Date(f.created_at) < cutoffDate
          );

          if (oldFiles.length > 0) {
            const { error: delError } = await supabase.storage
              .from("dokumen-magang")
              .remove(oldFiles.map((f) => f.name));

            if (delError) {
              newLog.push(`❌ Error hapus file: ${delError.message}`);
            } else {
              newLog.push(`✅ ${oldFiles.length} file lama dihapus dari Storage`);
            }
          } else {
            newLog.push("ℹ️ Tidak ada file lama di Storage");
          }
        }
      }
    } catch (err: any) {
      newLog.push(`❌ Terjadi error: ${err.message}`);
    }

    setLog(newLog);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Cleanup Data Lama</h1>
      <button
        onClick={cleanup}
        disabled={loading}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        {loading ? "Menghapus..." : "Hapus Data > 2 Tahun"}
      </button>

      <div className="mt-4 space-y-1">
        {log.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </div>
  );
}
