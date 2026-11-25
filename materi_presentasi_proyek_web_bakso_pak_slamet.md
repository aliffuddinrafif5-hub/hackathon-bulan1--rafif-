# 🍜 Materi Presentasi Proyek: Sistem Pemesanan & Antrian "Bakso Pak Slamet"

**Peran:** Mahasiswa Web Developer  
**Target Audiens:** Dosen Penguji / Juri Lomba / Pemilik UMKM  
**Stack Teknologi:** Vanilla HTML5, CSS3 (Modern CSS), Vanilla JavaScript (ES6+), Web Storage API (`localStorage`)

---

## 1. Pembukaan (Hook & Latar Belakang)
> *"Selamat pagi/siang semuanya. Pernah nggak sih kalian lagi laper banget mau beli bakso, tapi pas nyampe gerobak malah bingung karena pembelinya numpuk, nggak jelas siapa yang duluan dateng, dan penjualnya kewalahan ngitung total belanjaan di kepala?"*

* **Masalah di Lapangan:** UMKM kuliner seperti gerobak bakso sering mengalami antrian yang semrawut, risiko salah hitung kembalian/total harga, dan repot mengganti daftar menu fisik jika harga bahan baku berubah.
* **Solusi yang Dibangun:** Kami merancang aplikasi web *Single-Page Application* (SPA) ringan bernama **Bakso Pak Slamet**. Aplikasi ini memungkinkan pembeli memesan langsung dari bangku mereka, melihat estimasi waktu tunggu, dan memberikan *dashboard* kasir/antrian sederhana untuk penjual tanpa perlu instalasi aplikasi berat atau biaya langganan server.

---

## 2. Arsitektur & Struktur Kode (Bedah Teknis)

Aplikasi ini dibangun menggunakan pendekatan **Vanilla Web Stack** (tanpa *framework* eksternal) dengan alasan performa yang sangat cepat, ringan dibuka di HP spesifikasi rendah sekalipun, dan mudah di-*deploy* di mana saja.

