// pages/admin/pendaftaran.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClientAnon";
import { ArrowLeft } from "lucide-react";

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return "-";
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function PendaftaranPage() {
  const router = useRouter();
  const [pendaftaran, setPendaftaran] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
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

      fetchPendaftaran();
    };

    const fetchPendaftaran = async () => {
      try {
        const { data, error } = await supabase
          .from("pendaftaran_magang")
          .select(
            "id, nama, study, email, no_hp, nama_sekolah_universitas, jurusan, unit_kerja, tanggal_start, tanggal_end, periode, dokumen_url, status"
          )
          .order("unit_kerja", { ascending: true })
          .order("tanggal_start", { ascending: true });

        if (error) throw error;
        setPendaftaran(data || []);
      } catch (err: any) {
        setError("Gagal memuat data pendaftaran: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  // ✅ DIPERBAIKI: Gunakan fetch ke API untuk approval
  const handleUpdateStatus = async (id: string, status: "accepted" | "rejected") => {
    if (!window.confirm(`Yakin ingin ${status} pendaftaran ini?`)) return;

    try {
      if (status === "accepted") {
        // 📬 Panggil API untuk update + kirim email
        const res = await fetch(`/api/admin/${id}/accept`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Gagal memperbarui status");
      } else {
        // ❌ Tolak langsung via Supabase (bisa dibuat API terpisah jika butuh email penolakan)
        const { error } = await supabase
          .from("pendaftaran_magang")
          .update({ status })
          .eq("id", id);

        if (error) throw error;
      }

      // Update UI
      setPendaftaran((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );

      alert(`Pendaftaran berhasil di-${status === "accepted" ? "setujui" : "tolak"}`);
    } catch (err: any) {
      console.error(err);
      alert("Gagal memperbarui status: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Memuat data pendaftaran...</p>
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

  const groupedByUnit: Record<string, any[]> = pendaftaran.reduce((acc, p) => {
    const unit = p.unit_kerja || "Tidak Diketahui";
    if (!acc[unit]) acc[unit] = [];
    acc[unit].push(p);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-lg hover:bg-gray-100 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali</span>
      </button>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            📋 Daftar Pendaftaran Magang/PKL
          </h1>
          <p className="text-gray-600">
            Total: <strong>{pendaftaran.length}</strong> pendaftar
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {Object.keys(groupedByUnit).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada pendaftaran saat ini.</p>
          </div>
        ) : (
          Object.keys(groupedByUnit)
            .sort()
            .map((unit) => (
              <div key={unit} className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">{unit}</h2>
                  <p className="text-blue-100 text-sm">
                    {groupedByUnit[unit].length} pendaftar
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">study</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Instansi</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jurusan</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mulai</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Selesai</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Periode</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dokumen</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {groupedByUnit[unit].map((p, idx) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                          <td className="px-6 py-4">{p.nama}</td>
                          <td className="text-sm text-gray-500">{p.study}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{p.nama_sekolah_universitas}</td>
                          <td className="text-sm text-gray-500">{p.jurusan}</td>
                          <td className="px-6 py-4 text-sm font-medium text-green-700">{formatTanggal(p.tanggal_start)}</td>
                          <td className="px-6 py-4 text-sm font-medium text-red-600">{formatTanggal(p.tanggal_end)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{p.periode}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {p.dokumen_url ? (
                              <a
                                href={p.dokumen_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Lihat Dokumen
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                p.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : p.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {p.status === "accepted"
                                ? "Disetujui"
                                : p.status === "rejected"
                                ? "Ditolak"
                                : "Menunggu"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm space-y-1">
                            {p.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(p.id, "accepted")}
                                  className="block w-full text-left px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(p.id, "rejected")}
                                  className="block w-full text-left px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                            {p.status !== "pending" && (
                              <span className="text-gray-500 text-xs">
                                ✓ {p.status === "accepted" ? "Disetujui" : "Ditolak"}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                          {p.no_hp ? (
                          <a
                            href={`https://api.whatsapp.com/send?phone=${p.no_hp.replace(/^0/, "62")}&text=${encodeURIComponent(
                              `Halo ${p.nama},\n\nSelamat! Pendaftaran magang/PKL kamu telah *diterima* di BBSPJIT.\n\nPeriode: ${formatTanggal(
                                p.tanggal_start
                              )} - ${formatTanggal(p.tanggal_end)}\nUnit Kerja: ${p.unit_kerja}\n\nSilakan konfirmasi kehadiranmu.\n\nTerima kasih.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                          >
                            Kirim WA
                          </a>

                          ) : (
                            <span className="text-gray-400 italic">No HP tidak ada</span>
                          )}
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