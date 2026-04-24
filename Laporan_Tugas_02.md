# TUGAS 02: Rancangan Front-End Aplikasi Menggunakan Laravel dan React (Tugas Project UTS)

**Mata Kuliah:** Pemrograman Web Berbasis Framework
**Sifat Tugas:** Perancangan Antarmuka & Penjelasan Struktur Kode
**Platform:** Bansos-Verify (Website Verifikasi dan Pelaporan Bantuan Sosial)

---

## BAB I: Penentuan Halaman dan Struktur Navigasi

Berdasarkan studi kasus "Bansos-Verify", halaman-halaman utama yang dibangun pada front-end aplikasi untuk mengelola data dan alur bantuan sosial terdiri dari:

1. **Halaman Login (`Login.jsx`, `LoginAdmin.jsx`)**
   Halaman pintu masuk bagi pengguna (Warga, Admin, Auditor) untuk mengakses sistem sesuai dengan perannya masing-masing.
2. **Halaman Dashboard / Landing Page (`Welcome.jsx` / `AdminDashboard.jsx`)**
   Menyajikan ringkasan informasi, statistik penyaluran bansos, fitur pencarian NIK (bagi warga), serta metrik penting (bagi admin).
3. **Halaman Data Utama (`VerificationCenter.jsx`)**
   Berisi daftar data utama seperti penerima bansos atau data laporan/pengaduan yang masuk beserta status verifikasinya.
4. **Halaman Form Tambah/Edit Data (`AdminSchedule.jsx`)**
   Digunakan administrator untuk menjadwalkan pengambilan bansos, memasukkan tanggal, lokasi, serta pesan broadcast kepada warga.
5. **Halaman Tambahan: Laporan Anonim (Modal / Form)**
   Fitur untuk warga melaporkan penyimpangan distribusi bansos secara anonim.

**Struktur Navigasi dan Alur:**
Pengguna yang belum login / masyarakat umum dapat melihat halaman Landing Page (`Welcome.jsx`) dan mengirim Laporan Anonim. Bagi penerima bansos/warga, mereka dapat melakukan login (`Login.jsx`). Admin/Operator memiliki akses terpisah untuk masuk (`LoginAdmin.jsx`) lalu diarahkan ke Dashboard Admin letak menu pengelolaan data dan penjadwalan.

---

## BAB II: Implementasi Rancangan Front-End

Aplikasi ini menggunakan perpaduan **Laravel** (sebagai backend) dan **React.js** (sebagai frontend antarmuka) yang dijembatani oleh **Inertia.js**.
Pengembangan antarmuka berfokus pada:
- **Pembagian Komponen:** Komponen React dipisah secara terstruktur seperti `AdminLayout`, halaman `Pages`, dan modal (contoh: Laporan Anonim) agar kode lebih bersih (clean code) dan *reusable*.
- **Tata Letak (Layout) Konsisten:** Menggunakan layout wrapper seperti `<AdminLayout>` agar navigasi sidebar dan header selalu seragam di setiap halaman admin.
- **Elemen Antarmuka & Framework:** Tampilan menggunakan perpaduan CSS Framework (seperti TailwindCSS) yang disesuaikan dengan desain Figma. Elemen interaktif seperti form input, tombol, serta badge status menggunakan warna dan ukuran yang padu.
- **Alur Interaksi Dasar:** Memanfaatkan *React State* (`useState`) dan form helper dari Inertia (`useForm`) untuk menangani interaksi perubahan input dan pengiriman (submit) secara *Single Page Application (SPA)* tanpa me-reload browser penuh.

---

## BAB III: Dokumentasi Screenshot dan Penjelasan Kode

### 1. Deskripsi Singkat Aplikasi dan Tujuan Tampilan
**Bansos-Verify** merupakan platform yang ditujukan untuk transparansi dan verifikasi distribusi Bantuan Sosial. Tampilan didesain agar masyarakat umum mudah mencari status bantuan, sekaligus memberikan kemudahan kepada aparat/admin desa untuk memvalidasi dan mengatur jadwal penerimaan bantuan sosial.

### 2. Screenshot Halaman dan Penjelasan
*(Instruksi: Hapus teks [TEMPATKAN SCREENSHOT DI SINI...] ini di Word dan ganti dengan gambar screenshot Anda)*

**A. Halaman Landing Page (Welcome)**
[TEMPATKAN SCREENSHOT HALAMAN LANDING PAGE (WELCOME) DI SINI]
- **Nama Halaman:** Landing Page Bansos-Verify
- **Fungsi:** Menyajikan portal transparansi data bansos untuk publik, pencarian status penerima, dan akses ke Laporan Anonim.

**B. Halaman Login**
[TEMPATKAN SCREENSHOT HALAMAN LOGIN DI SINI]
- **Nama Halaman:** Form Autentikasi Login Utama
- **Fungsi:** Mengizinkan penerima/pengguna memverifikasi identitas mereka masuk ke sistem.

**C. Halaman Dashboard Admin**
[TEMPATKAN SCREENSHOT HALAMAN ADMIN DASHBOARD DI SINI]
- **Nama Halaman:** Admin Dashboard
- **Fungsi:** Menampilkan summary metrik penyaluran bantuan, grafik analitik, dan status verifikasi terkini bagi operator.

**D. Form Tambah/Edit Data (Manajemen Jadwal & Checklist)**
[TEMPATKAN SCREENSHOT HALAMAN ADMIN SCHEDULE DI SINI]
- **Nama Halaman:** Manajemen Jadwal Penyaluran (`AdminSchedule.jsx`)
- **Fungsi:** Formulir untuk menambah / membuat jadwal penyaluran bansos ("Broadcast Jadwal") dan tabel tabel checklist konfirmasi warga yang sudah mengambil.

