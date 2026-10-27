import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY tidak dikonfigurasi di Environment Variables Vercel.',
      });
    }

    const { type, purpose, rawNotes, recipient, schoolName } = req.body || {};

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `
Anda adalah pakar administrasi tata naskah dinas pendidikan di Indonesia.
Tolong buatkan teks surat dinas sekolah yang baku, santun, lugas, dan sesuai Pedoman Tata Naskah Dinas Kemendikbudristek RI (EYD V).

Detail Input:
- Jenis Surat: ${type || 'Surat Dinas Sekolah'}
- Nama Satuan Pendidikan: ${schoolName || 'Sekolah'}
- Ditujukan Kepada: ${recipient || 'Yth. Bapak/Ibu Orang Tua / Wali Murid'}
- Maksud / Keperluan: ${purpose || '-'}
- Catatan / Poin-poin tambahan dari pengguna: ${rawNotes || '-'}

Harap kembalikan response HANYA berupa JSON valid (tanpa markdown blok):
{
  "subject": "Perihal surat yang singkat, padat, dan baku",
  "opening": "Paragraf pembuka",
  "content": "Isi utama surat dalam beberapa kalimat/paragraf yang rapi dan lugas",
  "closing": "Paragraf penutup",
  "notes": ["poin penting"],
  "signRole": "Kepala Sekolah",
  "attachment": "- atau jumlah berkas"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });

    const responseText = response.text || '';
    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleaned);

    return res.status(200).json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error in Vercel API /api/ai-draft:', error);
    return res.status(500).json({
      error: 'Gagal memproses draf surat: ' + (error?.message || 'Unknown error'),
    });
  }
}
