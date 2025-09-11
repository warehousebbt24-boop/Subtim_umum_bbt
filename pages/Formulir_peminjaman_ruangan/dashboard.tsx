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
