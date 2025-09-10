// pages/admin.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClientAnon';

// Tipe data umum
interface FormData {
  id: number;
  [key: string]: string | number;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('peminjaman_kendaraan');
  const [filteredData, setFilteredData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: 'peminjaman_kendaraan', label: 'Peminjaman Kendaraan' },
    { key: 'peminjaman_ruangan', label: 'Peminjaman Ruangan' },
    { key: 'permintaan_pemeliharaan', label: 'Pemeliharaan Sarana' },
    { key: 'peminjaman_inventaris', label: 'Peminjaman Inventaris' },
    { key: 'pendaftaran_magang', label: 'Pendaftaran Magang' },
  ];

  // Cek login saat halaman dibuka
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login'); // redirect kalau belum login
      } else {
        setSession(session);
      }
      setLoadingSession(false);
    };

    checkSession();

    // Optional: subscribe untuk perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/admin/login');
      } else {
        setSession(session);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // Fetch data dari Supabase
  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(activeTab)
          .select('*');

        if (error) throw error;
        setFilteredData(data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, session]);

  // Filter data
  useEffect(() => {
    if (!searchTerm) return;
    const filtered = filteredData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'disetujui':
        return 'bg-green-100 text-green-800';
      case 'menunggu':
        return 'bg-yellow-100 text-yellow-800';
      case 'ditolak':
        return 'bg-red-100 text-red-800';
      case 'dalam perbaikan':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingSession) {
    return <p className="p-6 text-center">Memeriksa sesi login...</p>;
  }

  if (!session) {
    return null; // sementara kosong karena sudah redirect
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      {/* Header */}
      <header className="bg-blue-800 shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-bold">Admin Dashboard - SOLUSI</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/admin/login');
          }}
          className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded text-sm font-semibold transition"
        >
          Logout
        </button>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari data di semua kolom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
          />
        </div>

        {/* Tabs - Horizontal Scroll di Mobile */}
        <div className="flex overflow-x-auto space-x-2 pb-2 mb-4 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-transparent">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition capitalize ${
                activeTab === tab.key
                  ? 'bg-white text-blue-900'
                  : 'bg-blue-700 hover:bg-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-white text-gray-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-blue-900 capitalize">
              {tabs.find((t) => t.key === activeTab)?.label}
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">Memuat data...</p>
          ) : filteredData.length === 0 ? (
            <p className="p-6 text-center text-gray-500">Tidak ada data ditemukan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(filteredData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-3 py-2 text-left text-gray-700 font-medium capitalize whitespace-nowrap"
                      >
                        {key.replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-left text-gray-700 font-medium whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      {Object.entries(item).map(([key, value]) => (
                        <td key={key} className="px-3 py-2">
                          {key === 'status' ? (
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                value as string
                              )}`}
                            >
                              {value}
                            </span>
                          ) : (
                            <span className="block max-w-xs truncate" title={String(value)}>
                              {value}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <Link href={`/${activeTab}/detail/${item.id}`}>
                          <button className="text-cyan-600 hover:underline text-xs md:text-sm font-medium">
                            Lihat Detail
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/admin/Peminjaman_kendaraan/">
            <div className="bg-blue-500 hover:bg-blue-400 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
              <h3 className="font-bold text-white">Peminjaman Kendaraan</h3>
              <p className="text-blue-100 text-sm mt-1">Buka data peminjaman kendaraan</p>
            </div>
          </Link>

          <Link href="/admin/peminjaman_ruangan">
            <div className="bg-blue-500 hover:bg-blue-400 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
              <h3 className="font-bold text-white">Peminjaman Ruangan</h3>
              <p className="text-blue-100 text-sm mt-1">Buka data peminjaman ruangan</p>
            </div>
          </Link>

          <Link href="/admin/Permintaan_pemeliharaan/">
            <div className="bg-blue-500 hover:bg-blue-400 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
              <h3 className="font-bold text-white">Pemeliharaan Sarana</h3>
              <p className="text-blue-100 text-sm mt-1">Buka data pemeliharaan sarana</p>
            </div>
          </Link>

          <Link href="/admin/Peminjaman_inventaris/">
            <div className="bg-blue-500 hover:bg-blue-400 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
              <h3 className="font-bold text-white">Peminjaman Inventaris</h3>
              <p className="text-blue-100 text-sm mt-1">Buka data peminjaman inventaris</p>
            </div>
          </Link>

          <Link href="/admin/dashboard">
            <div className="bg-blue-500 hover:bg-blue-400 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
              <h3 className="font-bold text-white">Pendaftaran Magang</h3>
              <p className="text-blue-100 text-sm mt-1">Buka dashboardpenerimaan pkl/magang</p>
            </div>
          </Link>
           <Link href="/cleanup_data">
            <div className="bg-blue-500 hover:bg-blue-400 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
              <h3 className="font-bold text-white">Bersihkan Data rentang 2 tahun</h3>
              <p className="text-blue-100 text-sm mt-1">Buka dashboard formulir</p>
            </div>
          </Link>
        </div>
        
      </main>

      <footer className="mt-8 text-center text-xs text-white opacity-70 pb-6">
        &copy; {new Date().getFullYear()} BBSPJI Tekstil - Sistem SOLUSI
      </footer>
    </div>
  );
};

export default AdminDashboard;