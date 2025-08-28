// pages/api/full-dates.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data, error } = await supabase
      .from("pendaftaran_magang")
      .select("tanggal");

    if (error) throw error;

    const countPerDate: Record<string, number> = {};
    data.forEach((item) => {
      const tgl = item.tanggal;
      countPerDate[tgl] = (countPerDate[tgl] || 0) + 1;
    });

    const fullDates = Object.keys(countPerDate).filter(
      (tgl) => countPerDate[tgl] >= 5
    );

    res.status(200).json(fullDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data" });
  }
}
