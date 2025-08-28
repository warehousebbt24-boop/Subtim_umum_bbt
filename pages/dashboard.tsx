import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClientAnon";
import {
  UserCircleIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

// Gunakan tipe dari Supabase
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Application {
  id: string;
  status: "draft" | "submitted" | "review" | "accepted" | "rejected" | "pending";
  created_at: string;
  nama_lengkap?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, draft: 0, submitted: 0, accepted: 0 });
  const [applications, setApplications] = useState<Application[]>([]);
  const [nextAction, setNextAction] = useState<{ title: string; desc: string; action: () => void } | null>(null);
  const [profile, setProfile] = useState<{ nama_lengkap: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      // Ambil nama lengkap dari tabel profil
      const { data: profileData } = await supabase
        .from("profiles")
        .select("nama_lengkap")
        .eq("id", currentUser.id)
        .single();

      setProfile(profileData || null);

      // Ambil data pendaftaran
      const { data: apps, error } = await supabase
        .from("pendaftaran_magang")
        .select("id, status, created_at, nama_lengkap")
        .eq("user_id", currentUser.id);

      if (error) {
        console.error("Error fetching applications:", error);
      }

      if (!error && apps) {
        console.log("Fetched applications:", apps);
        console.log("Application statuses:", apps.map(app => ({ id: app.id, status: app.status })));
        
        setApplications(apps);

        const draft = apps.filter((a) => a.status === "draft").length;
        const submitted = apps.filter((a) =>
          ["pending", "accepted", "rejected"].includes(a.status)
        ).length;
        const accepted = apps.filter((a) => a.status === "accepted").length;

        console.log("Calculated stats:", { total: apps.length, draft, submitted, accepted });
        
        setStats({ total: apps.length, draft, submitted, accepted });

        // Tentukan aksi berikutnya
        if (draft > 0) {
          setNextAction({
            title: "Lanjutkan Pendaftaran",
            desc: "Anda memiliki formulir yang belum selesai",
            action: () => router.push("/pendaftaran"),
          });
        } else if (submitted > 0) {
          setNextAction({
            title: "Status Sedang Diproses",
            desc: "Tim kami sedang meninjau pendaftaran Anda",
            action: () => router.push("/cek-status"),
          });
        } else if (accepted > 0) {
          setNextAction({
            title: "🎉 Selamat! Anda Diterima",
            desc: "Silakan cek email untuk instruksi selanjutnya",
            action: () => router.push("/cek-status"),
          });
        } else if (apps.length > 0) {
          // Misalnya semua ditolak
          setNextAction({
            title: "📬 Hasil Telah Diumumkan",
            desc: "Silakan cek status terbaru",
            action: () => router.push("/cek-status"),
          });
        } else {
          setNextAction({
            title: "✨ Mulai Pendaftaran Baru",
            desc: "Buat formulir pendaftaran pertama Anda",
            action: () => router.push("/pendaftaran"),
          });
        }
      } else {
        setNextAction({
          title: "📬 Belum Ada Pendaftaran",
          desc: "Ayo mulai proses magang Anda sekarang!",
          action: () => router.push("/pendaftaran"),
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-lg">Memuat dashboard...</p>
          <p className="text-sm text-gray-500">Mengambil data Anda</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.nama_lengkap || user?.email?.split("@")[0] || "Pengguna";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
            Dashboard Magang
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200 group"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-white to-blue-50 border border-blue-100/70 rounded-3xl shadow-xl p-10 text-center overflow-hidden hover:shadow-2xl transition-all duration-500"
        >
          <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-200/30 rounded-full blur-lg"></div>

          <div className="w-20 h-20 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg relative z-10">
            <UserCircleIcon className="w-10 h-10 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3 leading-tight z-10 relative">
            Halo,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent font-extrabold">
              {displayName}
            </span>
            !
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-lg mx-auto mb-6 z-10 relative">
            Anda berada di pusat kendali pendaftaran magang <strong className="text-blue-900">BBSPJIT</strong>. 
            Pantau progres Anda dan lanjutkan kapan saja.
          </p>

          {/* Next Action */}
          {nextAction && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={nextAction.action}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mx-auto max-w-md cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-blue-800 text-lg">{nextAction.title}</h3>
                  <p className="text-blue-600 text-sm mt-1">{nextAction.desc}</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-blue-500 opacity-70" />
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <StatCard icon={DocumentTextIcon} label="Total" value={stats.total} color="blue" pulse={stats.total > 0} />
            <StatCard icon={ClipboardDocumentListIcon} label="Draf" value={stats.draft} color="yellow" pulse={stats.draft > 0} />
            <StatCard icon={ClockIcon} label="Ditinjau" value={stats.submitted} color="green" pulse={stats.submitted > 0} />
            <StatCard icon={CheckCircleIcon} label="Diterima" value={stats.accepted} color="purple" pulse={stats.accepted > 0} />
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="✏️ Lanjutkan Pendaftaran"
            desc="Isi atau lanjutkan formulir yang belum selesai"
            icon={PencilIcon}
            color="blue"
            onClick={() => router.push("/pendaftaran")}
          />
          <DashboardCard
            title="🔍 Cek Status"
            desc="Lihat progres pendaftaran Anda"
            icon={MagnifyingGlassIcon}
            color="green"
            onClick={() => router.push("/cek-status")}
          />
          <DashboardCard
            title="⬅️ Kembali"
            desc="Kembali ke halaman sebelumnya"
            icon={ArrowLeftIcon}
            color="gray"
            onClick={() => router.back()}
          />
        </div>

        {/* Recent Applications */}
        {applications.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
              Riwayat Pendaftaran
            </h3>
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <motion.div
                  key={app.id}
                  whileHover={{ x: 4 }}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => router.push("/cek-status")}
                >
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      {app.nama_lengkap || `Formulir #${app.id.slice(0, 8)}`}
                    </span>
                    <p className="text-xs text-gray-500">
                      {new Date(app.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </motion.div>
              ))}
            </div>
            {applications.length > 3 && (
              <button
                onClick={() => router.push("/cek-status")}
                className="w-full mt-4 text-blue-600 text-sm font-medium hover:underline"
              >
                Lihat semua ({applications.length})
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 text-center max-w-md mx-auto"
          >
            <SparklesIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-bold text-gray-800 text-lg">Belum Ada Pendaftaran</h3>
            <p className="text-gray-600 text-sm mt-2 mb-4">
              Ayo mulai proses magang Anda sekarang! Isi formulir dalam 5 menit.
            </p>
            <button
              onClick={() => router.push("/pendaftaran")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Mulai Sekarang →
            </button>
          </motion.div>
        )}

        {/* Info Footer */}
        <div className="text-center mt-8 p-6 bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md max-w-2xl mx-auto">
          <p className="text-sm text-gray-600 leading-relaxed">
            Sistem pendaftaran magang resmi oleh{" "}
            <span className="font-semibold text-blue-900">BBSPJIT</span>.<br />
            Semua data pribadi dilindungi dengan enkripsi tingkat tinggi dan hanya digunakan untuk proses seleksi.
          </p>
          <div className="mt-4 flex justify-center space-x-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="text-green-500">●</span> Aman</span>
            <span>•</span>
            <span className="flex items-center gap-1"><span className="text-blue-500">⚡</span> Cepat</span>
            <span>•</span>
            <span className="flex items-center gap-1"><span className="text-purple-500">📄</span> Resmi</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 bg-white/50 backdrop-blur-sm border-t border-gray-100">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-800">BBSPJIT</span>. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}

// StatCard: Gunakan React.ComponentType untuk ikon
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  pulse,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: "blue" | "green" | "yellow" | "purple";
  pulse?: boolean;
}) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <motion.div
      initial={false}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
      className="text-center p-4 rounded-xl bg-white/70 border border-gray-100 shadow-sm hover:shadow transition-shadow"
    >
      <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </motion.div>
  );
}

