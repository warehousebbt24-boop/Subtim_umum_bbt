import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Premium Modern dengan Branding Kuat */}
<header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-blue-100 shadow-lg">
  <div className="container mx-auto px-6 py-4">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
      {/* Logo & Brand */}
      <div className="flex items-center space-x-3">
        
        <div className="shadow-lg transform transition-transform hover:scale-105">
          <img 
            src="logo.svg" 
            alt="Logo Balai Besar Standarisasi Jasa Industri Tekstil" 
            className="h-12 w-auto" // h-12 = tinggi 48px, lebar otomatis (mempertahankan rasio)
          />
        </div>
        
        {/* Nama Institusi */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 leading-tight">
            Balai Besar Standarisasi
          </h1>
          <p className="text-sm text-gray-600 font-medium">Jasa Industri Tekstil</p>
        </div>
      </div>

      {/* Login Button & Dropdown */}
      <div className="relative inline-block">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 opacity-90 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Masuk
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/10 z-50 overflow-hidden border border-gray-200/60 transform origin-top scale-100 opacity-100 transition-all duration-300 animate-fadeIn">
            <Link
              href="/login"
              className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border-b border-gray-100 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span>User Login</span>
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 border-b border-gray-100 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span>Admin Login</span>
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span>Daftar Akun</span>
            </Link>
          </div>
        )}
      </div>
    </div>

    {/* Overlay untuk close dropdown */}
    {isMenuOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={() => setIsMenuOpen(false)}
      ></div>
    )}
  </div>
</header>

      {/* Hero Section - Parallax + Gradient Overlay */}
      <section
        className="flex-1 flex flex-col justify-center items-center px-6 py-20 sm:py-28 relative"
        style={{
          backgroundImage: 'url("/bg-company.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay: Black + Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-indigo-900/30"></div>

        {/* Content */}
        <div className="relative z-10 text-white text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Selamat Datang di
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-50 to-indigo-200">
              Sistem Pendaftaran Magang
            </span>
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Platform resmi untuk pendaftaran magang mahasiswa di 
            <strong className="text-white"> Balai Besar Standarisasi Jasa Industri Tekstil</strong>. 
            Mulai proses pendaftaran Anda dengan cepat dan aman.
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            {/* Card: Login */}
            <Link
              href="/login"
              className="group p-6 bg-white/15 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-white/30 text-white text-center hover:bg-white/25"
            >
              <div className="text-blue-200 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Masuk</h3>
              <p className="text-blue-100 text-sm">Lanjutkan pendaftaran atau pantau status Anda.</p>
            </Link>

            {/* Card: Register */}
            <Link
              href="/register"
              className="group p-6 bg-white/15 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-white/30 text-white text-center hover:bg-white/25"
            >
              <div className="text-purple-200 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-8 0v2m8-10a4 4 0 10-8 0 4 4 0 008 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Daftar</h3>
              <p className="text-blue-100 text-sm">Buat akun baru untuk memulai proses magang.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Prosedur Pendaftaran */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              Proses Pendaftaran Magang
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Ikuti langkah-langkah berikut untuk menyelesaikan pendaftaran magang Anda secara resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { step: "Daftar Akun", desc: "Buat akun dengan email aktif Anda." },
              { step: "Isi Data Diri", desc: "Lengkapi biodata dan unggah dokumen pendukung." },
              { step: "Pilih Jadwal", desc: "Tentukan periode dan unit kerja magang." },
              { step: "Konfirmasi", desc: "Periksa dan kirim formulir pendaftaran." },
              { step: "Tunggu Verifikasi", desc: "Admin akan mengonfirmasi dalam 1-3 hari kerja." },
            ].map((item, index) => (
              <div
                key={index}
                className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/60 text-center group"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {index + 1}
                </div>

                <h4 className="text-xl font-bold text-gray-800 mb-2 mt-4 group-hover:text-blue-700 transition-colors">
                  {item.step}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold text-white mb-4">Balai Besar Standarisasi Jasa Industri Tekstil</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Jl. Penelitian No. 24, Kampus PUSLITBANG Industri Tekstil, Gedebage, Bandung 40292<br />
              Email: bbstj@kemenperin.go.id | Telp: (022) 721-1420
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Balai Besar Standarisasi Jasa Industri Tekstil. 
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}