import React, { useState, useEffect } from "react";
import { CLASSES, ALL_SUBJECTS, SEMESTERS } from "../data";
import { exportToWord } from "../utils";
import { BrainCircuit, Download, Printer, Save, CheckSquare, PlusCircle, AlertCircle, FileText, Check, HelpCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface SoalGeneratorProps {
  onSave: (inputs: any, data: any) => void;
  editData?: { id: string; inputs: any; data: any } | null;
  latestModul?: any | null;
}

export default function SoalGenerator({ onSave, editData, latestModul }: SoalGeneratorProps) {
  // Input parameters
  const [jenisUjian, setJenisUjian] = useState("Ulangan Harian");
  const [fase, setFase] = useState("A");
  const [kelas, setKelas] = useState("1");
  const [mapel, setMapel] = useState("Pendidikan Agama Islam dan Budi Pekerti");
  const [semester, setSemester] = useState("Semester 1");
  const [materi, setMateri] = useState("");
  const [cp, setCp] = useState("");
  const [tp, setTp] = useState("");
  const [petunjuk, setPetunjuk] = useState("1. Berdoalah sebelum mengerjakan soal.\n2. Bacalah soal dengan teliti.\n3. Kerjakan dengan jujur.");
  const [kesulitan, setKesulitan] = useState("campuran");
  
  // Bloom Checklist
  const [bloomLevels, setBloomLevels] = useState<string[]>(["C1", "C2", "C3"]);
  
  // Format checklist and counts
  const [formats, setFormats] = useState({
    pg: true,
    pgk_bs: false,
    pgk_cat: false,
    menjodohkan: false,
    isian: false,
    uraian: false
  });
  
  const [counts, setCounts] = useState({
    pg: 5,
    pgk_bs: 3,
    pgk_cat: 3,
    menjodohkan: 2,
    isian: 5,
    uraian: 3
  });

  const [hasIllustration, setHasIllustration] = useState("tidak");
  const [uploadedFileName, setUploadedFileName] = useState("");
  
  // Output and UI states
  const [generatedQuestions, setGeneratedQuestions] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Interactive testing state (for previewers/students or teacher test-run)
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showAnswersScore, setShowAnswersScore] = useState(false);

  // Sync initial state if editing
  useEffect(() => {
    if (editData) {
      const { inputs, data } = editData;
      setJenisUjian(inputs.jenisUjian);
      setFase(inputs.fase);
      setKelas(inputs.kelas);
      setMapel(inputs.mapel);
      setSemester(inputs.semester);
      setMateri(inputs.materi);
      setCp(inputs.cp || "");
      setTp(inputs.tp || "");
      setPetunjuk(data.petunjuk || inputs.petunjuk || "1. Berdoalah sebelum mengerjakan soal.\n2. Bacalah soal dengan teliti.\n3. Kerjakan dengan jujur.");
      setKesulitan(inputs.kesulitan);
      setBloomLevels(inputs.bloomLevels || ["C1", "C2", "C3"]);
      setFormats(inputs.formats);
      setCounts(inputs.counts);
      setHasIllustration(inputs.hasIllustration);
      setGeneratedQuestions(Array.isArray(data) ? data : data.soal || []);
    }
  }, [editData]);

  // Auto sync with latest Modul Ajar
  useEffect(() => {
    if (latestModul && !editData) {
      setMapel(latestModul.inputs.mapel || "Pendidikan Agama Islam dan Budi Pekerti");
      setSemester(latestModul.inputs.semester || "Semester 1");
      setMateri(latestModul.inputs.materiPokok || "");
      setCp(latestModul.inputs.capaianPembelajaran || "");
      setTp(latestModul.inputs.tujuanPembelajaran || "");
      
      // Parse Fase and Kelas from inputs.kelas (e.g., "Fase A / Kelas 1")
      const kelasStr = latestModul.inputs.kelas || "";
      if (kelasStr.includes("Kelas 1")) {
        setFase("A");
        setKelas("1");
      } else if (kelasStr.includes("Kelas 2")) {
        setFase("A");
        setKelas("2");
      } else if (kelasStr.includes("Kelas 3")) {
        setFase("B");
        setKelas("3");
      } else if (kelasStr.includes("Kelas 4")) {
        setFase("B");
        setKelas("4");
      } else if (kelasStr.includes("Kelas 5")) {
        setFase("C");
        setKelas("5");
      } else if (kelasStr.includes("Kelas 6")) {
        setFase("C");
        setKelas("6");
      }
    }
  }, [latestModul, editData]);

  // Adjust Class options based on Fase
  const getClassesForFase = () => {
    if (fase === "A") return ["1", "2"];
    if (fase === "B") return ["3", "4"];
    return ["5", "6"];
  };

  useEffect(() => {
    const validClasses = getClassesForFase();
    if (!validClasses.includes(kelas)) {
      setKelas(validClasses[0]);
    }
  }, [fase]);

  // Handle file reference uploading simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const toggleBloom = (level: string) => {
    if (bloomLevels.includes(level)) {
      setBloomLevels(bloomLevels.filter((b) => b !== level));
    } else {
      setBloomLevels([...bloomLevels, level]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setShowAnswersScore(false);
    setUserAnswers({});
    
    // Assemble counts for formats which are checked
    const activeCounts = {
      pg: formats.pg ? counts.pg : 0,
      pgk_bs: formats.pgk_bs ? counts.pgk_bs : 0,
      pgk_cat: formats.pgk_cat ? counts.pgk_cat : 0,
      menjodohkan: formats.menjodohkan ? counts.menjodohkan : 0,
      isian: formats.isian ? counts.isian : 0,
      uraian: formats.uraian ? counts.uraian : 0
    };

    const payload = {
      jenisUjian,
      fase,
      kelas,
      mapel,
      semester,
      materi: materi || "Materi dasar bab pertama",
      cp,
      tp,
      petunjuk,
      kesulitan,
      bloomLevels,
      formats: formats,
      counts: activeCounts,
      hasIllustration: hasIllustration === "ya"
    };

    try {
      const response = await fetch("/api/generate-soal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const text = await response.text();
      if (!response.ok) {
        let errMsg = "Terjadi kesalahan sistem saat kompilasi soal oleh AI.";
        try {
          const parsed = JSON.parse(text);
          if (parsed.error) errMsg = parsed.error;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = JSON.parse(text);
      let questionsToSet = [];
      let petunjukToSet = "1. Berdoalah sebelum mengerjakan soal.\n2. Bacalah soal dengan teliti.\n3. Kerjakan dengan jujur.";

      if (data && data.soal) {
        questionsToSet = data.soal;
        if (data.petunjuk) {
          petunjukToSet = data.petunjuk;
          setPetunjuk(data.petunjuk);
        }
      } else {
        questionsToSet = Array.isArray(data) ? data : [];
      }

      setGeneratedQuestions(questionsToSet);
      
      const dataObj = {
        petunjuk: petunjukToSet,
        soal: questionsToSet
      };

      // Auto save
      onSave(payload, dataObj);
    } catch (err: any) {
      setError(err.message || "Gagal membuat soal latihan");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = () => {
    if (generatedQuestions) {
      const activeCounts = {
        pg: formats.pg ? counts.pg : 0,
        pgk_bs: formats.pgk_bs ? counts.pgk_bs : 0,
        pgk_cat: formats.pgk_cat ? counts.pgk_cat : 0,
        menjodohkan: formats.menjodohkan ? counts.menjodohkan : 0,
        isian: formats.isian ? counts.isian : 0,
        uraian: formats.uraian ? counts.uraian : 0
      };
      
      const payload = {
        jenisUjian,
        fase,
        kelas,
        mapel,
        semester,
        materi,
        cp,
        tp,
        petunjuk,
        kesulitan,
        bloomLevels,
        formats,
        counts: activeCounts,
        hasIllustration: hasIllustration === "ya"
      };
      
      const dataObj = {
        petunjuk,
        soal: generatedQuestions
      };

      onSave(payload, dataObj);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleDownloadWord = () => {
    if (!generatedQuestions) return;

    // Build the questions formatted nicely for Word
    const compiledQuestionsHtml = generatedQuestions.map((q) => {
      let formatBody = "";
      
      if (q.format === "pg") {
        formatBody = `
          <ol style="list-style-type: uppercase; margin-left: 20px;">
            ${(q.opsi || []).map((o: string) => `<li>${o.replace(/^[A-D]\.\s*/, "")}</li>`).join("")}
          </ol>
          <p style="color: #4b5563; font-style: italic; margin-top: 4px;">Kunci Jawaban: ${q.kunciJawaban}</p>
        `;
      } else if (q.format === "pgk_bs") {
        formatBody = `
          <table style="width:100%; border-collapse: collapse; margin-top: 6px;">
            <tr style="background-color: #f3f4f6;">
              <th width="70%" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Pernyataan</th>
              <th width="15%" style="border: 1px solid #aaa; padding: 4px; text-align: center;">Benar</th>
              <th width="15%" style="border: 1px solid #aaa; padding: 4px; text-align: center;">Salah</th>
            </tr>
            ${(q.pgkBsPernyataan || []).map((p: any) => `
              <tr>
                <td style="border: 1px solid #aaa; padding: 4px;">${p.pernyataan}</td>
                <td style="border: 1px solid #aaa; padding: 4px; text-align: center;">[  ]</td>
                <td style="border: 1px solid #aaa; padding: 4px; text-align: center;">[  ]</td>
              </tr>
            `).join("")}
          </table>
          <p style="color: #4b5563; font-style: italic; margin-top: 4px;">Kunci/Keterangan: ${q.kunciJawaban}</p>
        `;
      } else if (q.format === "pgk_cat") {
        formatBody = `
          <div style="margin-left: 10px; margin-top: 6px;">
            ${(q.opsi || []).map((o: string) => `<p>[  ] ${o}</p>`).join("")}
          </div>
          <p style="color: #4b5563; font-style: italic; margin-top: 4px;">Pernyataan Benar: ${q.kunciJawaban}</p>
        `;
      } else if (q.format === "menjodohkan") {
        const matchingData = q.menjodohkanData || { kiri: [], kanan: [] };
        formatBody = `
          <div style="margin-top: 6px;">
            <table style="width:100%; border: none;">
              <tr>
                <td width="45%" style="border: none; vertical-align: top;">
                  <b>Pernyataan (Kiri)</b>
                  <ol>
                    ${(matchingData.kiri || []).map((k: string) => `<li>${k}</li>`).join("")}
                  </ol>
                </td>
                <td width="10%" style="border: none; text-align: center; vertical-align: middle;">➡</td>
                <td width="45%" style="border: none; vertical-align: top;">
                  <b>Pilihan Jawaban (Kanan)</b>
                  <ol style="list-style-type: upper-alpha;">
                    ${(matchingData.kanan || []).map((k: string) => `<li>${k}</li>`).join("")}
                  </ol>
                </td>
              </tr>
            </table>
            <p style="color: #4b5563; font-style: italic; margin-top: 4px;">Pasangan Kunci: ${q.kunciJawaban}</p>
          </div>
        `;
      } else if (q.format === "isian") {
        formatBody = `
          <p style="margin-top: 8px;">Jawaban: __________________________________________________</p>
          <p style="color: #4b5563; font-style: italic; margin-top: 4px;">Kunci Jawaban: ${q.kunciJawaban}</p>
        `;
      } else if (q.format === "uraian") {
        formatBody = `
          <div style="height: 80px; border: 1px solid #ccc; margin-top: 6px; padding: 6px; font-size: 9pt; color: #aaa;">Lembar jawaban siswa...</div>
          <p style="color: #4b5563; font-style: italic; margin-top: 4px;">Pedoman Penskoran: ${q.kunciJawaban}</p>
        `;
      }

      return `
        <div style="margin-bottom: 24px; page-break-inside: avoid;">
          <p style="margin: 0; font-weight: bold;">
            Soal ${q.nomor}. [Tipe: ${q.tipeBloom}]
          </p>
          ${q.stimulus ? `<p style="margin: 6px 0; padding: 6px; background-color: #f9fafb; border-left: 3px solid #f97316; font-size: 10pt;">${q.stimulus}</p>` : ""}
          <p style="margin: 6px 0;">${q.pertanyaan}</p>
          ${formatBody}
        </div>
      `;
    }).join("");

    const documentHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 14pt; font-weight: bold;">INSTRUMEN SOAL EVALUASI</h2>
        <h3 style="margin: 0; font-size: 12pt; font-weight: bold;">${jenisUjian.toUpperCase()} - SEMESTER ${semester === "Semester 1" ? "I" : "II"}</h3>
        <p style="margin: 4px 0; font-size: 10pt; font-weight: bold;">Mata Pelajaran: ${mapel} | Kelas: ${kelas} | Kesulitan: ${kesulitan.toUpperCase()}</p>
      </div>
      <hr style="border: 1px solid #333; margin-bottom: 12px;" />
      
      <!-- Identitas Siswa -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10pt; font-family: Arial, sans-serif;">
        <tr>
          <td style="width: 15%; padding: 4px 0; border: none; font-weight: bold;">Nama Siswa</td>
          <td style="width: 35%; padding: 4px 0; border: none;">: ___________________________</td>
          <td style="width: 15%; padding: 4px 0; border: none; font-weight: bold;">No. Absen</td>
          <td style="width: 35%; padding: 4px 0; border: none;">: ___________________________</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; border: none; font-weight: bold;">Kelas</td>
          <td style="padding: 4px 0; border: none;">: ___________________________</td>
          <td style="padding: 4px 0; border: none; font-weight: bold;">Asal Sekolah</td>
          <td style="padding: 4px 0; border: none;">: ___________________________</td>
        </tr>
      </table>
      <hr style="border: 0.5px solid #ccc; margin-bottom: 16px;" />
      
      ${cp ? `<p style="font-size: 10pt; margin: 4px 0;"><b>Capaian Pembelajaran (CP):</b> ${cp}</p>` : ""}
      ${tp ? `<p style="font-size: 10pt; margin: 4px 0 12px 0;"><b>Tujuan Pembelajaran (TP):</b> ${tp}</p>` : ""}
      
      ${petunjuk ? `
      <div style="border: 1px solid #aaa; padding: 10px; margin-bottom: 24px; background-color: #fafafa;">
        <p style="margin: 0 0 6px 0; font-weight: bold; font-size: 10pt;">PETUNJUK PENGERJAAN SOAL:</p>
        <p style="margin: 0; font-size: 10pt; white-space: pre-wrap;">${petunjuk}</p>
      </div>
      ` : ""}
      
      <div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5;">
        ${compiledQuestionsHtml}
      </div>
    `;

    exportToWord(`Instrumen_Soal_${mapel.replace(/\s+/g, "_")}`, documentHtml, {
      paperSize: "A4",
      lineSpasi: "1.5",
      fontName: "Arial",
      isJustified: true
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Interactive Quiz test scoring
  const calculateScore = () => {
    setShowAnswersScore(true);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Selection Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
              <CheckSquare size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Penyusunan Soal Evaluasi AI</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kompilasi Otomatis Berbasis Taksonomi Bloom</p>
            </div>
          </div>
          {latestModul && !editData && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded text-green-800 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>Tersinkron otomatis dengan Modul Ajar Terakhir</span>
            </div>
          )}
        </div>

        {latestModul && !editData && (
          <div className="mb-5 sm:hidden p-2.5 bg-green-50 border border-green-200 rounded text-green-800 text-[10px] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>Tersinkron otomatis dengan Modul Ajar Terakhir</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Jenis Ujian */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Jenis Ujian</label>
            <select
              value={jenisUjian}
              onChange={(e) => setJenisUjian(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              <option value="Ulangan Harian">Ulangan Harian</option>
              <option value="Sumatif Akhir Semester (SAS)">Sumatif Akhir Semester (SAS)</option>
              <option value="Sumatif Akhir Jenjang (SAJ)">Sumatif Akhir Jenjang (SAJ)</option>
            </select>
          </div>

          {/* Pilih Fase */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Pilih Fase</label>
            <select
              value={fase}
              onChange={(e) => setFase(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              <option value="A">Fase A (Kelas 1 & 2)</option>
              <option value="B">Fase B (Kelas 3 & 4)</option>
              <option value="C">Fase C (Kelas 5 & 6)</option>
            </select>
          </div>

          {/* Pilih Kelas */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Pilih Kelas</label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {getClassesForFase().map((cl) => (
                <option key={cl} value={cl}>
                  Kelas {cl}
                </option>
              ))}
            </select>
          </div>

          {/* Mata Pelajaran */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</label>
            <select
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {ALL_SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Tingkat Kesulitan */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Tingkat Kesulitan</label>
            <select
              value={kesulitan}
              onChange={(e) => setKesulitan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              <option value="mudah">Mudah (LOTS)</option>
              <option value="sedang">Sedang (MOTS)</option>
              <option value="sulit">Sulit (HOTS)</option>
              <option value="campuran">Campuran (LOTS & HOTS)</option>
            </select>
          </div>

          {/* Tambahkan Gambar Ilustrasi */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Tambahkan Gambar Ilustrasi</label>
            <select
              value={hasIllustration}
              onChange={(e) => setHasIllustration(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              <option value="tidak">Tidak</option>
              <option value="ya">Ya (Simulasikan Gambar Stimulus)</option>
            </select>
          </div>

          {/* Upload Referensi Dokumen PDF */}
          <div className="space-y-1 md:col-span-2">
            <label className="font-bold text-slate-500 uppercase tracking-wider">
              Dokumen Referensi Materi (.PDF) <span className="text-slate-400 font-normal lowercase">(opsional)</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 text-[11px] font-bold cursor-pointer transition flex items-center gap-1">
                <FileText size={12} />
                <span>Pilih File PDF</span>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] font-semibold text-slate-500 truncate max-w-xs">
                {uploadedFileName || "Tidak ada file terpilih"}
              </span>
            </div>
          </div>

          {/* Isikan Materi Pokok */}
          <div className="md:col-span-3 space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Fokus Materi Pokok / Indikator Soal</label>
            <input
              id="soal-materi-input"
              type="text"
              value={materi}
              onChange={(e) => setMateri(e.target.value)}
              placeholder="Contoh: Operasi hitung perkalian bilangan pecahan desimal"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            />
          </div>

          {/* Capaian Pembelajaran (CP) */}
          <div className="md:col-span-3 space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Capaian Pembelajaran (CP)</label>
            <textarea
              id="soal-cp-input"
              value={cp}
              onChange={(e) => setCp(e.target.value)}
              placeholder="Contoh: Peserta didik dapat menganalisis hubungan antar sudut pada dua garis sejajar yang dipotong oleh sebuah garis transversal."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition text-xs"
            />
          </div>

          {/* Tujuan Pembelajaran (TP) */}
          <div className="md:col-span-3 space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Tujuan Pembelajaran (TP)</label>
            <textarea
              id="soal-tp-input"
              value={tp}
              onChange={(e) => setTp(e.target.value)}
              placeholder="Contoh: Menyelesaikan masalah kontekstual yang berkaitan dengan sudut sehadap dan sudut bertolak belakang."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition text-xs"
            />
          </div>

          {/* Petunjuk Pengerjaan Soal */}
          <div className="md:col-span-3 space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Petunjuk Pengerjaan Soal</label>
            <textarea
              id="soal-petunjuk-input"
              value={petunjuk}
              onChange={(e) => setPetunjuk(e.target.value)}
              placeholder="1. Berdoalah sebelum mengerjakan soal..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition text-xs"
            />
          </div>
        </div>

        {/* Bloom Checklist and Question Formats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100">
          {/* Tipe Soal (Taksonomi Bloom) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block">Tipe Soal (Taksonomi Bloom)</label>
            <div className="grid grid-cols-2 gap-3">
              {["C1 (Mengingat)", "C2 (Memahami)", "C3 (Menerapkan)", "C4 (Menganalisis)", "C5 (Mengevaluasi)", "C6 (Mencipta)"].map((bloom) => {
                const code = bloom.split(" ")[0];
                return (
                  <label key={code} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bloomLevels.includes(code)}
                      onChange={() => toggleBloom(code)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 w-4 h-4"
                    />
                    <span>{bloom}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Format Soal Checklist & Counts */}
          <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block">Format Soal & Jumlah Tiap Format</label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {/* PG */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formats.pg}
                    onChange={(e) => setFormats({ ...formats, pg: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-600"
                  />
                  <span>Pilihan Ganda</span>
                </label>
                {formats.pg && (
                  <input
                    id="count-pg"
                    type="number"
                    value={counts.pg}
                    onChange={(e) => setCounts({ ...counts, pg: parseInt(e.target.value, 10) || 0 })}
                    className="w-12 p-1 bg-white border border-slate-300 text-center text-xs font-bold rounded"
                    min={1}
                  />
                )}
              </div>

              {/* PGK B/S */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formats.pgk_bs}
                    onChange={(e) => setFormats({ ...formats, pgk_bs: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-600"
                  />
                  <span>PGK Benar/Salah</span>
                </label>
                {formats.pgk_bs && (
                  <input
                    id="count-pgk-bs"
                    type="number"
                    value={counts.pgk_bs}
                    onChange={(e) => setCounts({ ...counts, pgk_bs: parseInt(e.target.value, 10) || 0 })}
                    className="w-12 p-1 bg-white border border-slate-300 text-center text-xs font-bold rounded"
                    min={1}
                  />
                )}
              </div>

              {/* PGK Kategori */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formats.pgk_cat}
                    onChange={(e) => setFormats({ ...formats, pgk_cat: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-600"
                  />
                  <span>PGK (Jawaban &gt; 1)</span>
                </label>
                {formats.pgk_cat && (
                  <input
                    id="count-pgk-cat"
                    type="number"
                    value={counts.pgk_cat}
                    onChange={(e) => setCounts({ ...counts, pgk_cat: parseInt(e.target.value, 10) || 0 })}
                    className="w-12 p-1 bg-white border border-slate-300 text-center text-xs font-bold rounded"
                    min={1}
                  />
                )}
              </div>

              {/* Menjodohkan */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formats.menjodohkan}
                    onChange={(e) => setFormats({ ...formats, menjodohkan: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-600"
                  />
                  <span>Menjodohkan</span>
                </label>
                {formats.menjodohkan && (
                  <input
                    id="count-menjodohkan"
                    type="number"
                    value={counts.menjodohkan}
                    onChange={(e) => setCounts({ ...counts, menjodohkan: parseInt(e.target.value, 10) || 0 })}
                    className="w-12 p-1 bg-white border border-slate-300 text-center text-xs font-bold rounded"
                    min={1}
                  />
                )}
              </div>

              {/* Isian */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formats.isian}
                    onChange={(e) => setFormats({ ...formats, isian: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-600"
                  />
                  <span>Isian Singkat</span>
                </label>
                {formats.isian && (
                  <input
                    id="count-isian"
                    type="number"
                    value={counts.isian}
                    onChange={(e) => setCounts({ ...counts, isian: parseInt(e.target.value, 10) || 0 })}
                    className="w-12 p-1 bg-white border border-slate-300 text-center text-xs font-bold rounded"
                    min={1}
                  />
                )}
              </div>

              {/* Uraian */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formats.uraian}
                    onChange={(e) => setFormats({ ...formats, uraian: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-600"
                  />
                  <span>Uraian / Essay</span>
                </label>
                {formats.uraian && (
                  <input
                    id="count-uraian"
                    type="number"
                    value={counts.uraian}
                    onChange={(e) => setCounts({ ...counts, uraian: parseInt(e.target.value, 10) || 0 })}
                    className="w-12 p-1 bg-white border border-slate-300 text-center text-xs font-bold rounded"
                    min={1}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button Row */}
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-md">
            *AI akan mendesain instrumen asesmen secara lengkap, termasuk stimulus bermakna.
          </p>
          <button
            id="soal-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>AI Menyusun Soal...</span>
              </>
            ) : (
              <>
                <BrainCircuit size={14} />
                <span>Kompilasi Instrumen Soal (AI)</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Output Panel & Interactive Quiz Play */}
      {generatedQuestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-5 print:shadow-none print:border-none print:p-0 print:bg-white"
        >
          {/* Quick controls bar */}
          <div className="flex flex-wrap gap-3 justify-between items-center border-b border-slate-100 pb-3 print:hidden">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Hasil Kompilasi Soal AI</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{generatedQuestions.length} Butir Soal Terkompilasi</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveData}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer transition"
              >
                <Save size={12} />
                <span>{savedSuccess ? "Tersimpan!" : "Sinkronkan"}</span>
              </button>
              <button
                onClick={handleDownloadWord}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer transition"
              >
                <Download size={12} />
                <span>Unduh Word</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer transition"
              >
                <Printer size={12} />
                <span>Cetak / PDF</span>
              </button>
            </div>
          </div>

          {/* Header Identitas Cetak (Hanya Muncul saat Print/Cetak PDF) */}
          <div className="hidden print:block mb-6 font-sans text-xs">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold uppercase tracking-tight text-black">INSTRUMEN SOAL EVALUASI</h1>
              <h2 className="text-sm font-bold uppercase tracking-tight text-slate-800">{jenisUjian.toUpperCase()} - SEMESTER {semester === "Semester 1" ? "I" : "II"}</h2>
              <p className="text-[10px] font-semibold text-slate-600 mt-1">
                Mata Pelajaran: {mapel} | Kelas: {kelas} | Kesulitan: {kesulitan.toUpperCase()}
              </p>
            </div>
            <hr className="border-t border-black mb-4" />
            
            {/* Identitas Siswa */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 border border-slate-300 p-3 rounded bg-slate-50/30 text-xs font-semibold mb-6">
              <div className="flex items-center">
                <span className="w-24 shrink-0 text-slate-700">Nama Siswa</span>
                <span className="mr-2">:</span>
                <span className="border-b border-dashed border-slate-400 flex-grow h-4"></span>
              </div>
              <div className="flex items-center">
                <span className="w-24 shrink-0 text-slate-700">No. Absen</span>
                <span className="mr-2">:</span>
                <span className="border-b border-dashed border-slate-400 flex-grow h-4"></span>
              </div>
              <div className="flex items-center">
                <span className="w-24 shrink-0 text-slate-700">Kelas</span>
                <span className="mr-2">:</span>
                <span className="border-b border-dashed border-slate-400 flex-grow h-4">{kelas}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 shrink-0 text-slate-700">Asal Sekolah</span>
                <span className="mr-2">:</span>
                <span className="border-b border-dashed border-slate-400 flex-grow h-4"></span>
              </div>
            </div>

            {cp && (
              <p className="text-xs text-slate-800 mb-1">
                <strong>Capaian Pembelajaran (CP):</strong> {cp}
              </p>
            )}
            {tp && (
              <p className="text-xs text-slate-800 mb-3">
                <strong>Tujuan Pembelajaran (TP):</strong> {tp}
              </p>
            )}
          </div>

          {/* Petunjuk Pengerjaan Soal */}
          {petunjuk && (
            <div className="max-w-4xl mx-auto p-4 bg-amber-50/50 border border-amber-200 rounded-lg space-y-1 text-xs mb-4 print:bg-white print:border-slate-300">
              <h4 className="font-bold text-amber-800 uppercase tracking-wide text-xs">Petunjuk Pengerjaan Soal:</h4>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{petunjuk}</p>
            </div>
          )}

          {/* Interactive Exam taking */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {generatedQuestions.map((q, idx) => (
              <div key={q.id || idx} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2 relative text-xs print:bg-white print:border-none print:p-0 print:shadow-none print:mb-6">
                <div className="flex items-center justify-between print:hidden">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded uppercase">
                    Soal {q.nomor} - {q.tipeBloom}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{q.format.replace("_", " ")}</span>
                </div>

                {/* Stimulus / Image mockup */}
                {q.stimulus && (
                  <div className="p-2.5 bg-white border-l-4 border-indigo-600 text-[11px] text-slate-600 rounded print:border-l-2 print:border-slate-400 print:bg-white print:p-1.5 print:mb-2">
                    {q.stimulus}
                  </div>
                )}

                <p className="text-xs font-bold text-slate-800 leading-relaxed"><span className="hidden print:inline mr-1">{q.nomor}.</span>{q.pertanyaan}</p>

                {/* Rendering details per format */}
                {q.format === "pg" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {(q.opsi || []).map((op: string) => {
                      const letter = op.trim().charAt(0);
                      const isSelected = userAnswers[q.id] === letter;
                      return (
                        <button
                          key={op}
                          onClick={() => setUserAnswers({ ...userAnswers, [q.id]: letter })}
                          className={`p-2.5 text-left text-xs font-semibold rounded border transition flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-700 text-white"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                          } print:bg-white print:text-black print:border-slate-300 print:shadow-none print:p-1.5`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? "bg-white text-indigo-600" : "bg-slate-200 text-slate-700"
                          } print:bg-white print:text-black print:border print:border-slate-300`}>
                            {letter}
                          </span>
                          <span>{op.replace(/^[A-D]\.\s*/, "")}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.format === "pgk_bs" && (
                  <div className="overflow-x-auto rounded border border-slate-200 bg-white mt-2">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="p-2">Pernyataan</th>
                          <th className="p-2 text-center w-20">Benar</th>
                          <th className="p-2 text-center w-20">Salah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(q.pgkBsPernyataan || []).map((p: any, pIdx: number) => {
                          const stateKey = `${q.id}_${pIdx}`;
                          const stateVal = userAnswers[stateKey];
                          return (
                            <tr key={pIdx} className="border-b border-slate-100">
                              <td className="p-2 font-medium text-slate-700">{p.pernyataan}</td>
                              <td className="p-2 text-center">
                                <input
                                  type="radio"
                                  name={stateKey}
                                  checked={stateVal === true}
                                  onChange={() => setUserAnswers({ ...userAnswers, [stateKey]: true })}
                                  className="text-indigo-600 focus:ring-indigo-600"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="radio"
                                  name={stateKey}
                                  checked={stateVal === false}
                                  onChange={() => setUserAnswers({ ...userAnswers, [stateKey]: false })}
                                  className="text-indigo-600 focus:ring-indigo-600"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {q.format === "pgk_cat" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {(q.opsi || []).map((op: string, oIdx: number) => {
                      const stateKey = `${q.id}_checkbox_${oIdx}`;
                      const isChecked = userAnswers[stateKey] === true;
                      return (
                        <label
                          key={op}
                          className={`p-2.5 text-left text-xs font-semibold rounded border transition flex items-center gap-2 cursor-pointer ${
                            isChecked
                              ? "bg-indigo-600 border-indigo-700 text-white"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                          } print:bg-white print:text-black print:border-slate-300 print:shadow-none print:p-1.5`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setUserAnswers({ ...userAnswers, [stateKey]: e.target.checked })}
                            className="rounded text-indigo-600 border-slate-300 w-4 h-4 mr-2"
                          />
                          <span>{op}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.format === "menjodohkan" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-3 bg-white border border-slate-200 rounded text-xs print:border-slate-300 print:shadow-none print:p-1.5">
                    <div>
                      <span className="font-bold text-slate-700 block mb-2">Pernyataan Kiri</span>
                      <ol className="list-decimal pl-4 space-y-1 font-semibold text-slate-600">
                        {(q.menjodohkanData?.kiri || []).map((k: string) => <li key={k}>{k}</li>)}
                      </ol>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-2">Pilihan Jawaban (Menarik Garis)</span>
                      <ol className="list-alpha pl-4 space-y-1 font-semibold text-slate-600" style={{ listStyleType: "upper-alpha" }}>
                        {(q.menjodohkanData?.kanan || []).map((k: string) => <li key={k}>{k}</li>)}
                      </ol>
                    </div>
                  </div>
                )}

                {q.format === "isian" && (
                  <div className="mt-2">
                    <input
                      id={`answer-isian-${q.id}`}
                      type="text"
                      value={userAnswers[q.id] || ""}
                      onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                      placeholder="Ketik jawaban singkat Anda di sini..."
                      className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-medium focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-slate-700 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block mt-2 border-b border-dashed border-slate-400 w-full h-5"></div>
                  </div>
                )}

                {q.format === "uraian" && (
                  <div className="mt-2">
                    <textarea
                      id={`answer-uraian-${q.id}`}
                      value={userAnswers[q.id] || ""}
                      onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                      placeholder="Tuliskan jawaban lengkap dan terperinci Anda di sini..."
                      rows={3}
                      className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-medium focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-slate-700 focus:outline-none print:hidden"
                    />
                    <div className="hidden print:block mt-3 space-y-3">
                      <div className="border-b border-dashed border-slate-400 w-full h-4"></div>
                      <div className="border-b border-dashed border-slate-400 w-full h-4"></div>
                      <div className="border-b border-dashed border-slate-400 w-full h-4"></div>
                      <div className="border-b border-dashed border-slate-400 w-full h-4"></div>
                    </div>
                  </div>
                )}

                {/* Answer Key disclosure */}
                {showAnswersScore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 p-2.5 bg-green-50 border border-green-200 text-xs text-green-800 font-semibold rounded print:hidden"
                  >
                    Kunci Jawaban / Kriteria Penilaian:<br />
                    <span className="font-medium text-slate-700">{q.kunciJawaban}</span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Scorer Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-center">
            <button
              onClick={calculateScore}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded shadow transition flex items-center gap-2 cursor-pointer"
            >
              <HelpCircle size={14} />
              <span>{showAnswersScore ? "Sembunyikan Pembahasan" : "Cek Kunci Jawaban & Pembahasan"}</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
