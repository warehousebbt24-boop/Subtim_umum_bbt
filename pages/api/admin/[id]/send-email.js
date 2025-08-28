// pages/api/send-email.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Buat transporter nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Kirim email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
    });

    return res.status(200).json({ message: "Email berhasil dikirim!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal mengirim email" });
  }
}
