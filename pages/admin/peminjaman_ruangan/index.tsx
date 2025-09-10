import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClientAnon";

export default function AdminDashboardRuangan() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        fetchData();
      }
    };

    checkSession();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("peminjaman_ruangan")
      .select("*")
      .order("tanggal_pinjam", { ascending: true });

    if (error) {
      console.error("Gagal fetch data:", error.message);
    } else {
      setData(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from("peminjaman_ruangan")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Gagal update status:", error.message);
    } else {
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-7xl mx-auto border border-gray-200 transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            📋 Dashboard Admin — Peminjaman Ruangan
          </h1>
          <button
            onClick={fetchData}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="ml-4 text-gray-500 font-medium">Memuat data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">Belum ada data peminjaman ruangan.</p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <th className="p-4 border-b">Nama</th>
                    <th className="p-4 border-b">Tanggal</th>
                    <th className="p-4 border-b">Jam Mulai</th>
                    <th className="p-4 border-b">Ruangan</th>
                    <th className="p-4 border-b">Keperluan</th>
                    <th className="p-4 border-b">Bagian</th>
                    <th className="p-4 border-b text-center">Peserta</th>
                    <th className="p-4 border-b text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="p-4 border-b font-medium text-gray-800">{item.nama}</td>
                      <td className="p-4 border-b text-gray-700">{item.tanggal_pinjam}</td>
                      <td className="p-4 border-b text-gray-700">{item.jam_mulai}</td>
                      <td className="p-4 border-b">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                          Ruangan {item.ruangan}
                        </span>
                      </td>
                      <td className="p-4 border-b text-gray-700 max-w-xs truncate" title={item.keperluan}>
                        {item.keperluan}
                      </td>
                      <td className="p-4 border-b text-gray-700">{item.bagian}</td>
                      <td className="p-4 border-b text-center font-medium text-gray-800">
                        {item.jumlah_peserta}
                      </td>
                      <td className="p-4 border-b text-center">
                        {item.status === "pending" && (
                          <button
                            onClick={() => updateStatus(item.id, "acc")}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium shadow transition-transform hover:scale-105"
                          >
                            ✅ ACC
                          </button>
                        )}
                        {item.status === "acc" && (
                          <button
                            onClick={() => updateStatus(item.id, "selesai")}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow transition-transform hover:scale-105"
                          >
                            🎯 Selesai
                          </button>
                        )}
                        {item.status === "selesai" && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 font-semibold rounded-full text-xs">
                            ✅ Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                    <div className="font-semibold text-gray-600">Nama:</div>
                    <div className="text-gray-800">{item.nama}</div>

                    <div className="font-semibold text-gray-600">Tanggal:</div>
                    <div>{item.tanggal_pinjam}</div>

                    <div className="font-semibold text-gray-600">Jam Mulai:</div>
                    <div>{item.jam_mulai}</div>

                    <div className="font-semibold text-gray-600">Ruangan:</div>
                    <div>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                        Ruangan {item.ruangan}
                      </span>
                    </div>

                    <div className="font-semibold text-gray-600">Keperluan:</div>
                    <div className="col-span-2 text-gray-700 line-clamp-2">
                      {item.keperluan}
                    </div>

                    <div className="font-semibold text-gray-600">Bagian:</div>
                    <div>{item.bagian}</div>

                    <div className="font-semibold text-gray-600">Peserta:</div>
                    <div className="font-medium">{item.jumlah_peserta}</div>

                    <div className="font-semibold text-gray-600">Status:</div>
                    <div>
                      {item.status === "pending" && (
                        <button
                          onClick={() => updateStatus(item.id, "acc")}
                          className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium mt-1"
                        >
                          ✅ ACC
                        </button>
                      )}
                      {item.status === "acc" && (
                        <button
                          onClick={() => updateStatus(item.id, "selesai")}
                          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium mt-1"
                        >
                          🎯 Selesai
                        </button>
                      )}
                      {item.status === "selesai" && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 font-semibold rounded-full text-xs">
                          ✅ Selesai
                        </span>
                      )}
                    </div>
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