// DashboardCard
const colorStyles = {
  blue: "from-blue-600 to-blue-700 text-white",
  green: "from-green-600 to-green-700 text-white",
  gray: "bg-gray-50 text-gray-700 border border-gray-200",
} as const;

type ColorKey = keyof typeof colorStyles;

function DashboardCard({
  title,
  desc,
  icon: Icon,
  color,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: ColorKey;
  onClick: () => void;
}) {
  const isGradient = color !== "gray";

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group p-6 font-semibold rounded-2xl shadow-lg transition-all duration-300 transform text-left relative overflow-hidden ${
        isGradient ? `bg-gradient-to-b ${colorStyles[color]} hover:shadow-2xl` : colorStyles[color]
      }`}
    >
      <div className={`absolute top-0 ${isGradient ? 'right-0' : 'left-0'} w-20 h-20 bg-white/20 rounded-full -translate-y-8 ${isGradient ? 'translate-x-8' : '-translate-x-8'} group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="flex items-start space-x-4 relative z-10">
        <div className={`p-3 rounded-full ${isGradient ? 'bg-white/20' : 'bg-white'} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm opacity-90 mt-1">{desc}</p>
        </div>
      </div>
    </motion.button>
  );
}

// StatusBadge - Diperbarui untuk mendukung 'pending'
function StatusBadge({ status }: { status: string }) {
  const colors = {
    draft: "bg-yellow-100 text-yellow-800",
    submitted: "bg-blue-100 text-blue-800",
    review: "bg-indigo-100 text-indigo-800",
    pending: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const labels = {
    draft: "📝 Draf",
    submitted: "📤 Dikirim",
    review: "🔍 Ditinjau",
    pending: "⏳ Pending",
    accepted: "✅ Diterima",
    rejected: "❌ Ditolak",
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
      colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
    }`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}