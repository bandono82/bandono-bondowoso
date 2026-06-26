import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import ModulAjarView from "./components/ModulAjarView";
import SoalGenerator from "./components/SoalGenerator";
import LKPDGenerator from "./components/LKPDGenerator";
import HistoryList from "./components/HistoryList";
import { SavedItem } from "./types";
import { TEACHERS } from "./data";
import {
  LayoutDashboard, BookOpen, CheckSquare, FileText, History,
  LogOut, User, Award, ArrowRight, ShieldCheck, HeartPulse, GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<{ name: string; nip: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [historyItems, setHistoryItems] = useState<SavedItem[]>([]);
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);

  const loadHistory = async () => {
    try {
      const response = await fetch("/api/modul");
      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          setHistoryItems(data);
        } catch (jsonErr) {
          console.warn("Respons dari server bukan JSON yang valid. Kemungkinan server belum siap atau mengembalikan HTML:", jsonErr);
        }
      }
    } catch (err) {
      console.error("Gagal memuat riwayat:", err);
    }
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem("teacher_session");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    loadHistory();
  }, []);

  const handleLoginSuccess = (name: string, nip: string, role: string) => {
    const userData = { name, nip, role };
    setUser(userData);
    sessionStorage.setItem("teacher_session", JSON.stringify(userData));
    loadHistory();
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("teacher_session");
    setActiveTab("dashboard");
    setEditingItem(null);
  };

  const handleSaveItem = async (inputs: any, data: any) => {
    let type: "modul" | "soal" | "lkpd" = "modul";
    if (activeTab === "soal-ai") type = "soal";
    else if (activeTab === "lkpd-ai") type = "lkpd";

    const payload = {
      id: editingItem ? editingItem.id : "item_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      type,
      inputs,
      data,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch("/api/modul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await loadHistory();
        setEditingItem(null);
        setActiveTab("riwayat");
      }
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus arsip data ini secara permanen?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/modul/${id}`, { method: "DELETE" });
      if (response.ok) {
        setHistoryItems(historyItems.filter((item) => item.id !== id));
        if (editingItem && editingItem.id === id) {
          setEditingItem(null);
        }
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleLoadItemToEdit = (item: SavedItem) => {
    setEditingItem(item);
    if (item.type === "modul") setActiveTab("modul-ajar");
    else if (item.type === "soal") setActiveTab("soal-ai");
    else if (item.type === "lkpd") setActiveTab("lkpd-ai");
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 print:hidden shadow-sm relative z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-lg uppercase tracking-wider">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-sm font-black">DL</div>
            <span className="text-slate-800 font-black text-sm tracking-tight hidden sm:inline">EduModul AI</span>
          </div>
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            TERSYNC
          </span>
        </div>

        {/* Quick tab switch (Top menu bar) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="top-nav-dashboard"
              onClick={() => { setActiveTab("dashboard"); setEditingItem(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "dashboard" ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutDashboard size={12} />
              <span>DASHBOARD</span>
            </button>
            <button
              id="top-nav-modul"
              onClick={() => { setActiveTab("modul-ajar"); setEditingItem(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "modul-ajar" ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen size={12} />
              <span>MODUL AJAR</span>
            </button>
            <button
              id="top-nav-soal"
              onClick={() => { setActiveTab("soal-ai"); setEditingItem(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "soal-ai" ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <CheckSquare size={12} />
              <span>SOAL LATIHAN</span>
            </button>
            <button
              id="top-nav-lkpd"
              onClick={() => { setActiveTab("lkpd-ai"); setEditingItem(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "lkpd-ai" ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText size={12} />
              <span>LKPD AI</span>
            </button>
            <button
              id="top-nav-riwayat"
              onClick={() => { setActiveTab("riwayat"); setEditingItem(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "riwayat" ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <History size={12} />
              <span>RIWAYAT ({historyItems.length})</span>
            </button>
          </div>

          {/* User logout */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-right">
              <span className="text-xs font-bold text-slate-700 block leading-tight">{user.name}</span>
              <span className="text-[9px] font-bold text-slate-400 block leading-none">{user.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition cursor-pointer border border-slate-200"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Width workspace layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 md:px-8 py-8 gap-8">
        
        {/* Sidebar Menu */}
        <aside className="hidden lg:block w-64 space-y-4 shrink-0 print:hidden">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm space-y-1">
            <div className="text-[10px] uppercase text-slate-500 font-bold px-3 pb-2 tracking-wider">Menu Utama</div>
            
            <button
              onClick={() => { setActiveTab("dashboard"); setEditingItem(null); }}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutDashboard size={14} className="text-indigo-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab("modul-ajar"); setEditingItem(null); }}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === "modul-ajar"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <BookOpen size={14} className="text-indigo-400" />
              <span>Modul Ajar</span>
            </button>

            <button
              onClick={() => { setActiveTab("soal-ai"); setEditingItem(null); }}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === "soal-ai"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <CheckSquare size={14} className="text-indigo-400" />
              <span>Soal Latihan</span>
            </button>

            <button
              onClick={() => { setActiveTab("lkpd-ai"); setEditingItem(null); }}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === "lkpd-ai"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FileText size={14} className="text-indigo-400" />
              <span>LKPD AI</span>
            </button>

            <button
              onClick={() => { setActiveTab("riwayat"); setEditingItem(null); }}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === "riwayat"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <History size={14} className="text-indigo-400" />
              <span>Riwayat Sinkron</span>
            </button>
          </div>

          {/* Connected User Badge */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-800 text-indigo-400 flex items-center justify-center font-bold text-xs">
                <User size={16} />
              </div>
              <div className="truncate">
                <p className="text-xs text-slate-200 font-semibold leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 truncate">{user.role}</p>
              </div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded border border-slate-800 text-[10px] space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status Server</span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  ONLINE
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Arsip Lokal</span>
                <span className="text-slate-200 font-bold">{historyItems.length} File</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic content wrapper */}
        <main className="flex-1 space-y-6">
          
          {/* Top navigation tabs bar for mobile / tablets */}
          <div className="flex lg:hidden overflow-x-auto gap-2 bg-white p-2 border border-slate-200 rounded-xl print:hidden shadow-sm">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs shrink-0 cursor-pointer ${
                activeTab === "dashboard" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("modul-ajar")}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs shrink-0 cursor-pointer ${
                activeTab === "modul-ajar" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Modul Ajar
            </button>
            <button
              onClick={() => setActiveTab("soal-ai")}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs shrink-0 cursor-pointer ${
                activeTab === "soal-ai" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Soal Latihan AI
            </button>
            <button
              onClick={() => setActiveTab("lkpd-ai")}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs shrink-0 cursor-pointer ${
                activeTab === "lkpd-ai" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              LKPD AI
            </button>
            <button
              onClick={() => setActiveTab("riwayat")}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs shrink-0 cursor-pointer ${
                activeTab === "riwayat" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Riwayat ({historyItems.length})
            </button>
          </div>

          {/* Morphing Page Container with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (editingItem?.id || "new")}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* DASHBOARD TAB */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Greeting Hero Header */}
                  <div className="bg-slate-900 rounded-lg p-5 text-white relative overflow-hidden shadow-sm border border-slate-800">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent opacity-80" />
                    <div className="relative z-10 max-w-xl space-y-2">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-bold tracking-wider uppercase border border-indigo-500/30">
                        Selamat Datang
                      </span>
                      <h2 className="text-xl font-bold uppercase tracking-tight leading-tight">
                        Halo, Rekan {user.name}!
                      </h2>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Mari mudahkan penyusunan Rencana Ajar, Soal Evaluasi, dan LKPD secara otomatis, terpersonalisasi, dan selaras dengan metode pembelajaran mendalam (Deep Learning).
                      </p>
                    </div>
                  </div>

                  {/* Dynamic stats cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Modul Card */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="p-2 bg-indigo-50 text-indigo-600 rounded"><BookOpen size={16} /></span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Modul Ajar</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Rencana Ajar</h4>
                          <p className="text-xs text-slate-500 mt-1">Sesuaikan CP, TP, dan langkah-langkah pedagogis per pertemuan.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("modul-ajar")}
                        className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded shadow-sm transition mt-4 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Buat Sekarang</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    {/* Soal Card */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="p-2 bg-indigo-50 text-indigo-600 rounded"><CheckSquare size={16} /></span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Asesmen AI</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Soal Evaluasi</h4>
                          <p className="text-xs text-slate-500 mt-1">Buat PG, Isian, Menjodohkan, maupun Essay berbasis Bloom.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("soal-ai")}
                        className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded shadow-sm transition mt-4 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Buat Sekarang</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    {/* LKPD Card */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="p-2 bg-indigo-50 text-indigo-600 rounded"><FileText size={16} /></span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Interaktif</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Lembar Kerja (LKPD)</h4>
                          <p className="text-xs text-slate-500 mt-1">Sajikan worksheet interaktif terpersonalisasi untuk murid.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("lkpd-ai")}
                        className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded shadow-sm transition mt-4 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Buat Sekarang</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Informational Guidelines Card */}
                  <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-tight text-slate-500 border-b border-slate-100 pb-2">
                      Fitur Unggulan Deep Learning UPTD SPF SDN Gayam Kidul 2
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1.5 p-3.5 bg-slate-50 rounded border border-slate-100">
                        <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded inline-block"><GraduationCap size={14} /></span>
                        <p className="font-bold text-slate-800 uppercase tracking-tight text-[11px]">Personalisasi Cerdas</p>
                        <p className="text-slate-500 font-medium">Asesmen, CP, dan materi disesuaikan dengan kebutuhan belajar individu tiap siswa.</p>
                      </div>
                      <div className="space-y-1.5 p-3.5 bg-slate-50 rounded border border-slate-100">
                        <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded inline-block"><ShieldCheck size={14} /></span>
                        <p className="font-bold text-slate-800 uppercase tracking-tight text-[11px]">Sinkronisasi Cloud</p>
                        <p className="text-slate-500 font-medium">Arsip tersinkron otomatis menggunakan API server cerdas di berbagai gawai.</p>
                      </div>
                      <div className="space-y-1.5 p-3.5 bg-slate-50 rounded border border-slate-100">
                        <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded inline-block"><HeartPulse size={14} /></span>
                        <p className="font-bold text-slate-800 uppercase tracking-tight text-[11px]">Ekspor Word & PDF</p>
                        <p className="text-slate-500 font-medium">Download langsung file Rencana Ajar format F4 dan LKPD berukuran A4.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODUL AJAR TAB */}
              {activeTab === "modul-ajar" && (
                <ModulAjarView
                  initialTeacherName={user.name}
                  initialTeacherNip={user.nip}
                  onSave={handleSaveItem}
                  editData={editingItem}
                />
              )}

              {/* SOAL GENERATOR TAB */}
              {activeTab === "soal-ai" && (
                <SoalGenerator
                  onSave={handleSaveItem}
                  editData={editingItem}
                  latestModul={
                    [...historyItems]
                      .filter((item) => item.type === "modul")
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] || null
                  }
                />
              )}

              {/* LKPD GENERATOR TAB */}
              {activeTab === "lkpd-ai" && (
                <LKPDGenerator
                  onSave={handleSaveItem}
                  editData={editingItem}
                  latestModul={
                    [...historyItems]
                      .filter((item) => item.type === "modul")
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] || null
                  }
                />
              )}

              {/* RIWAYAT / ARCHIVE TAB */}
              {activeTab === "riwayat" && (
                <HistoryList
                  items={historyItems}
                  onLoad={handleLoadItemToEdit}
                  onDelete={handleDeleteItem}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Stats Bar */}
      <footer className="h-10 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between px-6 shrink-0 py-2 sm:py-0 gap-1 print:hidden text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span> Sesuai Kurikulum Merdeka</div>
          <div className="hidden sm:block text-slate-400">|</div>
          <div>ID Sesi: DL-2026-ACTIVE</div>
        </div>
        <div className="text-slate-600 font-semibold">
          Pengembang: <span className="text-indigo-600">Panji Amboro, S.Pd., M.Pd</span>
        </div>
        <div className="text-slate-400">
          © 2026 UPTD SPF SDN Gayam Kidul 2
        </div>
      </footer>
    </div>
  );
}
