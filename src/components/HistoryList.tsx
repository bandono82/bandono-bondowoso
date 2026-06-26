import React from "react";
import { SavedItem } from "../types";
import { BookOpen, HelpCircle, FileText, Trash2, Edit, Printer, Clock, FileDown } from "lucide-react";

interface HistoryListProps {
  items: SavedItem[];
  onLoad: (item: SavedItem) => void;
  onDelete: (id: string) => void;
}

export default function HistoryList({ items, onLoad, onDelete }: HistoryListProps) {
  const getIcon = (type: "modul" | "soal" | "lkpd") => {
    if (type === "modul") {
      return (
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <BookOpen size={16} />
        </div>
      );
    }
    if (type === "soal") {
      return (
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <HelpCircle size={16} />
        </div>
      );
    }
    return (
      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
        <FileText size={16} />
      </div>
    );
  };

  const getBadge = (type: "modul" | "soal" | "lkpd") => {
    if (type === "modul") {
      return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-bold rounded uppercase">Modul Ajar</span>;
    }
    if (type === "soal") {
      return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-bold rounded uppercase">Soal Latihan</span>;
    }
    return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold rounded uppercase">LKPD</span>;
  };

  const getTitle = (item: SavedItem) => {
    const { inputs } = item;
    if (item.type === "modul") {
      return inputs.materiPokok || `Modul ${inputs.mapel}`;
    }
    if (item.type === "soal") {
      return inputs.materi || `Asesmen ${inputs.mapel}`;
    }
    return inputs.topik || `Aktivitas ${inputs.mapel}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-800">Riwayat & Penyimpanan Sinkron</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Arsip Pembelajaran di UPTD SPF SDN Gayam Kidul 2</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <FileDown size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-500">Belum ada riwayat penyusunan</p>
          <p className="text-[10px] text-slate-400 mt-1">Gunakan formulir di tab lain untuk membuat Rencana Ajar, Soal Evaluasi, atau LKPD pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/50 rounded-lg p-4 border border-slate-200 hover:border-indigo-300 transition flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  {getIcon(item.type)}
                  {getBadge(item.type)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                    {getTitle(item)}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 truncate">
                    {item.inputs.mapel} (Kelas {item.inputs.kelas?.replace(/Fase\s+[A-C]\s+\/\s+Kelas\s+/i, "") || item.inputs.kelas})
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                  <Clock size={10} />
                  <span>{new Date(item.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => onLoad(item)}
                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded transition cursor-pointer"
                    title="Edit / Load"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition cursor-pointer"
                    title="Hapus permanen"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
