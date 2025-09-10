import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/router"; // ✅ Tambah router
import { supabase } from "../../lib/supabaseClientAnon"; // \t

export default function AcceptedListPage() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const router = useRouter();

  // 🔐 Cek login dulu
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login"); // ✅ Redirect kalau belum login
      } else {
        fetchData(); // ✅ Baru fetch data kalau sudah login
      }
    };

    checkAuth();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accepted-list");
      const json = await res.json();

      const onlyAccepted = (json.data || []).filter(
        (item: any) => item.status === "accepted"
      );

      setData(onlyAccepted);
    } catch (err) {
      console.error("Gagal fetch:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter berdasar tahun
  useEffect(() => {
    const filteredData = data.filter((item) => {
      const year = new Date(item.tanggal_start).getFullYear();
      return year === selectedYear;
    });
    setFiltered(filteredData);
  }, [data, selectedYear]);

  // Generate tahun (3 tahun ke belakang + sekarang)
  const years = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i);

  // Export ke Excel
  const exportToExcel = () => {
    if (filtered.length === 0) {
      alert("Tidak ada data untuk diunduh!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Accepted-${selectedYear}`);
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Accepted_Pemagang_${selectedYear}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">📊 Laporan Pemagang Diterima</h1>

        {/* Pilihan Tahun */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <label className="mr-2 font-semibold text-gray-700">Pilih Tahun:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border rounded-lg"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={exportToExcel}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Unduh Excel
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-500">Memuat data...</p>}

        {/* Table */}
        {!loading && filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Nama</th>
                  <th className="px-4 py-2 border">Bagian</th>
                  <th className="px-4 py-2 border">Tanggal Mulai</th>
                  <th className="px-4 py-2 border">Tanggal Selesai</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
             <tbody>
  {filtered.map((item) => (
    <tr key={item.id} className="text-center">
      <td className="px-4 py-2 border">{item.id}</td>
      <td className="px-4 py-2 border">{item.nama}</td>
      <td className="px-4 py-2 border">{item.unit_kerja}</td> {/* FIX */}
      <td className="px-4 py-2 border">
        {new Date(item.tanggal_start).toLocaleDateString("id-ID")}
      </td>
      <td className="px-4 py-2 border">
        {new Date(item.tanggal_end).toLocaleDateString("id-ID")}
      </td>
      <td className="px-4 py-2 border text-green-600 font-semibold">
        {item.status}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        ) : (
          !loading && <p className="text-gray-500">Tidak ada data untuk tahun ini.</p>
        )}
      </div>
    </div>
  );
}
