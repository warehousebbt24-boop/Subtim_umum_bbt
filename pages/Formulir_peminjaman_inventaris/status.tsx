// pages/user/peralatan.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClientAnon";

export default function UserPeralatan() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("peminjaman_peralatan")
      .select("*")
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Disetujui
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Selesai
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section — Elegan & Profesional */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            Peminjaman Peralatan
          </h1>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            Pantau status peminjaman peralatan Anda secara real-time.
          </p>
        </div>

        {/* Message Alert (Auto dismiss) */}
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

        {/* Loading Skeleton */}
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

        {/* Desktop Table — Elegant & Clean */}
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
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.206 0-4.166-.895-5.586-2.315m0 0L3 16m0 0l3-3m0 0l3 3"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">Belum ada peminjaman</h3>
                  <p className="mt-2 text-gray-500">Anda belum membuat permohonan peminjaman peralatan.</p>
                </div>
              ) : (
                <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Daftar Peminjaman
                    </h2>
                  </div>
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Nama", "Bagian", "Peralatan", "Pinjam", "Kembali", "Keperluan", "Status"].map((header, i) => (
                          <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.bagian}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={item.peralatan}>
                            {item.peralatan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(item.tanggal_kembali).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={item.keperluan}>
                            {item.keperluan}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Mobile Cards — Rapi, Lega, Mudah Dibaca di HP */}
            <div className="md:hidden space-y-5">
              {data.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Belum ada peminjaman</h3>
                  <p className="text-gray-500 mt-1 text-sm">Silakan ajukan peminjaman peralatan terlebih dahulu.</p>
                </div>
              ) : (
                data.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transform transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                  >
                    {/* Header with Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{item.nama}</h3>
                        <p className="text-sm text-gray-600">{item.bagian}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    {/* Detail Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Pinjam</span>
                        <span className="font-medium text-gray-800">
                          {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Kembali</span>
                        <span className="font-medium text-gray-800">
                          {new Date(item.tanggal_kembali).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-gray-500 text-xs uppercase tracking-wide">Peralatan</span>
                        <span className="font-medium text-gray-800 break-words">{item.peralatan}</span>
                      </div>
                    </div>

                    {/* Keperluan Section */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Keperluan
                      </p>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg break-words leading-relaxed">
                        {item.keperluan}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}