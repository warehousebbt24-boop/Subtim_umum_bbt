import React from "react";

export default function CreatedBy() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Created by</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
            Halaman ini menampilkan tim pengembang yang membuat <strong>Website Penerimaan Magang</strong> untuk
            <br /> <em>Balai Besar Standardisasi dan Pelayanan Jasa Industri Tekstil</em> (BBSPJI Tekstil).
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Person 1 */}
          <article className="flex flex-col items-center text-center p-4 rounded-2xl border border-gray-100">
            <img
              src="choerulpajri.jpg"
              alt="Foto Pengembang 1"
              className="w-28 h-28 rounded-full object-cover shadow-sm"
            />
            <h3 className="mt-4 font-semibold text-gray-800">Choerul Pajri</h3>
            <p className="text-sm text-gray-500">Ketua Tim • Sistem Informasi</p>
          </article>

          {/* Person 2 */}
          <article className="flex flex-col items-center text-center p-4 rounded-2xl border border-gray-100">
            <img
              src="deri.jpg"
              alt="Foto Pengembang 2"
              className="w-28 h-28 rounded-full object-cover shadow-sm"
            />
            <h3 className="mt-4 font-semibold text-gray-800">Deri Anggara</h3>
            <p className="text-sm text-gray-500">Anggota • Sistem Informasi</p>
          </article>

          {/* Person 3 */}
          <article className="flex flex-col items-center text-center p-4 rounded-2xl border border-gray-100">
            <img
              src="mr_bintang.jpg"
              alt="Foto Pengembang 3"
              className="w-28 h-28 rounded-full object-cover shadow-sm"
            />
            <h3 className="mt-4 font-semibold text-gray-800">Bintang Nugroho</h3>
            <p className="text-sm text-gray-500">Mentor</p>
          </article>
        </div>

        <div className="mt-8 rounded-xl p-6 bg-gray-50 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Tentang Proyek</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Proyek ini merupakan pengembangan sistem pendaftaran magang berbasis web untuk <strong>Balai Besar
            Standardisasi dan Pelayanan Jasa Industri Tekstil</strong>. Sistem menyediakan fitur pendaftaran, verifikasi,
            pengelolaan peserta, dan laporan. Teknologi yang digunakan antara lain Next.js, React, Tailwind CSS, dan
            Supabase (untuk autentikasi dan database). Tujuan proyek adalah mempermudah proses administrasi magang,
            meningkatkan transparansi, dan mempercepat verifikasi peserta.
          </p>

          <div className="mt-4 text-sm text-gray-500">
            <div><strong>Waktu Pengerjaan:</strong> 11 Agustus — 11 September 2025</div>
          </div>
        </div>

        <footer className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Tim Pengembangan - Website Penerimaan Magang BBSPJI Tekstil
        </footer>
      </div>
    </section>
  );
}
