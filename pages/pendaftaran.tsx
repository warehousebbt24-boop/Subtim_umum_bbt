// pages/pendaftaran.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClientAnon";
import CalendarStep from "../components/calendarstep";
import FormStep from "../components/formstep";

type UserData = {
  nama: string;
  email: string;
  nama_sekolah_universitas: string;
  jurusan: string;
};

export default function Pendaftaran() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [step, setStep] = useState<"calendar" | "form">("calendar");
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [unitKerja, setUnitKerja] = useState<string>(""); // State untuk unit kerja

  useEffect(() => {
    const checkSessionAndFetchUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const token = session.access_token;

      try {
        const resUser = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resUser.status === 401) {
          router.push("/login");
          return;
        }

        if (!resUser.ok) throw new Error("Gagal mengambil data user");

        const dataUser: UserData = await resUser.json();
        setUserData(dataUser);
        setErrorUser(null);
      } catch (error: any) {
        setErrorUser(error.message);
      } finally {
        setLoadingUser(false);
      }
    };

    checkSessionAndFetchUser();
  }, [router]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (errorUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center border border-red-200">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-600 mb-4">{errorUser}</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-25 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Pendaftaran Magang</h1>
            <p className="text-gray-600 text-sm">BBSPJIT - Badan Standardisasi Pendidikan dan Kejuruan</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Halo,</p>
            <p className="font-medium text-gray-800">{userData?.nama}</p>
          </div>
        </div>
      </header>

      {/* Progress Step Indicator */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
              step === "calendar" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
            }`}
          >
            1
          </div>
          <div className={`h-1 w-16 transition ${step === "form" ? "bg-green-500" : "bg-gray-300"}`}></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
              step === "form" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {step === "calendar" ? "Pilih Tanggal Magang" : "Lengkapi Formulir"}
          </h2>
          <p className="text-gray-500">
            {step === "calendar"
              ? "Pilih rentang tanggal sesuai kebutuhan Anda"
              : "Isi data tambahan untuk melengkapi pendaftaran"}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <main className="max-w-4xl mx-auto px-6 pb-12">
        {step === "calendar" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6">
              <h3 className="text-lg font-semibold">📅 Pilih Tanggal Mulai Magang</h3>
              <p className="text-blue-100 text-sm">Pilih unit kerja dan tanggal yang tersedia</p>
            </div>
            <div className="p-6">
              <CalendarStep
                selectedDates={selectedDates.start ? { start: selectedDates.start, end: selectedDates.end } : undefined}
                onSelectDates={(range) =>
                  setSelectedDates({
                    start: range.start ?? null,
                    end: range.end ?? null,
                  })
                }
                onNext={() => {
                  if (!selectedDates.start || !unitKerja) {
                    alert("Pilih unit kerja dan tanggal terlebih dahulu.");
                    return;
                  }
                  setStep("form");
                }}
                onPeriodeChange={() => {}}
                defaultPeriode={30}
                onUnitKerjaChange={setUnitKerja}
              />
            </div>
          </div>
        )}

        {step === "form" && userData && selectedDates.start && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6">
              <h3 className="text-lg font-semibold">📄 Lengkapi Formulir Pendaftaran</h3>
              <p className="text-green-100 text-sm">Isi data tambahan Anda</p>
            </div>
            <div className="p-6">
              <FormStep
                selectedDates={{
                  start: selectedDates.start,
                  end: selectedDates.end ?? null,
                }}
                onBack={() => setStep("calendar")}
                userData={userData}
                unitKerja={unitKerja}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm bg-white border-t">
        &copy; {new Date().getFullYear()} BBSPJIT. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}