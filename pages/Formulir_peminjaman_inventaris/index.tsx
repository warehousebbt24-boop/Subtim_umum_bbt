import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-lg w-full text-center space-y-6 px-6 py-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9 text-white"
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

        {/* Judul */}
        <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">
          Sistem Peminjaman Kendaraan
          <span className="block text-blue-700 mt-1">BBSPJI Tekstil</span>
        </h1>

        <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
          Pilih menu di bawah ini untuk mengajukan atau memantau status
          peminjaman Inventaris secara resmi.
        </p>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-1 gap-5 mt-8">
          {/* Form Peminjaman */}
          <Link
            href="/Formulir_peminjaman_inventaris/dashboard"
            className="group block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-xl shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transform transition-all duration-300 group-hover:-translate-y-1 font-semibold text-lg border border-blue-500/20"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 opacity-90"
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
            className="group block w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-5 rounded-xl shadow-lg hover:shadow-2xl hover:from-green-700 hover:to-emerald-800 transform transition-all duration-300 group-hover:-translate-y-1 font-semibold text-lg border border-green-500/20"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 opacity-90"
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
        <div className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} BBSPJI Tekstil • Sistem Manajemen
          Peminjaman Internal
        </div>
      </div>
    </div>
  );
}
