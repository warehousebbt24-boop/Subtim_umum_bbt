import { IncomingForm, Fields, Files, File } from "formidable";
import fs from "fs";
import { supabase } from "../../lib/supabaseClient";

export const config = { api: { bodyParser: false } };

function parseForm(req: any): Promise<{ fields: Fields; files: Files }> {
  const form = new IncomingForm({ multiples: false, keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    const supabase_id = fields.supabase_id?.toString() || "";
    if (!supabase_id) {
      return res.status(400).json({ error: "supabase_id wajib diisi" });
    }

    const nama = fields.nama?.toString() || "";
    const email = fields.email?.toString() || "";
    const namaSekolah = fields.nama_sekolah_universitas?.toString() || "";
    const jurusan = fields.jurusan?.toString() || "";
    const noHp = fields.no_hp?.toString() || "";
    const unitKerja = fields.unit_kerja?.toString() || "";
    const tanggalStart = fields.tanggal_start?.toString() || "";
    const tanggalEnd = fields.tanggal_end?.toString() || "";
    const periode = fields.periode?.toString() || "";
    

    let file: File | undefined;
    if (Array.isArray(files.file)) {
      file = files.file[0];
    } else {
      file = files.file;
    }

    if (!file) {
      return res.status(400).json({ error: "File wajib diupload" });
    }

    const fileBuffer = await fs.promises.readFile(file.filepath);
    const fileExt = file.originalFilename?.split(".").pop() || "pdf";
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    const { error: storageError } = await supabase.storage
      .from("dokumen-magang")
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype || "application/pdf",
      });

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage
      .from("dokumen-magang")
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Gagal mendapatkan public URL file");
    }

    // UPDATE record berdasarkan supabase_id
    const { error: dbError } = await supabase
      .from("pendaftaran_magang")
      .update({
        nama,
        email,
        nama_sekolah_universitas: namaSekolah,
        jurusan,
        no_hp: noHp,
        unit_kerja: unitKerja,
        tanggal_start: tanggalStart,
        tanggal_end: tanggalEnd,
        periode: periode,
        dokumen_url: publicUrlData.publicUrl,
        status: "pending"
      })
      .eq("supabase_id", supabase_id);

    if (dbError) throw dbError;

    return res.status(200).json({ message: "Pendaftaran berhasil diperbarui!" });
  } catch (error: any) {
    console.error("Error di api/pendaftaran:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
