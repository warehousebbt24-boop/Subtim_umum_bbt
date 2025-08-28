import { useEffect, useState } from "react";

export default function CleanupPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Ambil data dari API
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/cleanup-list");
        const json = await res.json();
        
        // Transformasi: ganti status "accepted" → "selesai" jika periode sudah lewat
        const transformedData = (json.data || []).map((item: any) => {
          const today = new Date().toISOString().split("T")[0];
          if (item.status === "accepted" && item.tanggal_end < today) {
            return { ...item, status: "selesai" };
          }
          return item;
        });

        setList(transformedData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  const handleDelete = async () => {
    if (list.length === 0) return;

    const confirm = window.confirm(
      `Anda yakin ingin menghapus ${list.length} data pemagang beserta file yang diunggah? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirm) return;

    const ids = list.map((item) => item.id);

    try {
      const res = await fetch("/api/admin/cleanup-deleted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || `Berhasil menghapus ${ids.length} data dan file terkait.`);
        setList([]); // Kosongkan list setelah berhasil
      } else {
        alert(`Gagal menghapus data: ${result.error || "Terjadi kesalahan."}`);
      }
    } catch (err) {
      console.error("Error saat menghapus:", err);
      alert("Gagal terhubung ke server. Cek koneksi atau coba lagi nanti.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
            🧹 Cleanup Data Pemagang
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bersihkan data pemagang yang sudah tidak aktif atau masa magangnya telah berakhir.
            File yang diunggah juga akan dihapus dari penyimpanan.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            <span className="text-gray-600 text-lg">Memuat daftar pemagang...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && list.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-200 mx-4 md:mx-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-400 mx-auto mb-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Tidak Ada Data untuk Dibersihkan</h3>
            <p className="text-gray-500">Semua data pemagang dalam status aktif atau belum perlu dibersihkan.</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && list.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mx-4 md:mx-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold">Daftar Pemagang (Siap Dibersihkan)</h2>
              <p className="text-blue-100 mt-1">
                Menampilkan <span className="font-semibold">{list.length}</span> entri yang telah selesai atau ditolak.
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 font-semibold text-gray-800">ID</th>
                    <th className="px-8 py-4 font-semibold text-gray-800">Nama</th>
                    <th className="px-8 py-4 font-semibold text-gray-800">Status</th>
                    <th className="px-8 py-4 font-semibold text-gray-800">Periode Magang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map((item) => {
                    const startDate = new Date(item.tanggal_start).toLocaleDateString("id-ID");
                    const endDate = new Date(item.tanggal_end).toLocaleDateString("id-ID");
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-8 py-4 font-mono text-sm text-gray-600">{item.id}</td>
                        <td className="px-8 py-4 font-medium text-gray-800">{item.nama}</td>
                        <td className="px-8 py-4">
                          <span
                            className={`inline-flex text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                              item.status === "selesai"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-gray-600">
                          {startDate} — {endDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Delete Button */}
            <div className="px-8 py-6 bg-gray-50 flex justify-end">
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transform transition hover:scale-105 duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Hapus Semua ({list.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}