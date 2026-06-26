import { Teacher, CapaianPembelajaran, ClassOption } from "./types";

export const TEACHERS: Teacher[] = [
  { nip: "197611272006042018", name: "MUZAINI,S.Pd", role: "Guru Kelas" },
  { nip: "199410132020122010", name: "NURMA TRYA OKTAVIANING SARI, S.Pd.", role: "Guru Kelas" },
  { nip: "197912102021211005", name: "HARI TRIYANTO,S.Pd", role: "Guru Kelas" },
  { nip: "198610102022212025", name: "FENI SUKARSIH,S.Pd", role: "Guru Kelas" },
  { nip: "199005072022211010", name: "HARIS SOFYAN FADILLAH,S.Pd", role: "Guru PJOK" },
  { nip: "198512072022212029", name: "LIKA CANDRAWATI,S.Pd", role: "Guru Kelas" },
  { nip: "198507102023212040", name: "SITI QOMARIAH,S.Pd", role: "Guru Kelas" },
  { nip: "199112102023212029", name: "ROMZA IMANIAH,S.Pd", role: "Guru Kelas" },
  { nip: "199311012023211011", name: "AHMAD TAUFIQ DAHLAN,S.Pd", role: "Guru PJOK" },
  { nip: "198507152023211015", name: "HASAN BASRI,S.PD.I", role: "Guru PAI, BTQ" }
];

export const CLASSES: ClassOption[] = [
  { value: "Fase A / Kelas 1", fase: "A", kelas: "1" },
  { value: "Fase A / Kelas 2", fase: "A", kelas: "2" },
  { value: "Fase B / Kelas 3", fase: "B", kelas: "3" },
  { value: "Fase B / Kelas 4", fase: "B", kelas: "4" },
  { value: "Fase C / Kelas 5", fase: "C", kelas: "5" },
  { value: "Fase C / Kelas 6", fase: "C", kelas: "6" }
];

export const ALL_SUBJECTS = [
  "Pendidikan Agama Islam dan Budi Pekerti",
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Matematika",
  "IPAS",
  "Seni Rupa",
  "Seni Musik",
  "Seni Tari",
  "Seni Teater",
  "PJOK",
  "Bahasa Inggris",
  "Bahasa Madura",
  "Baca Tulis Al-Quran"
];

export const YEARS = ["2026/2027", "2027/2028"];
export const SEMESTERS = ["Semester 1", "Semester 2"];

export const PERTEMUAN_LIST = Array.from({ length: 20 }, (_, i) => `Pertemuan ${i + 1}`);

export const DURASI_LIST = [
  "2 × 35 menit",
  "3 × 35 menit",
  "4 × 35 menit",
  "5 × 35 menit"
];

export const PEDAGOGI_LIST = [
  "Inkuiri-Discovery",
  "PjBL",
  "Problem Solving",
  "Game Based Learning",
  "Station Learning"
];

export const DIMENSI_LIST = [
  "Keimanan & Ketakwaan",
  "Kewargaan",
  "Penalaran Kritis",
  "Kreativitas",
  "Kolaborasi",
  "Kemandirian",
  "Kesehatan",
  "Komunikasi"
];

