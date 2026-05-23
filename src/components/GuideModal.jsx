import { useState } from "react"

const TABS = ["Referensi Panel", "Cara Belajar"]

export default function GuideModal({ onClose }) {
  const [tab, setTab] = useState(0)

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#131a2e", border: "1px solid #253055",
          borderRadius: 12, padding: 28, maxWidth: 640, width: "100%",
          maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem", color: "#fff" }}>Panduan Penggunaan</h2>
          <button onClick={onClose} style={{
            background: "transparent", border: "none",
            color: "#aaa", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid #253055", paddingBottom: 12 }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "5px 14px", borderRadius: 6, cursor: "pointer",
              fontWeight: "bold", fontSize: "0.82rem",
              background: tab === i ? "#1e3a5f" : "transparent",
              border: `1px solid ${tab === i ? "#3a6fa8" : "#253055"}`,
              color: tab === i ? "#7cb3ff" : "#556",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        {/* Scrollable content area */}
        <div style={{ overflowY: "auto", flex: 1, paddingRight: 4 }}>
        {/* Tab 0 — Referensi Panel */}
        {tab === 0 && (
          <>
            <Section title="Parameter" color="#00e5ff">
              <Row label="Crank (r)" desc="Panjang lengan engkol. Semakin besar, semakin panjang stroke slider." />
              <Row label="Rod (l)" desc="Panjang batang penghubung. Mempengaruhi rasio λ = r/l dan distorsi gerak." />
              <Row label="ω (omega)" desc="Kecepatan sudut crank. Akselerasi naik sebanding ω², bukan ω." />
            </Section>
            <Section title="Kontrol simulasi" color="#a3e635">
              <Row label="▶ Play" desc="Mulai animasi." />
              <Row label="⏸ Pause" desc="Jeda — aktifkan slider posisi θ manual di bawahnya." />
              <Row label="⏭ Step" desc="Maju satu langkah kecil untuk amati detail gerak." />
              <Row label="⏹ Reset" desc="Kembalikan θ ke 0° dan bersihkan riwayat grafik." />
              <Row label="Slider θ" desc="Hanya aktif saat Pause. Geser 0°–360° untuk eksplorasi bebas." />
            </Section>
            <Section title="Panel mekanisme" color="#ff6b35">
              <Row label="Canvas animasi" desc="Posisi crank, rod, dan slider secara real-time." />
              <Row label="Panah vB (hijau)" desc="Vektor kecepatan titik pin B — selalu tegak lurus crank." />
              <Row label="Panah vC (ungu)" desc="Vektor kecepatan slider C — selalu horizontal." />
              <Row label="Tabel kanan" desc="Nilai vC dan ωrod di 8 sudut kunci. Baris kuning = dead center." />
            </Section>
            <Section title="Anotasi kondisi kritis" color="#ffcd56">
              <Row label="λ rasio" desc="Selalu terlihat. Abu-abu = aman. Kuning/merah = distorsi signifikan." />
              <Row label="Dead center" desc="Aktif saat vC ≈ 0 — slider berbalik arah, terjadi 2× per putaran." />
              <Row label="Posisi singular" desc="Aktif saat θ ≈ 0° atau 180° — crank segaris dengan rod." />
              <Row label="ωrod ekstrem" desc="Aktif saat ωrod > 1.5× ω crank." />
            </Section>
            <Section title="Grafik" color="#c084fc">
              <Row label="Buka/tutup" desc="Klik header grafik untuk fokus pada variabel tertentu." />
              <Row label="Sumbu X" desc="Nilai θ dalam radian (0 – 2π), berulang tiap putaran." />
              <Row label="Hover" desc="Arahkan kursor untuk nilai tepat di sudut tertentu." />
            </Section>
          </>
        )}

        {/* Tab 1 — Cara Belajar */}
        {tab === 1 && (
          <>
            <p style={{ fontSize: "0.83rem", color: "#8a9bb5", marginBottom: 16, lineHeight: 1.6 }}>
              Ikuti alur belajar bertahap berikut. Setiap skenario membangun pemahaman dari konsep dasar ke analisis lanjutan.
            </p>

            <LearningStep
              num={1}
              color="#00e5ff"
              title="Pahami geometri mekanisme dulu"
              goal="Memahami hubungan fisik antara r, l, dan gerak slider"
              steps={[
                "Buka tab Dasar Teori → Posisi, baca persamaan xC.",
                "Kembali ke simulasi, set r = 1, l = 3, ω = 2, lalu Play.",
                "Amati: seberapa jauh slider bergerak? Itu adalah stroke = 2r.",
                "Pause, naikkan r ke 2 → perhatikan stroke ikut membesar.",
                "Pertanyaan: mengapa stroke selalu = 2r terlepas dari nilai l?",
              ]}
            />

            <LearningStep
              num={2}
              color="#a3e635"
              title="Amati dead center secara langsung"
              goal="Memahami kapan dan mengapa slider berbalik arah"
              steps={[
                "Set r = 1, l = 2.5, ω = 2, lalu Play sebentar.",
                "Pause → geser slider θ perlahan dari 0° ke 360°.",
                "Perhatikan panel anotasi: kapan label Dead Center menyala?",
                "Lihat juga tabel di samping canvas — baris mana yang kuning?",
                "Amati panah vC: arahnya berbalik tepat saat dead center aktif.",
              ]}
            />

            <LearningStep
              num={3}
              color="#ffcd56"
              title="Eksplorasi rasio λ = r/l"
              goal="Memahami kapan gerak slider mendekati harmonik sederhana"
              steps={[
                "Set r = 0.5, l = 5 (λ ≈ 0.1) → Play → lihat grafik x(t).",
                "Bandingkan dengan r = 2, l = 2.5 (λ = 0.8) → grafik berubah bentuk.",
                "Buka tab Dasar Teori → Geometri → baca penjelasan aproksimasi.",
                "Amati anotasi λ: warna berubah dari tosca → kuning → merah.",
                "Pertanyaan: pada λ berapa grafik x(t) mulai terlihat tidak simetris?",
              ]}
            />

            <LearningStep
              num={4}
              color="#ff6b35"
              title="Hubungkan kecepatan dan akselerasi"
              goal="Memahami mengapa akselerasi naik jauh lebih cepat dari kecepatan"
              steps={[
                "Set r = 1, l = 2.5, mulai dari ω = 2 → lihat grafik v dan a.",
                "Naikkan ω ke 10 → perhatikan perubahan skala grafik akselerasi.",
                "Naikkan lagi ke 20 → akselerasi melonjak drastis.",
                "Coba hitung manual: jika ω×2, maka a seharusnya ×4. Cocokkan dengan grafik.",
                "Buka tab Dasar Teori → Akselerasi untuk memverifikasi rumus aC.",
              ]}
            />

            <LearningStep
              num={5}
              color="#c084fc"
              title="Analisis kecepatan sudut rod"
              goal="Memahami mengapa ωrod bisa lebih besar dari ω crank"
              steps={[
                "Set r = 1.5, l = 2, ω = 5 → Play.",
                "Buka grafik Angular Vel ωrod(t) di panel kanan.",
                "Amati: kapan ωrod mencapai nilai maksimum? (sekitar θ = 90° atau 270°)",
                "Pause → geser slider θ ke 90° → lihat anotasi ωrod Ekstrem.",
                "Bandingkan nilai ωrod di tabel dengan nilai ω yang kamu set.",
              ]}
            />

            <div style={{
              marginTop: 16, padding: "12px 14px",
              background: "rgba(0, 229, 255, 0.05)",
              border: "1px solid rgba(0, 229, 255, 0.2)",
              borderRadius: 8, fontSize: "0.8rem", color: "#7cb3ff", lineHeight: 1.6,
            }}>
              💡 <strong>Tips belajar:</strong> Setelah setiap skenario, coba ubah satu parameter saja dan prediksi dulu apa yang akan terjadi sebelum menekan Play. Lalu verifikasi prediksimu dengan melihat grafik dan anotasi. Cara ini melatih intuisi kinematika lebih efektif daripada hanya mengamati animasi.
            </div>
          </>
        )}

        </div>
        <p style={{ marginTop: 12, fontSize: "0.75rem", color: "#3a4a6a", textAlign: "center", flexShrink: 0 }}>
          Klik di luar panel atau × untuk menutup
        </p>
      </div>
    </div>
  )
}

function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "0.08em",
        textTransform: "uppercase", color, marginBottom: 8,
        paddingBottom: 4, borderBottom: `1px solid ${color}33`,
      }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, desc }) {
  return (
    <div style={{ display: "flex", gap: 10, fontSize: "0.82rem" }}>
      <span style={{ color: "#fff", fontWeight: "500", minWidth: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#8a9bb5", lineHeight: 1.5 }}>{desc}</span>
    </div>
  )
}

function LearningStep({ num, color, title, goal, steps }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${color}33` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left", background: `${color}18`,
          border: "none", padding: "10px 14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: "50%",
          background: color, color: "#0b0f1c",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.78rem", fontWeight: "bold", flexShrink: 0,
        }}>{num}</div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: "0.88rem", fontWeight: "bold", color: "#fff" }}>{title}</div>
          <div style={{ fontSize: "0.75rem", color, marginTop: 1 }}>Tujuan: {goal}</div>
        </div>
        <span style={{ color, fontSize: "0.7rem", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${color}22` }}>
          <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
            {steps.map((s, i) => (
              <li key={i} style={{ fontSize: "0.8rem", color: "#8a9bb5", lineHeight: 1.55 }}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
