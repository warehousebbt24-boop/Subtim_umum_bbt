import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClientAnon";
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export default function CekStatus() {
  const [message, setMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | "warning" | "info" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      setLoading(true);
      setMessage(null);
      setStatusType(null);

      const { data: { session }, error: authError } = await supabase.auth.getSession();

      if (authError || !session) {
        setMessage("Anda belum login. Silakan masuk terlebih dahulu.");
        setStatusType("warning");
        setLoading(false);
        return;
      }

      const email = session.user.email;
      if (!email) {
        setMessage("Email tidak ditemukan dalam sesi.");
        setStatusType("error");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/cek-status", {
          headers: {
            "x-user-email": email,
          },
        });

        const data = await res.json();

        setMessage(data.message || "Tidak ada informasi status saat ini.");
        
        // Tentukan tipe status untuk styling dan ikon
        if (data.message?.toLowerCase().includes("diterima")) {
          setStatusType("success");
        } else if (data.message?.toLowerCase().includes("ditolak")) {
          setStatusType("error");
        } else if (data.message?.toLowerCase().includes("pending") || data.message?.toLowerCase().includes("dalam peninjauan")) {
          setStatusType("info");
        } else if (data.message?.toLowerCase().includes("belum")) {
          setStatusType("warning");
        } else {
          setStatusType("info");
        }
      } catch (err) {
        setMessage("Gagal terhubung ke server. Coba lagi nanti.");
        setStatusType("error");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  const getIcon = () => {
    switch (statusType) {
      case "success":
        return <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />;
      case "error":
        return <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />;
      case "warning":
        return <ExclamationCircleIcon className="w-16 h-16 text-yellow-500 mx-auto" />;
      case "info":
      default:
        return <ClockIcon className="w-16 h-16 text-blue-500 mx-auto" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Status Pendaftaran Magang</h1>
          <p className="text-indigo-100 mt-2">Pantau perkembangan aplikasi Anda di sini</p>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
              <p className="text-slate-600 font-medium">Memeriksa status Anda...</p>
            </div>
          ) : (
            <div className="text-center space-y-5">
              {getIcon()}
              <p
                className={`text-lg leading-relaxed px-4 ${
                  statusType === "success"
                    ? "text-green-700"
                    : statusType === "error"
                    ? "text-red-700"
                    : statusType === "warning"
                    ? "text-yellow-700"
                    : "text-slate-700"
                }`}
              >
                {message}
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Diperbarui secara real-time dari sistem kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}