import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClientAnon";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  const fullText = "Halo, Admin! 👋 Selamat datang di Dashboard";

  // Efek mengetik
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Ambil statistik dari database
  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data: adminData } = await supabase
        .from("admin_user")
        .select("email")
        .ilike("email", session.user.email!)
        .single();

      if (!adminData) {
        alert("Akses ditolak: Anda bukan admin.");
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setUser(session.user);
      fetchStats(); // Ambil statistik setelah validasi
      setLoading(false);
    };

    const fetchStats = async () => {
      const { count: total } = await supabase
        .from("pendaftaran_magang")
        .select("*", { count: "exact", head: true });

      const { count: active } = await supabase
        .from("pendaftaran_magang")
        .select("*", { count: "exact", head: true })
        .eq("status", "aktif");

      const { count: completed } = await supabase
        .from("pendaftaran_magang")
        .select("*", { count: "exact", head: true })
        .in("status", ["selesai", "lulus"]);

      setStats({ total: total || 0, active: active || 0, completed: completed || 0 });
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Memuat dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Harap tunggu sebentar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header dengan efek blur dan gradien */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Dashboard Admin
            </h1>
          </motion.div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{user?.email}</p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/admin/login");
              }}
              className="text-xs text-red-500 hover:text-red-700 transition-colors underline"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section dengan Statistik */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
            {typedText}
            <span className="inline-block w-2 h-8 bg-blue-500 ml-1 animate-pulse rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Anda memiliki akses penuh untuk mengelola pendaftaran magang, memantau peserta aktif, 
            dan mengarsipkan data peserta yang telah menyelesaikan program.
          </p>
        </motion.div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Pendaftar", value: stats.total, color: "blue", icon: "📋" },
            { label: "Peserta Aktif", value: stats.active, color: "green", icon: "🚀" },
            { label: "Selesai/Lulus", value: stats.completed, color: "yellow", icon: "🎓" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-${stat.color}-100 hover:shadow-2xl hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
                </div>
                <div className={`text-4xl opacity-80`}>{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Menu Cards Diperluas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Pendaftaran Magang/PKL",
              desc: "Kelola data pendaftar baru, verifikasi, dan atur status.",
              color: "blue",
              path: "/admin/pendaftaran",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              ),
            },
            {
              title: "Status Aktif Magang",
              desc: "Pantau peserta yang sedang menjalankan magang.",
              color: "green",
              path: "/admin/status_aktif",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              ),
            },
            {
              title: "Riwayat & Arsip",
              desc: "Lihat peserta yang telah menyelesaikan magang.",
              color: "yellow",
              path: "/admin/cleanup",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ),
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => router.push(card.path)}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-${card.color}-100 cursor-pointer transition-all duration-300 transform`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-${card.color}-100 text-${card.color}-600`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {card.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{card.desc}</p>
                  <span className={`inline-block mt-3 text-xs font-medium text-${card.color}-500`}>
                    Buka →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ilustrasi atau Info Tambahan */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center"
        >
          <p className="text-gray-700">
            💡 <strong>Tip:</strong> Gunakan fitur pencarian dan filter di setiap halaman untuk mempermudah pencarian data peserta.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} — Dashboard Admin Magang. Dibuat dengan ❤️ untuk tim pengelola.
      </footer>
    </div>
  );
}