// Capaian Pembelajaran map by Subject + Fase
export const CAPAIAN_PEMBELAJARAN: Record<string, Record<string, string>> = {
  "Pendidikan Agama Islam dan Budi Pekerti": {
    "A": "Elemen Al-Qur'an Hadis: Membaca dan membedakan huruf hijaiah berharakat, huruf hijaiah bersambung; menghafal Surah al-Fatihah, beberapa surah pendek Al-Qur'an, dan hadis tentang kebersihan. Elemen Akidah: Menjelaskan dan meyakini rukun iman, iman kepada Allah Swt., beberapa asmaulhusna, dan iman kepada malaikat. Elemen Akhlak: Menerapkan akhlak terhadap Allah Swt. dengan menyucikan dan memuji-Nya, dan akhlak terhadap diri sendiri. Elemen Fikih: Menerapkan rukun Islam, syahadatain, tata cara bersuci, salat fardu, zikir dan berdoa setelah salat. Elemen Sejarah Peradaban Islam: Menceritakan kisah keteladanan beberapa nabi dan rasul.",
    "B": "Elemen Al-Qur'an Hadis: Membaca, menulis, dan membedakan huruf hijaiah bersambung; menghafal dan menjelaskan beberapa surah pendek, hadis tentang kewajiban salat dan menjaga hubungan baik dengan sesama. Elemen Akidah: Menjelaskan dan meyakini sifat-sifat Allah Swt., iman kepada kitab-kitab Allah Swt., beberapa asmaulhusna, dan iman kepada rasul-rasul Allah Swt. Elemen Akhlak: Menerapkan akhlak terhadap Allah Swt. dengan berbaik sangka kepada-Nya, akhlak terhadap orang tua, keluarga, dan guru. Elemen Fikih: Menerapkan azan dan ikamah, salat jumat dan salat sunah; menjelaskan balig dan tanggung jawab yang menyertainya (taklif). Elemen Sejarah Peradaban Islam: Menceritakan dan menjelaskan kisah Nabi Muhammad saw. sebelum dan sesudah menjadi rasul periode Makkah.",
    "C": "Elemen Al-Qur'an Hadis: Membaca, menulis, dan membedakan huruf hijaiah bersambung; menjelaskan beberapa surah pendek dan hadis tentang berbuat baik kepada orang tua, guru, dan teman. Elemen Akidah: Menjelaskan dan meyakini beberapa asmaulhusna, iman kepada hari akhir, iman kepada qada' dan qadar. Elemen Akhlak: Menerapkan akhlak terhadap Allah Swt. dengan berdoa dan bertawakal kepada-Nya, akhlak terhadap teman, tetangga, non-muslim, hewan, dan tumbuhan. Elemen Fikih: Menerapkan puasa wajib dan sunah, makanan minuman yang halal dan haram, zakat, infak, sedekah, dan wakaf. Elemen Sejarah Peradaban Islam: Menceritakan dan menjelaskan kisah Nabi Muhammad saw. periode Madinah dan khulafaurasyidin."
  },
  "Pendidikan Pancasila": {
    "A": "Murid mengenali simbol sila-sila Pancasila dan menerima identitas diri sebagai anak Indonesia. Murid mengidentifikasi dan mematuhi aturan di lingkungan rumah serta sekolah, serta mampu menyebutkan identitas diri, keluarga, dan teman.",
    "B": "Murid mengidentifikasi makna sila-sila Pancasila dan penerapannya dalam kehidupan sehari-hari, serta mengenal karakter para perumus Pancasila. Murid melaksanakan aturan di sekolah, mengidentifikasi hak dan kewajiban, serta menghargai keberagaman suku bangsa, sosial budaya, dan tradisi di lingkungan sekitar.",
    "C": "Murid memahami sejarah kelahiran Pancasila, kedudukan Pancasila sebagai dasar negara, pandangan hidup, dan ideologi negara. Murid mempraktikkan norma dan konstitusi, menyelaraskan hak-kewajiban, serta menjaga persatuan-kesatuan dalam bingkai Bhinneka Tunggal Ika di tingkat kabupaten/kota atau provinsi."
  },
  "Bahasa Indonesia": {
    "A": "Murid memiliki kemampuan berbahasa untuk berkomunikasi sesuai tujuan. Murid mampu menyimak instruksi lisan, membaca kata-kata fungsional, berbicara dengan volume yang tepat, serta menulis huruf atau kata sederhana secara mandiri.",
    "B": "Murid mampu memahami informasi dari berbagai teks, menyampaikan gagasan secara lisan dengan gestur yang sesuai, serta menulis teks narasi/deskripsi sederhana dengan rangkaian kalimat yang beragam menggunakan kosakata baru yang tepat.",
    "C": "Murid mampu menganalisis informasi dari berbagai sumber media secara kritis. Murid terampil mempresentasikan ide secara logis, berdiskusi secara aktif, dan menulis berbagai tipe teks (argumentasi/eksposisi) dengan kaidah kebahasaan baku."
  },
  "Matematika": {
    "A": "Murid memahami dan memiliki intuisi bilangan cacah sampai 100. Murid melakukan operasi penjumlahan dan pengurangan, mengenal pola gambar/objek sederhana, serta mengukur dan membandingkan besaran panjang dan berat menggunakan satuan tidak baku.",
    "B": "Murid menguasai intuisi bilangan cacah sampai 10.000, pecahan dengan pembilang satu atau penyebut sama. Murid melakukan operasi hitung (+, -, x, :) sampai 1.000, mengenal kelipatan/faktor, serta mendeskripsikan ciri-ciri bangun datar dan ruang.",
    "C": "Murid menguasai operasi bilangan cacah sampai 1.000.000, pecahan senilai, desimal, dan persen. Murid mampu menyelesaikan masalah rasio, skala, menghitung luas dan volume bangun ruang, serta mengolah data dalam bentuk tabel maupun grafik."
  },
  "IPAS": {
    "A": "Struktur IPAS pada Fase A diintegrasikan secara tematis/luwes pada mata pelajaran lain seperti Bahasa Indonesia.",
    "B": "Murid menganalisis hubungan bentuk dan fungsi tubuh makhluk hidup, siklus hidup, wujud zat, serta gaya dan energi. Murid juga mengidentifikasi ragam bentang alam, sejarah lokal, aktivitas ekonomi, dan struktur sosial-budaya di lingkungan sekitar.",
    "C": "Murid menganalisis sistem organ tubuh manusia, ekosistem, transfer energi, sifat cahaya dan bunyi. Murid memahami letak geografis Indonesia, sejarah perjuangan kemerdekaan, serta peran Indonesia dalam kancah dunia dan pelestarian alam."
  },
  "Bahasa Inggris": {
    "A": "Menggunakan kosakata lisan sederhana dalam berinteraksi di lingkungan kelas dan sekolah.",
    "B": "Murid memahami teks lisan dan visual pendek bertema lingkungan rumah dan sekolah. Murid berinteraksi secara lisan menggunakan kalimat berpola sederhana untuk menyampaikan keinginan, kegemaran, serta membaca nyaring teks pendek.",
    "C": "Murid memahami dan merespons teks lisan, tulisan, dan visual yang lebih kompleks. Murid mampu bertukar informasi secara lisan dan tertulis mengenai topik familiar, serta menyusun teks deskriptif pendek dengan struktur kalimat yang runtut."
  },
  "Seni Rupa": {
    "A": "Murid mengamati, mengenali, dan menguji coba unsur-unsur dasar seni rupa (warna, garis, bidang).",
    "B": "Murid mengidentifikasi dan menerapkan prinsip seni rupa yang lebih terstruktur (pola, kombinasi warna, keseimbangan).",
    "C": "Murid menganalisis unsur dan prinsip seni rupa secara kritis serta menciptakan karya dengan orisinalitas imajinasi."
  },
  "Seni Musik": {
    "A": "Murid mengenal unsur dasar musik seperti nada, tempo, dinamika sederhana, dan ketukan tubuh.",
    "B": "Murid mengidentifikasi ritme, melodi terstruktur, dan bernyanyi dengan intonasi yang baik.",
    "C": "Murid menciptakan komposisi musik sederhana, memahami tempo, birama, dan alat musik tradisional."
  },
  "Seni Tari": {
    "A": "Murid melakukan gerakan tubuh imitatif, ritmis, dan merespons musik sederhana.",
    "B": "Murid mengidentifikasi gerak tari terstruktur, koordinasi tubuh, dan pola lantai dasar.",
    "C": "Murid merancang karya tari kelompok kreatif dengan memperhatikan unsur artistik tradisional."
  },
  "Seni Teater": {
    "A": "Murid memerankan ekspresi wajah, emosi sederhana, dan berinteraksi secara fisik tanpa suara.",
    "B": "Murid menyusun naskah pendek imajinatif dan memerankannya dalam kelompok kecil.",
    "C": "Murid menganalisis watak karakter tokoh secara kritis dan melakonkannya di panggung."
  },
  "PJOK": {
    "A": "Murid mempraktikkan keterampilan gerak dasar fundamental (lokomotor, non-lokomotor, manipulatif) secara mandiri. Murid mengenal bagian-bagian tubuh, pentingnya menjaga kebersihan diri, serta menunjukkan perilaku tertib saat beraktivitas jasmani.",
    "B": "Murid menerapkan variasi dan kombinasi gerak dasar dalam berbagai permainan dan olahraga tradisional/modifikasi. Murid menerapkan strategi gerak sederhana, konsep kebugaran jasmani, serta menumbuhkan sikap fair play dalam kelompok atau tim.",
    "C": "Murid mempraktikkan variasi dan kombinasi gerak spesifik olahraga dengan teknik yang lebih stabil. Murid mengukur komponen kebugaran jasmani pribadi, memahami pemeliharaan kesehatan reproduksi, serta berkontribusi positif dalam kerja sama tim."
  },
  "Bahasa Madura": {
    "A": "Mampu menyimak, membaca, berbicara, dan menulis teks sederhana tentang diri dan lingkungan menggunakan ondhaggha bhasa Madhura yang santun.",
    "B": "Mampu memahami ide pokok teks, menceritakan kembali cerita fiksi, serta menulis teks deskripsi/prosedur yang kaya kosakata.",
    "C": "Mampu menganalisis lalonget (parebhasan, ebharat, saloka), melagukan tembang macapat (Pucung, Gambuh, Kinanthi), serta membaca-menulis aksara carakan Madhura."
  },
  "Baca Tulis Al-Quran": {
    "A": "Peserta didik mampu mengenal, melafalkan, dan menulis huruf hijaiyah tunggal maupun bersambung dasar berharakat fathah, kasrah, dhummah, tanwin, sukun, dan tasydid.",
    "B": "Peserta didik mampu membaca dan menulis rangkaian ayat Al-Qur'an dengan hukum bacaan mad dasar (Mad Thabi'i) serta menganalisis hukum Nun Sukun/Tanwin (Idzhar, Idgham, Iqlab, Ikhfa) dan Mim Sukun.",
    "C": "Peserta didik mampu menguasai hukum bacaan tajwid lanjutan (Ghunnah, Mad Far'i, Alif Lam) serta membaca Al-Qur'an secara mutqin dan tartil dengan mematuhi rambu-rambu Waqaf dan Wasal."
  }
};

