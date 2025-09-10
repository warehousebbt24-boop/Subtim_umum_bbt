// components/formstep.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClientAnon";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type SelectedRange = {
  start: Date;
  end?: Date | null;
};

type Props = {
  selectedDates: SelectedRange;
  onBack: () => void;
  userData: {
    nama: string;
    email: string;
    nama_sekolah_universitas: string;
    jurusan: string;
  };
  unitKerja: string;
};

export default function FormStep({ selectedDates, onBack, userData, unitKerja }: Props) {
  const [noHp, setNoHp] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [supabaseId, setSupabaseId] = useState<string>("");

  const startDate = new Date(selectedDates.start);
  const endDate = selectedDates.end ? new Date(selectedDates.end) : startDate;
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const periode = `${diffDays} hari`;

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getUser:", error);
        return;
      }
      if (data?.user?.id) {
        setSupabaseId(data.user.id);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!noHp || !file) {
      return setMessage("Harap isi semua data dan unggah dokumen PDF.");
    }
    if (file.type !== "application/pdf") {
      return setMessage("File harus berformat PDF.");
    }
    if (!supabaseId) {
      return setMessage("Anda belum login.");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("supabase_id", supabaseId);
    formData.append("nama", userData.nama);
    formData.append("email", userData.email);
    formData.append("nama_sekolah_universitas", userData.nama_sekolah_universitas);
    formData.append("jurusan", userData.jurusan);
    formData.append("no_hp", noHp);
 
    formData.append("unit_kerja", unitKerja);
    formData.append("file", file);
    formData.append("tanggal_start", selectedDates.start.toISOString());
    if (selectedDates.end) {
      formData.append("tanggal_end", selectedDates.end.toISOString());
    }
    formData.append("periode", periode);

    try {
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Terjadi kesalahan saat mendaftar.");
      } else {
        setMessage("✅ Pendaftaran berhasil! Terima kasih telah mendaftar.");
        setNoHp("");
        setFile(null);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("⚠️ Terjadi kesalahan jaringan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-sm border border-blue-100 rounded-3xl shadow-xl p-6 md:p-8 transition-all duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium text-sm mb-6 transition-colors group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Kalender
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
          Formulir Pendaftaran Magang
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Lengkapi data di bawah ini untuk menyelesaikan pendaftaran
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            value={userData.nama}
            readOnly
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={userData.email}
            readOnly
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            No HP <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            placeholder="Contoh: 08123456789"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Perguruan Tinggi/Sekolah</label>
          <input
            type="text"
            value={userData.nama_sekolah_universitas}
            readOnly
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
          <input
            type="text"
            value={userData.jurusan}
            readOnly
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja Tujuan</label>
          <input
            type="text"
            value={unitKerja}
            readOnly
            className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 font-medium cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Periode Magang</label>
          <input
            type="text"
            value={periode}
            readOnly
            className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 font-medium cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unggah Dokumen (PDF) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">File harus berformat PDF, maksimal 5MB.</p>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform focus:outline-none focus:ring-4 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </div>
      </form>

      {message && (
        <div
          className={`mt-5 p-4 rounded-xl text-sm transition-all ${
            message.includes("berhasil")
              ? "bg-green-50 border border-green-200 text-green-800"
              : message.includes("error") || message.includes("kesalahan")
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-yellow-50 border border-yellow-200 text-yellow-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}