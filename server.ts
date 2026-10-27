import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini API route for drafting or refining official school letters
app.post('/api/ai-draft', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY tidak ditemukan. Mohon konfigurasi API Key atau gunakan template standar otomatis.',
      });
    }

    const { type, purpose, rawNotes, recipient, schoolName } = req.body;

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

Harap kembalikan response HANYA berupa JSON valid (tanpa markdown blok atau teks pengantar apapun selain json yang dapat di-JSON.parse) dengan format:
{
  "subject": "Perihal surat yang singkat, padat, dan baku",
  "opening": "Paragraf pembuka (misal: 'Dengan hormat, sehubungan dengan...')",
  "content": "Isi utama surat dalam beberapa kalimat/paragraf yang rapi dan lugas",
  "closing": "Paragraf penutup (misal: 'Demikian surat ini kami sampaikan, atas perhatian dan kerja sama...')",
  "notes": ["poin penting jika ada, misal jadwal atau hal yang perlu dibawa"],
  "signRole": "Kepala Sekolah",
  "attachment": "- atau jumlah berkas"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });

    const responseText = response.text || '';
    // Clean potential markdown blocks
    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleaned);

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error in /api/ai-draft:', error);
    return res.status(500).json({
      error: 'Gagal membuat draf surat dengan AI: ' + (error?.message || 'Unknown error'),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server SuratKita berjalan pada port ${PORT}`);
  });
}

startServer();
