export interface Teacher {
  nip: string;
  name: string;
  role: string;
}

export interface ClassOption {
  value: string;
  fase: string;
  kelas: string;
}

export interface CapaianPembelajaran {
  fase: string;
  elemen: string;
  deskripsi: string;
}

export interface TujuanPembelajaran {
  kelas: string;
  semester: string;
  mapel: string;
  tujuan: string[];
}

export interface ModulInputState {
  namaGuru: string;
  NIP: string;
  role: string;
  unitKerja: string;
  kelas: string;
  mapel: string;
  tahunPelajaran: string;
  semester: string;
  pertemuan: string;
  durasi: string;
  materiPokok: string;
  tanggalPelaksanaan: string;
  pedagogi: string;
  dimensi: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  kabupaten: string;
}

export interface GeneratedModul {
  lintasDisiplin: string;
  topikPembelajaran: string;
  kemitraanPembelajaran: string;
  lingkunganPembelajaran: string;
  pemanfaatanDigital: string;
  videoYoutubeRelevan?: string;
  pengalamanBelajar: {
    pertemuan: string;
    kegiatanAwal: string;
    kegiatanInti: string;
    kegiatanPenutup: string;
  }[];
  asesmenAwal: string;
  asesmenProses: string;
  asesmenAkhir: string;
  asesmenRubrik?: {
    kriteria: string;
    perluBimbingan: string;
    cukup: string;
    baik: string;
    sangatBaik: string;
  }[];
  prinsipPembelajaran?: {
    mindful: string;
    meaningful: string;
    joyful: string;
  };
  kerangkaPembelajaran?: {
    praktikPedagogik: string;
    lingkunganPembelajaran: string;
    pemanfaatanDigital: string;
    kemitraanPembelajaran: string;
  };
}

export interface SavedItem {
  id: string;
  type: "modul" | "soal" | "lkpd";
  timestamp: string;
  inputs: any;
  data: any;
}
