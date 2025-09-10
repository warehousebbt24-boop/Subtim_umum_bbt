import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  BuildingOfficeIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  MicrophoneIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  ServerIcon,
  LightBulbIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  UsersIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// Daftar unit kerja sebagai union type
type UnitName =
  | "Subtim Umum"
  | "Subtim Bimtek"
  | "Subtim PBJL"
  | "Subtim Pemasaran"
  | "Subtim Bimtek dan Konsultasi"
  | "Subtim LPH"
  | "Subtim Keuangan"
  | "Subtim Pengujian"
  | "Subtim TKDN"
  | "Subtim Kepegawaian"
  | "Subtim Sekertaris"
  | "Subtim Humasdatin"
  | "Subtim Legal & Bussines Development"
  | "Lab Pengujian"
  | "Lab Lingkungan"
  | "Lab Testbed FOPTI"
  | "Lab Masker"
  | "Lab ISSC";

type UnitType = "Administrasi" | "Teknis" | "Laboratorium" | "Pendukung Strategis";

export default function AlokasiPenempatan() {
  const router = useRouter();

  // Objek ikon dengan tipe eksplisit
  const unitIcons: Record<UnitName, React.ReactNode> = {
    "Subtim Umum": <BuildingOfficeIcon className="w-6 h-6" />,
    "Subtim Bimtek": <BookOpenIcon className="w-6 h-6" />,
    "Subtim PBJL": <CurrencyDollarIcon className="w-6 h-6" />,
    "Subtim Pemasaran": <MicrophoneIcon className="w-6 h-6" />,
    "Subtim Bimtek dan Konsultasi": <LightBulbIcon className="w-6 h-6" />,
    "Subtim LPH": <ShieldCheckIcon className="w-6 h-6" />,
    "Subtim Keuangan": <BanknotesIcon className="w-6 h-6" />,
    "Subtim Pengujian": <ClipboardDocumentListIcon className="w-6 h-6" />,
    "Subtim TKDN": <TruckIcon className="w-6 h-6" />,
    "Subtim Kepegawaian": <UsersIcon className="w-6 h-6" />,
    "Subtim Sekertaris": <DocumentTextIcon className="w-6 h-6" />,
    "Subtim Humasdatin": <GlobeAltIcon className="w-6 h-6" />,
    "Subtim Legal & Bussines Development": <ShieldCheckIcon className="w-6 h-6" />,
    "Lab Pengujian": <ServerIcon className="w-6 h-6" />,
    "Lab Lingkungan": <AcademicCapIcon className="w-6 h-6" />,
    "Lab Testbed FOPTI": <ChartBarIcon className="w-6 h-6" />,
    "Lab Masker": <UserGroupIcon className="w-6 h-6" />,
    "Lab ISSC": <CogIcon className="w-6 h-6" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-indigo-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-blue-800 bg-clip-text text-transparent">
            Alokasi Penempatan Magang
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-all"
          >
            ← Kembali
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <SparklesIcon className="w-14 h-14 text-indigo-500 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-800">
            Pilih Bidang yang Sesuai Minatmu
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Setiap unit kerja memiliki peran penting dalam mendukung operasional dan misi <strong>BBSPJIT</strong>. 
            Pahami dulu tugas dan lingkungan kerja di masing-masing subtim sebelum memilih saat pendaftaran.
          </p>
        </motion.div>

        {/* Units List */}
        <div className="space-y-6">
          {(Object.keys(unitIcons) as UnitName[]).map((unitName, index) => (
            <UnitCard
              key={index}
              name={unitName}
              icon={unitIcons[unitName]}
              description={getUnitDescription(unitName)}
              type={getUnitType(unitName)}
            />
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 p-6 bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl shadow-md"
        >
          <p className="text-sm text-gray-600 leading-relaxed">
            📌 <strong>Penting:</strong> Pilihan unit kerja akan memengaruhi tugas harian Anda selama magang. 
            Pilih sesuai minat dan kompetensi Anda.
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 bg-white/50 backdrop-blur-sm border-t border-gray-100">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-indigo-800">BBSPJIT</span>. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}

// Deskripsi unit
function getUnitDescription(unitName: UnitName): string {
  const descriptions: Record<UnitName, string> = {
    "Subtim Umum":
      "Mengelola administrasi umum, surat-menyurat, keprotokolan, dan fasilitas kantor. Cocok untuk yang tertarik di bidang administrasi dan tata usaha.",
    "Subtim Bimtek":
      "Menyelenggarakan kegiatan Bimbingan Teknis (Bimtek) untuk peserta pelatihan. Tugasnya termasuk perencanaan, pendataan, dan pendampingan peserta.",
    "Subtim PBJL":
      "Bidang Pengadaan Barang/Jasa dan Logistik. Mengelola proses pengadaan, lelang, dan distribusi logistik pendukung operasional.",
    "Subtim Pemasaran":
      "Memasarkan program dan layanan BBSPJIT, membuat konten promosi, serta menjalin kerja sama dengan pihak eksternal.",
    "Subtim Bimtek dan Konsultasi":
      "Gabungan antara pelatihan dan konsultasi teknis. Memberikan pendampingan teknis kepada industri terkait standar dan sertifikasi.",
    "Subtim LPH":
      "Laboratorium Pengujian dan Sertifikasi Halal. Mendukung proses sertifikasi halal melalui dokumentasi, verifikasi, dan koordinasi dengan BPJPH.",
    "Subtim Keuangan":
      "Mengelola anggaran, pembayaran, pertanggungjawaban keuangan, dan pelaporan keuangan lembaga.",
    "Subtim Pengujian":
      "Membantu proses administrasi pengujian produk, pengelolaan data, dan dokumentasi hasil uji.",
    "Subtim TKDN":
      "Tim Konsultasi dan Pendampingan TKDN (Tingkat Komponen Dalam Negeri). Memberikan pendampingan industri dalam memenuhi regulasi TKDN.",
    "Subtim Kepegawaian":
      "Mengelola data pegawai, rekrutmen, absensi, dan pengembangan SDM internal.",
    "Subtim Sekertaris":
      "Mendukung fungsi sekretariat, notulensi rapat, arsip dokumen, dan penjadwalan kegiatan pimpinan.",
    "Subtim Humasdatin":
      "Hubungan Masyarakat dan Pengelolaan Data & Informasi. Mengelola media sosial, website, dan publikasi lembaga.",
    "Subtim Legal & Bussines Development":
      "Menangani aspek hukum, kontrak kerja sama, dan pengembangan bisnis/kerja sama strategis lembaga.",
    "Lab Pengujian":
      "Laboratorium utama yang melakukan pengujian teknis produk sesuai standar nasional dan internasional.",
    "Lab Lingkungan":
      "Melakukan pengujian sampel lingkungan seperti air, udara, dan limbah untuk keperluan sertifikasi dan pemantauan.",
    "Lab Testbed FOPTI":
      "Laboratorium untuk pengujian teknologi fotonik dan telekomunikasi (FOPTI). Fokus pada inovasi dan standarisasi teknologi komunikasi.",
    "Lab Masker":
      "Khusus menguji kualitas masker medis dan non-medis, termasuk filtrasi, breathability, dan ketahanan.",
    "Lab ISSC":
      "Integrated Smart System Center – laboratorium untuk sistem cerdas seperti IoT, smart building, dan otomasi industri.",
  };
  return descriptions[unitName];
}

// Tipe unit
function getUnitType(unitName: UnitName): UnitType {
  if (unitName.startsWith("Lab")) return "Laboratorium";
  if (["Subtim Umum", "Subtim Keuangan", "Subtim Kepegawaian", "Subtim Sekertaris", "Subtim PBJL"].includes(unitName)) {
    return "Administrasi";
  }
  if (["Subtim Pemasaran", "Subtim Humasdatin", "Subtim Legal & Bussines Development"].includes(unitName)) {
    return "Pendukung Strategis";
  }
  return "Teknis";
}

// Komponen UnitCard
function UnitCard({
  name,
  icon,
  description,
  type,
}: {
  name: UnitName;
  icon: React.ReactNode;
  description: string;
  type: UnitType;
}) {
  const typeColors: Record<UnitType, string> = {
    Administrasi: "bg-blue-100 text-blue-800",
    Teknis: "bg-amber-100 text-amber-800",
    Laboratorium: "bg-green-100 text-green-800",
    "Pendukung Strategis": "bg-purple-100 text-purple-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-700">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-800">{name}</h3>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[type]}`}>
              {type}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}