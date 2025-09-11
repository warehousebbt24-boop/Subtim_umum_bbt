// pages/user/peralatan_tahun.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClientAnon";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function UserPeralatanTahun() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // ambil 3 tahun ke belakang
  const years = [0, 1, 2, 3].map((i) => new Date().getFullYear() - i);

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const fetchData = async (year: number) => {
    setLoading(true);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from("peminjaman_peralatan")
      .select("*")
      .gte("tanggal_pinjam", startDate)
      .lte("tanggal_pinjam", endDate)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("❌ Gagal memuat data: " + error.message);
    } else {
      setData(data || []);
    }
    setLoading(false);

    setTimeout(() => setMessage(null), 4000);
  };

  const exportToExcel = () => {
    if (data.length === 0) {
      setMessage("❌ Tidak ada data untuk diunduh.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Nama: item.nama,
        Bagian: item.bagian,
        Peralatan: item.peralatan,
        "Tanggal Pinjam": new Date(item.tanggal_pinjam).toLocaleDateString("id-ID"),
        "Tanggal Kembali": new Date(item.tanggal_kembali).toLocaleDateString("id-ID"),
        Keperluan: item.keperluan,
        Status: item.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Peminjaman_${selectedYear}`);

    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Peminjaman_Peralatan_${selectedYear}.xlsx`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            Menunggu
          </span>
        );
      case "acc":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
            ✔ Disetujui
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-200">
            ✅ Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
            —
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar Tahun */}
      <div className="w-52 bg-white shadow-md border-r border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Pilih Tahun</h2>
        <div className="space-y-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`w-full px-4 py-2 rounded-lg text-left font-medium transition ${
                selectedYear === year
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <button
          onClick={exportToExcel}
          className="mt-6 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
        >
          Unduh Excel
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-6 px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            Peminjaman Peralatan {selectedYear}
          </h1>
          <p className="text-gray-600 mt-2">
            Pantau status peminjaman peralatan tahun {selectedYear}.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-center text-sm font-medium border-l-4 animate-fade-in ${
              message.includes("❌")
                ? "bg-red-50 text-red-700 border-red-400"
                : "bg-green-50 text-green-700 border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Tampilkan Data */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="mt-4 text-lg font-medium text-gray-800">Belum ada peminjaman</h3>
            <p className="mt-2 text-gray-500">
              Tidak ada peminjaman pada tahun {selectedYear}.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Nama", "Bagian", "Peralatan", "Pinjam", "Kembali", "Keperluan", "Status"].map(
                    (header, i) => (
                      <th
                        key={i}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.bagian}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.peralatan}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(item.tanggal_kembali).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.keperluan}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
