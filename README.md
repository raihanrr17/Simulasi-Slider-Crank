# Slider-Crank Educational Simulator

Aplikasi simulasi interaktif berbasis web untuk membantu mahasiswa memahami kinematika mekanisme **slider-crank** secara visual dan eksploratif.

---

## Apa itu Slider-Crank?

Slider-crank adalah mekanisme empat batang yang mengubah **gerak rotasi** (crank) menjadi **gerak translasi** (slider), atau sebaliknya. Mekanisme ini menjadi dasar dari banyak mesin nyata seperti mesin piston, kompresor, dan pompa.

```
     B (pin)
    /|
   / |
  /  |          ← Connecting Rod (l)
 /   |
A----+----------C (slider)
(pivot)          →→→ gerak bolak-balik
```

---

## Cara Menjalankan Aplikasi

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- npm (sudah termasuk dalam Node.js)

### Langkah-langkah

```bash
# 1. Clone atau ekstrak folder proyek
cd Simulasi-Slider-Crank-main

# 2. Install dependensi
npm install

# 3. Jalankan aplikasi
npm run dev

# 4. Buka browser dan akses
http://localhost:5173
```

---

## Struktur File Penting

```
src/
├── App.jsx                    # Komponen utama & logika simulasi
├── styles.css                 # Gaya tampilan global
├── assets/
│   └── equations.js           # Gambar persamaan matematika (base64)
├── physics/
│   └── sliderCrankModel.js    # Model kinematika (posisi, kecepatan, akselerasi)
├── components/
│   ├── ControlPanel.jsx       # Slider input parameter
│   ├── SimulationControl.jsx  # Tombol play/pause/step/reset + slider posisi manual
│   ├── MechanismView.jsx      # Animasi mekanisme + diagram vektor + tabel nilai
│   ├── ValidationPanel.jsx    # Validasi persamaan + anotasi kondisi kritis
│   └── TheoryPanel.jsx        # Dasar teori dengan tabs dan expander
└── chart/
    └── Graph3Panel.jsx        # Grafik x(t), v(t), a(t), ωrod(t)
```

---

## Panduan Penggunaan

### 1. Panel Parameter (kiri atas)
Atur parameter mekanisme menggunakan slider:

| Parameter | Simbol | Rentang | Keterangan |
|---|---|---|---|
| Crank Length | r | 0.5 – 2 m | Panjang lengan engkol |
| Rod Length | l | 1 – 5 m | Panjang batang penghubung |
| Angular Velocity | ω | 1 – 20 rad/s | Kecepatan sudut crank |

> 💡 **Tips:** Coba ubah r dan l secara bersamaan dan perhatikan bagaimana bentuk grafik berubah.

---

### 2. Simulation Control (kiri)
| Tombol | Fungsi |
|---|---|
| ▶ Play | Mulai animasi |
| ⏸ Pause | Jeda animasi |
| ⏭ Step | Maju satu langkah kecil |
| ⏹ Reset | Kembali ke posisi awal (θ = 0°) |

**Slider posisi manual** — hanya aktif saat simulasi di-*pause*. Geser untuk mengeksplorasi posisi θ dari 0° hingga 360° secara bebas dan amati perubahan semua nilai secara real-time.

---

### 3. Mechanism & Velocity Diagram (tengah)
- **Animasi mekanisme** — crank (biru), connecting rod (oranye), dan slider bergerak sesuai parameter
- **Panah vektor** — menunjukkan arah dan besar kecepatan:
  - **vB** — kecepatan titik pin B
  - **vC** — kecepatan slider C (selalu horizontal)
- **Tabel kanan** — nilai vC dan ωrod pada 8 posisi sudut kunci (0°, 45°, 90°, ..., 315°), diperbarui otomatis saat parameter berubah. Baris kuning menandai **dead center**.

---

### 4. Grafik (kanan)
Empat grafik real-time yang bisa dibuka/tutup secara independen:

| Grafik | Warna | Satuan |
|---|---|---|
| Position x(t) | Tosca | m |
| Velocity vC(t) | Merah muda | m/s |
| Acceleration aC(t) | Kuning | m/s² |
| Angular Vel ωrod(t) | Ungu | rad/s |

Klik header tiap grafik untuk menutup/membuka. Sumbu-X menunjukkan θ dalam radian (0 – 2π).

---

### 5. Equation Validation (tengah bawah)
Menampilkan persamaan posisi slider secara eksplisit dengan nilai parameter saat ini, beserta **4 anotasi kondisi kritis** yang selalu terlihat:

| Anotasi | Aktif Saat |
|---|---|
| **Rasio Geometri λ** | Selalu — warna berubah sesuai nilai λ |
| **Dead Center** | vC ≈ 0, slider berbalik arah |
| **Posisi Singular** | θ ≈ 0° atau 180°, crank segaris dengan rod |
| **ωrod Ekstrem** | ωrod > 1.5× ω crank |

Anotasi berwarna **abu-abu** = kondisi belum terpenuhi. Anotasi **menyala** = kondisi aktif saat ini.

---

### 6. Dasar Teori (bawah — panel lebar)
Berisi penjelasan akademik dalam 5 tab:

- **Posisi** — persamaan loop-closure dan sudut φ
- **Kecepatan** — vB, vC, dan ωrod
- **Akselerasi** — aC dan αrod
- **Geometri** — rasio λ dan aproksimasi harmonik
- **Referensi** — 5 referensi jurnal dan buku teks

Tiap tab memiliki **expander** yang bisa dibuka/tutup untuk detail tambahan.

---

## Skenario Eksplorasi yang Disarankan

### Skenario 1 — Pengaruh rasio λ
1. Set r = 2, l = 2.5 → lihat anotasi λ menjadi **merah** (distorsi besar)
2. Set r = 0.5, l = 5 → lihat anotasi λ menjadi **tosca** (mendekati harmonik sederhana)
3. Bandingkan bentuk grafik x(t) pada kedua kondisi

### Skenario 2 — Amati Dead Center
1. Pause simulasi
2. Geser slider posisi θ perlahan dari 0° hingga 360°
3. Perhatikan kapan anotasi **Dead Center** menyala — itu saat slider berbalik arah

### Skenario 3 — Pengaruh kecepatan sudut
1. Set ω = 1 rad/s, amati grafik akselerasi
2. Naikkan ke ω = 20 rad/s
3. Perhatikan: nilai akselerasi naik sebanding **ω²**

---

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Chart.js + react-chartjs-2 | Grafik dinamis |
| Canvas API | Animasi mekanisme & vektor |
| Matplotlib (Python) | Generate gambar persamaan (offline) |

---

## Referensi Utama

1. Erdman, A. G., Sandor, G. N., & Kota, S. (2001). *Mechanism Design: Analysis and Synthesis* (4th ed.). Prentice Hall.
2. Norton, R. L. (2020). *Design of Machinery* (6th ed.). McGraw-Hill.
3. Shigley, J. E., & Uicker, J. J. (2022). *Theory of Machines and Mechanisms* (5th ed.). Oxford University Press.
4. Sancibrian, R., et al. (2021). A general procedure based on exact gradient for optimization of mechanisms. *Mechanism and Machine Theory, 159*, 104258.
5. Bai, S., & Angeles, J. (2022). Kinematic synthesis of RCCC linkages for prescribed four poses. *Mechanism and Machine Theory, 168*, 104580.
