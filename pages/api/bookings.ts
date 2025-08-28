// pages/api/bookings.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ error: 'year and month are required' })
  }

  const yearNum = Number(year)
  const monthNum = Number(month)

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({ error: 'Invalid year or month' })
  }

  // Format tanggal mulai dan akhir bulan dalam ISO string
  // contoh: '2025-08-01' dan '2025-08-31'
  const startDate = new Date(yearNum, monthNum - 1, 1).toISOString().slice(0, 10)
  const endDate = new Date(yearNum, monthNum, 0).toISOString().slice(0, 10)

  try {
    // Ambil semua data booking dengan filter tanggal di bulan tersebut
    const { data, error } = await supabase
      .from('pendaftaran_magang')
      .select('tanggal')
      .gte('tanggal', startDate)
      .lte('tanggal', endDate)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Hitung jumlah booking per tanggal
    const counts: Record<string, number> = {}
    data?.forEach((row) => {
      const tgl = row.tanggal
      counts[tgl] = (counts[tgl] ?? 0) + 1
    })

    return res.status(200).json(counts)
  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
}
