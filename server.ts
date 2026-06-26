import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY is not defined. AI features might fail.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const ai = getGeminiClient();

// Local Database Setup (db-modul.json)
const DB_FILE = path.join(process.cwd(), "db-modul.json");

const readDatabase = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  return [];
};

const writeDatabase = (data: any[]) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
};

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
  writeDatabase([]);
}

// REST API Endpoints
// Auth endpoint
app.post("/api/login", (req, res) => {
  const { name, password } = req.body;
  if (password === "123456") {
    res.json({ success: true, teacherName: name || "Guru" });
  } else {
    res.status(401).json({ success: false, message: "Password salah!" });
  }
});

// Modul / Data storage CRUD endpoints
app.get("/api/modul", (req, res) => {
  const db = readDatabase();
  res.json(db);
});

app.post("/api/modul", (req, res) => {
  const newItem = req.body;
  if (!newItem.id) {
    newItem.id = "item_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }
  newItem.timestamp = new Date().toISOString();
  
  const db = readDatabase();
  const existingIndex = db.findIndex((item) => item.id === newItem.id);
  if (existingIndex !== -1) {
    db[existingIndex] = newItem;
  } else {
    db.push(newItem);
  }
  writeDatabase(db);
  res.json({ success: true, item: newItem });
});

app.delete("/api/modul/:id", (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const updatedDb = db.filter((item) => item.id !== id);
  writeDatabase(updatedDb);
  res.json({ success: true, message: "Item berhasil dihapus" });
});

// AI Generation: Modul Ajar
app.post("/api/generate-modul", async (req, res) => {
  const inputs = req.body;
  const {
    namaGuru, NIP, unitKerja, kelas, mapel, semester, tahunPelajaran,
    pertemuan, durasi, materiPokok, tanggalPelaksanaan, pedagogi, dimensi
  } = inputs;

  const prompt = `
    Bertindaklah sebagai pengembang kurikulum profesional di Indonesia untuk tingkat Sekolah Dasar (SD).
    Berdasarkan informasi dasar berikut, buatlah perencanaan pembelajaran terstruktur untuk Modul Ajar:
    - Nama Guru: ${namaGuru} (${NIP})
    - Unit Kerja: ${unitKerja}
    - Kelas: ${kelas}
    - Mata Pelajaran: ${mapel}
    - Semester: ${semester}
    - Tahun Pelajaran: ${tahunPelajaran}
    - Pertemuan: ${pertemuan}
    - Durasi: ${durasi}
    - Materi Pokok: ${materiPokok}
    - Tanggal Pelaksanaan: ${tanggalPelaksanaan}
    - Praktik Pedagogis: ${pedagogi}
    - Dimensi Profil Lulusan: ${dimensi}

    Tugas Anda adalah menghasilkan perencanaan pembelajaran terstruktur dalam Bahasa Indonesia yang baik dan benar dengan 7 bagian utama:
    - Tabel 1: Informasi Dasar / Identitas (Berisi informasi dasar di atas)
    - Tabel 2: Identifikasi (Berisi Kesiapan Belajar Siswa, Materi, dan Capaian Dimensi Profil Lulusan)
    - Tabel 3: Desain Pembelajaran (Berisi Capaian Pembelajaran, Lintas Disiplin Ilmu, Tujuan Pembelajaran, Topik Pembelajaran, Praktik Pedagogis, Kemitraan Pembelajaran, Lingkungan Pembelajaran, dan Pemanfaatan Digital)
    - Tabel 4: Pengalaman Belajar (Berisi alur pertemuan detail dengan Kegiatan Awal, Kegiatan Inti, Kegiatan Penutup yang mengandung nilai Berkesadaran, Bermakna, dan Menggembirakan)
    - Tabel 5: Asesmen Pembelajaran (Berisi penjelasan Asesmen Awal, Proses, Akhir, serta Rubrik Penilaian dengan Kriteria, Perlu Bimbingan, Cukup, Baik, Sangat Baik)
    - Bagian 6: Prinsip Pembelajaran (Uraian Berkesadaran (Mindful), Bermakna (Meaningful), Menggembirakan (Joyful))
    - Bagian 7: Kerangka Pembelajaran (Uraian Praktik Pedagogik, Lingkungan Pembelajaran, Pemanfaatan Digital (berikan sumber link video pembelajaran youtube yang nyata/relevan berdasarkan materi dari canal youtube), Kemitraan Pembelajaran)

    Mohon kembalikan output dalam format JSON terstruktur persis seperti schema ini:
    {
      "lintasDisiplin": "Penjelasan rinci lintas disiplin ilmu...",
      "topikPembelajaran": "Penjelasan rinci topik pembelajaran...",
      "kemitraanPembelajaran": "Penjelasan rinci kemitraan pembelajaran...",
      "lingkunganPembelajaran": "Penjelasan rinci lingkungan pembelajaran...",
      "pemanfaatanDigital": "Penjelasan rinci pemanfaatan digital serta tools online...",
      "videoYoutubeRelevan": "https://www.youtube.com/watch?v=dQw4w9WgXcQ (Tulis URL youtube fiktif namun terkesan sangat relevan dengan topik ${materiPokok})",
      "pengalamanBelajar": [
        {
          "pertemuan": "Pertemuan 1",
          "kegiatanAwal": "Langkah-langkah Kegiatan Awal (Memahami, 15-20 menit) yang detail...",
          "kegiatanInti": "Langkah-langkah Kegiatan Inti (Mengaplikasikan, sesuai sintaks ${pedagogi} secara detail)...",
          "kegiatanPenutup": "Langkah-langkah Kegiatan Penutup (Refleksi, 10-15 menit) yang detail..."
        }
      ],
      "asesmenAwal": "Asesmen diagnostik awal...",
      "asesmenProses": "Asesmen formatif proses...",
      "asesmenAkhir": "Asesmen sumatif akhir...",
      "asesmenRubrik": [
        {
          "kriteria": "Pemahaman Konsep Materi",
          "perluBimbingan": "Siswa belum mampu memahami...",
          "cukup": "Siswa mampu memahami sebagian...",
          "baik": "Siswa memahami konsep dengan baik...",
          "sangatBaik": "Siswa sangat menguasai konsep secara mendalam..."
        }
      ],
      "prinsipPembelajaran": {
        "mindful": "Uraian bagaimana prinsip Berkesadaran (Mindful) diterapkan oleh guru dan siswa...",
        "meaningful": "Uraian bagaimana materi terhubung secara Bermakna (Meaningful) dengan kehidupan nyata...",
        "joyful": "Uraian bagaimana suasana belajar dibuat Menggembirakan (Joyful) dan menyenangkan..."
      },
      "kerangkaPembelajaran": {
        "praktikPedagogik": "Metode dan pendekatan mengajar yang tepat sasaran...",
        "lingkunganPembelajaran": "Menciptakan suasana dan fasilitas kelas/sekolah yang mendukung...",
        "pemanfaatanDigital": "Penggunaan teknologi untuk memperluas akses dan memperkaya materi...",
        "kemitraanPembelajaran": "Kolaborasi antara sekolah, orang tua, dan masyarakat..."
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lintasDisiplin: { type: Type.STRING },
            topikPembelajaran: { type: Type.STRING },
            kemitraanPembelajaran: { type: Type.STRING },
            lingkunganPembelajaran: { type: Type.STRING },
            pemanfaatanDigital: { type: Type.STRING },
            videoYoutubeRelevan: { type: Type.STRING },
            pengalamanBelajar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pertemuan: { type: Type.STRING },
                  kegiatanAwal: { type: Type.STRING },
                  kegiatanInti: { type: Type.STRING },
                  kegiatanPenutup: { type: Type.STRING }
                },
                required: ["pertemuan", "kegiatanAwal", "kegiatanInti", "kegiatanPenutup"]
              }
            },
            asesmenAwal: { type: Type.STRING },
            asesmenProses: { type: Type.STRING },
            asesmenAkhir: { type: Type.STRING },
            asesmenRubrik: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kriteria: { type: Type.STRING },
                  perluBimbingan: { type: Type.STRING },
                  cukup: { type: Type.STRING },
                  baik: { type: Type.STRING },
                  sangatBaik: { type: Type.STRING }
                },
                required: ["kriteria", "perluBimbingan", "cukup", "baik", "sangatBaik"]
              }
            },
            prinsipPembelajaran: {
              type: Type.OBJECT,
              properties: {
                mindful: { type: Type.STRING },
                meaningful: { type: Type.STRING },
                joyful: { type: Type.STRING }
              },
              required: ["mindful", "meaningful", "joyful"]
            },
            kerangkaPembelajaran: {
              type: Type.OBJECT,
              properties: {
                praktikPedagogik: { type: Type.STRING },
                lingkunganPembelajaran: { type: Type.STRING },
                pemanfaatanDigital: { type: Type.STRING },
                kemitraanPembelajaran: { type: Type.STRING }
              },
              required: ["praktikPedagogik", "lingkunganPembelajaran", "pemanfaatanDigital", "kemitraanPembelajaran"]
            }
          },
          required: [
            "lintasDisiplin", "topikPembelajaran", "kemitraanPembelajaran",
            "lingkunganPembelajaran", "pemanfaatanDigital", "videoYoutubeRelevan",
            "pengalamanBelajar", "asesmenAwal", "asesmenProses", "asesmenAkhir",
            "asesmenRubrik", "prinsipPembelajaran", "kerangkaPembelajaran"
          ]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating modul:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Generation: Soal Latihan
app.post("/api/generate-soal", async (req, res) => {
  try {
    const options = req.body || {};
    const {
      jenisUjian, fase, kelas, mapel, semester, materi, kesulitan, hasIllustration
    } = options;

    const tipeSoal = options.tipeSoal || options.bloomLevels || ["C1", "C2", "C3"];
    const formatSoal = options.formatSoal || options.counts || {};
    const cp = options.cp || "";
    const tp = options.tp || "";

    // tipeSoal is array of Bloom taxonomy level (e.g. ["C1", "C2", "C4"])
    // formatSoal is object of counts for formats (e.g. { pg: 5, pgk_bs: 3, pgk_cat: 3, menjodohkan: 3, isian: 5, uraian: 3 })
    const formatInstructions = `
      Hasilkan soal-soal sesuai jumlah yang diminta untuk tiap format berikut:
      - Pilihan Ganda (PG) biasa: ${formatSoal.pg || 0} soal, 4 opsi (A, B, C, D) ke bawah, sebutkan kunci jawabannya.
      - Pilihan Ganda Kompleks Benar/Salah (PGK B/S): ${formatSoal.pgk_bs || 0} soal. Terdiri dari 3 pernyataan dalam bentuk tabel (atau terstruktur baris) dengan pilihan jawaban Benar atau Salah, berikan penjelasannya.
      - Pilihan Ganda Kompleks Kategori (PGK Jawaban >1): ${formatSoal.pgk_cat || 0} soal, terdiri dari 4 pernyataan dengan jawaban benar lebih dari satu, berikan kotak kecil [] di samping opsi untuk tempat checklist.
      - Menjodohkan: ${formatSoal.menjodohkan || 0} kelompok soal. Terdiri dari 4 pernyataan di kolom kiri (sejenis) dengan 5 pilihan jawaban di kolom kanan, sehingga siswa dapat menarik garis.
      - Isian Singkat: ${formatSoal.isian || 0} soal, pertanyaan langsung yang membutuhkan jawaban singkat dan padat.
      - Uraian: ${formatSoal.uraian || 0} soal, pertanyaan terbuka yang membutuhkan jawaban rinci beserta pedoman penskoran.
    `;

    const prompt = `
      Bertindaklah sebagai ahli pembuat soal evaluasi pendidikan Sekolah Dasar.
      Buatlah instrumen soal berkualitas tinggi dengan ketentuan berikut:
      - Jenis Ujian: ${jenisUjian}
      - Tingkat Kesulitan: ${kesulitan}
      - Fase / Kelas: Fase ${fase} / Kelas ${kelas}
      - Mata Pelajaran: ${mapel}
      - Semester: ${semester}
      - Capaian Pembelajaran (CP): ${cp || "Sesuai Kurikulum Merdeka"}
      - Tujuan Pembelajaran (TP): ${tp || "Sesuai kurikulum"}
      - Materi Pokok / Fokus: ${materi}
      - Tipe Soal (Taksonomi Bloom): ${tipeSoal.join(", ")}
      - Apakah menyertakan gambar ilustrasi deskriptif (stimulus soal)? ${hasIllustration ? "Ya, tambahkan penjelasan gambar ilustrasi [Gambar Ilustrasi: Deskripsi gambar di sini] sebagai stimulus di awal soal." : "Tidak perlu gambar."}

      Sesuai instruksi format berikut:
      ${formatInstructions}

      Kembalikan output berupa objek JSON yang memiliki properti:
      - petunjuk: string (Petunjuk pengerjaan soal yang memotivasi dan jelas untuk siswa SD)
      - soal: array dari soal-soal tersebut agar bisa ditampilkan secara interaktif dan juga dapat diunduh.

      Setiap objek soal dalam array "soal" harus memiliki properti berikut:
      - id: string unik
      - nomor: number
      - tipeBloom: string (misal: "C1", "C4")
      - format: string ("pg" | "pgk_bs" | "pgk_cat" | "menjodohkan" | "isian" | "uraian")
      - stimulus: string (jika ada gambar ilustrasi, tuliskan deskripsinya di sini, atau teks stimulus pengantar soal)
      - pertanyaan: string (isi pertanyaan)
      - opsi: array of strings (jika pilihan ganda / pgk_cat, misal ["A. Pilihan 1", "B. Pilihan 2", ...])
      - pgkBsPernyataan: array of objects { pernyataan: string, jawabanBenar: boolean } (khusus untuk PGK B/S)
      - menjodohkanData: object { kiri: string[], kanan: string[], kunci: string[] } (khusus untuk Menjodohkan)
      - kunciJawaban: string (kunci jawaban atau jawaban singkat atau pedoman penskoran uraian)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            petunjuk: { type: Type.STRING },
            soal: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  nomor: { type: Type.INTEGER },
                  tipeBloom: { type: Type.STRING },
                  format: { type: Type.STRING },
                  stimulus: { type: Type.STRING },
                  pertanyaan: { type: Type.STRING },
                  opsi: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  pgkBsPernyataan: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        pernyataan: { type: Type.STRING },
                        jawabanBenar: { type: Type.BOOLEAN }
                      },
                      required: ["pernyataan", "jawabanBenar"]
                    }
                  },
                  menjodohkanData: {
                    type: Type.OBJECT,
                    properties: {
                      kiri: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      kanan: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      kunci: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    }
                  },
                  kunciJawaban: { type: Type.STRING }
                },
                required: ["id", "nomor", "tipeBloom", "format", "pertanyaan", "kunciJawaban"]
              }
            }
          },
          required: ["petunjuk", "soal"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating soal:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Generation: LKPD (Lembar Kerja Peserta Didik)
app.post("/api/generate-lkpd", async (req, res) => {
  try {
    const inputs = req.body || {};
    const {
      mapel, fase, kelas, topik, tujuan, kesulitan
    } = inputs;
    const cp = inputs.cp || "";

    const prompt = `
      Bertindaklah sebagai ahli pendidikan kreatif dan guru sekolah dasar profesional tingkat nasional.
      Buatlah materi Lembar Kerja Peserta Didik (LKPD) yang menarik, interaktif, bernilai estetis tinggi, dan sesuai dengan pendekatan pembelajaran mendalam (Deep Learning).
      
      Detail Pembelajaran:
      - Mata Pelajaran: ${mapel || "Umum"}
      - Fase/Kelas: Fase ${fase || "Sesuai"} / Kelas ${kelas || "Umum"}
      - Capaian Pembelajaran (CP): ${cp || "Sesuai Kurikulum Merdeka"}
      - Topik Materi: ${topik || "Umum"}
      - Tujuan Pembelajaran: ${tujuan || "Sesuai kurikulum"}
      - Tingkat Kategori LKPD: ${kesulitan || "Sedang"} (Mudah, Sedang, atau Sulit)

      Harap susun LKPD secara komprehensif dengan struktur wajib:
      1. Judul Kegiatan yang memotivasi dan bernilai petualangan atau kontekstual.
      2. Identitas Siswa (Nama, Kelas, No. Absen, Kelompok).
      3. Petunjuk Penggunaan yang bersahabat, memotivasi, dan jelas bagi siswa.
      4. Ringkasan Materi Singkat: disajikan dengan bahasa yang sangat mudah dipahami, penuh analogi kreatif, dan kontekstual.
      5. Aktivitas / Langkah Kerja yang interaktif, menantang siswa melakukan investigasi nyata, diskusi, atau kreasi (disesuaikan tingkat kesulitan ${kesulitan || "Sedang"}).
      6. Pertanyaan Pemantik / Pemahaman Bermakna untuk merangsang rasa ingin tahu yang mendalam.
      7. Latihan Soal Evaluasi: 3-5 soal interaktif yang menguji daya nalar kritis siswa.
      8. Kolom Refleksi / Cek Pemahaman Diri: aktivitas penilaian diri dengan emoticon atau skala ketertarikan yang menyenangkan.
      
      Sertakan juga ide ilustrasi 3D atau visual yang meriah agar LKPD menjadi lebih berwarna, menyenangkan, dan interaktif.
      Kembalikan output dalam format JSON terstruktur persis seperti schema ini:
      {
        "judulKegiatan": "Nama Judul LKPD Kreatif",
        "petunjuk": "Langkah petunjuk penggunaan...",
        "ringkasanMateri": "Ringkasan materi singkat...",
        "langkahKerja": "Langkah-langkah aktivitas kerja...",
        "pertanyaanPemantik": "Pertanyaan pemantik & pemahaman bermakna...",
        "latihanSoal": [
          {
            "pertanyaan": "Soal 1...",
            "kunci": "Kunci/Pedoman..."
          }
        ],
        "refleksiDiri": "Instruksi kolom refleksi diri...",
        "ideVisual3D": "Ide ilustrasi 3D penuh warna untuk digambar siswa..."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            judulKegiatan: { type: Type.STRING },
            petunjuk: { type: Type.STRING },
            ringkasanMateri: { type: Type.STRING },
            langkahKerja: { type: Type.STRING },
            pertanyaanPemantik: { type: Type.STRING },
            latihanSoal: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pertanyaan: { type: Type.STRING },
                  kunci: { type: Type.STRING }
                },
                required: ["pertanyaan", "kunci"]
              }
            },
            refleksiDiri: { type: Type.STRING },
            ideVisual3D: { type: Type.STRING }
          },
          required: [
            "judulKegiatan", "petunjuk", "ringkasanMateri", "langkahKerja",
            "pertanyaanPemantik", "latihanSoal", "refleksiDiri", "ideVisual3D"
          ]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating LKPD:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve frontend with Vite middleware in development
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
