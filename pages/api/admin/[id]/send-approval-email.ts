import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // Konfigurasi transporter SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // untuk Gmail
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // email pengirim
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    // Kirim email
    await transporter.sendMail({
      from: `"Admin Magang" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}
