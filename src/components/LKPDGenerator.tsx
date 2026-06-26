import React, { useState, useEffect } from "react";
import { ALL_SUBJECTS, CLASSES } from "../data";
import { exportToWord } from "../utils";
import { BrainCircuit, Download, Printer, Save, FileText, CheckCircle, AlertCircle, Edit, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface LKPDGeneratorProps {
  onSave: (inputs: any, data: any) => void;
  editData?: { id: string; inputs: any; data: any } | null;
  latestModul?: any | null;
}

export default function LKPDGenerator({ onSave, editData, latestModul }: LKPDGeneratorProps) {
  // Inputs
  const [mapel, setMapel] = useState("Pendidikan Agama Islam dan Budi Pekerti");
  const [fase, setFase] = useState("A");
  const [kelas, setKelas] = useState("Fase A / Kelas 1");
  const [topik, setTopik] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [cp, setCp] = useState("");
  const [kesulitan, setKesulitan] = useState("Sedang");

  // Output states
  const [generatedLKPD, setGeneratedLKPD] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Custom manual edit states
  const [isEditing, setIsEditing] = useState(false);

  // Sync initial state if editing
  useEffect(() => {
    if (editData) {
      const { inputs, data } = editData;
      setMapel(inputs.mapel);
      setFase(inputs.fase);
      setKelas(inputs.kelas);
      setTopik(inputs.topik);
      setTujuan(inputs.tujuan);
      setCp(inputs.cp || "");
      setKesulitan(inputs.kesulitan);
      setGeneratedLKPD(data);
    }
  }, [editData]);

  // Auto sync with latest Modul Ajar
  useEffect(() => {
    if (latestModul && !editData) {
      setMapel(latestModul.inputs.mapel || "Pendidikan Agama Islam dan Budi Pekerti");
      setTopik(latestModul.inputs.materiPokok || "");
      setTujuan(latestModul.inputs.tujuanPembelajaran || "");
      setCp(latestModul.inputs.capaianPembelajaran || "");
      
      const kelasStr = latestModul.inputs.kelas || "";
      if (kelasStr.includes("Kelas 1")) {
        setKelas("Fase A / Kelas 1");
        setFase("A");
      } else if (kelasStr.includes("Kelas 2")) {
        setKelas("Fase A / Kelas 2");
        setFase("A");
      } else if (kelasStr.includes("Kelas 3")) {
        setKelas("Fase B / Kelas 3");
        setFase("B");
      } else if (kelasStr.includes("Kelas 4")) {
        setKelas("Fase B / Kelas 4");
        setFase("B");
      } else if (kelasStr.includes("Kelas 5")) {
        setKelas("Fase C / Kelas 5");
        setFase("C");
      } else if (kelasStr.includes("Kelas 6")) {
        setKelas("Fase C / Kelas 6");
        setFase("C");
      }
    }
  }, [latestModul, editData]);

  // Adjust Fase based on Class selection
  useEffect(() => {
    if (kelas.includes("Kelas 1") || kelas.includes("Kelas 2")) setFase("A");
    else if (kelas.includes("Kelas 3") || kelas.includes("Kelas 4")) setFase("B");
    else setFase("C");
  }, [kelas]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setIsEditing(false);

    const payload = {
      mapel,
      fase,
      kelas,
      topik: topik || "Materi dasar bab pertama",
      tujuan: tujuan || "Memahami prinsip dasar pelajaran",
      cp,
      kesulitan
    };

    try {
      const response = await fetch("/api/generate-lkpd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const text = await response.text();
      if (!response.ok) {
        let errMsg = "Terjadi kesalahan sistem saat penyusunan LKPD.";
        try {
          const parsed = JSON.parse(text);
          if (parsed.error) errMsg = parsed.error;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = JSON.parse(text);
      setGeneratedLKPD(data);
      
      // Auto save to synchronized database
      onSave(payload, data);
    } catch (err: any) {
      setError(err.message || "Gagal membuat LKPD");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = () => {
    if (generatedLKPD) {
      const payload = {
        mapel,
        fase,
        kelas,
        topik,
        tujuan,
        cp,
        kesulitan
      };
      onSave(payload, generatedLKPD);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleDownloadWord = () => {
    if (!generatedLKPD) return;

    const latihanHtml = (generatedLKPD.latihanSoal || []).map((l: any, idx: number) => `
      <div style="margin-bottom: 12px;">
        <p><b>Pertanyaan ${idx + 1}:</b> ${l.pertanyaan}</p>
        <p style="color: #4b5563; font-style: italic;">Pedoman Kunci: ${l.kunci}</p>
      </div>
    `).join("");

    const documentHtml = `
      <div style="border: 3px double #f97316; padding: 20px; font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5;">
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="margin: 0; color: #ea580c; font-size: 16pt;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
          <h3 style="margin: 0; font-size: 12pt; color: #4b5563;">${generatedLKPD.judulKegiatan || "AKTIVITAS BELAJAR SISWA"}</h3>
        </div>

        <table style="width: 100%; border: none; margin-bottom: 20px; font-size: 10pt;">
          <tr>
            <td width="50%" style="border: none;"><b>Mata Pelajaran:</b> ${mapel}</td>
            <td width="50%" style="border: none;"><b>Nama Siswa:</b> ____________________</td>
          </tr>
          <tr>
            <td style="border: none;"><b>Fase / Kelas:</b> Fase ${fase} / ${kelas}</td>
            <td style="border: none;"><b>No. Absen:</b> ____________________</td>
          </tr>
          <tr>
            <td style="border: none;"><b>Topik:</b> ${topik}</td>
            <td style="border: none;"><b>Kelompok:</b> ____________________</td>
          </tr>
          ${cp ? `<tr><td colspan="2" style="border: none; padding-top: 4px;"><b>Capaian Pembelajaran (CP):</b> ${cp}</td></tr>` : ""}
          ${tujuan ? `<tr><td colspan="2" style="border: none; padding-top: 4px;"><b>Tujuan Pembelajaran (TP):</b> ${tujuan}</td></tr>` : ""}
        </table>

        <hr style="border: 1px solid #ea580c; margin-bottom: 18px;" />

        <h4 style="color: #ea580c; margin-bottom: 4px;">PETUNJUK BELAJAR</h4>
        <p style="margin-top: 0;">${generatedLKPD.petunjuk}</p>

        <h4 style="color: #ea580c; margin-bottom: 4px;">RINGKASAN MATERI</h4>
        <p style="margin-top: 0; text-align: justify; background-color: #fff7ed; padding: 10px; border-radius: 8px;">
          ${generatedLKPD.ringkasanMateri}
        </p>

        <h4 style="color: #ea580c; margin-bottom: 4px;">AKTIVITAS / LANGKAH KERJA</h4>
        <p style="margin-top: 0;">${generatedLKPD.langkahKerja}</p>

        <h4 style="color: #ea580c; margin-bottom: 4px;">PERTANYAAN PEMANTIK</h4>
        <p style="margin-top: 0; font-style: italic;">${generatedLKPD.pertanyaanPemantik}</p>

        <h4 style="color: #ea580c; margin-bottom: 4px;">LATIHAN EVALUASI</h4>
        <div style="margin-top: 0;">
          ${latihanHtml}
        </div>

        <h4 style="color: #ea580c; margin-bottom: 4px;">KOLOM REFLEKSI MANDIRI</h4>
        <p style="margin-top: 0;">${generatedLKPD.refleksiDiri}</p>

        <div style="margin-top: 24px; padding: 10px; border: 1px dashed #f97316; font-size: 9pt; background-color: #fafafa;">
          <b>Ide Ilustrasi 3D yang Dapat Digambar:</b> ${generatedLKPD.ideVisual3D}
        </div>
      </div>
    `;

    exportToWord(`LKPD_${topik.replace(/\s+/g, "_")}`, documentHtml, {
      paperSize: "A4",
      lineSpasi: "1.5",
      fontName: "Arial",
      isJustified: true
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Parameter inputs card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Lembar Kerja Peserta Didik (LKPD) AI</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aktivitas Belajar Interaktif & Kreatif</p>
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
          {/* Kelas */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Fase / Kelas</label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {CLASSES.map((cl) => (
                <option key={cl.value} value={cl.value}>
                  {cl.value}
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

          {/* Kategori Kesulitan */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Kategori Kesulitan LKPD</label>
            <select
              value={kesulitan}
              onChange={(e) => setKesulitan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
            </select>
          </div>

          {/* Topik Materi */}
          <div className="md:col-span-3 space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Topik Pembahasan Materi</label>
            <input
              id="lkpd-topik-input"
              type="text"
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Belajar bagian panca indera mata dan fungsinya"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            />
          </div>

          {/* Capaian Pembelajaran */}
          <div className="md:col-span-3 space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Capaian Pembelajaran (CP)</label>
            <textarea
              id="lkpd-cp-input"
              value={cp}
              onChange={(e) => setCp(e.target.value)}
              placeholder="Contoh: Peserta didik dapat mengidentifikasi bagian-bagian tubuh manusia beserta fungsinya."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            />
          </div>

          {/* Tujuan Pembelajaran */}
          <div className="md:col-span-3 space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Tujuan Pembelajaran</label>
            <textarea
              id="lkpd-tujuan-input"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              placeholder="Contoh: Murid dapat menunjukkan minimal 5 bagian panca indra utama beserta fungsinya secara tepat."
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-md">
            *LKPD AI akan menyusun lembar petualangan interaktif lengkap dengan aktivitas, ringkasan, soal evaluasi, dan refleksi.
          </p>
          <button
            id="lkpd-generate-btn"
            onClick={handleGenerate}
            disabled={loading || !topik}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>AI Menyusun Lembar Aktivitas...</span>
              </>
            ) : (
              <>
                <BrainCircuit size={14} />
                <span>Sajikan LKPD Bermakna (AI)</span>
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

      {/* Output workbook */}
      {generatedLKPD && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Quick controls bar */}
          <div className="flex flex-wrap gap-2 justify-end items-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer transition"
            >
              <Edit size={12} />
              <span>{isEditing ? "Selesai Edit" : "Koreksi Teks"}</span>
            </button>
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
              <span>Unduh Word (Arial 11, Spasi 1.5)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer transition"
            >
              <Printer size={12} />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

          {/* Interactive bright A4 styled mockup */}
          <div className="p-5 md:p-8 bg-slate-50 border border-slate-200 rounded-lg space-y-5 text-slate-800 text-xs font-sans shadow-sm">
            <div className="text-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Lembar Kerja Peserta Didik (LKPD)
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                Kategori: {kesulitan} | Kurikulum Merdeka Sekolah Dasar
              </p>
            </div>

            {/* Student Metadata Box */}
            <div className="grid grid-cols-2 gap-4 p-3.5 bg-white rounded border border-slate-200 text-[11px] font-bold text-slate-700">
              <div className="space-y-1">
                <p>Mata Pelajaran: <span className="font-semibold text-slate-600">{mapel}</span></p>
                <p>Fase / Kelas: <span className="font-semibold text-slate-600">Fase {fase} / {kelas}</span></p>
                <p>Topik: <span className="font-semibold text-slate-600">{topik}</span></p>
              </div>
              <div className="space-y-1">
                <p>Nama Siswa: ___________________________</p>
                <p>No. Absen: ____________________________</p>
                <p>Kelompok: ____________________________</p>
              </div>
            </div>

            {/* Structure 1: Judul Kegiatan */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">1. Judul Kegiatan</h4>
              <p className="text-xs font-bold text-slate-800 p-2.5 bg-white border border-slate-200 rounded shadow-sm">
                {isEditing ? (
                  <input
                    id="edit-lkpd-judul"
                    type="text"
                    value={generatedLKPD.judulKegiatan}
                    onChange={(e) => setGeneratedLKPD({ ...generatedLKPD, judulKegiatan: e.target.value })}
                    className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                  />
                ) : (
                  generatedLKPD.judulKegiatan
                )}
              </p>
            </div>

            {/* Structure 2: Petunjuk Penggunaan */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">2. Petunjuk Penggunaan</h4>
              <div className="text-xs leading-relaxed text-slate-600 p-3 bg-white border border-slate-200 rounded shadow-sm font-semibold">
                {isEditing ? (
                  <textarea
                    id="edit-lkpd-petunjuk"
                    value={generatedLKPD.petunjuk}
                    onChange={(e) => setGeneratedLKPD({ ...generatedLKPD, petunjuk: e.target.value })}
                    className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                    rows={2}
                  />
                ) : (
                  <p>{generatedLKPD.petunjuk}</p>
                )}
              </div>
            </div>

            {/* Structure 3: Ringkasan Materi Singkat */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">3. Petualangan Ilmu (Materi Singkat)</h4>
              <div className="text-xs leading-relaxed text-slate-700 p-3 bg-white border border-slate-200 rounded shadow-sm font-semibold whitespace-pre-line text-justify">
                {isEditing ? (
                  <textarea
                    id="edit-lkpd-materi"
                    value={generatedLKPD.ringkasanMateri}
                    onChange={(e) => setGeneratedLKPD({ ...generatedLKPD, ringkasanMateri: e.target.value })}
                    className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                    rows={6}
                  />
                ) : (
                  generatedLKPD.ringkasanMateri
                )}
              </div>
            </div>

            {/* Structure 4: Aktivitas / Langkah Kerja */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">4. Langkah Kerja & Eksplorasi</h4>
              <div className="text-xs leading-relaxed text-slate-700 p-3 bg-white border border-slate-200 rounded shadow-sm font-semibold whitespace-pre-line">
                {isEditing ? (
                  <textarea
                    id="edit-lkpd-langkah"
                    value={generatedLKPD.langkahKerja}
                    onChange={(e) => setGeneratedLKPD({ ...generatedLKPD, langkahKerja: e.target.value })}
                    className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                    rows={4}
                  />
                ) : (
                  generatedLKPD.langkahKerja
                )}
              </div>
            </div>

            {/* Structure 5: Pertanyaan Pemantik */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">5. Pertanyaan Pemantik</h4>
              <div className="text-xs leading-relaxed text-slate-700 p-3 bg-white border border-slate-200 rounded shadow-sm font-bold italic">
                {isEditing ? (
                  <textarea
                    id="edit-lkpd-pemantik"
                    value={generatedLKPD.pertanyaanPemantik}
                    onChange={(e) => setGeneratedLKPD({ ...generatedLKPD, pertanyaanPemantik: e.target.value })}
                    className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                    rows={2}
                  />
                ) : (
                  <p>"{generatedLKPD.pertanyaanPemantik}"</p>
                )}
              </div>
            </div>

            {/* Structure 6: Latihan Soal Evaluasi */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">6. Latihan Soal Evaluasi</h4>
              <div className="space-y-2">
                {generatedLKPD.latihanSoal.map((soal: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded shadow-sm space-y-1.5 text-xs font-semibold text-slate-700">
                    <p className="font-bold text-slate-800">Soal {idx + 1}: {soal.pertanyaan}</p>
                    <div className="h-10 border border-slate-200 rounded bg-slate-50 p-2 text-slate-400">Tulis jawabanmu di sini...</div>
                    <p className="text-[10px] text-slate-400 italic">Kunci: {soal.kunci}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Structure 7: Kolom Refleksi / Cek Pemahaman Diri */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">7. Cek Pemahaman Diri (Refleksi)</h4>
              <div className="text-xs leading-relaxed text-slate-700 p-3 bg-white border border-slate-200 rounded shadow-sm font-semibold">
                {isEditing ? (
                  <textarea
                    id="edit-lkpd-refleksi"
                    value={generatedLKPD.refleksiDiri}
                    onChange={(e) => setGeneratedLKPD({ ...generatedLKPD, refleksiDiri: e.target.value })}
                    className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                    rows={2}
                  />
                ) : (
                  <p>{generatedLKPD.refleksiDiri}</p>
                )}
              </div>
            </div>

            {/* 3D Illustration Mockup */}
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-xs font-bold text-indigo-950">
              🖼️ <span className="underline">Saran Ide Ilustrasi Visual 3D Pendukung Belajar Siswa:</span>
              <p className="font-medium text-slate-600 mt-1">{generatedLKPD.ideVisual3D}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
