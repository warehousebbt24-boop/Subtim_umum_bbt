import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClientAnon";
import * as XLSX from "xlsx";

interface Peminjaman {
  id: number;
  nama: string;
  ruangan: string;
  tanggal_pinjam: string;
  jam_mulai: string;
  jumlah_peserta: number;
  keperluan: string;
  bagian: string;
  status: string;
  created_at: string;
}

export default function CekStatus() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // ambil range 3 tahun kebelakang
  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchPeminjaman = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("peminjaman_ruangan")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data:", error.message);
      } else {
        // filter data sesuai tahun dipilih
        const filtered = (data as Peminjaman[]).filter(
          (item) => new Date(item.tanggal_pinjam).getFullYear() === selectedYear
        );
        setData(filtered);
      }

      setLoading(false);
    };

    fetchPeminjaman();
  }, [selectedYear]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "acc":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "acc":
        return "Disetujui";
      case "pending":
        return "Menunggu";
      default:
        return "Ditolak";
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Peminjaman");
    XLSX.writeFile(workbook, `peminjaman_${selectedYear}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:px-6 flex gap-6">
      {/* Sidebar Tahun */}
      <div className="w-40 bg-white rounded-2xl shadow-md border border-gray-100 p-4 h-fit">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Pilih Tahun</h3>
        <ul className="space-y-2">
          {years.map((year) => (
            <li key={year}>
              <button
                onClick={() => setSelectedYear(year)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedYear === year
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {year}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={downloadExcel}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-3 rounded-lg"
        >
          📥 Unduh Excel
        </button>
      </div>

      {/* Konten Utama */}
      <div className="flex-1">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            Cek Status Peminjaman Ruangan
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
            Pantau status pengajuan peminjaman ruangan Anda secara real-time.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
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
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-800">Belum ada pengajuan</h3>
            <p className="mt-2 text-gray-500">
              Tidak ditemukan data peminjaman pada tahun {selectedYear}.
            </p>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && data.length > 0 && (
          <>
            <div className="hidden md:block">
              <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ruangan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Jam
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Peserta
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Bagian
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Keperluan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          Ruang {item.ruangan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.jam_mulai}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.jumlah_peserta}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.bagian}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {item.keperluan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transform transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">Ruang {item.ruangan}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Nama:</span> {item.nama}
                    </div>
                    <div>
                      <span className="font-medium">Tanggal:</span>{" "}
                      {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID")}
                    </div>
                    <div>
                      <span className="font-medium">Jam:</span> {item.jam_mulai}
                    </div>
                    <div>
                      <span className="font-medium">Peserta:</span> {item.jumlah_peserta}
                    </div>
                    <div>
                      <span className="font-medium">Bagian:</span> {item.bagian}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                      Keperluan
                    </p>
                    <p className="text-sm text-gray-700">{item.keperluan}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
