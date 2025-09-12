// pages/user/permintaan-pemeliharaan.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClientAnon";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

export default function UserPermintaanPemeliharaan() {
  const [data, setData] = useState<Permintaan[]>([]);
  const [filteredData, setFilteredData] = useState<Permintaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // ✅ tambahan untuk checkbox
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterByYear(selectedYear);
  }, [data, selectedYear]);

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

    setTimeout(() => setMessage(""), 5000);
  };

  const filterByYear = (year: number) => {
    const filtered = data.filter(
      (row) => new Date(row.tanggal_permintaan).getFullYear() === year
    );
    setFilteredData(filtered);
  };

  const downloadExcel = () => {
    if (filteredData.length === 0) {
      setMessage("❌ Tidak ada data untuk diunduh.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Data ${selectedYear}`);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, `permintaan_pemeliharaan_${selectedYear}.xlsx`);
  };

  // ✅ hapus terpilih
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      setMessage("❌ Tidak ada data yang dipilih.");
      return;
    }

    const { error } = await supabase
      .from("permintaan_pemeliharaan")
      .delete()
      .in("id", selectedIds);

    if (error) {
      setMessage("❌ Gagal menghapus data: " + error.message);
    } else {
      setMessage("✅ Data berhasil dihapus.");
      setData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
      setSelectedIds([]);
      setSelectAll(false);
    }

    setTimeout(() => setMessage(""), 4000);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((row) => row.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getTindakanBadge = (tindakan?: string) => {
    if (!tindakan) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          Belum ada tindakan
        </span>
      );
    }

    let bgColor = "bg-gray-100 text-gray-700 border-gray-200";
    if (tindakan === "Selesai") {
      bgColor = "bg-green-100 text-green-800 border-green-200";
    } else if (tindakan.toLowerCase().includes("proses")) {
      bgColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgColor}`}
      >
        {tindakan}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:px-6">
      <div className="w-full px-4 sm:px-6 flex gap-6">
        {/* Sidebar Tahun */}
        <aside className="w-48 bg-white rounded-2xl shadow-md border border-gray-100 p-4 h-fit">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Pilih Tahun</h2>
          <ul className="space-y-2">
            {years.map((year) => (
              <li key={year}>
                <button
                  onClick={() => setSelectedYear(year)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    selectedYear === year
                      ? "bg-indigo-600 text-white"
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
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-2 rounded-lg font-medium transition"
          >
            📥 Unduh Excel
          </button>

          <button
            onClick={handleDeleteSelected}
            className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg font-medium transition disabled:opacity-50"
            disabled={selectedIds.length === 0}
          >
            🗑️ Hapus Terpilih
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              Permintaan Pemeliharaan & Perbaikan
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
              Pantau status permintaan pemeliharaan sarana Anda di sini.
            </p>
            <p className="mt-1 text-sm text-indigo-600 font-medium">
              Menampilkan data tahun {selectedYear}
            </p>
          </div>

          {/* Message Alert */}
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

          {/* Desktop Table */}
          {!loading && filteredData.length > 0 && (
            <div className="hidden md:block">
              <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Nama
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Bagian
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Jenis
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Sarana
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Lokasi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Deskripsi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                        Tindakan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => toggleSelect(row.id)}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {row.nama}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.bagian}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.jenis}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.sarana}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{row.lokasi}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(row.tanggal_permintaan).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {row.deskripsi}
                        </td>
                        <td className="px-6 py-4">{getTindakanBadge(row.tindakan)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Cards tetap tanpa checkbox */}
          <div className="md:hidden space-y-5">
            {filteredData.map((row) => (
              <div
                key={row.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {row.sarana} — {row.lokasi}
                  </h3>
                  {getTindakanBadge(row.tindakan)}
                </div>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Nama:</span> {row.nama}</p>
                  <p><span className="font-medium">Bagian:</span> {row.bagian}</p>
                  <p><span className="font-medium">Jenis:</span> {row.jenis}</p>
                  <p><span className="font-medium">Tanggal:</span> {new Date(row.tanggal_permintaan).toLocaleDateString("id-ID")}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Deskripsi
                  </p>
                  <p className="text-sm text-gray-700">{row.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
