import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClientAnon";

export default function DashboardRuangan() {
  const [nama, setNama] = useState("");
  const [ruangan, setRuangan] = useState("");
  const [tglPinjam, setTglPinjam] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [bagian, setBagian] = useState("");
  const [jam_mulai, setJam_Mulai] = useState("");
  const [jumlahPeserta, setJumlahPeserta] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [ruanganPenuh, setRuanganPenuh] = useState<string[]>([]);

  // Daftar ruangan tetap
  const daftarRuangan = [
  "Ruang Rapat Sutera BBSPJI Tekstil",
  "Ruang Rapat Kapas BBSPJI Tekstil",
  "Ruang Rapat Pelatihan Lantai 3 (Gedung Utama) BBSPJI Tekstil",
  "Ruang Rapat Lantai 3 (Lab.Pengujian) BBSPJI Tekstil",
  "Ruang Rapat Lantai 2 (SRKT) BBSPJI Tekstil",
  "Aula BBSPJI Tekstil",
  "Ruang V.I.P"
];


  // Cek ruangan penuh berdasarkan tanggal
useEffect(() => {
  const fetchData = async () => {
    if (!tglPinjam) {
      setRuanganPenuh([]);
      return;
    }

    const { data, error } = await supabase
      .from("peminjaman_ruangan")
      .select("ruangan, status")
      .eq("tanggal_pinjam", tglPinjam);

    if (error) {
      console.error("Gagal cek ruangan:", error.message);
      return;
    }

    if (data) {
      // Ambil hanya ruangan yang sudah di ACC (status = 'acc')
      const list = data
        .filter((item: any) => item.status === "acc")
        .map((item: any) => item.ruangan);

      setRuanganPenuh(list);
    }
  };

  fetchData();
}, [tglPinjam]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (ruanganPenuh.includes(ruangan)) {
      setMessage("❌ Ruangan ini sudah penuh di tanggal tersebut.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("peminjaman_ruangan").insert([
      {
        nama,
        ruangan,
        tanggal_pinjam: tglPinjam,
        keperluan,
        bagian,
        jam_mulai,
        jumlah_peserta: jumlahPeserta,
      },
    ]);

    if (error) {
      setMessage("❌ Gagal menyimpan: " + error.message);
    } else {
      setMessage("✅ Peminjaman berhasil diajukan!");
      // Reset form
      setNama("");
      setRuangan("");
      setTglPinjam("");
      setKeperluan("");
      setBagian("");
      setJam_Mulai("");
      setJumlahPeserta("");
      setRuanganPenuh([]);
    }
    setLoading(false);

    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Pencarian Ruangan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pilih tanggal & ruangan terlebih dahulu.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium text-center shadow-sm
              ${
                message.includes("Gagal")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
          >
            {message}
          </div>
        )}

        {/* Pilih tanggal & ruangan */}
        <div className="space-y-5 mb-6">
          {/* Tanggal Pinjam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Peminjaman
            </label>
            <input
              type="date"
              value={tglPinjam}
              onChange={(e) => {
                setTglPinjam(e.target.value);
                setRuangan("");
              }}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Ruangan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Ruangan
            </label>
            <select
              value={ruangan}
              onChange={(e) => setRuangan(e.target.value)}
              disabled={!tglPinjam}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">-- Pilih Ruangan --</option>
              {daftarRuangan.map((r) => (
                <option key={r} value={r} disabled={ruanganPenuh.includes(r)}>
                  {`Ruangan ${r}`} {ruanganPenuh.includes(r) ? "(Penuh)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form detail muncul hanya jika ruangan dipilih */}
        {ruangan && !ruanganPenuh.includes(ruangan) && (
          <form onSubmit={handleSubmit} className="space-y-5 border-t pt-6">
            {/* Nama & NIM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Peminjam
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                />
                
              </div>
               {/* Jam Mulai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jam Mulai
              </label>
              <input
                type="time"
                value={jam_mulai}
                onChange={(e) => setJam_Mulai(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            </div>
           


            {/* Keperluan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keperluan
              </label>
              <textarea
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
                required
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
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
              <option value="--pilih bagian --">
                --Pilih Bagian --
              </option>
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

            {/* Jumlah Peserta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Peserta
              </label>
              <input
                type="number"
                value={jumlahPeserta}
                onChange={(e) => setJumlahPeserta(e.target.value)}
                required
                min={2} // batas minimal 2 orang
                max={1000} // batas maksimal 6 orang
                className="w-1/2 p-3 border border-gray-300 rounded-xl bg-white text-sm"
                placeholder="Masukkan jumlah peserta"
              />
            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300
                ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                }`}
            >
              {loading ? "Memproses..." : "Ajukan Peminjaman"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
