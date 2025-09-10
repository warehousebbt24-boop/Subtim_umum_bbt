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

    // Jika user memilih peralatan (bukan "lainnya"), cek jadwalnya
    if (name === "peralatan" && value && value !== "lainnya") {
      await checkAvailability(value);
    }
  };

  const checkAvailability = async (peralatan: string) => {
    const { data, error } = await supabase
      .from("peminjaman_peralatan")
      .select("tanggal_pinjam, tanggal_kembali, status")
      .eq("peralatan", peralatan)
      .eq("status", "acc"); // hanya cek yang aktif dipinjam

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
        blocked.push(d.toISOString().split("T")[0]); // format YYYY-MM-DD
        d.setDate(d.getDate() + 1);
      }
    });

    setUnavailableDates(blocked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Ambil nilai peralatan final
    const peralatanFinal =
      form.peralatan === "lainnya" ? form.peralatanLainnya : form.peralatan;

    // Validasi ketersediaan
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Formulir Peminjaman Peralatan
          </h1>
          <p className="text-gray-500 text-sm">
            Isi data dengan lengkap dan benar untuk mengajukan peminjaman.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 px-5 py-3 rounded-lg text-sm font-medium text-center shadow-sm ${
              message.includes("❌")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="nama"
            placeholder="Nama Lengkap"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <select
  name="bagian"
  value={form.bagian}
  onChange={handleChange}
  required
  className="w-full p-3 border border-gray-300 rounded-xl bg-white 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             focus:border-blue-500 transition-all duration-200 text-sm"
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


          {/* Pilihan Peralatan */}
          <select
            name="peralatan"
            value={form.peralatan}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">-- Pilih Peralatan --</option>
            <option value="Soundsystem Portable(1 Unit)">Soundsystem Portable(1 Unit)</option>
            <option value="Roda Ngangkut Barang (1 Unit)">Roda Ngangkut Barang (1 Unit)</option>
            <option value="Oxygen Concentrator (Nebulizer) (1 Unit)">Oxygen Concentrator (Nebulizer) (1 Unit)</option>
            <option value="Soundsystem HUPPER & Mixer Besar (1 Unit)">Soundsystem HUPPER & Mixer Besar (1 Unit)</option>
            <option value="Kabel Terminal Combinasi (1 Pcs )">Kabel Terminal Combinasi (1 Pcs )</option>
            <option value="lainnya">Lainnya...</option>
          </select>

          {/* Jika pilih lainnya */}
          {form.peralatan === "lainnya" && (
            <input
              type="text"
              name="peralatanLainnya"
              placeholder="Masukkan peralatan lainnya"
              value={form.peralatanLainnya}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          )}

           <input
            type="date"
            name="tanggal_pinjam"
            value={form.tanggal_pinjam}
            onChange={handleChange}
            required
            className={`w-full p-3 border rounded-lg ${
              unavailableDates.includes(form.tanggal_pinjam)
                ? "bg-red-100 border-red-400 cursor-not-allowed"
                : "border-gray-300"
            }`}
          />

          <input
            type="date"
            name="tanggal_kembali"
            value={form.tanggal_kembali}
            onChange={handleChange}
            required
            className={`w-full p-3 border rounded-lg ${
              unavailableDates.includes(form.tanggal_kembali)
                ? "bg-red-100 border-red-400 cursor-not-allowed"
                : "border-gray-300"
            }`}
          />


          <textarea
            name="keperluan"
            placeholder="Keperluan"
            value={form.keperluan}
            onChange={handleChange}
            rows={3}
            required
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              loading
                ? "bg-gray-500"
                : "bg-gradient-to-r from-blue-600 to-blue-700"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim Permohonan"}
          </button>
        </form>
      </div>
    </div>
  );
}