### 3. Komponen Utama React yang Digunakan
Beberapa komponen inti bangunan React pada proyek ini meliputi:
- **Inertia.js Hooks:** `useForm` (pengelolaan *state* form input), `usePage` (mengambil *props* yang disuntikkan dari backend Laravel).
- **Layout Manager:** `<AdminLayout>` yang membungkus komponen turunan (*children*) di dalamnya beserta Navbar dan Navigasi.
- **UI Components Inti:** `div` pembungkus form, `<input>`, `<textarea>`, `<button>`, serta tabel data (map pada array checklist).

### 4. Potongan Kode Penting

*(Instruksi: Berikut adalah potongan kode yang disiapkan untuk Laporan. Jika diminta screenshot kode, Anda bisa mengambil screenshot dari text editor/VSCode Anda untuk kode serupa, lalu taruh di bawah teks tabel penjelasannya)*

**Potongan Kode Form dan State Handling (Dari `AdminSchedule.jsx`)**
```javascript
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, reset } = useForm({
    tanggal: '',
    lokasi: 'Kantor Kelurahan Suka Maju',
    pesan: '',
});

function submitBroadcast(e) {
    e.preventDefault();
    post(route('admin.schedule.broadcast'), {
        onSuccess: () => reset('tanggal', 'pesan'),
    });
}
```
*[TEMPATKAN SCREENSHOT KODE DI ATAS DI SINI, jika dosen meminta format foto kode]*

**Penjelasan Potongan Kode:**
Kode ini menggunakan `useForm` bawaan Inertia untuk menginisialisasi *state* form. Fungsi `submitBroadcast` dipicu ketika formulir dikirim (*onSubmit*). Fungsi panggil dari `post()` secara asinkron (AJAX) mengirim isi variabel `data` ke *route* di sisi Laravel, tanpa perlu *reload* halaman, serta otomatis mereset *field* tanggal dan pesan setelah sukses.

**Potongan Kode Rendering Tabel Berbasis Data (Mapping)**
```javascript
{checklist.map((row) => {
    const isDone = row.status === 'Telah Disalurkan';
    return (
        <tr key={row.id}>
            <td>{row.nama} - {row.nik}</td>
            <td>
                <button onClick={() => tandaiSelesai(row.id)}>
                    Tandai Selesai
                </button>
            </td>
        </tr>
    );
})}
```
**Penjelasan Potongan Kode:**
Komponen memanfaatkan sintaks `map` pada JavaScript array bernama `checklist` untuk membuat serangkaian elemen baris tabel (`<tr>`). Setiap elemen mengikat iterasi ke kunci `key` yang unik dan mengkondisikan status agar tombol "Tandai Selesai" merespons aksi klik yang dihubungkan dengan id warga (props).

### 5. Penjelasan Hubungan Laravel dan React
Aplikasi diintegrasikan menggunakan **Inertia.js**.
- **Peran Laravel:** Bertugas sebagai *backend* pengatur *routing*, autentikasi, serta pengolahan *database* (Controller). Laravel mengirim (merender) respons berupa properti (props) berformat JSON.
- **Peran React:** Bertugas mengatur *frontend view* menerima data JSON tersebut dari *Controller* dan me-rendernya menjadi DOM interaktif, serta menangani perubahan *state* lokal. Keterkaitan ini membuat *user experience* semulus SPA (Single Page Application) meskipun secara kapabilitas server dikerjakan oleh Laravel (Monolith-SPA hybrid).

---

## BAB IV: Analisis Desain Antarmuka

### Penjelasan Naratif Desain:
* **Alasan Pemilihan Layout:** Layout mengadopsi model Dashboard yang memisahkan navigasi tepi (Sidebar) dengan ruang kerja utama (Main Content Area). Model ini dipilih karena platform memiliki banyak data hirarkis bagi staf administrator sehingga visibilitas navigasi sangat kritikal.
* **Konsistensi Warna dan Navigasi:** Skema warna utama mengusung kesan "Publik dan Terpercaya" dengan pemilihan warna oranye peringatan (sifat darurat/urgency pada bansos) dan hijau kesuksesan. Konsistensi dijaga menggunakan variabel CSS dan implementasi global di *class* Tailwind/objek style.
* **Kemudahan Penggunaan & Kesesuaian Studi Kasus:** Penggunaan bahasa Indonesia yang baku (seperti "Cek Status Bansos", "Tandai Selesai") mempermudah sasaran pengguna. Bagi operator lapangan yang sering menangani warga secara fisik, tombol besar serta kolom input kalender akan sangat mempercepat kerja (UX field testing).
* **Pertimbangan User Experience (UX):** Ditambahkan umpan balik interaktif (terlihat dari prop properties `processing` di React inertis), ketika tombol ditekan, statusnya menjadi `'Mengirim...'` untuk mencegah submit ganda.

### Kendala yang Dihadapi dan Solusinya:
**Kendala:** 
Sinkronisasi desain dari Figma ke struktur React menggunakan Tailwind sempat menyulitkan saat harus mengatur *responsive design* antara layar HP dan layar monitor. Integrasi form Laporan Anonim sering kali mengalami issue limitasi *re-render* di mana modal selalu tertutup jika *state* berubah.
**Solusi:** 
Menggunakan kelas turunan Flexbox/Grid CSS untuk struktur tampilan responsif, serta penerapan state management prop yang proporsional sehingga modal hanya tertutup bila status pengiriman (*request Inertia*) sukses dieksekusi.

---
Mengerjakan Mandiri Sesuai Pertimbangan Penggunaan AI untuk Sintaks Kode dan Struktur Laporan.

