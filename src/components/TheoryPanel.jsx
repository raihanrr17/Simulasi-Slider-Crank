import { useEffect } from "react"

// Load KaTeX dari CDN sekali saja
function loadKaTeX(cb) {
  if (window.katex) { cb(); return }
  const link = document.createElement("link")
  link.rel  = "stylesheet"
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
  document.head.appendChild(link)
  const script = document.createElement("script")
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"
  script.onload = cb
  document.head.appendChild(script)
}

function Eq({ tex, block = false }) {
  const ref = { current: null }
  useEffect(() => {
    loadKaTeX(() => {
      if (ref.current && window.katex) {
        window.katex.render(tex, ref.current, { displayMode: block, throwOnError: false })
      }
    })
  }, [tex, block])
  return <span ref={r => { ref.current = r }} />
}

const refs = [
  {
    authors: "Erdman, A. G., Sandor, G. N., & Kota, S.",
    year: 2001,
    title: "Mechanism Design: Analysis and Synthesis (4th ed.)",
    source: "Prentice Hall",
  },
  {
    authors: "Norton, R. L.",
    year: 2020,
    title: "Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines (6th ed.)",
    source: "McGraw-Hill",
  },
  {
    authors: "Shigley, J. E., & Uicker, J. J.",
    year: 2022,
    title: "Theory of Machines and Mechanisms (5th ed.)",
    source: "Oxford University Press",
  },
  {
    authors: "Sancibrian, R., et al.",
    year: 2021,
    title: "A general procedure based on exact gradient for optimization of mechanisms",
    source: "Mechanism and Machine Theory, 159, 104258",
  },
  {
    authors: "Bai, S., & Angeles, J.",
    year: 2022,
    title: "Kinematic synthesis of RCCC linkages for prescribed four poses",
    source: "Mechanism and Machine Theory, 168, 104580",
  },
]

export default function TheoryPanel() {
  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <h2 style={{ marginTop: 0 }}>Dasar Teori — Slider-Crank Mechanism</h2>

      {/* ── 1. Kinematika Posisi ── */}
      <h3 style={{ color: "#00e5ff", marginBottom: 4 }}>1. Analisis Posisi</h3>
      <p style={{ color: "#ccc", fontSize: "0.9rem", marginTop: 0 }}>
        Posisi slider C diperoleh dari loop-closure equation mekanisme empat-batang:
      </p>
      <div style={{ margin: "8px 0 4px 24px" }}>
        <Eq block tex="x_C = r\cos\theta + \sqrt{l^2 - r^2\sin^2\theta}" />
      </div>
      <p style={{ color: "#ccc", fontSize: "0.9rem" }}>
        dengan sudut konekting rod <Eq tex="\phi" /> diperoleh dari:
      </p>
      <div style={{ margin: "8px 0 4px 24px" }}>
        <Eq block tex="\phi = \arcsin\!\left(\frac{r}{l}\sin\theta\right)" />
      </div>

      {/* ── 2. Kinematika Kecepatan ── */}
      <h3 style={{ color: "#ff6384", marginBottom: 4 }}>2. Analisis Kecepatan</h3>
      <p style={{ color: "#ccc", fontSize: "0.9rem", marginTop: 0 }}>
        Kecepatan titik B (pin crank–rod) dan slider C:
      </p>
      <div style={{ margin: "8px 0 4px 24px" }}>
        <Eq block tex="\vec{v}_B = \omega \times \vec{r}_{AB} \implies v_{Bx} = -r\omega\sin\theta,\quad v_{By} = r\omega\cos\theta" />
      </div>
      <div style={{ margin: "8px 0 4px 24px" }}>
        <Eq block tex="v_C = -r\omega\sin\theta - l\,\omega_{rod}\sin\phi" />
      </div>
      <p style={{ color: "#ccc", fontSize: "0.9rem" }}>
        Kecepatan sudut konekting rod:
      </p>
      <div style={{ margin: "8px 0 4px 24px" }}>
        <Eq block tex="\omega_{rod} = \frac{r\,\omega\cos\theta}{l\cos\phi}" />
      </div>

      {/* ── 3. Kinematika Akselerasi ── */}
      <h3 style={{ color: "#ffcd56", marginBottom: 4 }}>3. Analisis Akselerasi</h3>
      <p style={{ color: "#ccc", fontSize: "0.9rem", marginTop: 0 }}>
        Akselerasi slider C (asumsi <Eq tex="\alpha_{crank}=0" />, kecepatan sudut konstan):
      </p>
      <div style={{ margin: "8px 0 4px 24px" }}>
        <Eq block tex="a_C = -r\omega^2\cos\theta - l\!\left(\alpha_{rod}\sin\phi + \omega_{rod}^2\cos\phi\right)" />
      </div>
      <div style={{ margin: "8px 0 4px 24px" }}>
        <Eq block tex="\alpha_{rod} = \frac{-r\omega^2\sin\theta\cos\phi - l\,\omega_{rod}^2\sin\phi\cos\phi}{l\cos^2\phi}" />
      </div>

      {/* ── 4. Rasio r/l ── */}
      <h3 style={{ color: "#c084fc", marginBottom: 4 }}>4. Rasio Geometri</h3>
      <p style={{ color: "#ccc", fontSize: "0.9rem", marginTop: 0 }}>
        Rasio <Eq tex="\lambda = r/l" /> menentukan karakteristik kinematik.
        Untuk <Eq tex="\lambda \ll 1" /> (rod panjang), gerakan slider mendekati
        gerak harmonik sederhana:
      </p>
      <div style={{ margin: "8px 0 4px 24px" }}>
        <Eq block tex="x_C \approx r\cos\theta + l\left(1 - \frac{\lambda^2}{2}\sin^2\theta\right)" />
      </div>

      {/* ── Referensi ── */}
      <h3 style={{ color: "#94a3b8", marginBottom: 6 }}>Referensi</h3>
      <ol style={{ color: "#aaa", fontSize: "0.82rem", lineHeight: 1.8, paddingLeft: 20 }}>
        {refs.map((r, i) => (
          <li key={i}>
            {r.authors} ({r.year}). <em>{r.title}</em>. {r.source}.
          </li>
        ))}
      </ol>
    </div>
  )
}
