import { useState } from "react";
import { supabase } from "../../lib/supabaseClientAnon";

export default function DashboardPemeliharaan() {
  const [nama, setNama] = useState("");
  const [bagian, setBagian] = useState("");
  const [jenis, setJenis] = useState("Pemeliharaan");
  const [sarana, setSarana] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validasi: pastikan tanggal diisi
    if (!tanggal) {
      setMessage("❌ Harap isi tanggal permintaan.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("permintaan_pemeliharaan").insert([
      {
        nama,
        bagian,
        jenis,
        sarana,
        lokasi,
        deskripsi,
        tanggal_permintaan: tanggal,
      },
    ]);

    if (error) {
      setMessage("❌ Gagal mengirim permintaan: " + error.message);
    } else {
      setMessage("✅ Permintaan berhasil dikirim! Tim akan segera menindaklanjuti.");
      // Reset form
      setNama("");
      setBagian("");
      setJenis("Pemeliharaan");
      setSarana("");
      setLokasi("");
      setDeskripsi("");
      setTanggal("");
    }
    setLoading(false);

    // Hilangkan pesan setelah 5 detik
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-3xl border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Formulir Permintaan Pemeliharaan & Perbaikan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Laporkan kerusakan atau ajukan pemeliharaan sarana/prasarana di bawah ini.
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium text-center shadow-sm
              ${message.includes("Gagal") || message.includes("Harap")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
              }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama & Bagian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                placeholder="Contoh: Andi Wijaya"
              />
            </div>
            
          {/* Bagian */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bagian</label>
            <select
              value={bagian}
              onChange={(e) => setBagian(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            >
              <option value="Kepala Bagian Tata Usaha">Kepala Bagian Tata Usaha</option>
              <option value="Tim Kerja Sertifikasi">Tim Kerja Sertifikasi</option>
              <option value="Tim Kerja Verifikasi dan Validasi">Tim Kerja Verifikasi dan Validasi</option>
              <option value="Tim Kerja Pengujian, Standardisasi dan Inspeksi Teknis">Tim Kerja Pengujian, Standardisasi dan Inspeksi Teknis</option>
              <option value="Tim Kerja Kalibrasi dan Uji Profesiensi">Tim Kerja Kalibrasi dan Uji Profesiensi</option>
              <option value="Tim Kerja Optimalisasi Pemanfaatan Teknologi dan Lembaga Sertifikasi Profesi">Tim Kerja Optimalisasi Pemanfaatan Teknologi dan Lembaga Sertifikasi Profesi</option>
              <option value="Tim Kerja Bimbingan Teknis Konsultansi dan Pendampingan">Tim Kerja Bimbingan Teknis Konsultansi dan Pendampingan</option>
              <option value="Tim Kerja Pengembangan Bisnis">Tim Kerja Pengembangan Bisnis</option>
              <option value="Tim Kerja Satuan Pengawas Intern">Tim Kerja Satuan Pengawas Intern</option>
              <option value="Tim Kerja Bagian Tata Usaha">Tim Kerja Bagian Tata Usaha</option>
            </select>
          </div>
          </div>
        
          {/* Jenis Permintaan & Sarana */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Permintaan pemeliharaan/perbaikan</label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white"
              >
                <option value="Pemeliharaan">Pemeliharaan</option>
                <option value="Perbaikan">Perbaikan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sarana/Prasarana</label>
              <input
                type="text"
                value={sarana}
                onChange={(e) => setSarana(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                placeholder="Contoh: AC, Lift, Meja Kerja"
              />
            </div>
          </div>

          {/* Lokasi & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi / Ruangan</label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                placeholder="Contoh: Lantai 2, Ruang Server"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Permintaan</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Deskripsi Kerusakan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Kerusakan / Permintaan
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm resize-none"
              placeholder="Jelaskan kondisi kerusakan atau kebutuhan pemeliharaan secara detail..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2
              ${loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md hover:shadow-lg"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Mengirim...
              </span>
            ) : (
              "Kirim Permintaan"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Sistem Permintaan Pemeliharaan. Dilaporkan, ditindaklanjuti, tercatat.
        </div>
      </div>
    </div>
  );
}