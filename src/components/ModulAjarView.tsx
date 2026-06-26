import React, { useState, useEffect } from "react";
import {
  TEACHERS, CLASSES, ALL_SUBJECTS, YEARS, SEMESTERS,
  PERTEMUAN_LIST, DURASI_LIST, PEDAGOGI_LIST, DIMENSI_LIST,
  CAPAIAN_PEMBELAJARAN, getTPList
} from "../data";
import { ModulInputState, GeneratedModul } from "../types";
import { exportToWord } from "../utils";
import { Calendar, BrainCircuit, Download, Save, Printer, Edit2, Check, RefreshCw, AlertCircle, PlusCircle, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface ModulAjarViewProps {
  initialTeacherName?: string;
  initialTeacherNip?: string;
  onSave: (inputs: any, data: any) => void;
  editData?: { id: string; inputs: any; data: any } | null;
}

export default function ModulAjarView({ initialTeacherName = "", initialTeacherNip = "", onSave, editData }: ModulAjarViewProps) {
  // Input states
  const [inputs, setInputs] = useState<ModulInputState>({
    namaGuru: initialTeacherName,
    NIP: initialTeacherNip || "198507152023211015",
    role: "Guru",
    unitKerja: "UPTD SPF SDN GAYAM KIDUL 2",
    kelas: "Fase A / Kelas 1",
    mapel: "Pendidikan Agama Islam dan Budi Pekerti",
    tahunPelajaran: "2026/2027",
    semester: "Semester 1",
    pertemuan: "Pertemuan 1",
    durasi: "2 × 35 menit",
    materiPokok: "",
    tanggalPelaksanaan: new Date().toISOString().split("T")[0],
    pedagogi: "Inkuiri-Discovery",
    dimensi: "Keimanan & Ketakwaan",
    capaianPembelajaran: "",
    tujuanPembelajaran: "",
    kabupaten: "Sampang"
  });

  // Dynamic values based on selections
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [customCP, setCustomCP] = useState("");
  const [isEditingCP, setIsEditingCP] = useState(false);
  
  const [availableTPList, setAvailableTPList] = useState<string[]>([]);
  const [selectedTP, setSelectedTP] = useState<string>("");
  const [customTPText, setCustomTPText] = useState("");
  const [isAddingCustomTP, setIsAddingCustomTP] = useState(false);

  // AI Output state
  const [generated, setGenerated] = useState<GeneratedModul | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Manual Editing States for Generated Tables
  const [isEditingTable, setIsEditingTable] = useState(false);

  // Sync initial state if editing
  useEffect(() => {
    if (editData) {
      setInputs(editData.inputs);
      setGenerated(editData.data);
    }
  }, [editData]);

  // Handle teacher dropdown changes to auto-populate NIP and Role
  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNip = e.target.value;
    const teacher = TEACHERS.find((t) => t.nip === selectedNip);
    if (teacher) {
      setInputs((prev) => ({
        ...prev,
        NIP: teacher.nip,
        namaGuru: teacher.name,
        role: teacher.role
      }));
    }
  };

  // Filter subjects based on class level (Kelas 1 & 2 do not have IPAS or Bahasa Inggris)
  useEffect(() => {
    const isKelas1or2 = inputs.kelas.includes("Kelas 1") || inputs.kelas.includes("Kelas 2");
    const filtered = ALL_SUBJECTS.filter((subj) => {
      if (isKelas1or2 && (subj === "IPAS" || subj === "Bahasa Inggris")) {
        return false;
      }
      return true;
    });
    setAvailableSubjects(filtered);
    
    // Reset mapel if not in the new filtered list
    if (!filtered.includes(inputs.mapel)) {
      setInputs((prev) => ({ ...prev, mapel: filtered[0] || "" }));
    }
  }, [inputs.kelas]);

  // Load Capaian Pembelajaran based on Mapel & Clase group
  useEffect(() => {
    const fase = inputs.kelas.includes("Kelas 1") || inputs.kelas.includes("Kelas 2") ? "A" :
                 inputs.kelas.includes("Kelas 3") || inputs.kelas.includes("Kelas 4") ? "B" : "C";
    
    const cpMap = CAPAIAN_PEMBELAJARAN[inputs.mapel];
    const defaultCP = cpMap ? cpMap[fase] || "" : "";
    
    setInputs((prev) => ({ ...prev, capaianPembelajaran: defaultCP }));
    setCustomCP(defaultCP);
  }, [inputs.mapel, inputs.kelas]);

  // Load Tujuan Pembelajaran options
  useEffect(() => {
    const list = getTPList(inputs.kelas, inputs.semester, inputs.mapel);
    setAvailableTPList(list);
    if (list.length > 0) {
      setSelectedTP(list[0]);
      setInputs((prev) => ({ ...prev, tujuanPembelajaran: list[0] }));
    } else {
      setSelectedTP("");
      setInputs((prev) => ({ ...prev, tujuanPembelajaran: "" }));
    }
  }, [inputs.kelas, inputs.semester, inputs.mapel]);

  // Handle select predefined TP
  const handleTPSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTP(val);
    setInputs((prev) => ({ ...prev, tujuanPembelajaran: val }));
  };

  // Save modified CP
  const handleSaveCP = () => {
    setInputs((prev) => ({ ...prev, capaianPembelajaran: customCP }));
    setIsEditingCP(false);
  };

  // Add custom TP
  const handleAddCustomTP = () => {
    if (customTPText.trim()) {
      setAvailableTPList((prev) => [customTPText, ...prev]);
      setSelectedTP(customTPText);
      setInputs((prev) => ({ ...prev, tujuanPembelajaran: customTPText }));
      setCustomTPText("");
      setIsAddingCustomTP(false);
    }
  };

  // Delete TP from available list
  const handleDeleteTP = () => {
    const updated = availableTPList.filter((item) => item !== selectedTP);
    setAvailableTPList(updated);
    if (updated.length > 0) {
      setSelectedTP(updated[0]);
      setInputs((prev) => ({ ...prev, tujuanPembelajaran: updated[0] }));
    } else {
      setSelectedTP("");
      setInputs((prev) => ({ ...prev, tujuanPembelajaran: "" }));
    }
  };

  // Generate Modul Ajar with AI
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSavedSuccess(false);
    try {
      const response = await fetch("/api/generate-modul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });
      
      const text = await response.text();
      if (!response.ok) {
        let errMsg = "Terjadi kesalahan sistem saat penyusunan oleh AI.";
        try {
          const parsed = JSON.parse(text);
          if (parsed.error) errMsg = parsed.error;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = JSON.parse(text);
      setGenerated(data);
      
      // Auto save after generation
      onSave(inputs, data);
    } catch (err: any) {
      setError(err.message || "Gagal menyusun modul");
    } finally {
      setLoading(false);
    }
  };

  // Trigger manual save
  const handleSaveData = () => {
    if (generated) {
      onSave(inputs, generated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Download Word Document
  const handleDownloadWord = () => {
    if (!generated) return;
    
    // Format Experiencias Belajar (Table 4) html rows
    const pengalamanRowsHtml = generated.pengalamanBelajar.map((p) => `
      <tr>
        <td colspan="2" style="background-color: #f3f4f6; font-weight: bold;">${p.pertemuan}</td>
      </tr>
      <tr>
        <td><b>Memahami (Kegiatan Awal)</b><br/><span style="font-size: 9pt; color: #666666;">(Berkesadaran, Bermakna, Menggembirakan)</span></td>
        <td>${p.kegiatanAwal}</td>
      </tr>
      <tr>
        <td><b>Mengaplikasi (Kegiatan Inti)</b><br/><span style="font-size: 9pt; color: #666666;">(Berkesadaran, Bermakna, Menggembirakan)</span></td>
        <td>${p.kegiatanInti}</td>
      </tr>
      <tr>
        <td><b>Refleksi (Kegiatan Penutup)</b><br/><span style="font-size: 9pt; color: #666666;">(Berkesadaran, Bermakna, Menggembirakan)</span></td>
        <td>${p.kegiatanPenutup}</td>
      </tr>
    `).join("");

    const rubrikRowsHtml = (generated.asesmenRubrik || []).map((r) => `
      <tr>
        <td><b>${r.kriteria}</b></td>
        <td>${r.perluBimbingan}</td>
        <td>${r.cukup}</td>
        <td>${r.baik}</td>
        <td>${r.sangatBaik}</td>
      </tr>
    `).join("");

    const documentHtml = `
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase;">MODUL AJAR DEEP LEARNING (KURIKULUM MERDEKA)</h2>
        <h3 style="margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">${inputs.unitKerja} - KABUPATEN ${inputs.kabupaten.toUpperCase()}</h3>
      </div>

      <!-- Tabel 1: Identitas -->
      <h4 style="font-size: 11pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">TABEL 1. INFORMASI DASAR / IDENTITAS MODUL AJAR</h4>
      <table>
        <tr>
          <td width="30%"><b>Nama Satuan Pendidikan</b></td>
          <td>${inputs.unitKerja}</td>
        </tr>
        <tr>
          <td><b>Mata Pelajaran</b></td>
          <td>${inputs.mapel}</td>
        </tr>
        <tr>
          <td><b>Kelas / Semester</b></td>
          <td>${inputs.kelas} / ${inputs.semester}</td>
        </tr>
        <tr>
          <td><b>Materi Pelajaran</b></td>
          <td>${inputs.materiPokok}</td>
        </tr>
        <tr>
          <td><b>Durasi Pertemuan</b></td>
          <td>${inputs.durasi} (${inputs.pertemuan})</td>
        </tr>
        <tr>
          <td><b>Tahun Pelajaran</b></td>
          <td>${inputs.tahunPelajaran}</td>
        </tr>
      </table>

      <!-- Tabel 2: Identifikasi -->
      <h4 style="font-size: 11pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">TABEL 2. IDENTIFIKASI</h4>
      <table>
        <tr>
          <td width="30%"><b>Peserta Didik (Kesiapan Belajar)</b></td>
          <td>Identifikasi kesiapan peserta didik sebelum belajar, seperti pengetahuan awal, minat, latar belakang, dan kebutuhan belajar disesuaikan dengan kurikulum deep learning.</td>
        </tr>
        <tr>
          <td><b>Materi Pelajaran</b></td>
          <td>${inputs.materiPokok}</td>
        </tr>
        <tr>
          <td><b>Capaian Dimensi Profil Lulusan</b></td>
          <td>${inputs.dimensi}</td>
        </tr>
      </table>

      <!-- Tabel 3: Desain Pembelajaran -->
      <h4 style="font-size: 11pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">TABEL 3. DESAIN PEMBELAJARAN</h4>
      <table>
        <tr>
          <td width="30%"><b>Capaian Pembelajaran (CP)</b></td>
          <td>${inputs.capaianPembelajaran}</td>
        </tr>
        <tr>
          <td><b>Lintas Disiplin Ilmu</b></td>
          <td>${generated.lintasDisiplin}</td>
        </tr>
        <tr>
          <td><b>Tujuan Pembelajaran (TP)</b></td>
          <td>${inputs.tujuanPembelajaran}</td>
        </tr>
        <tr>
          <td><b>Topik Pembelajaran</b></td>
          <td>${generated.topikPembelajaran}</td>
        </tr>
        <tr>
          <td><b>Praktik Pedagogis per Pertemuan</b></td>
          <td>${inputs.pedagogi}</td>
        </tr>
        <tr>
          <td><b>Kemitraan Pembelajaran</b></td>
          <td>${generated.kemitraanPembelajaran}</td>
        </tr>
        <tr>
          <td><b>Lingkungan Pembelajaran</b></td>
          <td>${generated.lingkunganPembelajaran}</td>
        </tr>
        <tr>
          <td><b>Pemanfaatan Digital</b></td>
          <td>${generated.pemanfaatanDigital}</td>
        </tr>
      </table>

      <!-- Tabel 4: Pengalaman Belajar -->
      <h4 style="font-size: 11pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">TABEL 4. PENGALAMAN BELAJAR</h4>
      <table>
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th width="30%"><b>Fase / Kegiatan</b></th>
            <th><b>Langkah Pembelajaran Berkesadaran & Bermakna</b></th>
          </tr>
        </thead>
        <tbody>
          ${pengalamanRowsHtml}
        </tbody>
      </table>

      <!-- Tabel 5: Asesmen Pembelajaran -->
      <h4 style="font-size: 11pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">TABEL 5. ASESMEN PEMBELAJARAN</h4>
      <table>
        <tr>
          <td width="30%"><b>Asesmen Awal (Diagnostik/Apersepsi)</b></td>
          <td>${generated.asesmenAwal}</td>
        </tr>
        <tr>
          <td><b>Asesmen Proses (Observasi, Rubrik)</b></td>
          <td>${generated.asesmenProses}</td>
        </tr>
        <tr>
          <td><b>Asesmen Akhir (Produk, Tugas, Ujian)</b></td>
          <td>${generated.asesmenAkhir}</td>
        </tr>
      </table>

      <!-- Rubrik Penilaian -->
      <h5 style="font-size: 11pt; font-weight: bold; margin-top: 12px; margin-bottom: 6px;">RUBRIK PENILAIAN TERSTRUKTUR</h5>
      <table>
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th width="20%"><b>Kriteria</b></th>
            <th width="20%"><b>Perlu Bimbingan</b></th>
            <th width="20%"><b>Cukup</b></th>
            <th width="20%"><b>Baik</b></th>
            <th width="20%"><b>Sangat Baik</b></th>
          </tr>
        </thead>
        <tbody>
          ${rubrikRowsHtml}
        </tbody>
      </table>

      <!-- Bagian 6: Prinsip Pembelajaran -->
      <h4 style="font-size: 11pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">6. PRINSIP PEMBELAJARAN DEEP LEARNING</h4>
      <table>
        <tr>
          <td width="30%"><b>Berkesadaran (Mindful)</b></td>
          <td>${generated.prinsipPembelajaran?.mindful || ""}</td>
        </tr>
        <tr>
          <td><b>Bermakna (Meaningful)</b></td>
          <td>${generated.prinsipPembelajaran?.meaningful || ""}</td>
        </tr>
        <tr>
          <td><b>Menggembirakan (Joyful)</b></td>
          <td>${generated.prinsipPembelajaran?.joyful || ""}</td>
        </tr>
      </table>

      <!-- Bagian 7: Kerangka Pembelajaran -->
      <h4 style="font-size: 11pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">7. KERANGKA PEMBELAJARAN</h4>
      <table>
        <tr>
          <td width="30%"><b>Praktik Pedagogis (a)</b></td>
          <td>${generated.kerangkaPembelajaran?.praktikPedagogik || ""}</td>
        </tr>
        <tr>
          <td><b>Lingkungan Pembelajaran (b)</b></td>
          <td>${generated.kerangkaPembelajaran?.lingkunganPembelajaran || ""}</td>
        </tr>
        <tr>
          <td><b>Pemanfaatan Digital (c)</b></td>
          <td>
            ${generated.kerangkaPembelajaran?.pemanfaatanDigital || ""}
            ${generated.videoYoutubeRelevan ? `<br/><br/><b>Rekomendasi Video YouTube:</b> <a href="${generated.videoYoutubeRelevan}">${generated.videoYoutubeRelevan}</a>` : ""}
          </td>
        </tr>
        <tr>
          <td><b>Kemitraan Pembelajaran (d)</b></td>
          <td>${generated.kerangkaPembelajaran?.kemitraanPembelajaran || ""}</td>
        </tr>
      </table>

      <!-- Signature Section -->
      <table class="signature-table" style="width: 100%; border: none; margin-top: 50px;">
        <tr>
          <td colspan="2" style="text-align: right; border: none; font-size: 11pt;">
            ${inputs.kabupaten}, ${new Date(inputs.tanggalPelaksanaan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </td>
        </tr>
        <tr style="height: 80px;">
          <td width="50%" style="text-align: left; border: none; vertical-align: top;">
            Kepala Satuan Pendidikan<br />
            UPTD SPF SDN GAYAM KIDUL 2<br /><br /><br /><br />
            <b><u>Panji Amboro,S.Pd.,M.Pd</u></b><br />
            NIP: 198207172003121005
          </td>
          <td width="50%" style="text-align: right; border: none; vertical-align: top;">
            Guru Kelas / Mata Pelajaran<br /><br /><br /><br /><br />
            <b><u>${inputs.namaGuru}</u></b><br />
            NIP: ${inputs.NIP}
          </td>
        </tr>
      </table>
    `;

    exportToWord(`Modul_Ajar_${inputs.mapel}_Kelas_${inputs.kelas.split(" ").pop()}`, documentHtml, {
      paperSize: "A4",
      lineSpasi: "1.0",
      fontName: "Arial",
      isJustified: true
    });
  };

  // Print PDF View
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Penyusunan Modul Ajar</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Form Isian & Integrasi Kurikulum Merdeka</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Guru Dropdown */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Nama Guru Pengajar</label>
            <select
              value={inputs.NIP}
              onChange={handleTeacherChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {TEACHERS.map((t) => (
                <option key={t.nip} value={t.nip}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* NIP Auto display */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">NIP / NIPPPK</label>
            <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-600 font-bold">
              {inputs.NIP}
            </div>
          </div>

          {/* Jabatan Auto display */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Unit Kerja / Jabatan</label>
            <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-600 font-bold truncate">
              {inputs.unitKerja} ({inputs.role})
            </div>
          </div>

          {/* Fase / Kelas */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Fase / Kelas</label>
            <select
              value={inputs.kelas}
              onChange={(e) => setInputs((prev) => ({ ...prev, kelas: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {CLASSES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.value}
                </option>
              ))}
            </select>
          </div>

          {/* Mata Pelajaran */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</label>
            <select
              value={inputs.mapel}
              onChange={(e) => setInputs((prev) => ({ ...prev, mapel: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {availableSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Tahun Pelajaran */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Tahun Pelajaran</label>
            <select
              value={inputs.tahunPelajaran}
              onChange={(e) => setInputs((prev) => ({ ...prev, tahunPelajaran: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Semester</label>
            <select
              value={inputs.semester}
              onChange={(e) => setInputs((prev) => ({ ...prev, semester: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Pertemuan ke */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Pertemuan Ke</label>
            <select
              value={inputs.pertemuan}
              onChange={(e) => setInputs((prev) => ({ ...prev, pertemuan: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {PERTEMUAN_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Durasi */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Durasi Pertemuan</label>
            <select
              value={inputs.durasi}
              onChange={(e) => setInputs((prev) => ({ ...prev, durasi: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {DURASI_LIST.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Praktik Pedagogis */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Praktik Pedagogis</label>
            <select
              value={inputs.pedagogi}
              onChange={(e) => setInputs((prev) => ({ ...prev, pedagogi: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition"
            >
              {PEDAGOGI_LIST.map((ped) => (
                <option key={ped} value={ped}>
                  {ped}
                </option>
              ))}
            </select>
          </div>

          {/* Dimensi Profil Lulusan */}
          <div className="space-y-1 md:col-span-2">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-xs block mb-1">Dimensi Profil Lulusan</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {DIMENSI_LIST.map((dim) => {
                const isChecked = (inputs.dimensi || "").split(", ").map(d => d.trim()).includes(dim);
                return (
                  <label key={dim} className="flex items-center space-x-2 text-xs text-slate-700 font-semibold cursor-pointer bg-white p-1.5 rounded border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const list = (inputs.dimensi || "").split(", ").map(d => d.trim()).filter(Boolean);
                        let newList;
                        if (e.target.checked) {
                          newList = [...list, dim];
                        } else {
                          newList = list.filter((item) => item !== dim);
                        }
                        setInputs((prev) => ({ ...prev, dimensi: newList.join(", ") }));
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                    <span>{dim}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Tanggal Pelaksanaan dengan Mini Kalender */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Tanggal Pelaksanaan</label>
            <input
              id="modul-tanggal-input"
              type="date"
              value={inputs.tanggalPelaksanaan}
              onChange={(e) => setInputs((prev) => ({ ...prev, tanggalPelaksanaan: e.target.value }))}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium transition"
            />
          </div>

          {/* Kabupaten Penandatangan */}
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Kabupaten Pembuatan</label>
            <input
              id="modul-kabupaten"
              type="text"
              value={inputs.kabupaten}
              onChange={(e) => setInputs((prev) => ({ ...prev, kabupaten: e.target.value }))}
              placeholder="Contoh: Sampang"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium transition"
            />
          </div>

          {/* Materi Pokok (Manual input) */}
          <div className="md:col-span-2 space-y-1">
            <label className="font-bold text-slate-500 uppercase tracking-wider">Materi Pokok (Ketik Manual)</label>
            <input
              id="modul-materi-input"
              type="text"
              value={inputs.materiPokok}
              onChange={(e) => setInputs((prev) => ({ ...prev, materiPokok: e.target.value }))}
              placeholder="Ketik materi pokok utama di sini, misal: Mengenal bilangan bulat negatif"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium transition"
            />
          </div>
        </div>

        {/* Capaian & Tujuan Pembelajaran Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100">
          {/* Capaian Pembelajaran Box */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 block">Capaian Pembelajaran (CP) Terpilih</label>
              {!isEditingCP ? (
                <button
                  onClick={() => setIsEditingCP(true)}
                  className="text-indigo-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit2 size={12} /> Edit CP
                </button>
              ) : (
                <button
                  onClick={handleSaveCP}
                  className="text-green-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Check size={12} /> Selesai
                </button>
              )}
            </div>

            {isEditingCP ? (
              <textarea
                id="cp-edit-textarea"
                value={customCP}
                onChange={(e) => setCustomCP(e.target.value)}
                rows={4}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3 rounded border border-slate-200 h-28 overflow-y-auto">
                {inputs.capaianPembelajaran || "(Belum ada Capaian Pembelajaran terpilih)"}
              </p>
            )}
          </div>

          {/* Tujuan Pembelajaran Selector */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 block">Tujuan Pembelajaran (TP) Terpilih</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingCustomTP(true)}
                  className="text-indigo-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <PlusCircle size={12} /> Tambah TP
                </button>
                {selectedTP && (
                  <button
                    onClick={handleDeleteTP}
                    className="text-red-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                )}
              </div>
            </div>

            {isAddingCustomTP ? (
              <div className="space-y-2">
                <textarea
                  id="tp-custom-textarea"
                  value={customTPText}
                  onChange={(e) => setCustomTPText(e.target.value)}
                  placeholder="Ketik Tujuan Pembelajaran kustom baru..."
                  rows={2}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddingCustomTP(false)}
                    className="px-3 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddCustomTP}
                    className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={selectedTP}
                  onChange={handleTPSelection}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  {availableTPList.map((tp, idx) => (
                    <option key={idx} value={tp}>
                      {tp.substring(0, 70)}...
                    </option>
                  ))}
                  {availableTPList.length === 0 && (
                    <option value="">(Tidak ada TP tersedia, silakan buat baru)</option>
                  )}
                </select>
                <div className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3 rounded border border-slate-200 h-16 overflow-y-auto">
                  {inputs.tujuanPembelajaran || "(Silakan pilih atau tambahkan Tujuan Pembelajaran)"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button Row */}
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-md">
            *Pastikan semua field (terutama Materi Pokok) terisi agar AI dapat mengidentifikasi konten.
          </p>
          <button
            id="modul-generate-btn"
            onClick={handleGenerate}
            disabled={loading || !inputs.materiPokok}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>AI Menyusun Rencana...</span>
              </>
            ) : (
              <>
                <BrainCircuit size={14} />
                <span>Susun Rencana Ajar (AI Deep Learning)</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Output Rencana Ajar Tables Display */}
      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 bg-slate-50 p-5 rounded-lg border border-slate-200 print:bg-white print:p-0 print:border-none"
        >
          {/* Quick controls bar */}
          <div className="flex flex-wrap gap-2 justify-end items-center print:hidden">
            <button
              onClick={() => setIsEditingTable(!isEditingTable)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] rounded flex items-center gap-1.5 cursor-pointer transition"
            >
              <Edit2 size={12} />
              <span>{isEditingTable ? "Kunci & Selesai Edit" : "Koreksi Sel Manual"}</span>
            </button>
            <button
              onClick={handleSaveData}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded flex items-center gap-1.5 cursor-pointer transition"
            >
              <Save size={12} />
              <span>{savedSuccess ? "Tersimpan!" : "Sinkronkan & Simpan"}</span>
            </button>
            <button
              onClick={handleDownloadWord}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download size={12} />
              <span>Unduh Word (F4)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] rounded flex items-center gap-1.5 cursor-pointer transition"
            >
              <Printer size={12} />
              <span>Cetak / PDF</span>
            </button>
          </div>

          <div id="print-area" className="space-y-8 print:p-0">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight uppercase">
                MODUL AJAR DEEP LEARNING (KURIKULUM MERDEKA)
              </h2>
              <p className="text-sm font-bold text-slate-600 mt-1 uppercase tracking-wide">
                {inputs.unitKerja} - KABUPATEN {inputs.kabupaten.toUpperCase()}
              </p>
            </div>

            {/* TABEL 1: IDENTITAS */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">
                Tabel 1: Identitas Modul Ajar
              </h3>
              <div className="overflow-x-auto rounded border border-slate-200 shadow-sm bg-white text-xs">
                <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 w-1/3 border-r border-slate-100">Nama Satuan Pendidikan</td>
                      <td className="p-3">{inputs.unitKerja}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Mata Pelajaran</td>
                      <td className="p-3">{inputs.mapel}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Kelas / Semester</td>
                      <td className="p-3">{inputs.kelas} / {inputs.semester}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Materi Pelajaran</td>
                      <td className="p-3">
                        {isEditingTable ? (
                          <input
                            id="edit-identitas-materi"
                            type="text"
                            value={inputs.materiPokok}
                            onChange={(e) => setInputs({ ...inputs, materiPokok: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                          />
                        ) : (
                          inputs.materiPokok
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Durasi Pertemuan</td>
                      <td className="p-3">{inputs.durasi} ({inputs.pertemuan})</td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Tahun Pelajaran</td>
                      <td className="p-3">{inputs.tahunPelajaran}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABEL 2: IDENTIFIKASI */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">
                Tabel 2: Identifikasi
              </h3>
              <div className="overflow-x-auto rounded border border-slate-200 shadow-sm bg-white text-xs">
                <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 w-1/3 border-r border-slate-100">Peserta Didik (Kesiapan Belajar)</td>
                      <td className="p-3">
                        Identifikasi kesiapan peserta didik sebelum belajar, seperti pengetahuan awal, minat, latar belakang, dan kebutuhan belajar disesuaikan dengan kurikulum deep learning.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Materi Pelajaran</td>
                      <td className="p-3">{inputs.materiPokok}</td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Capaian Dimensi Profil Lulusan</td>
                      <td className="p-3">{inputs.dimensi}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABEL 3: DESAIN PEMBELAJARAN */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">
                Tabel 3: Desain Pembelajaran
              </h3>
              <div className="overflow-x-auto rounded border border-slate-200 shadow-sm bg-white text-xs">
                <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 w-1/3 border-r border-slate-100">Capaian Pembelajaran (CP)</td>
                      <td className="p-3 leading-relaxed">{inputs.capaianPembelajaran}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Lintas Disiplin Ilmu</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            id="edit-desain-lintas"
                            value={generated.lintasDisiplin}
                            onChange={(e) => setGenerated({ ...generated, lintasDisiplin: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={2}
                          />
                        ) : (
                          generated.lintasDisiplin
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Tujuan Pembelajaran (TP)</td>
                      <td className="p-3 leading-relaxed font-bold text-indigo-600">{inputs.tujuanPembelajaran}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Topik Pembelajaran</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            id="edit-desain-topik"
                            value={generated.topikPembelajaran}
                            onChange={(e) => setGenerated({ ...generated, topikPembelajaran: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={2}
                          />
                        ) : (
                          generated.topikPembelajaran
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Praktik Pedagogis per Pertemuan</td>
                      <td className="p-3">{inputs.pedagogi}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Kemitraan Pembelajaran</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            id="edit-desain-kemitraan"
                            value={generated.kemitraanPembelajaran}
                            onChange={(e) => setGenerated({ ...generated, kemitraanPembelajaran: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={2}
                          />
                        ) : (
                          generated.kemitraanPembelajaran
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Lingkungan Pembelajaran</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            id="edit-desain-lingkungan"
                            value={generated.lingkunganPembelajaran}
                            onChange={(e) => setGenerated({ ...generated, lingkunganPembelajaran: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={2}
                          />
                        ) : (
                          generated.lingkunganPembelajaran
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Pemanfaatan Digital</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            id="edit-desain-digital"
                            value={generated.pemanfaatanDigital}
                            onChange={(e) => setGenerated({ ...generated, pemanfaatanDigital: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={2}
                          />
                        ) : (
                          generated.pemanfaatanDigital
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABEL 4: PENGALAMAN BELAJAR */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">
                Tabel 4: Pengalaman Belajar
              </h3>
              <div className="overflow-x-auto rounded border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-xs font-semibold text-slate-700 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 w-1/4 border-r border-slate-200 text-left">Pertemuan & Alur Aktivitas</th>
                      <th className="p-3 text-left">Langkah Kegiatan Sesuai Sintaks {inputs.pedagogi}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generated.pengalamanBelajar.map((p, idx) => (
                      <React.Fragment key={idx}>
                        {/* Header Pertemuan */}
                        <tr className="border-b border-slate-200 bg-indigo-50/50">
                          <td colSpan={2} className="p-3 font-extrabold text-indigo-950 border-b border-slate-200">
                            {p.pertemuan} (Topik Pembahasan: {inputs.materiPokok})
                          </td>
                        </tr>
                        {/* Awal (Memahami) */}
                        <tr className="border-b border-slate-100">
                          <td className="p-3 bg-slate-50 border-r border-slate-100 font-bold text-slate-800">
                            Memahami (Kegiatan Awal)<br />
                            <span className="text-[10px] text-slate-500 font-medium">(Berkesadaran, Bermakna, Menggembirakan)</span>
                          </td>
                          <td className="p-3 leading-relaxed">
                            {isEditingTable ? (
                              <textarea
                                id={`edit-kegiatan-awal-${idx}`}
                                value={p.kegiatanAwal}
                                onChange={(e) => {
                                  const updatedArr = [...generated.pengalamanBelajar];
                                  updatedArr[idx].kegiatanAwal = e.target.value;
                                  setGenerated({ ...generated, pengalamanBelajar: updatedArr });
                                }}
                                className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                                rows={4}
                              />
                            ) : (
                              <div className="whitespace-pre-line">{p.kegiatanAwal}</div>
                            )}
                          </td>
                        </tr>
                        {/* Inti (Mengaplikasi) */}
                        <tr className="border-b border-slate-100">
                          <td className="p-3 bg-slate-50 border-r border-slate-100 font-bold text-slate-800">
                            Mengaplikasi (Kegiatan Inti)<br />
                            <span className="text-[10px] text-slate-500 font-medium">(Berkesadaran, Bermakna, Menggembirakan)</span>
                          </td>
                          <td className="p-3 leading-relaxed">
                            {isEditingTable ? (
                              <textarea
                                id={`edit-kegiatan-inti-${idx}`}
                                value={p.kegiatanInti}
                                onChange={(e) => {
                                  const updatedArr = [...generated.pengalamanBelajar];
                                  updatedArr[idx].kegiatanInti = e.target.value;
                                  setGenerated({ ...generated, pengalamanBelajar: updatedArr });
                                }}
                                className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                                rows={6}
                              />
                            ) : (
                              <div className="whitespace-pre-line">{p.kegiatanInti}</div>
                            )}
                          </td>
                        </tr>
                        {/* Penutup (Refleksi) */}
                        <tr className="border-b border-slate-200">
                          <td className="p-3 bg-slate-50 border-r border-slate-100 font-bold text-slate-800">
                            Refleksi (Kegiatan Penutup)<br />
                            <span className="text-[10px] text-slate-500 font-medium">(Berkesadaran, Bermakna, Menggembirakan)</span>
                          </td>
                          <td className="p-3 leading-relaxed">
                            {isEditingTable ? (
                              <textarea
                                id={`edit-kegiatan-penutup-${idx}`}
                                value={p.kegiatanPenutup}
                                onChange={(e) => {
                                  const updatedArr = [...generated.pengalamanBelajar];
                                  updatedArr[idx].kegiatanPenutup = e.target.value;
                                  setGenerated({ ...generated, pengalamanBelajar: updatedArr });
                                }}
                                className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                                rows={4}
                              />
                            ) : (
                              <div className="whitespace-pre-line">{p.kegiatanPenutup}</div>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABEL 5: ASESMEN PEMBELAJARAN */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">
                Tabel 5: Asesmen Pembelajaran
              </h3>
              <div className="overflow-x-auto rounded border border-slate-200 shadow-sm bg-white text-xs">
                <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 w-1/3 border-r border-slate-100">Asesmen Awal (Diagnostik/Apersepsi)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            id="edit-asesmen-awal"
                            value={generated.asesmenAwal}
                            onChange={(e) => setGenerated({ ...generated, asesmenAwal: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.asesmenAwal
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Asesmen Proses (Observasi, Rubrik, Diskusi)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            id="edit-asesmen-proses"
                            value={generated.asesmenProses}
                            onChange={(e) => setGenerated({ ...generated, asesmenProses: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.asesmenProses
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Asesmen Akhir (Produk, Tugas, Presentasi, Portofolio)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            id="edit-asesmen-akhir"
                            value={generated.asesmenAkhir}
                            onChange={(e) => setGenerated({ ...generated, asesmenAkhir: e.target.value })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.asesmenAkhir
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rubrik Penilaian Sub-tabel */}
              <div className="space-y-1 pt-2">
                <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Rubrik Penilaian Terstruktur</h4>
                <div className="overflow-x-auto rounded border border-slate-200 shadow-sm bg-white text-xs">
                  <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] text-slate-600 uppercase">
                        <th className="p-2 border-r border-slate-200 w-1/5">Kriteria</th>
                        <th className="p-2 border-r border-slate-200 w-1/5">Perlu Bimbingan</th>
                        <th className="p-2 border-r border-slate-200 w-1/5">Cukup</th>
                        <th className="p-2 border-r border-slate-200 w-1/5">Baik</th>
                        <th className="p-2 w-1/5">Sangat Baik</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(generated.asesmenRubrik || []).map((rubrik, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0">
                          <td className="p-2 bg-slate-50 border-r border-slate-200 font-bold">
                            {isEditingTable ? (
                              <input
                                type="text"
                                value={rubrik.kriteria}
                                onChange={(e) => {
                                  const updated = [...(generated.asesmenRubrik || [])];
                                  updated[idx].kriteria = e.target.value;
                                  setGenerated({ ...generated, asesmenRubrik: updated });
                                }}
                                className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                              />
                            ) : (
                              rubrik.kriteria
                            )}
                          </td>
                          <td className="p-2 border-r border-slate-100 leading-relaxed text-slate-600">
                            {isEditingTable ? (
                              <textarea
                                value={rubrik.perluBimbingan}
                                onChange={(e) => {
                                  const updated = [...(generated.asesmenRubrik || [])];
                                  updated[idx].perluBimbingan = e.target.value;
                                  setGenerated({ ...generated, asesmenRubrik: updated });
                                }}
                                className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                                rows={3}
                              />
                            ) : (
                              rubrik.perluBimbingan
                            )}
                          </td>
                          <td className="p-2 border-r border-slate-100 leading-relaxed text-slate-600">
                            {isEditingTable ? (
                              <textarea
                                value={rubrik.cukup}
                                onChange={(e) => {
                                  const updated = [...(generated.asesmenRubrik || [])];
                                  updated[idx].cukup = e.target.value;
                                  setGenerated({ ...generated, asesmenRubrik: updated });
                                }}
                                className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                                rows={3}
                              />
                            ) : (
                              rubrik.cukup
                            )}
                          </td>
                          <td className="p-2 border-r border-slate-100 leading-relaxed text-slate-600">
                            {isEditingTable ? (
                              <textarea
                                value={rubrik.baik}
                                onChange={(e) => {
                                  const updated = [...(generated.asesmenRubrik || [])];
                                  updated[idx].baik = e.target.value;
                                  setGenerated({ ...generated, asesmenRubrik: updated });
                                }}
                                className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                                rows={3}
                              />
                            ) : (
                              rubrik.baik
                            )}
                          </td>
                          <td className="p-2 leading-relaxed text-slate-600">
                            {isEditingTable ? (
                              <textarea
                                value={rubrik.sangatBaik}
                                onChange={(e) => {
                                  const updated = [...(generated.asesmenRubrik || [])];
                                  updated[idx].sangatBaik = e.target.value;
                                  setGenerated({ ...generated, asesmenRubrik: updated });
                                }}
                                className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                                rows={3}
                              />
                            ) : (
                              rubrik.sangatBaik
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* BAGIAN 6: PRINSIP PEMBELAJARAN DEEP LEARNING */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">
                6. Prinsip Pembelajaran Deep Learning
              </h3>
              <div className="overflow-x-auto rounded border border-slate-200 shadow-sm bg-white text-xs">
                <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 w-1/3 border-r border-slate-100">Berkesadaran (Mindful)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            value={generated.prinsipPembelajaran?.mindful || ""}
                            onChange={(e) => setGenerated({
                              ...generated,
                              prinsipPembelajaran: {
                                ...(generated.prinsipPembelajaran || { mindful: "", meaningful: "", joyful: "" }),
                                mindful: e.target.value
                              }
                            })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.prinsipPembelajaran?.mindful
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Bermakna (Meaningful)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            value={generated.prinsipPembelajaran?.meaningful || ""}
                            onChange={(e) => setGenerated({
                              ...generated,
                              prinsipPembelajaran: {
                                ...(generated.prinsipPembelajaran || { mindful: "", meaningful: "", joyful: "" }),
                                meaningful: e.target.value
                              }
                            })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.prinsipPembelajaran?.meaningful
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Menggembirakan (Joyful)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            value={generated.prinsipPembelajaran?.joyful || ""}
                            onChange={(e) => setGenerated({
                              ...generated,
                              prinsipPembelajaran: {
                                ...(generated.prinsipPembelajaran || { mindful: "", meaningful: "", joyful: "" }),
                                joyful: e.target.value
                              }
                            })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.prinsipPembelajaran?.joyful
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* BAGIAN 7: KERANGKA PEMBELAJARAN */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-l-4 border-indigo-600 pl-2">
                7. Kerangka Pembelajaran
              </h3>
              <div className="overflow-x-auto rounded border border-slate-200 shadow-sm bg-white text-xs">
                <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 w-1/3 border-r border-slate-100">Praktik Pedagogis (a)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            value={generated.kerangkaPembelajaran?.praktikPedagogik || ""}
                            onChange={(e) => setGenerated({
                              ...generated,
                              kerangkaPembelajaran: {
                                ...(generated.kerangkaPembelajaran || { praktikPedagogik: "", lingkunganPembelajaran: "", pemanfaatanDigital: "", kemitraanPembelajaran: "" }),
                                praktikPedagogik: e.target.value
                              }
                            })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.kerangkaPembelajaran?.praktikPedagogik
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Lingkungan Pembelajaran (b)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            value={generated.kerangkaPembelajaran?.lingkunganPembelajaran || ""}
                            onChange={(e) => setGenerated({
                              ...generated,
                              kerangkaPembelajaran: {
                                ...(generated.kerangkaPembelajaran || { praktikPedagogik: "", lingkunganPembelajaran: "", pemanfaatanDigital: "", kemitraanPembelajaran: "" }),
                                lingkunganPembelajaran: e.target.value
                              }
                            })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.kerangkaPembelajaran?.lingkunganPembelajaran
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Pemanfaatan Digital (c)</td>
                      <td className="p-3 leading-relaxed">
                        <div className="space-y-2">
                          {isEditingTable ? (
                            <textarea
                              value={generated.kerangkaPembelajaran?.pemanfaatanDigital || ""}
                              onChange={(e) => setGenerated({
                                ...generated,
                                kerangkaPembelajaran: {
                                  ...(generated.kerangkaPembelajaran || { praktikPedagogik: "", lingkunganPembelajaran: "", pemanfaatanDigital: "", kemitraanPembelajaran: "" }),
                                  pemanfaatanDigital: e.target.value
                                }
                              })}
                              className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                              rows={3}
                            />
                          ) : (
                            <div>{generated.kerangkaPembelajaran?.pemanfaatanDigital}</div>
                          )}
                          
                          {/* Youtube link */}
                          {generated.videoYoutubeRelevan && (
                            <div className="mt-2 p-2.5 bg-red-50 rounded border border-red-100 text-red-900 flex items-center gap-2">
                              <span className="font-bold">Rekomendasi Video YouTube:</span>
                              <a
                                href={generated.videoYoutubeRelevan}
                                target="_blank"
                                rel="referrer"
                                className="text-red-600 hover:underline font-bold inline-flex items-center gap-1"
                              >
                                {generated.videoYoutubeRelevan} ↗
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-50 border-r border-slate-100">Kemitraan Pembelajaran (d)</td>
                      <td className="p-3 leading-relaxed">
                        {isEditingTable ? (
                          <textarea
                            value={generated.kerangkaPembelajaran?.kemitraanPembelajaran || ""}
                            onChange={(e) => setGenerated({
                              ...generated,
                              kerangkaPembelajaran: {
                                ...(generated.kerangkaPembelajaran || { praktikPedagogik: "", lingkunganPembelajaran: "", pemanfaatanDigital: "", kemitraanPembelajaran: "" }),
                                kemitraanPembelajaran: e.target.value
                              }
                            })}
                            className="w-full p-1 bg-yellow-50 border border-yellow-300 rounded text-xs"
                            rows={3}
                          />
                        ) : (
                          generated.kerangkaPembelajaran?.kemitraanPembelajaran
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIGNATURES SECTION */}
            <div className="pt-12 grid grid-cols-2 gap-8 text-xs font-semibold text-slate-800">
              <div className="col-span-2 text-right text-slate-600 mb-4">
                {inputs.kabupaten}, {new Date(inputs.tanggalPelaksanaan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div className="space-y-12">
                <div>
                  <p>Mengetahui,</p>
                  <p>Kepala Satuan Pendidikan</p>
                  <p className="font-bold uppercase">{inputs.unitKerja}</p>
                </div>
                <div className="pt-8">
                  <p className="font-bold underline">Panji Amboro,S.Pd.,M.Pd</p>
                  <p className="text-[10px] text-slate-500">NIP: 198207172003121005</p>
                </div>
              </div>
              <div className="space-y-12 text-right">
                <div>
                  <p className="text-slate-500 opacity-0">Placeholder</p>
                  <p>Guru Kelas / Mata Pelajaran</p>
                  <p className="font-bold">{inputs.mapel}</p>
                </div>
                <div className="pt-8">
                  <p className="font-bold underline">{inputs.namaGuru}</p>
                  <p className="text-[10px] text-slate-500">NIP: {inputs.NIP}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
