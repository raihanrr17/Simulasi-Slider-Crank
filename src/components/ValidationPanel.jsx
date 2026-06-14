import { C } from "../colors"

export default function ValidationPanel({ r, l, omega, theta }) {
  const tNorm  = ((theta ?? 0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
  const safeR  = r     ?? 0
  const safeL  = l     ?? 0
  const safeO  = omega ?? 0
  const lambda = safeR / safeL

  const sinT     = Math.sin(tNorm)
  const cosT     = Math.cos(tNorm)
  const sinPhi   = (safeR / safeL) * sinT
  const cosPhi   = Math.sqrt(Math.max(0, 1 - sinPhi ** 2))
  const omegaRod = (safeR * safeO * cosT) / (safeL * cosPhi || 1)
  const vC       = -safeR * safeO * sinT - safeL * omegaRod * sinPhi
  const xC       = safeR * cosT + Math.sqrt(Math.max(0, safeL ** 2 - safeR ** 2 * sinT ** 2))

  const xExpr = `${safeR} · cos(${tNorm.toFixed(2)}) + √(${safeL}² − ${safeR}² · sin²(${tNorm.toFixed(2)}))`

  const annotations = [
    {
      icon: "λ", label: "Rasio Geometri",
      desc: "Aktif saat λ > 0.5 — distorsi besar, aproksimasi harmonik tidak valid",
      activeDesc: lambda > 0.5
        ? `λ = ${lambda.toFixed(2)} — distorsi besar, aproksimasi harmonik tidak valid`
        : lambda > 0.1
        ? `λ = ${lambda.toFixed(2)} — distorsi harmonik mulai signifikan`
        : `λ = ${lambda.toFixed(2)} — gerak slider ≈ harmonik sederhana`,
      active: true,
      color: lambda > 0.5 ? C.danger : lambda > 0.1 ? C.warn : C.success,
    },
    {
      icon: "⬤", label: "Dead Center",
      desc: "Aktif saat vC ≈ 0 — slider berbalik arah gerak",
      activeDesc: `vC = ${vC.toFixed(3)} m/s — slider di titik mati, berbalik arah`,
      active: Math.abs(vC) < 0.05,
      color: C.warn,
    },
    {
      icon: "📌", label: "Posisi Singular",
      desc: "Aktif saat θ ≈ 0° atau 180° — crank segaris dengan connecting rod",
      activeDesc: `θ = ${(tNorm * 180 / Math.PI).toFixed(1)}° — crank segaris dengan rod`,
      active: Math.abs(tNorm) < 0.08 || Math.abs(tNorm - Math.PI) < 0.08,
      color: C.vb,
    },
    {
      icon: "⚡", label: "ωrod Ekstrem",
      desc: "Aktif saat ωrod > 1.5× ω — rod berputar jauh lebih cepat dari crank",
      activeDesc: `ωrod = ${omegaRod.toFixed(2)} rad/s — jauh melebihi ω crank (${safeO} rad/s)`,
      active: Math.abs(omegaRod) > Math.abs(safeO) * 1.5,
      color: C.vc,
    },
  ]

  const box = (borderColor, bg) => ({
    fontFamily: "monospace", fontSize: "0.82rem", margin: "0 0 8px",
    background: bg, border: `1px solid ${C.border}`,
    borderRadius: 6, padding: "8px 12px",
  })

  return (
    <div className="panel" style={{ marginTop: 12 }}>
      <h2>Equation Validation</h2>

      <div style={box("", "rgba(255,255,255,0.03)")}>
        <div style={{ color: "#555", fontSize: "0.68rem", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Posisi Slider</div>
        <div style={{ color: C.muted, marginBottom: 4, fontSize: "0.8rem" }}>x(θ) = {xExpr}</div>
        <div style={{ color: C.crank, fontWeight: "bold", fontSize: "0.95rem" }}>x(θ) = {xC.toFixed(4)} m</div>
      </div>

      <div style={box("", "rgba(255,255,255,0.03)")}>
        <div style={{ color: "#555", fontSize: "0.68rem", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Kecepatan Linier Slider</div>
        <div style={{ color: C.muted, marginBottom: 4, fontSize: "0.8rem" }}>vC = −r·ω·sin(θ) − l·ωrod·sin(φ)</div>
        <div style={{ color: C.vc, fontWeight: "bold", fontSize: "0.95rem" }}>vC = {vC.toFixed(4)} m/s</div>
      </div>

      <div style={{ ...box("", "rgba(255,255,255,0.03)"), margin: "0 0 14px" }}>
        <div style={{ color: "#555", fontSize: "0.68rem", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Kecepatan Sudut Connecting Rod</div>
        <div style={{ color: C.muted, marginBottom: 4, fontSize: "0.8rem" }}>ωrod = (r·ω·cos(θ)) / (l·cos(φ))</div>
        <div style={{ color: C.omegrod, fontWeight: "bold", fontSize: "0.95rem" }}>ωrod = {omegaRod.toFixed(4)} rad/s</div>
      </div>

      <div style={{ display: "flex", gap: 16, fontSize: "0.83rem", color: C.muted, marginBottom: 14, flexWrap: "wrap" }}>
        <span>r = <strong style={{ color: "#fff" }}>{safeR} m</strong></span>
        <span>l = <strong style={{ color: "#fff" }}>{safeL} m</strong></span>
        <span>ω = <strong style={{ color: "#fff" }}>{safeO} rad/s</strong></span>
        <span>θ = <strong style={{ color: "#fff" }}>{tNorm.toFixed(2)} rad</strong> ({(tNorm * 180 / Math.PI).toFixed(1)}°)</span>
        <span>λ = <strong style={{ color: "#fff" }}>{lambda.toFixed(3)}</strong></span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {annotations.map((n, i) => {
          const col    = n.active ? n.color : C.dimmed
          const border = n.active ? `${n.color}55` : "#2d3748"
          const bg     = n.active ? `${n.color}18` : "rgba(255,255,255,0.03)"
          return (
            <div key={i} style={{ padding: "7px 10px", borderRadius: 6, background: bg, border: `1px solid ${border}`, display: "flex", gap: 10, alignItems: "flex-start", transition: "all 0.3s" }}>
              <span style={{ color: col, fontSize: "0.85rem", minWidth: 18, marginTop: 1 }}>{n.icon}</span>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: "bold", color: col, marginBottom: 1 }}>{n.label}</div>
                <div style={{ fontSize: "0.75rem", color: n.active ? col : C.dimmed }}>{n.active ? n.activeDesc : n.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
