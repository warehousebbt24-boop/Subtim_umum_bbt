import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type Data = { message: string; success?: boolean; token?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email dan password harus diisi" });

  const { data: user, error } = await supabaseAdmin
    .from("pendaftaran_magang")
    .select("email, password")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: "Email tidak ditemukan" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Password salah" });
  }

  // Buat JWT token
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );

  return res.status(200).json({ message: "Login berhasil", success: true, token });
}
