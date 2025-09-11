import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClientAnon";

interface Peminjaman {
  id: string;
  nama: string;
  bagian: string;
  jumlah_penumpang: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  keperluan: string;
  driver: string | null;
  no_pol: string | null;
  accepted: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // State untuk simpan perubahan lokal — TIDAK DIUBAH
  const [localUpdates, setLocalUpdates] = useState<{
    [id: string]: { driver?: string; no_pol?: string };
  }>({});

  // 🔑 Cek login — TIDAK DIUBAH
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

  // Fetch data — TIDAK DIUBAH
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("peminjaman_kendaraan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setData(data as Peminjaman[]);
    }
    setLoading(false);
  };

  // Handle approve/reject — TIDAK DIUBAH
  const handleApprove = async (id: string, approved: boolean) => {
    const updates = localUpdates[id] || {};
    const updatePayload = approved
      ? { accepted: true, ...updates }
      : { accepted: false };

    const { error } = await supabase
      .from("peminjaman_kendaraan")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      setMessage("❌ Gagal menyetujui: " + error.message);
    } else {
      setMessage(approved ? "✅ Berhasil disetujui!" : "🟡 Permintaan ditolak.");
      setLocalUpdates((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      fetchData();
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // Handle local update — TIDAK DIUBAH
  const handleLocalUpdate = (id: string, field: "driver" | "no_pol", value: string) => {
    setLocalUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Fetch ulang saat mount — TIDAK DIUBAH
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:px-6">
      <div className="w-full px-4 sm:px-6">
        {/* Header — Hanya tampilan diperindah */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-2xl font-bold shadow-lg mb-3">
            🚗
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Admin — Peminjaman Kendaraan
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-md mx-auto">
            Kelola permohonan peminjaman kendaraan dinas secara real-time.
          </p>
        </div>

        {/* Message Alert — Diperindah dengan shadow & border */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-center text-sm font-medium shadow-md border-l-4 animate-fade-in ${
              message.includes("Gagal")
                ? "bg-red-50 text-red-700 border-red-400"
                : message.includes("ditolak")
                ? "bg-yellow-50 text-yellow-700 border-yellow-400"
                : "bg-green-50 text-green-700 border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Loading — Diperindah dengan animasi dan layout center */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-gray-200 rounded-full"></div>
              <div className="w-14 h-14 border-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
            </div>
            <span className="text-gray-500 font-medium mt-3">Memuat data peminjaman...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table — Diperindah dengan shadow, rounded, dan hover effect */}
            <div className="hidden md:block">
              {data.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    🚗
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Belum ada permintaan</h3>
                  <p className="text-gray-500 mt-1">Data akan muncul setelah ada permintaan peminjaman.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-x-auto">
  <table className="min-w-[1250px] w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <tr>
                        <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg">
                          Nama
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Bagian
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Jumlah
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Tgl Pinjam
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Tgl Kembali
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Keperluan
                        </th>
                        <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                          Driver
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                          No. Pol
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider rounded-tr-lg">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.map((row) => {
                        const driver = localUpdates[row.id]?.driver ?? row.driver ?? "";
                        const no_pol = localUpdates[row.id]?.no_pol ?? row.no_pol ?? "";

                        return (
                          <tr key={row.id} className="hover:bg-gray-50 transition duration-150">
                            <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.nama}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{row.bagian}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-center text-gray-700">{row.jumlah_penumpang}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{row.tanggal_pinjam}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{row.tanggal_kembali}</td>
                            <td className="px-5 py-4 text-sm text-gray-700 max-w-xs truncate" title={row.keperluan}>
                              {row.keperluan}
                            </td>
                            <td className="px-5 py-4">
                              <select
                                value={driver}
                                onChange={(e) => handleLocalUpdate(row.id, "driver", e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                disabled={row.accepted}
                              >
                                <option value="">Pilih Driver</option>
                                <option value="Ali C">Ali C</option>
                                <option value="Asep H">Asep H</option>
                                <option value="Salman A">Salman A</option>
                                <option value="Oki">Oki</option>
                                <option value="Bintang">Bintang</option>
                                <option value="Nyetir Sendiri">Nyetir Sendiri</option>
                                <option value="ALL driver">ALL driver</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={no_pol}
                                onChange={(e) => handleLocalUpdate(row.id, "no_pol", e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                disabled={row.accepted}
                              >
                                <option value="">Pilih No. Pol</option>
                                <option value="D 1761 E">D 1761 E</option>
                                <option value="D 1852 E">D 1852 E</option>
                                <option value="D 1330 E">D 1330 E</option>
                                <option value="D 1635 D">D 1635 D</option>
                                <option value="D 1636 D">D 1636 D</option>
                                <option value="D 1481 F">D 1481 F</option>
                                <option value="D 1106 F">D 1106 F</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {row.accepted ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  ✅ Disetujui
                                </span>
                              ) : (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => handleApprove(row.id, true)}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow transition-transform transform hover:scale-105"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleApprove(row.id, false)}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow transition-transform transform hover:scale-105"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Mobile Cards — Hanya tampilan diubah, logika tetap sama */}
            <div className="md:hidden space-y-5">
              {data.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                    🚗
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Belum ada permintaan</h3>
                  <p className="text-gray-500 mt-1 text-sm">Silakan tunggu permintaan masuk.</p>
                </div>
              ) : (
                data.map((row) => {
                  const driver = localUpdates[row.id]?.driver ?? row.driver ?? "";
                  const no_pol = localUpdates[row.id]?.no_pol ?? row.no_pol ?? "";

                  return (
                    <div
                      key={row.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{row.nama}</h3>
                          <p className="text-sm text-gray-600">{row.bagian}</p>
                        </div>
                        {row.accepted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            ✅ Disetujui
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            ⏳ Menunggu
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Jumlah Penumpang:</span>
                          <div className="font-medium text-gray-800">{row.jumlah_penumpang}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Tgl Pinjam:</span>
                          <div className="font-medium text-gray-800">{row.tanggal_pinjam}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Tgl Kembali:</span>
                          <div className="font-medium text-gray-800">{row.tanggal_kembali}</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 mb-4">
                        <p className="text-xs text-gray-500 font-medium mb-1">Keperluan</p>
                        <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded break-words">
                          {row.keperluan}
                        </p>
                      </div>

                      {!row.accepted && (
                        <>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Driver</label>
                            <select
                              value={driver}
                              onChange={(e) => handleLocalUpdate(row.id, "driver", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                              <option value="">Pilih Driver</option>
                              <option value="Ali C">Ali C</option>
                              <option value="Asep H">Asep H</option>
                              <option value="Salman A">Salman A</option>
                              <option value="Oki">Oki</option>
                              <option value="Bintang">Bintang</option>
                              <option value="Nyetir Sendiri">Nyetir Sendiri</option>
                              <option value="ALL driver">ALL driver</option>
                            </select>
                          </div>

                          <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-500 mb-1">No. Polisi</label>
                            <select
                              value={no_pol}
                              onChange={(e) => handleLocalUpdate(row.id, "no_pol", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                              <option value="">Pilih No. Pol</option>
                              <option value="D 1761 E">D 1761 E</option>
                              <option value="D 1852 E">D 1852 E</option>
                              <option value="D 1330 E">D 1330 E</option>
                              <option value="D 1635 D">D 1635 D</option>
                              <option value="D 1636 D">D 1636 D</option>
                              <option value="D 1481 F">D 1481 F</option>
                              <option value="D 1106 F">D 1106 F</option>
                            </select>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(row.id, true)}
                              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium py-2.5 rounded-lg shadow-sm hover:shadow transition-transform transform hover:scale-105"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleApprove(row.id, false)}
                              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium py-2.5 rounded-lg shadow-sm hover:shadow transition-transform transform hover:scale-105"
                            >
                              Tolak
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Global Styles — hanya animasi, tidak ubah logika */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}