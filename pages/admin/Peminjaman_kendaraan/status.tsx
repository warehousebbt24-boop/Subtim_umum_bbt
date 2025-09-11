// pages/user/status-peminjaman-tahun.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClientAnon";
import * as XLSX from "xlsx";

interface Peminjaman {
  id: string;
  nama: string;
  bagian: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  keperluan: string;
  driver: string | null;
  no_pol: string | null;
  accepted: boolean | null;
  created_at: string;
}

export default function StatusPeminjamanTahun() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);

  const years = [currentYear, currentYear - 1, currentYear - 2];

  const fetchData = async (year: number) => {
    setLoading(true);
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    const { data, error } = await supabase
      .from("peminjaman_kendaraan")
      .select(
        "id, nama, bagian, tanggal_pinjam, tanggal_kembali, keperluan, driver, no_pol, accepted, created_at"
      )
      .gte("tanggal_pinjam", start)
      .lte("tanggal_pinjam", end)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error.message);
      setData([]);
    } else {
      setData(data as Peminjaman[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  // Status logic
  const getStatus = (row: Peminjaman) => {
    const today = new Date();
    const start = new Date(row.tanggal_pinjam);
    const end = new Date(row.tanggal_kembali);

    if (row.accepted === null)
      return { label: "Menunggu", icon: "⏳", color: "bg-gray-100 text-gray-700 border-gray-200" };
    if (row.accepted === false)
      return { label: "Ditolak", icon: "❌", color: "bg-red-50 text-red-700 border-red-200" };

    if (today < start)
      return { label: "Booking", icon: "📅", color: "bg-blue-50 text-blue-700 border-blue-200" };
    if (today >= start && today <= end)
      return { label: "Dinas", icon: "🚀", color: "bg-yellow-50 text-yellow-700 border-yellow-200" };
    if (today > end)
      return { label: "Selesai", icon: "✅", color: "bg-green-50 text-green-700 border-green-200" };

    return { label: "-", icon: "❓", color: "bg-gray-50 text-gray-500 border-gray-200" };
  };

  // Export Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((row) => ({
        Nama: row.nama,
        Bagian: row.bagian,
        "Tanggal Pinjam": new Date(row.tanggal_pinjam).toLocaleDateString("id-ID"),
        "Tanggal Kembali": new Date(row.tanggal_kembali).toLocaleDateString("id-ID"),
        Keperluan: row.keperluan,
        Driver: row.driver || "-",
        "No. Pol": row.no_pol || "-",
        Status: getStatus(row).label,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Peminjaman_${selectedYear}`);
    XLSX.writeFile(wb, `peminjaman_kendaraan_${selectedYear}.xlsx`);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar Tahun */}
      <div className="w-48 bg-white border-r border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Pilih Tahun</h2>
        <div className="space-y-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                selectedYear === year
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <button
          onClick={exportToExcel}
          disabled={data.length === 0}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          📥 Unduh Excel
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-2xl font-bold shadow-lg mb-4">
            🚗
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            Status Peminjaman Kendaraan {selectedYear}
          </h1>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            Pantau status peminjaman kendaraan dinas Anda untuk tahun {selectedYear}.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-500 rounded-full animate-spin border-t-transparent"></div>
            <p className="text-gray-500 font-medium">Memuat data...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
            {data.length === 0 ? (
              <div className="p-8 text-center text-gray-600">Tidak ada peminjaman tahun {selectedYear}.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Bagian</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Tgl Pinjam</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Tgl Kembali</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Keperluan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">No. Pol</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((row) => {
                    const status = getStatus(row);
                    return (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium">{row.nama}</td>
                        <td className="px-6 py-3 text-sm">{row.bagian}</td>
                        <td className="px-6 py-3 text-sm">
                          {new Date(row.tanggal_pinjam).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {new Date(row.tanggal_kembali).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-3 text-sm max-w-xs truncate">{row.keperluan}</td>
                        <td className="px-6 py-3 text-sm">{row.driver || "-"}</td>
                        <td className="px-6 py-3 text-sm">{row.no_pol || "-"}</td>
                        <td className="px-6 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
                          >
                            {status.icon} {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
