export default function ValidationPanel({ r, l, omega, theta }) {
  const tNorm   = ((theta ?? 0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
  const safeR   = r   ?? 0
  const safeL   = l   ?? 0
  const safeO   = omega ?? 0
  const lambda  = safeR / safeL

  const sinT    = Math.sin(tNorm)
  const cosT    = Math.cos(tNorm)
  const sinPhi  = (safeR / safeL) * sinT
  const cosPhi  = Math.sqrt(Math.max(0, 1 - sinPhi ** 2))
  const omegaRod = (safeR * safeO * cosT) / (safeL * cosPhi || 1)
  const vC      = -safeR * safeO * sinT - safeL * omegaRod * sinPhi

  const xExpr = `${safeR} · cos(${tNorm.toFixed(2)}) + √(${safeL}² − ${safeR}² · sin²(${tNorm.toFixed(2)}))`

  // ── Anotasi ──
  const notes = []

  if (lambda < 0.1)
    notes.push({ color: "#4bc0c0", icon: "✅", text: `λ = ${lambda.toFixed(2)} — gerak slider ≈ harmonik sederhana (rod sangat panjang)` })
  else if (lambda <= 0.5)
    notes.push({ color: "#ffcd56", icon: "⚠️", text: `λ = ${lambda.toFixed(2)} — distorsi harmonik mulai signifikan, analisis penuh diperlukan` })
  else
    notes.push({ color: "#ff6384", icon: "🔴", text: `λ = ${lambda.toFixed(2)} — distorsi besar, aproksimasi harmonik tidak valid` })

  if (Math.abs(vC) < 0.05)
    notes.push({ color: "#ffcd56", icon: "⬤", text: `vC ≈ 0 — slider berada di titik mati (dead center), perubahan arah gerak` })

  if (Math.abs(tNorm - 0) < 0.05 || Math.abs(tNorm - Math.PI) < 0.05)
    notes.push({ color: "#a3e635", icon: "📌", text: `θ ≈ ${Math.round(tNorm * 180 / Math.PI)}° — crank segaris dengan rod (posisi singular)` })

  if (Math.abs(omegaRod) > Math.abs(safeO) * 1.5)
    notes.push({ color: "#f0abfc", icon: "⚡", text: `ωrod = ${omegaRod.toFixed(2)} rad/s — kecepatan sudut rod jauh melebihi crank` })

  return (
    <div className="panel" style={{ marginTop: 12 }}>
      <h2>Equation Validation</h2>

      <p style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#ccc", margin: "0 0 10px" }}>
        x(θ) = {xExpr}
      </p>

      <div style={{ display: "flex", gap: 24, fontSize: "0.83rem", color: "#aaa", marginBottom: 12, flexWrap: "wrap" }}>
        <span>r = <strong style={{ color: "#fff" }}>{safeR} m</strong></span>
        <span>l = <strong style={{ color: "#fff" }}>{safeL} m</strong></span>
        <span>ω = <strong style={{ color: "#fff" }}>{safeO} rad/s</strong></span>
        <span>θ = <strong style={{ color: "#fff" }}>{tNorm.toFixed(2)} rad</strong> ({(tNorm * 180 / Math.PI).toFixed(1)}°)</span>
        <span>λ = <strong style={{ color: "#fff" }}>{lambda.toFixed(3)}</strong></span>
      </div>

      {/* Anotasi */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {notes.map((n, i) => (
          <div key={i} style={{
            padding: "6px 10px", borderRadius: 6, fontSize: "0.8rem",
            background: n.color + "18", border: `1px solid ${n.color}55`,
            color: n.color,
          }}>
            {n.icon} {n.text}
          </div>
        ))}
      </div>
    </div>
  )
}
