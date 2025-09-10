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
              <option value="">-- Pilih Bagian / Departemen --</option>
              <option value="Sub.Tim. Kerjasama Internasional, Humas, Data & Informasi">
                Sub.Tim. Kerjasama Internasional, Humas, Data & Informasi
              </option>
              <option value="Sub.Tim.Keuangan">Sub.Tim.Keuangan</option>
              <option value="Sub.Tim.Kepegawaian">Sub.Tim.Kepegawaian</option>
              <option value="Sub.Tim.ProgLap">Sub.Tim.ProgLap</option>
              <option value="Sub.Tim.Umum">Sub.Tim.Umum</option>
              <option value="Sub.Tim.Protokoler">Sub.Tim.Protokoler</option>
              <option value="Sub.Tim. Integrasi Sistem Manajemen">
                Sub.Tim. Integrasi Sistem Manajemen
              </option>
              <option value="Sub.Tim. ISSC dan Penangganan Pelanggan ISSC">
                Sub.Tim. ISSC dan Penangganan Pelanggan ISSC
              </option>
              <option value="Sub.Tim. Promosi and Marketing">
                Sub.Tim. Promosi and Marketing
              </option>
              <option value="Sub.Tim. Bussiness Development and Collaboration">
                Sub.Tim. Bussiness Development and Collaboration
              </option>
              <option value="Sub.Tim. Legal & Business Development">
                Sub.Tim. Legal & Business Development
              </option>
              <option value="Sub.Tim. Pengujian">Sub.Tim. Pengujian</option>
              <option value="Sub.Tim. Kalibrasi">Sub.Tim. Kalibrasi</option>
              <option value="Sub.Tim. Inspeksi Teknis">Sub.Tim. Inspeksi Teknis</option>
              <option value="Sub.Tim. Uji Profiensi">Sub.Tim. Uji Profiensi</option>
              <option value="Sub.Tim. Standardisasi dan Bahan Acuan">
                Sub.Tim. Standardisasi dan Bahan Acuan
              </option>
              <option value="Sub.Tim. Sertifikasi Mutu & Produk">
                Sub.Tim. Sertifikasi Mutu & Produk
              </option>
              <option value="Sub.Tim. Sertifikasi Industri Hijau">
                Sub.Tim. Sertifikasi Industri Hijau
              </option>
              <option value="Sub.Tim.Sertifikasi Halal">Sub.Tim.Sertifikasi Halal</option>
              <option value="Sub.Tim.Sertifikasi Lingkungan dan SMK.3">
                Sub.Tim.Sertifikasi Lingkungan dan SMK.3
              </option>
              <option value="Sub.Tim. LVV dan GRK">Sub.Tim. LVV dan GRK</option>
              <option value="Sub.Tim.Pengendali Mutu Sertifikasi dan Verifikasi">
                Sub.Tim.Pengendali Mutu Sertifikasi dan Verifikasi
              </option>
              <option value="Sub.Tim. Fasilitasi Kemitraan Industri dan Lembaga Sertifikasi Personil">
                Sub.Tim. Fasilitasi Kemitraan Industri dan Lembaga Sertifikasi Personil
              </option>
              <option value="Sub.Tim. Bimbingan Teknis dan Konsultansi">
                Sub.Tim. Bimbingan Teknis dan Konsultansi
              </option>
              <option value="Sub.Tim.OPTI">Sub.Tim.OPTI</option>
              <option value="Sub.Tim.TKDN dan Kemampuan Industri">
                Sub.Tim.TKDN dan Kemampuan Industri
              </option>
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