// We will export a giant object holding TP (Tujuan Pembelajaran) map
export const TUJUAN_PEMBELAJARAN_MAP: Record<string, Record<string, Record<string, string[]>>> = {
  "1": {
    "Semester 1": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu membaca dan membedakan huruf hijaiah berharakat secara mandiri dan benar.(Al-Qur'an Hadis)",
        "Murid mampu menghafal Surah al-Fatihah dengan lancar dan tartil.(Al-Qur'an Hadis)",
        "Murid mampu menjelaskan dan meyakini rukun iman serta iman kepada Allah SWT. (Akidah)",
        "Murid mampu menerapkan akhlak mulia terhadap diri sendiri dalam kehidupan sehari-hari.(Akhlak)",
        "Murid mampu menyebutkan dan menerapkan rukun Islam serta melafalkan syahadatain. (Fikih)"
      ],
      "Pendidikan Pancasila": [
        "Murid dapat menerangkan simbol bendera negara dengan benar.",
        "Murid dapat menafsirkan isi teks lagu Indonesia Raya dengan benar",
        "Murid dapat menjelaskan bunyi Pancasila dengan benar",
        "Murid dapat mengaitkan gambar simbol Garuda Pancasila dengan bunyi sila Pancasila dengan benar.",
        "Murid dapat mengemukakan sila Pancasila secara runtut maupun secara acak dengan lancar.",
        "Murid dapat menerapkan nilai-nilai Pancasila dalam kehidupan sehari – hari dengan baik.",
        "Murid dapat menjelaskan dampak jika melanggar sila Pancasila.",
        "Murid dapat menelaah para perumus Pancasila dengan benar.",
        "Murid dapat mengidentifikasi aturan yang ada di lingkungan keluarga dan sekolah dengan benar.",
        "Murid mampu melaksanakan aturan yang ada di lingkungan keluarga dan sekolah dengan baik",
        "Murid dapat menghargai perbedaan aturan yang ada di lingkungan keluarga dengan baik.",
        "Murid dapat menceritakan contoh sikap mematuhi aturan yang berlaku di lingkungan keluarga"
      ],
      "Bahasa Indonesia": [
        "Murid dapat menyimpulkan cerita yang dibacakan guru",
        "Murid dapat menjelaskan pertanyaan terkait cerita yang dibacakan baik secara lisan maupun tulis.",
        "Murid dapat menyimpulkan informasi dari media audio, teks aural, maupun percakapan dan menceritakan kembali simpulannya,",
        "Murid dapat membedakan bentuk dan bunyi abjad dengan tepat.",
        "Murid dapat membedakan suku kata yang diawali dengan huruf tertentu.",
        "Murid dapat menyimpulkan dan merefleksi suasana dan peristiwa pada gambar.",
        "Murid dapat menyusun kata-kata yang sering ditemui sehari-hari dengan baik.",
        "Murid dapat meninjau dan menulis ulang perbedaan bentuk huruf kapital dan huruf kecil dengan tepat."
      ],
      "Matematika": [
        "Murid dapat membaca dan menulis bilangan cacah sampai 100.",
        "Murid dapat menentukan nilai tempat bilangan cacah sampai 100",
        "Murid dapat membandingkan dan mengurutkan bilangan cacah sampai 100",
        "Murid dapat melakukan komposisi (menyusun) bilangan cacah sampai 100",
        "Murid dapat melakukan dekomposisi (mengurai)bilangan. bilangan cacah sampai 100",
        "Murid dapat melakukan operasi penjumlahan dan pengurangan menggunakan benda-benda konkret yang banyaknya sampai 20."
      ],
      "Seni Rupa": [
        "Murid dapat menyebutkan minimal 3 jenis garis (lurus, lengkung, zigzag) pada benda sekitar.",
        "Murid dapat membedakan 3 warna primer melalui kegiatan memilah media pewarna.",
        "Murid dapat menggoreskan garis pembentuk bidang objek secara mandiri.",
        "Murid dapat mewarnai gambar dengan warna primer tanpa keluar garis tepi secara rapi."
      ],
      "Seni Musik": [
        "Murid dapat menirukan bunyi internal tubuh (tepuk tangan, jentik jari).",
        "Murid dapat Mengkategorikan asal bunyi tiruan alam (hujan, angin, hewan).",
        "Murid dapat mengetuk konstan sesuai beat lagu yang diperdengarkan."
      ],
      "Seni Tari": [
        "Murid dapat mempraktikkan gerak kepala (menengok, menggeleng) secara ritmis.",
        "Murid dapat memperagakan gerakan tangan dan kaki secara beriringan.",
        "Murid dapat melangkah ke depan/samping (lokomotor) tepat pada hitungan."
      ],
      "Seni Teater": [
        "Murid dapat menunjukkan perubahan mimik wajah sesuai emosi yang diminta.",
        "Murid dapat melafalkan satu kata dengan intonasi suara senang atau sedih.",
        "Murid dapat menggerakkan tubuh mencerminkan aktivitas tertentu tanpa suara."
      ],
      "PJOK": [
        "Murid mampu berjalan lurus ke depan sejauh 10 meter dengan postur tegak.",
        "Murid mampu berlari mengubah arah tanpa kehilangan keseimbangan.",
        "Murid mampu melompat sejauh 1 meter bertumpu dengan dua kaki."
      ],
      "Bahasa Madura": [
        "mengidentifikasi dan membedakan bunyi bahasa dari teks kalimat yang didengar;",
        "membaca nyaring huruf, suku kata, kata, dan kalimat dengan lafal yang tepat;",
        "mengidentifikasi dan membedakan bunyi huruf vokal dan konsonan dengan tepat;",
        "menyebutkan data identitas diri, nama, kelas, sekolah, tempat tinggal dengan kalimat sederhana;"
      ],
      "Baca Tulis Al-Quran": [
        "Mengenal huruf hijaiah",
        "Tempat keluarnya huruf hijaiah",
        "Pengucapan huruf hijaiah",
        "Menulis huruf hijaiah"
      ]
    },
    "Semester 2": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu membedakan huruf hijaiah bersambung dengan benar.",
        "Murid mampu menjelaskan beberapa asmaulhusna secara sederhana.",
        "Murid mampu menerapkan akhlak terhadap Allah Swt. dengan cara menyucikan dan memuji-Nya",
        "Murid mampu mempraktikkan tata cara bersuci (taharah) dari najis/hadas kecil secara benar."
      ],
      "Pendidikan Pancasila": [
        "Murid dapat mengemukakan identitas dirinya dengan benar",
        "Murid dapat mengemukakan karakteristik fisik dan non-fisik orang lain dengan benar.",
        "Murid dapat menganalisis identitas dirinya dan karakter fisik dengan teman - temannya dengan benar",
        "Murid dapat menemukan sikap menghargai perbedaan karakter fisik/ jenis kelamin di lingkungan rumah."
      ],
      "Bahasa Indonesia": [
        "Murid dapat menyimpulkan teks nonfiksi yang dibacakan guru dan menyimpulkan informasi serta menjelaskan simpulannya.",
        "Murid dapat menganalisis informasi dengan benar.",
        "Murid dapat menyimpulkan penjelasan dan melakukan instruksi dengan baik."
      ],
      "Matematika": [
        "Murid dapat mengenal berbagai bangun segitiga.",
        "Murid dapat mengenal berbagai bangun segi empat",
        "Murid dapat mengenal berbagai bangun lingkaran.",
        "Murid dapat mengenal berbagai bangun segi banyak"
      ],
      "Baca Tulis Al-Quran": [
        "Mengenal harakat dalam bacaan Al-Qur’an",
        "Mengenal jenis bacaan berdasarkan pengucapan huruf",
        "Mengenal huruf hijaiyah bersambung"
      ]
    }
  },
  "2": {
    "Semester 1": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menghafal beberapa surah pendek Al-Qur'an (misal: Surah Al-Ikhlas, Al-Falaq).",
        "Murid mampu menjelaskan dan meyakini iman kepada malaikat Allah SWT",
        "Murid mampu membiasakan akhlak terpuji terhadap diri sendiri seperti menjaga kebersihan tubuh.",
        "Murid mampu menunjukkan tata cara melaksanakan salat fardu secara tertib."
      ],
      "Pendidikan Pancasila": [
        "Murid dapat mengemukakan makna dan arti dari bendera negara Indonesia",
        "Murid dapat menyimulasikan lagu kebangsaam Indonesia Raya secara mandiri/ berkelompok",
        "Murid dapat mengemukakan lima simbol Pancasila dalam Garuda Pancasila dengan tepat;"
      ],
      "Bahasa Indonesia": [
        "Murid dapat mengidentifikasi perbedaan dalam gambar/foto dan mempresentasikan informasi dengan suara yang jelas.",
        "Murid dapat menjelaskan informasi kunci pada puisi yang dibacakan.",
        "Murid dapat memahami dan menulis fungsi tanda baca titik dan huruf kapital"
      ],
      "Matematika": [
        "Murid dapat membaca dan menulis bilangan cacah sampai 1000",
        "Murid dapat membandingkan nilai bilangan 3 angka bilangan cacah sampai 1000",
        "Murid dapat mengurutkan nilai bilangan 3 angka bilangan cacah sampai 1000"
      ],
      "Baca Tulis Al-Quran": [
        "Murid dapat menulis huruf hijaiyah lepas",
        "Murid dapat menulis huruf hijaiyah bersambung",
        "Murid dapat menyebutkan ketentuan-ketentuan salat"
      ]
    },
    "Semester 2": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menghafal dan mengamalkan hadis tentang kebersihan dalam lingkungan sekolah.",
        "Murid mampu menyebutkan arti dan implementasi perilaku sehari-hari yang mencerminkan asmaulhusna yang dipelajari.",
        "Murid mampu mempraktikkan zikir dan berdoa setelah salat secara khusyuk."
      ],
      "Pendidikan Pancasila": [
        "Murid dapat mengemukakan identitas diri sesuai jenis kelamin, minat, dan perilaku dengan baik",
        "Murid dapat menceritakan karakter dan ciri-ciri lingkungan tempat tinggal dengan tepat."
      ],
      "Bahasa Indonesia": [
        "Murid dapat menyimpulkan informasi kunci pada puisi yang dibacakan.",
        "Murid dapat menerapkan instruksi untuk bermain “bum bum”."
      ],
      "Matematika": [
        "Murid dapat menjelaskan panjang dan berat serta membandingkan dengan menggunakan satuan pengukuran standard.",
        "Murid dapat menjelaskan panjang menggunakan satuan pengukuran tidak baku"
      ],
      "Baca Tulis Al-Quran": [
        "Menjelaskan pengertian Tafkhim dan Tarqiq dengan benar",
        "Menyebutkan macam-macam huruf Tafkhim dan Tarqiq dengan benar"
      ]
    }
  },
  "3": {
    "Semester 1": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu membaca dan menulis huruf hijaiah bersambung sesuai kaidah tajwid dasar.",
        "Murid mampu menjelaskan dan meyakini sifat-sifat wajib Allah SWT",
        "Murid mampu menerapkan akhlak terhadap orang tua dan keluarga di rumah."
      ],
      "Pendidikan Pancasila": [
        "Murid dapat menjabarkan sila-sila Pancasila secara urut dan menentukan makna setiap sila Pancasila",
        "Murid dapat mengidentifikasi makna sila-sila Pancasila dalam kehidupan sehari-hari."
      ],
      "Bahasa Indonesia": [
        "Murid dapat melaksanakan (C3) instruksi lisan yang disampaikan guru.",
        "Murid dapat menerapkan (C3) berbagai kosakata baru yang didapat dari teks bacaan dengan fasih."
      ],
      "Matematika": [
        "Murid dapat membaca, menulis, dan menentukan nilai tempat bilangan cacah sampai 10.000.",
        "Murid dapat membandingkan dan mengurutkan bilangan cacah sampai 10.000."
      ],
      "IPAS": [
        "Murid mampu menjelaskan pentingnya perkembangbiakan pada makhluk hidup",
        "Murid mampu membandingkan tahapan siklus hidup pada manusia, hewan, dan tumbuhan"
      ],
      "Bahasa Inggris": [
        "Murid mampu menjawab sapaan lisan 'Hello, how are you?' dengan frasa 'I am fine, thank you' secara fasih.",
        "Murid mampu menjodohkan teks tertulis nama hobi dengan gambar aktivitas yang tepat."
      ],
      "Baca Tulis Al-Quran": [
        "Terbiasa membaca basmalah setiap memulai belajar Al-Quran",
        "Mengenal hukum bacaan nun sukun dan tanwin"
      ]
    },
    "Semester 2": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menghafal beberapa surah pendek pilihan beserta penjelasan maknanya.",
        "Murid mampu menjelaskan makna beberapa asmaulhusna Fase B dan meyakininya dalam hati."
      ],
      "Pendidikan Pancasila": [
        "Murid dapat menentukan keberagaman budaya,suku bangsa,agama,dan kepercayaan sebagai sebuah kekayaan bangsa.",
        "Murid dapat menyampaikan contoh sikap dan perilaku yang dapat merusak keBhinnekaan."
      ],
      "Bahasa Indonesia": [
        "Murid dapat menjelaskan makna kosakata tertentu dari sebuah informasi yang dibacakan oleh guru.",
        "Murid dapat menyusun kosakata dengan pola kombinasi huruf yang telah dikenali."
      ],
      "Matematika": [
        "Murid dapat mengkategorikan berbagai bentuk bangun datar (segitiga, segiempat, dan lingkaran)",
        "Murid dapat menjabarkan ciri berbagai bentuk bangun datar segiempat."
      ],
      "IPAS": [
        "Murid mampu menjelaskan denah sederhana sebagai penunjuk arah",
        "Murid mampu menyusun denah daerah sekitar tempat tinggal"
      ],
      "Bahasa Inggris": [
        "Peserta didik mampu menyebutkan nama setiap ruangan di sekolah dengan lancar dan tepat",
        "Peserta didik mampu mengidentifikasi, menyebutkan dan merespon pertanyaan tentang letak ruangan."
      ],
      "Baca Tulis Al-Quran": [
        "Menerapkan hukum bacaan waqaf pada saat membaca ayat-ayat dalam Al-Qur’an",
        "Membaca beberapa ayat dalam Al-qur’an dengan tartil"
      ]
    }
  },
  "4": {
    "Semester 1": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menjelaskan kandungan hadis tentang kewajiban salat dan menjaga hubungan baik dengan sesama.",
        "Murid mampu menjelaskan dan meyakini iman kepada kitab-kitab Allah Swt. dan rasul-rasul-Nya.",
        "Murid mampu menerapkan sikap berbaik sangka (husnuzan) kepada Allah Swt. dalam segala kondisi."
      ],
      "Pendidikan Pancasila": [
        "Murid mengidentiikasi makna sila-sila Pancasila di lingkungan masyarakat.",
        "Murid menunjukkan kegiatan sehari-hari yang sesuai dengan makna sila-sila Pancasila di lingkungan masyarakat."
      ],
      "Bahasa Indonesia": [
        "Murid dapat menemukan makna teks narasi yang dibacakan atau dari media audio",
        "Murid dapat menggunakan kaidah sederhana kebahasaan berupa kalimat transitif dan intransitif"
      ],
      "Matematika": [
        "Murid dapat menghitung operasi penjumlahan dan pengurangan bilangan cacah dari 500 sampai 1.000.",
        "Murid dapat menghitung dalam operasi perkalian dan pembagian bilangan cacah dari 50 sampai 100"
      ],
      "IPAS": [
        "Murid menjelaskan bagian – bagian panca indra",
        "Murid mencirikan penyakit pada panca indra"
      ],
      "Bahasa Inggris": [
        "Murid mampu memperagakan gestur tubuh secara tepat saat guru mengucapkan kalimat lisan 'I brush my teeth'.",
        "Murid mampu membaca komik strip harian pendek dan mengidentifikasi jam pelaksanaan aktivitas."
      ],
      "Baca Tulis Al-Quran": [
        "Mengenal hukum bacaan mim sukun",
        "Melafalkan hukum bacaan mim sukun dalam surah-surah pendek pilihan"
      ]
    },
    "Semester 2": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menuliskan ayat dari surah pendek pilihan dengan benar dan rapi.",
        "Murid mampu menjelaskan ketentuan dan mempraktikkan ibadah salat jumat serta salat sunah."
      ],
      "Pendidikan Pancasila": [
        "Murid mengidentiikasi makna sila-sila Pancasila di lingkungan masyarakat.",
        "Murid menunjukkan kegiatan sehari-hari yang sesuai dengan makna sila-sila Pancasila."
      ],
      "Bahasa Indonesia": [
        "Murid dapat menjelaskan pesan (amanat) yang ada di dalam teks;",
        "Murid menganalisis teks yang diperdengarkan dari media audio"
      ],
      "Matematika": [
        "Murid dapat mendeskripsikan ciri berbagai bentuk bangun datar segiempat",
        "Murid dapat mendeskripsikan ciri berbagai bentuk bangun datar segitiga"
      ],
      "IPAS": [
        "Murid mampu menjelaskan pengertian, jenis - jenis dan peranan norma dalam kehidupan masyarakat",
        "Murid mampu menjelaskan pengertian dan jenis - jenis adat istiadat dalam kehidupan masyarakat"
      ],
      "Bahasa Inggris": [
        "Murid mampu menebak nama hewan secara lisan setelah mendengar deskripsi guru",
        "Murid mampu menyebutkan nama tokoh binatang dan sifatnya dalam cerita pendek."
      ],
      "Baca Tulis Al-Quran": [
        "Mengenal hukum bacaan lam ta'arif",
        "Melafalkan bacaan lam ta'arif dalam Al-Qur'an"
      ]
    }
  },
  "5": {
    "Semester 1": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menulis kalimat Al-Qur'an bersambung serta menjelaskan kandungan surah pendek pilihan.",
        "Murid mampu menjelaskan makna beberapa asmaulhusna tingkat lanjut."
      ],
      "Pendidikan Pancasila": [
        "Murid mampu menjelaskan kronologi sejarah kelahiran Pancasila.",
        "Murid mampu menganalisis rancangan dasar tokoh perumus Pancasila"
      ],
      "Bahasa Indonesia": [
        "Murid dapat membandingkan sinonim dan antonim",
        "Murid dapat menganalisis kata sifat berimbuhan pe- pada teks yang disimak"
      ],
      "Matematika": [
        "Murid dapat membaca dan menulis bilangan cacah sampai 1.000.000",
        "Murid dapat menentukan nilai tempat bilangan cacah sampai 1.000.000"
      ],
      "IPAS": [
        "Murid dapat merefleksikan pentingnya sistem pernapasan dan peran makanan.",
        "Murid dapat menerapkan cara menjaga kesehatan sistem pernapasan dan pencernaan."
      ],
      "Bahasa Inggris": [
        "Murid mampu mencatat hari pelaksanaan mata pelajaran tertentu setelah menyimak percakapan.",
        "Murid mampu menyebutkan pukul berapa kelas matematika dimulai berdasarkan gambar."
      ],
      "Baca Tulis Al-Quran": [
        "Menyebutkan contoh-contoh bacaan idhgam dalam beberapa ayat pendek pilihan",
        "Melafalkan hukum bacaan idhgam pada saat membaca surat-surat pendek pilihan"
      ]
    },
    "Semester 2": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menganalisis pesan hadis tentang pentingnya berbuat baik kepada orang tua, guru, dan teman.",
        "Murid mampu menerapkan akhlak terpuji kepada teman sebaya dan tetangga rumah."
      ],
      "Pendidikan Pancasila": [
        "Murid mampu menjelaskan konsep keberagaman budaya di Indonesia.",
        "Murid mampu menjelaskan makna semboyan Bhinneka Tunggal Ika."
      ],
      "Bahasa Indonesia": [
        "Murid dapat membandingkan singkatan dan akronim",
        "Murid dapat membandingkan fakta dan opini dari sebuah teks dan iklan."
      ],
      "Matematika": [
        "Murid dapat menjelaskan sifat-sifat bangun datar",
        "Murid dapat menjelaskan sifat-sifat bangun ruang (kubus,balok dan gabungannya)"
      ],
      "IPAS": [
        "Murid dapat menjelaskan komponen-komponen peta dan fungsinya.",
        "Murid dapat membandingkan peta konvensional dan digital."
      ],
      "Bahasa Inggris": [
        "Murid mampu menggambar garis rute perjalanan di atas peta buta sesuai petunjuk.",
        "Murid mampu menyimpulkan lokasi terdekat antar-fasilitas umum."
      ],
      "Baca Tulis Al-Quran": [
        "Menyebutkan contoh-contoh bacaan qalqalah dalam beberapa ayat pendek pilihan",
        "Melafalkan hukum bacaan qalqalah pada saat membaca surat-surat pendek pilihan"
      ]
    }
  },
  "6": {
    "Semester 1": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menjelaskan konsep dan meyakini sepenuh hati iman kepada hari akhir (kiamat).",
        "Murid mampu menunjukkan kepedulian lingkungan melalui penerapan akhlak kepada hewan dan tumbuhan."
      ],
      "Pendidikan Pancasila": [
        "Murid dapat menganalisis kronologi sejarah kelahiran Pancasila.",
        "Murid dapat menggali informasi seputar rancangan dasar tokoh perumus Pancasila"
      ],
      "Bahasa Indonesia": [
        "Murid dapat menganalisis unsur intrinsik dan nilai-nilai dalam cerita fiksi berbentuk cerpen.",
        "Murid dapat menyusun isi formulir pendaftaran sesuai prosedur pengisiannya."
      ],
      "Matematika": [
        "Murid dapat melakukan operasi perkalian dan pembagian bilangan cacah sampai 100.000.",
        "Murid dapat melakukan operasi perkalian dan pembagian pecahan dengan bilangan asli."
      ],
      "IPAS": [
        "Murid dapat menjelaskan sistem organ gerak pada manusia.",
        "Murid dapat menjelaskan cara tubuh manusia bergerak."
      ],
      "Bahasa Inggris": [
        "Murid mampu mengurutkan gambar peristiwa acak setelah menyimak cerita rekaman audio.",
        "Murid mampu mengidentifikasi kata kerja lampau (past verbs/regular-irregular)."
      ],
      "Baca Tulis Al-Quran": [
        "Mengenal hukum bacaan mad tabi'i dan mad far'i",
        "Mempratikkan hukum bacaan mad tabi'i dan mad far'i dalam Al-Qur'an"
      ]
    },
    "Semester 2": {
      "Pendidikan Agama Islam dan Budi Pekerti": [
        "Murid mampu menjelaskan dan menerima ketetapan Allah SWT. melalui keyakinan pada iman kepada qada' dan qadar.",
        "Murid mampu mewujudkan moderasi dan toleransi dengan menerapkan akhlak mulia kepada penganut agama lain."
      ],
      "Pendidikan Pancasila": [
        "Murid mampu mengemukakan tentang keberagaman",
        "Murid dapat mengidentifikasi faktor pendorong keberagaman."
      ],
      "Bahasa Indonesia": [
        "Murid dapat menganalisis teks nonsastra dan teks sastra berdasarkan informasi yang diperoleh.",
        "Murid dapat membaca dan menyusun kata-kata dengan berbagai pola kombinasi huruf."
      ],
      "Matematika": [
        "Murid dapat membandingkan karakteristik antar bangun datar dan antar bangun ruang",
        "Murid dapat menentukan lokasi peta yang menggunakan sistem berpetak"
      ],
      "IPAS": [
        "Murid dapat menceritakan sejarah kedatangan bangsa asing ke Indonesia.",
        "Murid dapat menganalisis pengaruh kedatangan bangsa asing ke Indonesia."
      ],
      "Bahasa Inggris": [
        "Murid mampu mencatat poin penting cita-cita dari tiga teman yang melakukan wawancara lisan.",
        "Murid mampu menjawab lembar pertanyaan evaluasi pemahaman bacaan."
      ],
      "Baca Tulis Al-Quran": [
        "Menjelaskan pengertian mad 'arid lissukun dengan benar",
        "Menunjukkan contoh bacaan mad 'arid lissukun dengan benar"
      ]
    }
  }
};

// Fallback generator for general combinations
export const getTPList = (kelas: string, semester: string, mapel: string): string[] => {
  const cleanKelas = kelas.replace(/Fase\s+[A-C]\s+\/\s+Kelas\s+/i, "").trim();
  const classGroup = TUJUAN_PEMBELAJARAN_MAP[cleanKelas];
  if (classGroup) {
    const semGroup = classGroup[semester];
    if (semGroup) {
      const tpList = semGroup[mapel];
      if (tpList && tpList.length > 0) {
        return tpList;
      }
    }
  }
  // Generic fallback if not defined
  return [
    `Murid mampu menjelaskan konsep dasar ${mapel} terkait materi pokok secara mandiri.`,
    `Murid mampu mengidentifikasi dan memecahkan permasalahan kontekstual ${mapel} pada semester ini.`,
    `Murid mampu menyajikan hasil karya kreatif dan melakukan refleksi diri terhadap materi ${mapel}.`
  ];
};
