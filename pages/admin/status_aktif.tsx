// pages/admin/status_aktif.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClientAnon";

export default function AktifPage() {
  const router = useRouter();
  const [peserta, setPeserta] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from("admin_user")
        .select("email")
        .ilike("email", session.user.email!)
        .single();

      if (adminError || !adminData) {
        alert("Akses ditolak: Anda bukan admin.");
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      fetchPesertaAktif();
    };

    const fetchPesertaAktif = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        const { data, error } = await supabase
          .from("pendaftaran_magang")
          .select(
            "id, nama, email, no_hp, nama_sekolah_universitas, jurusan, unit_kerja, tanggal_start, tanggal_end, periode"
          )
          .gte("tanggal_end", today)
          .lte("tanggal_start", today)
          .in("status", ["approved", "accepted"])
          .order("unit_kerja", { ascending: true })
          .order("tanggal_start", { ascending: true });

        if (error) throw error;

        setPeserta(data || []);
      } catch (err: any) {
        setError("Gagal memuat data peserta aktif: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  // fungsi helper untuk format tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Memuat data peserta aktif...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Kelompokkan per unit kerja
  const groupedByUnit: Record<string, any[]> = peserta.reduce((acc, p) => {
    const unit = p.unit_kerja || "Tidak Diketahui";
    if (!acc[unit]) acc[unit] = [];
    acc[unit].push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Tombol kembali */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-gray-100 transition"
      >
        ← Kembali
      </button>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">🔥 Status Aktif Magang/PKL</h1>
          <p className="text-gray-600">
            Total: <strong>{peserta.length}</strong> peserta sedang magang
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {Object.keys(groupedByUnit).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada peserta aktif saat ini.</p>
          </div>
        ) : (
          Object.keys(groupedByUnit)
            .sort()
            .map((unit) => (
              <div key={unit} className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">{unit}</h2>
                  <p className="text-indigo-100 text-sm">
                    {groupedByUnit[unit].length} peserta aktif
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Instansi</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mulai</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Selesai</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Periode</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kontak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {groupedByUnit[unit].map((p, idx) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{p.nama}</div>
                            <div className="text-sm text-gray-500">{p.jurusan}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{p.nama_sekolah_universitas}</td>
                          <td className="px-6 py-4 text-sm font-medium text-green-700">
                            {formatDate(p.tanggal_start)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-red-600">
                            {formatDate(p.tanggal_end)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{p.periode}</td>
                          <td className="px-6 py-4 text-sm">
                            <div>{p.email}</div>
                            <div className="text-gray-600">{p.no_hp}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
        )}
      </main>

      <footer className="bg-white border-t text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} BBSPJIT. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}