### A. `index.html` (Struktur Semantik & Dokumentasi Terintegrasi)
* **Semantic HTML5:** Menggunakan tag seperti `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, dan `<footer>` untuk aksesibilitas (*screen-reader friendly* dengan atribut `aria-live` dan `aria-label`) serta SEO yang baik.
* **All-in-One Showcase:** Selain fitur utama aplikasi (Katalog & Panel Penjual), halaman ini juga dilengkapi bagian **Pitching Deck**, **Flowchart & ERD** (dirender langsung menggunakan vektor `<svg>` tajam), dan **Pseudocode** untuk memudahkan pemahaman alur sistem secara menyeluruh.

### B. `style.css` (Desain Responsif & Modern UI/UX)
* **Design System via CSS Variables (`:root`):** Memudahkan pengelolaan tema warna yang terinspirasi dari nuansa kuliner segar (Hijau daun, Merah sambal, Kuning kaldu).
* **Adaptive Dark Mode:** Menggunakan `@media (prefers-color-scheme: dark)` sehingga tampilan otomatis menyesuaikan tema gelap/terang perangkat pengguna.
* **Tipografi Kontras:** Mengombinasikan *font* display yang tegas (`Bricolage Grotesque`) untuk judul dan nomor antrian, serta *font* yang mudah dibaca (`Instrument Sans`) untuk detail menu.
* **Layout Modern:** Memanfaatkan **CSS Grid** (`grid-template-columns: repeat(auto-fill, minmax(...))`) dan **Flexbox** agar tampilan mulus baik di layar HP pembeli maupun tablet kasir penjual.

### C. `script.js` (Logika Bisnis & Manajemen State)
* **Client-Side Persistence (`localStorage`):** Data pesanan, urutan nomor antrian (`A-01`, `A-02`, dst.), dan sisa stok disimpan secara lokal di *browser* (`bakso-db`). Jika halaman di-*refresh*, data tidak hilang.
* **Manajemen Stok Real-Time:** Saat pembeli menambahkan item ke keranjang, sisa stok yang ditampilkan langsung berkurang secara dinamis (`db.stok[id] - (cart[id] || 0)`), mencegah terjadinya *overselling* (pesanan melebihi stok).
* **Keamanan Dasar (XSS Prevention):** Pada fungsi `renderQueue()`, input nama pembeli disanitasi menggunakan `.replace(/</g, "&lt;")` untuk mencegah injeksi skrip berbahaya pada tabel antrian.
* **Reaktivitas DOM:** Menggunakan pola fungsi `refresh()` terpusat yang memperbarui tampilan katalog, keranjang, dan tabel antrian setiap kali terjadi perubahan *state*.

---

## 3. Alur Kerja Aplikasi (Live Demo Walkthrough)

Saat mendemonstrasikan aplikasi secara langsung, ikuti urutan skenario berikut:

1. **Sisi Pembeli (Katalog & Keranjang):**
   * Tunjukkan fitur pencarian cepat (ketik *"urat"*) dan filter kategori (*Bakso, Tambahan, Minuman*).
   * Tambahkan beberapa menu ke keranjang. Perhatikan bagaimana **total harga dihitung otomatis** dan **angka stok pada kartu menu berkurang**.
   * Isi nama pemesan (misal: *"Budi"*) lalu klik **Kirim pesanan**. Sistem langsung menerbitkan nomor antrian berurutan (misal: **A-01**).
2. **Sisi Penjual (Panel Antrian & Rekap):**
   * Gulir ke bagian **Panel Penjual**. Tunjukkan status antrian yang masuk dan estimasi waktu tunggu di bagian *Hero* atas (`5 menit` per antrian).
   * Klik tombol **Panggil berikutnya**. Nomor antrian di kartu hijau bagian atas (*Hero Ticket*) akan berubah menjadi **A-01** dengan status `dilayani`.
   * Klik **Selesai** pada baris pesanan tersebut, dan tunjukkan bahwa **Pendapatan hari ini** otomatis bertambah.
3. **Dokumentasi Sistem (Nilai Tambah Akademis):**
   * Buka bagian **Flowchart & ERD** serta **Pseudocode** untuk menjelaskan bahwa aplikasi ini dirancang berdasarkan pemodelan basis data relasional (`PRODUK`, `PESANAN`, `DETAIL_PESANAN`) dan algoritma yang terstruktur.

---

## 4. Tantangan & Rencana Pengembangan (Future Work)

Jika dosen atau juri bertanya, *"Apa kekurangan sistem ini sekarang dan bagaimana pengembangannya ke depan?"*, jawab dengan poin berikut:

* **Keterbatasan Saat Ini:** Karena menggunakan `localStorage`, data masih tersimpan di masing-masing perangkat (belum tersinkronisasi antara HP pembeli di meja dan HP penjual di gerobak).
* **Roadmap Pengembangan:**
  1. **Integrasi Backend & Real-Time Database:** Menghubungkan aplikasi ke Firebase atau Supabase/PostgreSQL agar pesanan dari HP pembeli langsung berbunyi di HP penjual.
  2. **Notifikasi WhatsApp Gateway:** Mengirimkan pesan otomatis ke WhatsApp pembeli saat nomor antrian mereka dipanggil.
  3. **Integrasi Pembayaran QRIS:** Menambahkan *payment gateway* agar pembeli bisa langsung membayar tanpa uang tunai.

---

## 5. Penutup
> *"Melalui proyek Bakso Pak Slamet ini, kami membuktikan bahwa solusi teknologi untuk UMKM tidak harus rumit dan mahal. Dengan kode yang bersih, ringan, dan berfokus pada pengalaman pengguna, digitalisasi warung kaki lima bisa langsung diterapkan hari ini juga. Terima kasih, saya persilakan jika ada pertanyaan atau masukan."*