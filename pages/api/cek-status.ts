// pages/api/cek-status.ts
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fungsi untuk konversi tanggal ke nama hari (dalam Bahasa Indonesia)
function getHariIndo(date: Date): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
}

// Fungsi format tanggal ke Bahasa Indonesia (contoh: 7 Januari 2025)
function formatTanggalIndo(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const email = req.headers['x-user-email'];

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email tidak ditemukan.' });
    }

    const { data, error } = await supabase
      .from('pendaftaran_magang')
      .select('nama, status, tanggal_start, tanggal_end')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Gagal mengakses database.' });
    }

    if (!data) {
      return res.status(200).json({
        message: 'Anda belum melakukan pendaftaran magang.',
      });
    }

    const { status, nama, tanggal_start } = data;

    let statusMessage = '';

    if (status === 'accepted') {
      if (!tanggal_start) {
        statusMessage = `Halo ${nama}, Anda diterima, tetapi tanggal mulai belum ditentukan. Silakan hubungi admin.`;
      } else {
        const date = new Date(tanggal_start);
        const hari = getHariIndo(date);
        const tanggalFormatted = formatTanggalIndo(tanggal_start);
        statusMessage = `Halo ${nama}, selamat! Anda diterima sebagai peserta magang. Silakan datang pada tanggal ${tanggalFormatted}, hari ${hari}, untuk memulai magang.`;
      }
    } else if (status === 'ditolak') {
      statusMessage = `Maaf ${nama}, pendaftaran magang Anda ditolak.`;
    } else if (status === 'pending' || status === 'diproses') {
      statusMessage = `Halo ${nama}, pendaftaran Anda sedang diproses. Silakan tunggu konfirmasi lebih lanjut.`;
    } else {
      statusMessage = `Halo ${nama}, status pendaftaran Anda: ${status || 'tidak diketahui'}.`;
    }

    res.status(200).json({ message: statusMessage });
  } catch (err: any) {
    console.error('Internal error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}