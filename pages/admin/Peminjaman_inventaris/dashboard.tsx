// pages/admin/peralatan.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClientAnon";
import { useRouter } from "next/router";


export default function DashboardAdminPeralatan() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  // 🔑 Cek apakah user sudah login
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
      } else {
        fetchData();
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("peminjaman_peralatan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      showNotification("Gagal memuat data: " + error.message, "error");
    } else {
      setData(data || []);
    }
    setLoading(false);
  };

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const updateStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from("peminjaman_peralatan")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      showNotification("Gagal update status: " + error.message, "error");
    } else {
      showNotification("Status berhasil diupdate!", "success");
      fetchData();
    }
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

  const getActionButton = (item: any) => {
    if (item.status === "pending") {
      return (
        <button
          onClick={() => updateStatus(item.id, "acc")}
          className="group relative w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Setujui peminjaman"
        >
          <span className="absolute inset-0 w-full h-full rounded-xl bg-blue-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Setujui
          </div>
        </button>
      );
    } else if (item.status === "acc") {
      return (
        <button
          onClick={() => updateStatus(item.id, "selesai")}
          className="group relative w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          aria-label="Tandai selesai"
        >
          <span className="absolute inset-0 w-full h-full rounded-xl bg-green-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Selesai
          </div>
        </button>
      );
    } else {
      return (
        <div className="w-full text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 text-xs rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Selesai
          </span>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-6 px-4 sm:px-6">
      {/* Notifikasi Toast (atas) — Tetap di atas saat scroll */}
      {message && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md px-5 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down transition-all duration-500 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header Section — Elegan & Profesional */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            Admin — Peminjaman Peralatan
          </h1>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            Kelola dan pantau permintaan peminjaman peralatan secara real-time.
          </p>
        </div>

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
                  <h3 className="mt-4 text-lg font-medium text-gray-800">Belum ada permintaan</h3>
                  <p className="mt-2 text-gray-500">Data akan muncul setelah ada permintaan peminjaman.</p>
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
                      Daftar Permintaan
                    </h2>
                  </div>
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Nama", "Bagian", "Peralatan", "Pinjam", "Kembali", "Keperluan", "Status", "Aksi"].map((header, i) => (
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
                          <td className="px-6 py-4 whitespace-nowrap">{getActionButton(item)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Mobile Cards — Rapi, Lega, Mudah Dibaca & Interaktif di HP */}
            <div className="md:hidden space-y-5">
              {data.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Belum ada permintaan</h3>
                  <p className="text-gray-500 mt-1 text-sm">Data akan muncul setelah ada permintaan peminjaman.</p>
                </div>
              ) : (
                data.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transform transition-all duration-200 hover:shadow-md"
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
                    <div className="pt-3 border-t border-gray-100 mb-4">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Keperluan
                      </p>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg break-words leading-relaxed">
                        {item.keperluan}
                      </p>
                    </div>

                    {/* Action Button — Full width for mobile */}
                    <div className="pt-2">{getActionButton(item)}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}