import { useState } from "react"
import {
  eq_xc, eq_phi,
  eq_vbx, eq_vc, eq_wrod,
  eq_ac, eq_arod,
  eq_lambda, eq_approx,
} from "../assets/equations"

// ── Expander ──
function Expander({ title, color = "#aaa", defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", textAlign: "left",
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${color}66`,
        borderRadius: open ? "6px 6px 0 0" : 6,
        padding: "7px 12px", color,
        fontWeight: "bold", fontSize: "0.88rem",
        cursor: "pointer", display: "flex",
        justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{title}</span>
        <span style={{ fontSize: "0.72rem", opacity: 0.7 }}>{open ? "▲ tutup" : "▼ buka"}</span>
      </button>
      {open && (
        <div style={{
          border: `1px solid ${color}33`, borderTop: "none",
          borderRadius: "0 0 6px 6px", padding: "12px 14px",
          background: "rgba(255,255,255,0.02)",
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Equation image ──
function EqImg({ src, alt }) {
  return (
    <div style={{ margin: "10px 0", textAlign: "center" }}>
      <img src={src} alt={alt} style={{ maxWidth: "100%", height: "auto" }} />
    </div>
  )
}

// ── Tab bar ──
const TABS = [
  { label: "Posisi",      color: "#00e5ff" },
  { label: "Kecepatan",   color: "#ff6384" },
  { label: "Akselerasi",  color: "#ffcd56" },
  { label: "Geometri",    color: "#c084fc" },
  { label: "Referensi",   color: "#94a3b8" },
]

const ps = { color: "#ccc", fontSize: "0.88rem", lineHeight: 1.7, marginTop: 4 }

const refs = [
  { authors: "Erdman, A. G., Sandor, G. N., & Kota, S.", year: 2001,
    title: "Mechanism Design: Analysis and Synthesis (4th ed.)", source: "Prentice Hall" },
  { authors: "Norton, R. L.", year: 2020,
    title: "Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines (6th ed.)",
    source: "McGraw-Hill" },
  { authors: "Shigley, J. E., & Uicker, J. J.", year: 2022,
    title: "Theory of Machines and Mechanisms (5th ed.)", source: "Oxford University Press" },
  { authors: "Sancibrian, R., et al.", year: 2021,
    title: "A general procedure based on exact gradient for optimization of mechanisms",
    source: "Mechanism and Machine Theory, 159, 104258" },
  { authors: "Bai, S., & Angeles, J.", year: 2022,
    title: "Kinematic synthesis of RCCC linkages for prescribed four poses",
    source: "Mechanism and Machine Theory, 168, 104580" },
]

function TabPosisi() {
  return (
    <>
      <p style={ps}>
        Posisi slider C diperoleh dari <em>loop-closure equation</em> mekanisme slider-crank.
        Dengan menjumlahkan vektor posisi sepanjang loop tertutup A→B→C→A:
      </p>
      <Expander title="Persamaan Posisi Slider" color="#00e5ff" defaultOpen>
        <EqImg src={eq_xc} alt="xC = r cos theta + sqrt(l^2 - r^2 sin^2 theta)" />
        <p style={ps}>Sudut konekting rod φ terhadap sumbu horizontal:</p>
        <EqImg src={eq_phi} alt="phi = arcsin(r/l sin theta)" />
      </Expander>
      <Expander title="Variabel & Notasi" color="#00e5ff">
        <p style={ps}>
          <strong style={{ color: "#00e5ff" }}>r</strong> — panjang crank (m)<br />
          <strong style={{ color: "#00e5ff" }}>l</strong> — panjang connecting rod (m)<br />
          <strong style={{ color: "#00e5ff" }}>θ</strong> — sudut rotasi crank (rad)<br />
          <strong style={{ color: "#00e5ff" }}>φ</strong> — sudut connecting rod terhadap sumbu x (rad)<br />
          <strong style={{ color: "#00e5ff" }}>xC</strong> — posisi slider C (m)
        </p>
      </Expander>
    </>
  )
}

function TabKecepatan() {
  return (
    <>
      <p style={ps}>
        Analisis kecepatan menggunakan diferensiasi persamaan posisi terhadap waktu,
        dengan kecepatan sudut crank ω dianggap konstan.
      </p>
      <Expander title="Kecepatan Titik B (Pin Crank–Rod)" color="#ff6384" defaultOpen>
        <EqImg src={eq_vbx} alt="vBx = -r omega sin theta, vBy = r omega cos theta" />
      </Expander>
      <Expander title="Kecepatan Slider C" color="#ff6384" defaultOpen>
        <EqImg src={eq_vc} alt="vC = -r omega sin theta - l omegaRod sin phi" />
      </Expander>
      <Expander title="Kecepatan Sudut Connecting Rod" color="#ff6384">
        <EqImg src={eq_wrod} alt="omegaRod = r omega cos theta / l cos phi" />
        <p style={ps}>
          ωrod diperoleh dari syarat bahwa komponen kecepatan tegak lurus rod di titik B
          dan C harus sama (constraint rigid body).
        </p>
      </Expander>
    </>
  )
}

function TabAkselerasi() {
  return (
    <>
      <p style={ps}>
        Akselerasi diperoleh dengan mendiferensiasikan persamaan kecepatan.
        Asumsi: kecepatan sudut crank ω konstan sehingga αcrank = 0.
      </p>
      <Expander title="Akselerasi Slider C" color="#ffcd56" defaultOpen>
        <EqImg src={eq_ac} alt="aC = -r omega^2 cos theta - l(alphaRod sin phi + omegaRod^2 cos phi)" />
      </Expander>
      <Expander title="Percepatan Sudut Connecting Rod" color="#ffcd56" defaultOpen>
        <EqImg src={eq_arod} alt="alphaRod formula" />
      </Expander>
    </>
  )
}

function TabGeometri() {
  return (
    <>
      <p style={ps}>
        Karakteristik kinematik mekanisme sangat dipengaruhi oleh rasio geometri λ = r/l.
      </p>
      <Expander title="Rasio Geometri λ" color="#c084fc" defaultOpen>
        <EqImg src={eq_lambda} alt="lambda = r/l" />
        <p style={ps}>
          <strong style={{ color: "#c084fc" }}>λ {"<"} 0.1</strong> — gerak slider sangat mendekati gerak harmonik sederhana.<br />
          <strong style={{ color: "#c084fc" }}>0.1 ≤ λ ≤ 0.5</strong> — karakteristik khas slider-crank, ada distorsi harmonik.<br />
          <strong style={{ color: "#c084fc" }}>λ {">"} 0.5</strong> — distorsi besar, perlu analisis penuh (tidak bisa diaproksimasi).
        </p>
      </Expander>
      <Expander title="Aproksimasi Harmonik Sederhana (λ ≪ 1)" color="#c084fc">
        <EqImg src={eq_approx} alt="xC approx r cos theta + l(1 - lambda^2/2 sin^2 theta)" />
        <p style={ps}>
          Untuk rod yang sangat panjang dibanding crank, suku orde tinggi λ² dapat diabaikan
          sehingga posisi slider mendekati fungsi cosinus murni.
        </p>
      </Expander>
    </>
  )
}

function TabReferensi() {
  return (
    <>
      <p style={ps}>Referensi utama yang digunakan dalam modul ini:</p>
      <ol style={{ color: "#aaa", fontSize: "0.82rem", lineHeight: 2, paddingLeft: 20 }}>
        {refs.map((r, i) => (
          <li key={i}>
            {r.authors} ({r.year}). <em style={{ color: "#ccc" }}>{r.title}</em>. {r.source}.
          </li>
        ))}
      </ol>
    </>
  )
}

const TAB_CONTENT = [TabPosisi, TabKecepatan, TabAkselerasi, TabGeometri, TabReferensi]

export default function TheoryPanel() {
  const [activeTab, setActiveTab] = useState(0)
  const Content = TAB_CONTENT[activeTab]

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>Dasar Teori — Slider-Crank Mechanism</h2>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
        {TABS.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: "6px 14px", borderRadius: 6, cursor: "pointer",
            fontWeight: "bold", fontSize: "0.82rem",
            background: activeTab === i ? tab.color + "22" : "transparent",
            border: `1px solid ${activeTab === i ? tab.color : "#334"}`,
            color: activeTab === i ? tab.color : "#888",
            transition: "all 0.15s",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Content />
      </div>
    </div>
  )
}
