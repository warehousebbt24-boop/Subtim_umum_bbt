import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    email,
    password,
    nama,
    study,
    jurusan,
    nama_sekolah_universitas,
  } = req.body;

  if (!email || !password || !nama || !study || !jurusan) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    // 1. Buat user baru di Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return res.status(400).json({ message: "Gagal daftar user: " + signUpError.message });
    }

    if (!signUpData.user) {
      return res.status(500).json({ message: "User tidak dibuat" });
    }

    const supabase_id = signUpData.user.id;

    // 2. Simpan data tambahan di tabel pendaftaran_magang
    const { error: insertError } = await supabase.from("pendaftaran_magang").insert([
      {
        supabase_id,
        email,
        nama,
        study,
        jurusan,
        nama_sekolah_universitas,
      },
    ]);

    if (insertError) {
      // Jika gagal simpan data tambahan, hapus user Supabase yang tadi dibuat
      await supabase.auth.admin.deleteUser(supabase_id); // *butuh supabase admin client*
      return res.status(500).json({ message: "Gagal menyimpan data tambahan: " + insertError.message });
    }

    return res.status(200).json({ message: "Registrasi berhasil" });
  } catch (error: any) {
    return res.status(500).json({ message: "Error server: " + error.message });
  }
}
