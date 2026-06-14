import { useState } from "react"
import { C } from "../colors"

const TABS = ["Referensi Panel", "Cara Belajar"]

export default function GuideModal({ onClose }) {
  const [tab, setTab] = useState(0)
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, maxWidth: 640, width: "100%", maxHeight: "88vh", boxShadow: "0 8px 40px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Panduan Penggunaan</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: C.muted, fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "5px 14px", borderRadius: 6, cursor: "pointer", fontWeight: "bold", fontSize: "0.82rem",
              background: tab === i ? `${C.crank}22` : "transparent",
              border: `1px solid ${tab === i ? C.crank : C.border}`,
              color: tab === i ? C.crank : "#888", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: 4 }}>
          {tab === 0 && (
            <>
              <Section title="Parameter" color={C.crank}>
                <Row label="Crank (r)" desc="Panjang lengan engkol. Semakin besar, semakin panjang stroke slider." />
                <Row label="Rod (l)" desc="Panjang batang penghubung. Mempengaruhi rasio λ = r/l dan distorsi gerak." />
                <Row label="ω (omega)" desc="Kecepatan sudut crank. Akselerasi naik sebanding ω², bukan ω." />
              </Section>
              <Section title="Kontrol simulasi" color={C.frod}>
                <Row label="▶ Play" desc="Mulai animasi." />
                <Row label="⏸ Pause" desc="Jeda — aktifkan slider posisi θ manual di bawahnya." />
                <Row label="⏭ Step" desc="Maju satu langkah kecil." />
                <Row label="⏹ Reset" desc="Kembalikan θ ke 0° dan bersihkan riwayat grafik." />
                <Row label="Slider θ" desc="Hanya aktif saat Pause. Geser 0°–360° untuk eksplorasi bebas." />
              </Section>
              <Section title="Panel mekanisme" color={C.rod}>
                <Row label="Crank" desc="Batang biru — lengan engkol berputar." />
                <Row label="Rod/Slider" desc="Batang & kotak oranye — connecting rod dan slider." />
                <Row label="vB / vC" desc="Panah kecepatan di titik B dan slider C." />
                <Row label="F slider/rod/pin" desc="Panah gaya inersia pada tiap elemen (massa = 5 kg)." />
                <Row label="Tabel kanan" desc="Nilai vC, ωrod, Fslider di 8 sudut kunci. Baris kuning = dead center." />
              </Section>
              <Section title="Anotasi kondisi kritis" color={C.warn}>
                <Row label="λ rasio" desc="Selalu terlihat. Warna berubah sesuai tingkat distorsi harmonik." />
                <Row label="Dead center" desc="Aktif saat vC ≈ 0 — slider berbalik arah." />
                <Row label="Posisi singular" desc="Aktif saat θ ≈ 0° atau 180°." />
                <Row label="ωrod ekstrem" desc="Aktif saat ωrod > 1.5× ω crank." />
              </Section>
              <Section title="Grafik" color={C.vc}>
                <Row label="Buka/tutup" desc="Klik header grafik untuk fokus pada variabel tertentu." />
                <Row label="Sumbu X" desc="θ dalam radian (0–2π), berulang tiap putaran." />
                <Row label="Hover" desc="Arahkan kursor untuk nilai tepat." />
              </Section>
            </>
          )}
          {tab === 1 && (
            <>
              <p style={{ fontSize: "0.83rem", color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
                Ikuti alur belajar bertahap berikut untuk membangun pemahaman dari konsep dasar ke analisis lanjutan.
              </p>
              <LearningStep num={1} color={C.crank} title="Pahami geometri mekanisme" goal="Memahami hubungan r, l, dan stroke slider"
                steps={["Buka tab Dasar Teori → Posisi, baca persamaan xC.", "Set r=1, l=3, ω=2 → Play. Amati stroke slider.", "Naikkan r ke 2 → stroke ikut membesar.", "Pertanyaan: mengapa stroke selalu = 2r terlepas dari l?"]} />
              <LearningStep num={2} color={C.frod} title="Amati dead center" goal="Memahami kapan dan mengapa slider berbalik arah"
                steps={["Play sebentar lalu Pause.", "Geser slider θ perlahan 0°→360°.", "Perhatikan kapan anotasi Dead Center menyala.", "Amati panah vC: arahnya berbalik tepat saat dead center aktif."]} />
              <LearningStep num={3} color={C.warn} title="Eksplorasi rasio λ" goal="Memahami kapan gerak mendekati harmonik sederhana"
                steps={["Set r=0.5, l=5 (λ≈0.1) → lihat grafik x(t).", "Bandingkan r=2, l=2.5 (λ=0.8).", "Baca tab Dasar Teori → Geometri.", "Pada λ berapa grafik x(t) mulai terlihat tidak simetris?"]} />
              <LearningStep num={4} color={C.fslider} title="Hubungkan kecepatan dan akselerasi" goal="Memahami mengapa akselerasi naik jauh lebih cepat"
                steps={["Set ω=2 → lihat grafik v dan a.", "Naikkan ω ke 10 → amati perubahan skala akselerasi.", "Naikkan ke 20 → coba hitung: jika ω×2, a seharusnya ×4.", "Verifikasi dengan tab Dasar Teori → Akselerasi."]} />
              <LearningStep num={5} color={C.vc} title="Analisis kecepatan sudut rod" goal="Memahami mengapa ωrod bisa melebihi ω crank"
                steps={["Set r=1.5, l=2, ω=5 → Play.", "Buka grafik Angular Vel ωrod(t).", "Kapan ωrod mencapai maksimum? (sekitar θ=90°)", "Pause → geser θ ke 90° → lihat anotasi ωrod Ekstrem."]} />
              <div style={{ marginTop: 16, padding: "12px 14px", background: `${C.crank}10`, border: `1px solid ${C.crank}33`, borderRadius: 8, fontSize: "0.8rem", color: C.crank, lineHeight: 1.6 }}>
                💡 <strong>Tips:</strong> Setelah setiap skenario, prediksi dulu apa yang terjadi sebelum menekan Play — lalu verifikasi. Cara ini melatih intuisi kinematika lebih efektif.
              </div>
            </>
          )}
        </div>
        <p style={{ marginTop: 12, fontSize: "0.75rem", color: C.dimmed, textAlign: "center", flexShrink: 0 }}>Klik di luar panel atau × untuk menutup</p>
      </div>
    </div>
  )
}

function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "0.08em", textTransform: "uppercase", color, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${color}33` }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </div>
  )
}

function Row({ label, desc }) {
  return (
    <div style={{ display: "flex", gap: 10, fontSize: "0.82rem" }}>
      <span style={{ color: "#fff", fontWeight: "500", minWidth: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ color: C.muted, lineHeight: 1.5 }}>{desc}</span>
    </div>
  )
}

function LearningStep({ num, color, title, goal, steps }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${color}33` }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", textAlign: "left", background: `${color}18`, border: "none", padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: color, color: "#0b0f1c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: "bold", flexShrink: 0 }}>{num}</div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: "0.88rem", fontWeight: "bold", color: "#fff" }}>{title}</div>
          <div style={{ fontSize: "0.75rem", color, marginTop: 1 }}>Tujuan: {goal}</div>
        </div>
        <span style={{ color, fontSize: "0.7rem", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${color}22` }}>
          <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
            {steps.map((s, i) => <li key={i} style={{ fontSize: "0.8rem", color: C.muted, lineHeight: 1.55 }}>{s}</li>)}
          </ol>
        </div>
      )}
    </div>
  )
}
