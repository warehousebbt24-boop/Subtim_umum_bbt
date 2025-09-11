import { useState } from "react";
import { supabase } from "../../lib/supabaseClientAnon";

export default function Dashboard() {
  const [nama, setNama] = useState("");
  const [bagian, setBagian] = useState("Motor");
  const [jumlah_penumpang, setJumlahPenumpang] = useState("");
  const [tglPinjam, setTglPinjam] = useState("");
  const [tglKembali, setTglKembali] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Perbaikan: Tambahkan tipe 'React.FormEvent'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("peminjaman_kendaraan").insert([
      {
        nama,
        bagian,
        tanggal_pinjam: tglPinjam,
        tanggal_kembali: tglKembali,
        keperluan,
        jumlah_penumpang,
      },
    ]);

    if (error) {
      setMessage("❌ Gagal menyimpan: " + error.message);
    } else {
      setMessage("✅ Data berhasil disimpan!");
      // Reset form
      setNama("");
      setBagian("");
      setJumlahPenumpang("");
      setTglPinjam("");
      setTglKembali("");
      setKeperluan("");
    }
    setLoading(false);

    // Hilangkan pesan setelah 5 detik
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-gray-100 transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            Form Peminjaman Kendaraan
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
            Isi formulir di bawah ini untuk mengajukan peminjaman kendaraan secara resmi.
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium text-center shadow-sm animate-fade-in
              ${message.includes("Gagal")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
              }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Peminjam */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Peminjam
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400"
              placeholder="Contoh: Budi Santoso"
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
              <option value="Subtim Humas Data & Informasi Dan Kerjasama Internasional">Subtim Humas Data & Informasi Dan Kerjasama Internasional</option>
              <option value="Subtim Keuangan Dan Barang Milik Negara">Subtim Keuangan Dan Barang Milik Negara</option>
              <option value="Subtim Kepegawaian">Subtim Kepegawaian</option>
              <option value="Subtim Program Evaluasi Dan Pelaporan">Subtim Program Evaluasi Dan Pelaporan</option>
              <option value="Subtim Umum">Subtim Umum</option>
              <option value="Subtim Protokoler Dan Layanan Pimpinan">Subtim Protokoler Dan Layanan Pimpinan</option>
              <option value="Subtim Integrasi Sistem Manajemen">Subtim Integrasi Sistem Manajemen</option>
              <option value="KATIM Pengembangan Bisnis Dan Jasa Layanan">KATIM Pengembangan Bisnis Dan Jasa Layanan</option>
              <option value="Subtim Promosi Dan Pemasaran">Subtim Promosi Dan Pemasaran</option>
              <option value="Subtim Pelayanan Dan Penanganan Keluhan Pelanggan (ISSC)">Subtim Pelayanan Dan Penanganan Keluhan Pelanggan (ISSC)</option>
              <option value="Subtim Pengembangan Sistem Operasi Bisnis Dan Layanan BLU">Subtim Pengembangan Sistem Operasi Bisnis Dan Layanan BLU</option>
              <option value="Subtim Kerjasama Dan Pengembangan Bisnis">Subtim Kerjasama Dan Pengembangan Bisnis</option>
              <option value="KATIM Pengujian,Kalibrasi,Standardisasi,Inspeksi Teknis Dan Uji Profisiensi">KATIM Pengujian,Kalibrasi,Standardisasi,Inspeksi Teknis Dan Uji Profisiensi</option>
              <option value="Subtim Pengujian">Subtim Pengujian</option>
              <option value="Subtim Kalibrasi">Subtim Kalibrasi</option>
              <option value="Subtim Inspeksi Teknis">Subtim Inspeksi Teknis</option>
              <option value="Subtim Penyelenggara Uji Profisiensi">Subtim Penyelenggara Uji Profisiensi</option>
              <option value="Subtim Standardisasi Dan Bahan Acuan">Subtim Standardisasi Dan Bahan Acuan</option>
              <option value="KATIM Sertifikasi Dan Verifikasi">KATIM Sertifikasi Dan Verifikasi</option>
              <option value="Subtim Sertifikasi Dan Verifikasi ">Subtim Sertifikasi Dan Verifikasi</option>
              <option value="Subtim Sertifikasi Industri Hijau">Subtim Sertifikasi Industri Hijau</option>
              <option value="Subtim Pemeriksa Halal">Subtim Pemeriksa Halal</option>
              <option value="Subtim Sertifikasi Lingkungan Dan SMK.3">Subtim Sertifikasi Lingkungan Dan SMK.3</option>
              <option value="Subtim Lembaga Validasi Verifikasi Gasrumah Kaca & Nilai Ekonomi Karbon">Subtim Lembaga Validasi Verifikasi Gasrumah Kaca & Nilai Ekonomi Karbon</option>
              <option value="Subtim Pengendali Mutu Sertifikasi Dan Verifikasi">Subtim Pengendali Mutu Sertifikasi Dan Verifikasi</option>
              <option value="KATIM Fasilitasi Optimalisasi Pemanfaatan Teknologi Industri">KATIM Fasilitasi Optimalisasi Pemanfaatan Teknologi Industri</option>
              <option value="Subtim Fasilitasi Workshop Dan Rancang Bangun">Subtim Fasilitasi Workshop Dan Rancang Bangun</option>
              <option value="Subtim Bimbingan Dan Konsultasi Teknis">Subtim Bimbingan Dan Konsultasi Teknis</option>
              <option value="Subtim Optimalisasi Teknologi Industri">Subtim Optimalisasi Teknologi Industri</option>
              <option value="Subtim Verifikasi TKDN Dan Kemampuan Industri">Subtim Verifikasi TKDN Dan Kemampuan Industri</option>
              <option value="Subtim Fasilitasi Kemitraan Industri Dan Lembaga Sertifikasi Profesi">Subtim Fasilitasi Kemitraan Industri Dan Lembaga Sertifikasi Profesi</option>
            </select>
          </div>

          {/* Jumlah Penumpang - Diperbaiki: Lebih ringkas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jumlah Penumpang
            </label>
            <select
              value={jumlah_penumpang}
              onChange={(e) => setJumlahPenumpang(e.target.value)}
              required
              className="w-1/2 p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-50 transition-all duration-20 text-sm"
            >
              <option value="">Pilih jumlah</option>
              <option value="2">2 orang</option>
              <option value="3">3 orang</option>
              <option value="4">4 orang</option>
              <option value="5">5 orang</option>
              <option value="6">6 orang</option>
            </select>
          </div>

          {/* Tanggal Pinjam & Kembali */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Pinjam
              </label>
              <input
                type="date"
                value={tglPinjam}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTglPinjam(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Kembali
              </label>
              <input
                type="date"
                value={tglKembali}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTglKembali(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Keperluan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keperluan Peminjaman
            </label>
            <textarea
              value={keperluan}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeperluan(e.target.value)}
              required
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm resize-none placeholder-gray-400"
              placeholder="Jelaskan tujuan peminjaman kendaraan..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
              ${loading
                ? "bg-gray-500 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Memproses permohonan...
              </span>
            ) : (
              "Ajukan Peminjaman"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-400 tracking-wide">
          © {new Date().getFullYear()} Sistem Peminjaman Kendaraan • Dikelola dengan aman dan profesional
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}