import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClientAnon";
import { useRouter } from "next/router";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

  const checkLogin = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return router.push("/admin/login");
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("permintaan_pemeliharaan")
      .select("*")
      .order("tanggal_permintaan", { ascending: false });

    if (error) setMessage("❌ Gagal memuat data: " + error.message);
    else setData(data || []);
    setLoading(false);
  };

  const handleChange = (id: number, value: string) => {
    setData(prev =>
      prev.map(row => (row.id === id ? { ...row, tindakan: value } : row))
    );
  };

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

  // ===============================
  // 🔹 TanStack Columns
  // ===============================
  const columns = useMemo<ColumnDef<Permintaan>[]>(
    () => [
      { header: "Nama", accessorKey: "nama" },
      { header: "Bagian", accessorKey: "bagian" },
      { header: "Jenis", accessorKey: "jenis" },
      {
        header: "Sarana",
        accessorKey: "sarana",
        cell: ({ row }) => (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {row.original.sarana}
          </span>
        ),
      },
      { header: "Lokasi", accessorKey: "lokasi" },
      {
        header: "Tanggal",
        accessorKey: "tanggal_permintaan",
        cell: ({ row }) =>
          new Date(row.original.tanggal_permintaan).toLocaleDateString("id-ID"),
      },
      {
        header: "Deskripsi",
        accessorKey: "deskripsi",
        cell: ({ row }) => (
          <span className="max-w-xs truncate block" title={row.original.deskripsi}>
            {row.original.deskripsi}
          </span>
        ),
      },
      {
        header: "Tindakan",
        accessorKey: "tindakan",
        cell: ({ row }) => (
          <select
            value={row.original.tindakan || ""}
            onChange={(e) => handleChange(row.original.id, e.target.value)}
            className="border border-gray-300 rounded-xl text-sm bg-white shadow-sm whitespace-nowrap"
            style={{ minWidth: `${((row.original.tindakan || "").length || 20) + 4}ch` }}
          >
            <option value="">- Pilih -</option>
            <option value="Dalam proses perbaikan">Dalam proses perbaikan</option>
            <option value="Dalam proses pembelian / pengadaan">
              Dalam proses pembelian / pengadaan
            </option>
            <option value="Selesai">Selesai</option>
          </select>
        ),
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4">Permintaan Pemeliharaan</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Desktop TanStack Table */}
          <div className="hidden md:block overflow-x-auto border rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-3 text-left font-medium border-b">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 border-b">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile tetap card */}
          <div className="md:hidden mt-6 space-y-3">
            {data.map(row => (
              <div key={row.id} className="p-4 bg-white border rounded-xl shadow-sm">
                <div className="text-sm">
                  <b>{row.nama}</b> — {row.bagian} — {row.jenis}
                </div>
                <div className="text-xs py-1">{row.deskripsi}</div>
                <select
                  value={row.tindakan || ""}
                  onChange={(e) => handleChange(row.id, e.target.value)}
                  className="border p-2 rounded-xl text-sm mt-2"
                >
                  <option value="">- Pilih -</option>
                  <option value="Dalam proses perbaikan">Dalam proses perbaikan</option>
                  <option value="Dalam proses pembelian / pengadaan">Dalam proses pembelian / pengadaan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
          </button>
        </>
      )}
    </div>
  );
}
