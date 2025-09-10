import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClientAnon";

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
}

export default function StatusPeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("peminjaman_kendaraan")
      .select(
        "id, nama, bagian, tanggal_pinjam, tanggal_kembali, keperluan, driver, no_pol, accepted, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setData(data as Peminjaman[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi menentukan status berdasarkan accepted + tanggal
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-2xl font-bold shadow-lg mb-4">
            🚗
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            Status Peminjaman Kendaraan
          </h1>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            Pantau status peminjaman kendaraan dinas Anda secara real-time.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-cyan-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
            </div>
            <p className="text-gray-500 font-medium">Memuat data peminjaman Anda...</p>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && (
          <>
            <div className="hidden md:block">
              {data.length === 0 ? (
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
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">Belum ada peminjaman</h3>
                  <p className="mt-2 text-gray-500">Anda belum membuat permohonan peminjaman kendaraan.</p>
                </div>
              ) : (
                <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-lg">
                          Nama
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Bagian
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Tgl Pinjam
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Tgl Kembali
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Keperluan
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Driver
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          No. Pol
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider rounded-tr-lg">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data.map((row) => {
                        const status = getStatus(row);
                        return (
                          <tr key={row.id} className="hover:bg-gray-50 transition duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.nama}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {row.bagian}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(row.tanggal_pinjam).toLocaleDateString("id-ID")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(row.tanggal_kembali).toLocaleDateString("id-ID")}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={row.keperluan}>
                              {row.keperluan}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {row.driver || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {row.no_pol || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
                              >
                                <span>{status.icon}</span>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-5">
              {data.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    🚗
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Belum ada peminjaman</h3>
                  <p className="text-gray-500 mt-1 text-sm">Silakan ajukan peminjaman kendaraan terlebih dahulu.</p>
                </div>
              ) : (
                data.map((row) => {
                  const status = getStatus(row);
                  return (
                    <div
                      key={row.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                    >
                      {/* Header with Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{row.nama}</h3>
                          <p className="text-sm text-gray-600">{row.bagian}</p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.color} whitespace-nowrap`}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>

                      {/* Detail Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Pinjam</span>
                          <span className="font-medium text-gray-800">
                            {new Date(row.tanggal_pinjam).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Kembali</span>
                          <span className="font-medium text-gray-800">
                            {new Date(row.tanggal_kembali).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Driver</span>
                          <span className="font-medium text-gray-800">{row.driver || "—"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">No. Pol</span>
                          <span className="font-medium text-gray-800">{row.no_pol || "—"}</span>
                        </div>
                      </div>

                      {/* Keperluan Section */}
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                          Keperluan
                        </p>
                        <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg break-words leading-relaxed">
                          {row.keperluan}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}