import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClientAnon";

export default function DashboardPeralatan() {
  const [form, setForm] = useState({
    nama: "",
    bagian: "",
    peralatan: "",
    peralatanLainnya: "",
    tanggal_pinjam: "",
    tanggal_kembali: "",
    keperluan: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "peralatan" && value && value !== "lainnya") {
      await checkAvailability(value);
    }
  };

  const checkAvailability = async (peralatan: string) => {
    const { data, error } = await supabase
      .from("peminjaman_peralatan")
      .select("tanggal_pinjam, tanggal_kembali, status")
      .eq("peralatan", peralatan)
      .eq("status", "acc");

    if (error) {
      console.error(error);
      return;
    }

    let blocked: string[] = [];
    data?.forEach((item) => {
      const start = new Date(item.tanggal_pinjam);
      const end = new Date(item.tanggal_kembali);

      let d = new Date(start);
      while (d <= end) {
        blocked.push(d.toISOString().split("T")[0]);
        d.setDate(d.getDate() + 1);
      }
    });

    setUnavailableDates(blocked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const peralatanFinal =
      form.peralatan === "lainnya" ? form.peralatanLainnya : form.peralatan;

    if (
      unavailableDates.includes(form.tanggal_pinjam) ||
      unavailableDates.includes(form.tanggal_kembali)
    ) {
      setMessage("❌ Peralatan sedang dipinjam pada tanggal tersebut.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("peminjaman_peralatan").insert([
      {
        nama: form.nama,
        bagian: form.bagian,
        peralatan: peralatanFinal,
        tanggal_pinjam: form.tanggal_pinjam,
        tanggal_kembali: form.tanggal_kembali,
        keperluan: form.keperluan,
        status: "pending",
      },
    ]);

    if (error) {
      setMessage("❌ Gagal menyimpan data: " + error.message);
    } else {
      setMessage("✅ Data berhasil disimpan!");
      setForm({
        nama: "",
        bagian: "",
        peralatan: "",
        peralatanLainnya: "",
        tanggal_pinjam: "",
        tanggal_kembali: "",
        keperluan: "",
      });
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 transition-all duration-300 hover:shadow-3xl">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 leading-tight">
            Formulir Peminjaman Peralatan
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            Lengkapi formulir di bawah ini untuk mengajukan peminjaman peralatan. Pastikan data yang Anda masukkan akurat.
          </p>
        </div>

        {/* Message Feedback */}
        {message && (
          <div
            className={`mb-8 px-6 py-4 rounded-xl text-sm font-medium text-center shadow-md transition-all duration-300 transform ${
              message.includes("❌")
                ? "bg-red-50 text-red-700 border border-red-200 animate-shake"
                : "bg-green-50 text-green-700 border border-green-200 animate-fade-in"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              placeholder="Masukkan nama lengkap Anda"
              value={form.nama}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800 shadow-sm"
            />
          </div>

          {/* Bagian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bagian / Departemen</label>
            <select
              name="bagian"
              value={form.bagian}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 shadow-sm appearance-none"
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

          {/* Peralatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peralatan yang Dipinjam</label>
            <select
              name="peralatan"
              value={form.peralatan}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 shadow-sm appearance-none"
            >
              <option value="">-- Pilih Peralatan --</option>
              <option value="Soundsystem Portable(1 Unit)">Soundsystem Portable (1 Unit)</option>
              <option value="Roda Ngangkut Barang (1 Unit)">Roda Ngangkut Barang (1 Unit)</option>
              <option value="Oxygen Concentrator (Nebulizer) (1 Unit)">Oxygen Concentrator (Nebulizer) (1 Unit)</option>
              <option value="Soundsystem HUPPER & Mixer Besar (1 Unit)">Soundsystem HUPPER & Mixer Besar (1 Unit)</option>
              <option value="Kabel Terminal Combinasi (1 Pcs )">Kabel Terminal Combinasi (1 Pcs)</option>
              <option value="lainnya">Lainnya...</option>
            </select>
          </div>

          {/* Input Peralatan Lainnya */}
          {form.peralatan === "lainnya" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spesifikasi Peralatan Lainnya</label>
              <input
                type="text"
                name="peralatanLainnya"
                placeholder="Sebutkan peralatan yang ingin dipinjam"
                value={form.peralatanLainnya}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800 shadow-sm"
              />
            </div>
          )}

          {/* Tanggal Pinjam */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pinjam</label>
              <input
                type="date"
                name="tanggal_pinjam"
                value={form.tanggal_pinjam}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3.5 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                  unavailableDates.includes(form.tanggal_pinjam)
                    ? "bg-red-50 border-red-300 text-red-700 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              />
              {unavailableDates.includes(form.tanggal_pinjam) && (
                <p className="mt-1 text-xs text-red-600">Tanggal ini tidak tersedia</p>
              )}
            </div>

            {/* Tanggal Kembali */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kembali</label>
              <input
                type="date"
                name="tanggal_kembali"
                value={form.tanggal_kembali}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3.5 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                  unavailableDates.includes(form.tanggal_kembali)
                    ? "bg-red-50 border-red-300 text-red-700 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              />
              {unavailableDates.includes(form.tanggal_kembali) && (
                <p className="mt-1 text-xs text-red-600">Tanggal ini tidak tersedia</p>
              )}
            </div>
          </div>

          {/* Keperluan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keperluan Peminjaman</label>
            <textarea
              name="keperluan"
              placeholder="Jelaskan keperluan peminjaman secara singkat"
              value={form.keperluan}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800 shadow-sm resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-white text-base tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : (
              "Ajukan Peminjaman Sekarang"
            )}
          </button>
        </form>
      </div>

      {/* Optional: Add subtle background pattern or decoration */}
      <div className="fixed top-0 right-0 w-96 h-96 -z-10 opacity-5">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#3B82F6" d="M40,-50.5C54.3,-40.7,65.7,-24.7,67.3,-7.3C68.9,10.1,60.7,29,49.2,41.9C37.7,54.8,22.9,61.7,6.6,62.7C-9.7,63.7,-27.4,58.8,-40.3,48.9C-53.2,39,-61.3,24.1,-61.7,7.7C-62.1,-8.7,-54.8,-26.6,-43.9,-39.4C-33,-52.2,-18.5,-60,-1.3,-60.6C15.9,-61.2,31.8,-54.7,40,-50.5Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>
  );
}
