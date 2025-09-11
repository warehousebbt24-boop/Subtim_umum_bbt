import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="relative max-w-lg w-full text-center space-y-8 px-8 py-12 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 text-white z-10">
        {/* Logo / Icon with Pulse Animation */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center shadow-2xl border border-white/20 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white drop-shadow-lg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h8m0 0v8m0-8l-8 8-8-8"
              />
            </svg>
          </div>
        </div>

        {/* Judul dengan Gradient Text */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
          Sistem Peminjaman Kendaraan
          <span className="block text-lg sm:text-xl font-semibold mt-2 text-blue-100">
            BBSPJI Tekstil
          </span>
        </h1>

        <p className="text-white/80 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
          Pilih menu di bawah ini untuk mengajukan atau memantau status
<<<<<<< HEAD
          peminjaman Inventaris secara resmi.
=======
          peminjaman kendaraan secara resmi dan terintegrasi.
>>>>>>> 168d0d5 (Update: deskripsi perubahan)
        </p>

        {/* Tombol Aksi dengan Hover Scale & Glow */}
        <div className="grid grid-cols-1 gap-6 mt-10">
          {/* Form Peminjaman */}
          <Link
            href="/Formulir_peminjaman_inventaris/dashboard"
            className="group block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-5 px-6 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 font-semibold text-lg border border-blue-400/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 opacity-90 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Form Peminjaman Inventaris</span>
            </div>
          </Link>

          {/* Cek Status */}
          <Link
            href="/Formulir_peminjaman_inventaris/status"
            className="group block w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-5 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/30 hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 font-semibold text-lg border border-emerald-400/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 opacity-90 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Cek Status Peminjaman Inventaris</span>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/20 text-xs text-white/60">
          © {new Date().getFullYear()} BBSPJI Tekstil • Sistem Manajemen Peminjaman Internal
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}