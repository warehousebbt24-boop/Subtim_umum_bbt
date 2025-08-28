import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClientAnon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Email dan password harus diisi");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login berhasil!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side: Illustration + Branding */}
      <div
        className="lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-12 text-white"
        style={{
          backgroundImage: 'url("/logo.svg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-800/80 to-purple-900/90"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-lg mx-auto">
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Selamat Datang di
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100">
              BBSTJ
            </span>
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            Balai Besar Standarisasi Jasa Industri Tekstil
          </p>
          <div className="mt-8 w-48 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto"></div>
        </div>
      </div>

      {/* Right Side: Login Form with Illustration Background */}
      <div
        className="lg:w-1/2 flex items-center justify-center p-8 relative"
        style={{
          backgroundImage: 'url("/login-illustration.svg")', // Ganti dengan nama file ilustrasi kanan
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/85 via-purple-900/75 to-pink-900/85"></div>

        {/* Login Form Card */}
        <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 border border-white/30 transform transition-all hover:shadow-3xl duration-300">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Masuk Akun</h2>
          <p className="text-gray-600 text-center text-sm mb-8">Silakan masukkan kredensial Anda</p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Masuk
            </button>
          </form>

          {/* Message */}
          {message && (
            <p
              className={`mt-5 text-center text-sm font-medium px-4 py-2 rounded-lg ${
                message.includes("berhasil")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          {/* Register Link */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Belum punya akun?{" "}
            <button
              onClick={() => router.push("/register")}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Daftar di sini
            </button>
          </p>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mt-4 w-full py-2.5 text-gray-600 font-medium text-sm bg-gray-100 hover:bg-gray-200 rounded-xl transition duration-200"
          >
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  );
}