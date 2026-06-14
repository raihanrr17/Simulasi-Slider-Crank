import { useEffect, useState, useRef } from "react"
import { C } from "../colors"

function loadKaTeX(cb) {
  if (window.katex) { cb(); return }
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
  document.head.appendChild(link)
  const script = document.createElement("script")
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"
  script.onload = cb
  document.head.appendChild(script)
}

function Eq({ tex, block = false }) {
  const elRef = useRef(null)
  useEffect(() => {
    loadKaTeX(() => {
      if (elRef.current && window.katex)
        window.katex.render(tex, elRef.current, { displayMode: block, throwOnError: false })
    })
  }, [tex, block])
  return <span ref={elRef} />
}

function Expander({ title, color = C.muted, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", textAlign: "left",
        background: open ? `${color}18` : "rgba(255,255,255,0.05)",
        border: `1px solid ${open ? color : color + "44"}`,
        borderRadius: open ? "6px 6px 0 0" : 6,
        padding: "7px 12px", color, fontWeight: "bold", fontSize: "0.88rem",
        cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{title}</span>
        <span style={{ fontSize: "0.72rem", opacity: 0.7 }}>{open ? "▲ tutup" : "▼ buka"}</span>
      </button>
      {open && (
        <div style={{ border: `1px solid ${color}33`, borderTop: "none", borderRadius: "0 0 6px 6px", padding: "12px 14px", background: "rgba(255,255,255,0.02)" }}>
          {children}
        </div>
      )}
    </div>
  )
}

const TABS = [
  { label: "Posisi",     color: C.crank   },
  { label: "Kecepatan",  color: C.vc      },
  { label: "Akselerasi", color: C.fslider },
  { label: "Geometri",   color: C.omegrod },
  { label: "Referensi",  color: C.muted   },
]

const ps = { color: C.muted, fontSize: "0.88rem", lineHeight: 1.7, marginTop: 4 }
const eq = { margin: "10px 0", textAlign: "center" }

const refs = [
  { authors: "Erdman, A. G., Sandor, G. N., & Kota, S.", year: 2001, title: "Mechanism Design: Analysis and Synthesis (4th ed.)", source: "Prentice Hall" },
  { authors: "Norton, R. L.", year: 2020, title: "Design of Machinery (6th ed.)", source: "McGraw-Hill" },
  { authors: "Shigley, J. E., & Uicker, J. J.", year: 2022, title: "Theory of Machines and Mechanisms (5th ed.)", source: "Oxford University Press" },
  { authors: "Sancibrian, R., et al.", year: 2021, title: "A general procedure based on exact gradient for optimization of mechanisms", source: "Mechanism and Machine Theory, 159, 104258" },
  { authors: "Bai, S., & Angeles, J.", year: 2022, title: "Kinematic synthesis of RCCC linkages for prescribed four poses", source: "Mechanism and Machine Theory, 168, 104580" },
]

