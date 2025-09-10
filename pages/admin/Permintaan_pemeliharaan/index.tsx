// pages/admin/permintaan-pemeliharaan.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClientAnon";
import { useRouter } from "next/router";

interface Permintaan {
  id: number;
  nama: string;
  bagian: string;
  jenis: string;
  sarana: string;
  lokasi: string;
  deskripsi: string;
  tanggal_permintaan: string;
  tindakan?: string;
}

export default function AdminPermintaanPemeliharaan() {
  const [data, setData] = useState<Permintaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkLogin();
  }, []);

  // Cek apakah user sudah login
  const checkLogin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
    } else {
      fetchData();
    }
  };

  // Ambil semua data
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("permintaan_pemeliharaan")
      .select("*")
      .order("tanggal_permintaan", { ascending: false });

    if (error) {
      setMessage("❌ Gagal memuat data: " + error.message);
    } else {
      setData(data || []);
    }
    setLoading(false);
  };

  // Update tindakan di state
  const handleChange = (id: number, value: string) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, tindakan: value } : row))
    );
  };

  // Simpan ke database
  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      for (const row of data) {
        const { error } = await supabase
          .from("permintaan_pemeliharaan")
          .update({ tindakan: row.tindakan })
          .eq("id", row.id);

        if (error) throw error;
      }
      setMessage("✅ Semua data berhasil diperbarui!");
    } catch (err: any) {
      setMessage("❌ Terjadi kesalahan: " + err.message);
    }

    setSaving(false);
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-7xl mx-auto border border-gray-200 transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            🛠️ Permintaan Pemeliharaan & Perbaikan
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Kelola dan pantau status permintaan dari seluruh bagian
          </p>
        </div>

        {/* Message Feedback */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-center text-sm font-medium border transition-all duration-300 ${
              message.includes("❌")
                ? "bg-red-50 text-red-700 border-red-200 animate-pulse"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-500 font-medium">Memuat data permintaan...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg font-medium">Tidak ada permintaan pemeliharaan saat ini.</p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 mb-8">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <th className="p-4 border-b">Nama</th>
                    <th className="p-4 border-b">Bagian</th>
                    <th className="p-4 border-b">Jenis</th>
                    <th className="p-4 border-b">Sarana</th>
                    <th className="p-4 border-b">Lokasi</th>
                    <th className="p-4 border-b">Tanggal</th>
                    <th className="p-4 border-b">Deskripsi</th>
                    <th className="p-4 border-b">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="p-4 border-b font-medium text-gray-800">{row.nama}</td>
                      <td className="p-4 border-b text-gray-700">{row.bagian}</td>
                      <td className="p-4 border-b text-gray-700">{row.jenis}</td>
                      <td className="p-4 border-b">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {row.sarana}
                        </span>
                      </td>
                      <td className="p-4 border-b text-gray-700">{row.lokasi}</td>
                      <td className="p-4 border-b text-gray-700">
                        {new Date(row.tanggal_permintaan).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4 border-b text-gray-700 max-w-xs truncate" title={row.deskripsi}>
                        {row.deskripsi}
                      </td>
                      <td className="p-4 border-b">
                        <select
                          value={row.tindakan || ""}
                          onChange={(e) => handleChange(row.id, e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
                        >
                          <option value="">- Pilih Tindakan -</option>
                          <option value="Dalam proses perbaikan">Dalam proses perbaikan</option>
                          <option value="Dalam proses pembelian / pengadaan">
                            Dalam proses pembelian / pengadaan
                          </option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-5 mb-8">
              {data.map((row) => (
                <div
                  key={row.id}
                  className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                    <div className="font-semibold text-gray-600">Nama:</div>
                    <div className="text-gray-800">{row.nama}</div>

                    <div className="font-semibold text-gray-600">Bagian:</div>
                    <div>{row.bagian}</div>

                    <div className="font-semibold text-gray-600">Jenis:</div>
                    <div>{row.jenis}</div>

                    <div className="font-semibold text-gray-600">Sarana:</div>
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {row.sarana}
                      </span>
                    </div>

                    <div className="font-semibold text-gray-600">Lokasi:</div>
                    <div>{row.lokasi}</div>

                    <div className="font-semibold text-gray-600">Tanggal:</div>
                    <div>
                      {new Date(row.tanggal_permintaan).toLocaleDateString("id-ID")}
                    </div>

                    <div className="font-semibold text-gray-600">Deskripsi:</div>
                    <div className="col-span-2 text-gray-700 text-xs line-clamp-2">
                      {row.deskripsi}
                    </div>

                    <div className="font-semibold text-gray-600">Tindakan:</div>
                    <div className="col-span-2 mt-1">
                      <select
                        value={row.tindakan || ""}
                        onChange={(e) => handleChange(row.id, e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
                      >
                        <option value="">- Pilih Tindakan -</option>
                        <option value="Dalam proses perbaikan">Dalam proses perbaikan</option>
                        <option value="Dalam proses pembelian / pengadaan">
                          Dalam proses pembelian / pengadaan
                        </option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-3.5 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  "💾 Simpan Perubahan"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}