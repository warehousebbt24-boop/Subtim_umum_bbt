// pages/dashboard.js
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

 const links = [
  {
  href: '/Formulir_peminjaman_kendaraaan/',
  icon: (
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110">
      <img
        src="/mobil.png"
        alt="Ikon Peminjaman Kendaraan Dinas"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  ),
  title: 'Formulir Peminjaman Kendaraan Dinas',
  description: 'Ajukan peminjaman kendaraan dinas secara online dengan cepat dan mudah.',
  },
    {
      href: '/Formulir_peminjaman_ruangan/',
      icon: (
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110">
      <img
        src="/ruangan.jpg"
        alt="Ikon Peminjaman Kendaraan Dinas"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  ),
      title: 'Formulir Peminjaman Ruangan',
    },
    {
      href: '/Formulir_permintaan_pemeliharaan/',
      icon: (
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110">
      <img
        src="/perbaikan.png"
        alt="Ikon Peminjaman Kendaraan Dinas"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  ),
      title: 'Formulir permintaan pemeliharaan/perbaikan',
    },
    {
      href: '/Formulir_peminjaman_inventaris/',
      icon: (
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110">
      <img
        src="/inventaris.png"
        alt="Ikon Peminjaman Kendaraan Dinas"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  ),
      title: 'Peminjaman Inventaris Umum',
    },
    {
      href: '/Download_formulir_permintaan/',
      icon: (
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110">
      <img
        src="/download.jpeg"
        alt="Ikon Peminjaman Kendaraan Dinas"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  ),
      title: 'Download Formulir permintaan',
    },
    {
      href: '/pendaftaran_magang',
      icon: (
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110">
      <img
        src="/pkl.png"
        alt="Ikon Peminjaman Kendaraan Dinas"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  ),
      title: 'Pendaftaran PKL / Magang',
    },
    {
  href: '/Create_by',
  icon: (
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110">
      <img
        src="/crete_by.jpeg"
        alt="Ikon Peminjaman Kendaraan Dinas"
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  ),
  title: 'Create By',
}

  ];

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white bg-opacity-5 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Login Admin Button */}
      <div className="absolute top-6 right-6 z-20">
        <Link href="/admin/login" passHref>
          <button
            aria-label="Login sebagai Admin"
            className="group relative bg-white bg-opacity-10 backdrop-blur-sm text-white rounded-full px-5 py-2.5 text-sm font-medium border border-white border-opacity-20 hover:bg-opacity-20 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 ease-out"
          >
            <span className="relative z-10">Login Admin</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>
        </Link>
      </div>

      {/* Main Card — Glassmorphism + Floating Animation */}
      <div
        className={`bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-6 md:p-10 w-full max-w-md md:max-w-lg text-white shadow-2xl border border-white border-opacity-20 transform transition-all duration-700 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } hover:shadow-cyan-500/20 hover:scale-[1.02]`}
      >
        {/* Decorative Corner Elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-40"></div>

        {/* Logo Section */}
        <div className="flex justify-center mb-8">
      <div className="relative group">
        {/* Glow animasi */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 blur-xl opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse"></div>
        
        {/* Lingkaran border gradient */}
        <div className="rounded-full p-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 relative z-10">
          {/* Logo */}
          <img
            src="/logo.jpg"
            alt="Logo Sistem Informasi Layanan Umum"
            className="h-24 w-24 md:h-28 md:w-28 object-contain rounded-full bg-white p-2 shadow-xl transform transition duration-500 group-hover:scale-110"
          />
        </div>

      </div>

        </div>

        {/* Title & Tagline */}
        <h1 className="text-center font-black text-3xl md:text-4xl mb-1 tracking-tighter bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
          SOLUSI
        </h1>
        <p className="text-center text-xs md:text-sm mb-10 font-medium opacity-85 tracking-wide px-4">
          <em>Sistem infOrmasi Layanan Umum terintegraSI</em>
        </p>

        {/* Links Grid */}
        <div className="space-y-4">
          {links.map(({ href, icon, title }, i) => (
            <Link
              key={i}
              href={href}
              className="group flex items-center gap-4 bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm rounded-2xl px-5 py-4 md:py-5 text-sm md:text-base font-medium border border-white border-opacity-10 hover:border-opacity-30 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
              aria-label={`Buka ${title}`}
            >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-md group-hover:scale-110 transition-transform duration-300 overflow-hidden">
            {icon}
          </div>



              <span className="flex-1 text-left font-medium leading-tight group-hover:text-cyan-200 transition-colors">
                {title}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-cyan-300 opacity-70 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] opacity-50 space-x-3 mt-8 tracking-wider">
          <Link href="#" className="hover:underline hover:text-cyan-300 transition">
            Cookie
          </Link>
          <span>•</span>
          <Link href="#" className="hover:underline hover:text-cyan-300 transition">
            Report
          </Link>
          <span>•</span>
          <Link href="#" className="hover:underline hover:text-cyan-300 transition">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}