const TAB_CONTENT = [
  () => (
    <>
      <p style={ps}>Posisi slider C dari loop-closure equation:</p>
      <Expander title="Persamaan Posisi Slider" color={C.crank} defaultOpen>
        <div style={eq}><Eq block tex="x_C = r\cos\theta + \sqrt{l^2 - r^2\sin^2\theta}" /></div>
        <p style={ps}>Sudut connecting rod φ:</p>
        <div style={eq}><Eq block tex="\phi = \arcsin\!\left(\frac{r}{l}\sin\theta\right)" /></div>
      </Expander>
      <Expander title="Variabel & Notasi" color={C.crank}>
        <p style={ps}>
          <strong style={{ color: C.crank }}>r</strong> — panjang crank (m)<br />
          <strong style={{ color: C.crank }}>l</strong> — panjang connecting rod (m)<br />
          <strong style={{ color: C.crank }}>θ</strong> — sudut rotasi crank (rad)<br />
          <strong style={{ color: C.crank }}>φ</strong> — sudut connecting rod (rad)
        </p>
      </Expander>
    </>
  ),
  () => (
    <>
      <p style={ps}>Kecepatan diperoleh dari diferensiasi persamaan posisi, ω konstan.</p>
      <Expander title="Kecepatan Titik B" color={C.vc} defaultOpen>
        <div style={eq}><Eq block tex="v_{Bx} = -r\omega\sin\theta,\quad v_{By} = r\omega\cos\theta" /></div>
      </Expander>
      <Expander title="Kecepatan Slider C" color={C.vc} defaultOpen>
        <div style={eq}><Eq block tex="v_C = -r\omega\sin\theta - l\,\omega_{rod}\sin\phi" /></div>
      </Expander>
      <Expander title="Kecepatan Sudut Rod" color={C.omegrod}>
        <div style={eq}><Eq block tex="\omega_{rod} = \frac{r\,\omega\cos\theta}{l\cos\phi}" /></div>
      </Expander>
    </>
  ),
  () => (
    <>
      <p style={ps}>Akselerasi diperoleh dari diferensiasi kecepatan, αcrank = 0.</p>
      <Expander title="Akselerasi Slider C" color={C.fslider} defaultOpen>
        <div style={eq}><Eq block tex="a_C = -r\omega^2\cos\theta - l(\alpha_{rod}\sin\phi + \omega_{rod}^2\cos\phi)" /></div>
      </Expander>
      <Expander title="Percepatan Sudut Rod" color={C.fslider} defaultOpen>
        <div style={eq}><Eq block tex="\alpha_{rod} = \frac{-r\omega^2\sin\theta\cos\phi - l\,\omega_{rod}^2\sin\phi\cos\phi}{l\cos^2\phi}" /></div>
      </Expander>
    </>
  ),
  () => (
    <>
      <p style={ps}>Rasio λ = r/l menentukan karakteristik kinematik mekanisme.</p>
      <Expander title="Rasio Geometri λ" color={C.omegrod} defaultOpen>
        <div style={eq}><Eq block tex="\lambda = \frac{r}{l}" /></div>
        <p style={ps}>
          <strong style={{ color: C.success }}>λ &lt; 0.1</strong> — mendekati harmonik sederhana<br />
          <strong style={{ color: C.warn }}>0.1 ≤ λ ≤ 0.5</strong> — distorsi harmonik terasa<br />
          <strong style={{ color: C.danger }}>λ &gt; 0.5</strong> — distorsi besar, analisis penuh diperlukan
        </p>
      </Expander>
      <Expander title="Aproksimasi Harmonik (λ ≪ 1)" color={C.omegrod}>
        <div style={eq}><Eq block tex="x_C \approx r\cos\theta + l\!\left(1 - \frac{\lambda^2}{2}\sin^2\theta\right)" /></div>
      </Expander>
    </>
  ),
  () => (
    <>
      <p style={ps}>Referensi utama yang digunakan dalam modul ini:</p>
      <ol style={{ color: C.muted, fontSize: "0.82rem", lineHeight: 2, paddingLeft: 20 }}>
        {refs.map((r, i) => (
          <li key={i}>{r.authors} ({r.year}). <em style={{ color: "#ccc" }}>{r.title}</em>. {r.source}.</li>
        ))}
      </ol>
    </>
  ),
]

export default function TheoryPanel() {
  const [activeTab, setActiveTab] = useState(0)
  const Content = TAB_CONTENT[activeTab]
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>Dasar Teori — Slider-Crank Mechanism</h2>
      <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
        {TABS.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: "6px 14px", borderRadius: 6, cursor: "pointer",
            fontWeight: "bold", fontSize: "0.82rem",
            background: activeTab === i ? `${tab.color}22` : "transparent",
            border: `1px solid ${activeTab === i ? tab.color : C.border}`,
            color: activeTab === i ? tab.color : "#888",
            transition: "all 0.15s",
          }}>{tab.label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Content />
      </div>
    </div>
  )
}
