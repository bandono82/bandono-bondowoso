import React, { useState } from "react";
import { TEACHERS } from "../data";
import { LogIn, User, Lock, Award } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  onLoginSuccess: (name: string, nip: string, role: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState<string>("custom");
  const [customName, setCustomName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let finalName = "";
    let finalNip = "";
    let finalRole = "";

    if (selectedTeacherIndex === "custom") {
      if (!customName.trim()) {
        setError("Silakan masukkan nama lengkap Anda");
        setLoading(false);
        return;
      }
      finalName = customName;
      finalNip = "Manual Input";
      finalRole = "Guru / Pengajar";
    } else {
      const idx = parseInt(selectedTeacherIndex, 10);
      finalName = TEACHERS[idx].name;
      finalNip = TEACHERS[idx].nip;
      finalRole = TEACHERS[idx].role;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: finalName, password }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(finalName, finalNip, finalRole);
      } else {
        setError(data.message || "Password salah!");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server. Hubungi administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
      {/* Deep blue/slate gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 opacity-100" />
      
      {/* Decorative indigo glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-800 rounded-full blur-3xl opacity-10 animate-pulse" />
 
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl border border-slate-200"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-lg shadow-sm mb-3">
            <Award size={28} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight uppercase">
            Aplikasi Modul Ajar<br />
            <span className="text-indigo-600">
              Deep Learning
            </span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
            UPTD SPF SDN Gayam Kidul 2
          </p>
        </div>
 
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guru Dropdown / Manual */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Pilih / Input Nama Guru
            </label>
            <div className="relative">
              <select
                id="login-teacher-select"
                value={selectedTeacherIndex}
                onChange={(e) => {
                  setSelectedTeacherIndex(e.target.value);
                  setError("");
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 font-medium text-xs transition"
              >
                <option value="custom">-- Input Nama Baru Manual --</option>
                {TEACHERS.map((teacher, index) => (
                  <option key={teacher.nip} value={index}>
                    {teacher.name} ({teacher.role})
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-2.5 text-slate-400">
                <User size={14} />
              </div>
            </div>
          </div>
 
          {/* Manual Name Field if selected "custom" */}
          {selectedTeacherIndex === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1"
            >
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nama Lengkap & Gelar Guru
              </label>
              <input
                id="login-custom-name"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Contoh: Panji Amboro, S.Pd., M.Pd"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-xs transition font-medium"
              />
            </motion.div>
          )}
 
          {/* Password field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-xs transition font-medium"
              />
              <div className="absolute left-3 top-2.5 text-slate-400">
                <Lock size={14} />
              </div>
            </div>
            <p className="text-[9px] text-slate-400">Petunjuk: Gunakan sandi default "123456"</p>
          </div>
 
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded animate-shake">
              {error}
            </div>
          )}
 
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded shadow transition flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={14} />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>
 
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Aplikasi dikembangkan oleh :{" "}
            <span className="text-indigo-600 font-bold block mt-0.5">
              Panji Amboro, S.Pd., M.Pd
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
