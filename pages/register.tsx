import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nama, setNama] = useState("");
  const [study, setStudy] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [namaSekolah, setNamaSekolah] = useState("");
  const [namaUniversitas, setNamaUniversitas] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // tambahan untuk input manual jurusan
  const [jurusanLainnya, setJurusanLainnya] = useState("");

  const router = useRouter();

  // Daftar jurusan di SMA & SMK
  const jurusanSMA = [
    // SMA
    "IPA",
    "IPS",
    "Bahasa",

    // SMK Teknik
    "Teknik Mesin",
    "Teknik Otomotif",
    "Teknik Listrik",
    "Teknik Elektronika",
    "Teknik Komputer dan Jaringan",
    "Multimedia",
    "Rekayasa Perangkat Lunak",
    "Teknik Sipil",
    "Teknik Kimia",
    "Teknik Pendingin dan Tata Udara",

    // SMK Non-Teknik
    "Akuntansi dan Keuangan",
    "Manajemen Perkantoran",
    "Bisnis Daring dan Pemasaran",
    "Perhotelan",
    "Tata Boga",
    "Tata Busana",
    "Farmasi",
    "Keperawatan",
    "Perbankan Syariah",
    "Agribisnis",
    "Peternakan",
    "Perikanan",
    "Lainnya",
  ];

  // Daftar jurusan kuliah / mahasiswa
  const jurusanMahasiswa = [
    // Komputer & Teknologi
    "Teknik Informatika",
    "Sistem Informasi",
    "Ilmu Komputer",
    "Rekayasa Perangkat Lunak",
    "Teknik Elektro",
    "Teknik Industri",
    "Teknik Mesin",
    "Teknik Sipil",
    "Teknik Kimia",
    "Teknik Lingkungan",
    "Arsitektur",

    // Ekonomi & Bisnis
    "Manajemen",
    "Akuntansi",
    "Ekonomi Pembangunan",
    "Bisnis Digital",
    "Administrasi Bisnis",
    "Kewirausahaan",

    // Sosial & Humaniora
    "Ilmu Hukum",
    "Ilmu Komunikasi",
    "Hubungan Internasional",
    "Sosiologi",
    "Psikologi",
    "Pendidikan Guru Sekolah Dasar",
    "Pendidikan Bahasa Inggris",
    "Sastra Indonesia",
    "Sastra Inggris",

    // Seni & Desain
    "Desain Komunikasi Visual",
    "Desain Produk",
    "Seni Musik",
    "Seni Rupa",

    // Kesehatan
    "Kedokteran",
    "Keperawatan",
    "Kebidanan",
    "Farmasi",
    "Kesehatan Masyarakat",
    "Gizi",

    // Sains
    "Matematika",
    "Fisika",
    "Biologi",
    "Kimia",
    "Statistika",
    "Astronomi",
    "Lainnya",
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi password tidak cocok.");
      setIsSubmitting(false);
      return;
    }

    if (!jurusan) {
      setMessage("Silakan pilih jurusan.");
      setIsSubmitting(false);
      return;
    }

    // cek jika pilih "Lainnya"
    const jurusanFinal = jurusan === "Lainnya" ? jurusanLainnya : jurusan;

    if (jurusan === "Lainnya" && !jurusanLainnya.trim()) {
      setMessage("Silakan isi jurusan lainnya.");
      setIsSubmitting(false);
      return;
    }

    let nama_sekolah_universitas = "";
    if (study === "SMA/SMK") {
      if (!namaSekolah.trim()) {
        setMessage("Silakan isi nama sekolah.");
        setIsSubmitting(false);
        return;
      }
      nama_sekolah_universitas = namaSekolah;
    } else if (study === "Mahasiswa") {
      if (!namaUniversitas.trim() || !jenjang) {
        setMessage("Silakan isi nama universitas dan jenjang pendidikan.");
        setIsSubmitting(false);
        return;
      }
      nama_sekolah_universitas = `${namaUniversitas} - ${jenjang}`;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nama,
          study,
          jurusan: jurusanFinal,
          nama_sekolah_universitas,
        }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        // Reset form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setNama("");
        setStudy("");
        setJurusan("");
        setJurusanLainnya("");
        setNamaSekolah("");
        setNamaUniversitas("");
        setJenjang("");

        // Redirect setelah 1.5 detik
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat mendaftar. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-8 px-6">
          <h1 className="text-3xl font-bold">Daftar Akun Magang</h1>
          <p className="mt-2 text-blue-100">
            Isi data diri Anda dengan benar untuk melanjutkan pendaftaran.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="p-8 space-y-6">
          {/* Nama Lengkap */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              id="nama"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Buat password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Study Level */}
          <div>
            <label htmlFor="study" className="block text-sm font-medium text-gray-700 mb-1">
              Jenjang Pendidikan
            </label>
            <select
              id="study"
              value={study}
              onChange={(e) => {
                setStudy(e.target.value);
                setJurusan("");
                setJurusanLainnya("");
              }}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">-- Pilih Jenjang --</option>
              <option value="SMA/SMK">SMA/SMK Sederajat</option>
              <option value="Mahasiswa">Mahasiswa/Mahasiswi</option>
            </select>
          </div>

          {/* Conditional Fields */}
          {study === "SMA/SMK" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700 mb-1">
                  Jurusan
                </label>
                <select
                  id="jurusan"
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">-- Pilih Jurusan --</option>
                  {jurusanSMA.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>

                {/* Input jika pilih Lainnya */}
                {jurusan === "Lainnya" && (
                  <input
                    type="text"
                    placeholder="Masukkan jurusan lainnya"
                    value={jurusanLainnya}
                    onChange={(e) => setJurusanLainnya(e.target.value)}
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                )}
              </div>
              <div>
                <label htmlFor="namaSekolah" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Sekolah
                </label>
                <input
                  id="namaSekolah"
                  type="text"
                  placeholder="Contoh: SMK Negeri 1 Bandung"
                  value={namaSekolah}
                  onChange={(e) => setNamaSekolah(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          )}

          {study === "Mahasiswa" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700 mb-1">
                    Jurusan
                  </label>
                  <select
                    id="jurusan"
                    value={jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">-- Pilih Jurusan --</option>
                    {jurusanMahasiswa.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>

                  {/* Input jika pilih Lainnya */}
                  {jurusan === "Lainnya" && (
                    <input
                      type="text"
                      placeholder="Masukkan jurusan lainnya"
                      value={jurusanLainnya}
                      onChange={(e) => setJurusanLainnya(e.target.value)}
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="jenjang" className="block text-sm font-medium text-gray-700 mb-1">
                    Jenjang
                  </label>
                  <select
                    id="jenjang"
                    value={jenjang}
                    onChange={(e) => setJenjang(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">-- Pilih Jenjang --</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="D4">D4</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="namaUniversitas" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Universitas
                </label>
                <input
                  id="namaUniversitas"
                  type="text"
                  placeholder="Contoh: Universitas Padjadjaran"
                  value={namaUniversitas}
                  onChange={(e) => setNamaUniversitas(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-300 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Mendaftar...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 text-center text-sm px-4 py-2 rounded-lg ${
                message.includes("berhasil")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login Link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
