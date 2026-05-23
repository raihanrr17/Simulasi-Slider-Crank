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

  const xExpr = `${safeR} · cos(${tNorm.toFixed(2)}) + √(${safeL}² − ${safeR}² · sin²(${tNorm.toFixed(2)}))`

  // ── Definisi semua anotasi: kondisi aktif atau tidak ──
  const annotations = [
    {
      icon: "λ",
      label: "Rasio Geometri",
      desc: "Aktif saat λ > 0.5 — distorsi besar, aproksimasi harmonik tidak valid",
      activeDesc:
        lambda > 0.5
          ? `λ = ${lambda.toFixed(2)} — distorsi besar, aproksimasi harmonik tidak valid`
          : lambda > 0.1
          ? `λ = ${lambda.toFixed(2)} — distorsi harmonik mulai signifikan`
          : `λ = ${lambda.toFixed(2)} — gerak slider ≈ harmonik sederhana`,
      active: true, // selalu tampil, hanya warna yang berubah
      color:
        lambda > 0.5 ? "#ff6384" :
        lambda > 0.1 ? "#ffcd56" : "#4bc0c0",
    },
    {
      icon: "⬤",
      label: "Dead Center",
      desc: "Aktif saat vC ≈ 0 — slider berbalik arah gerak",
      activeDesc: `vC = ${vC.toFixed(3)} m/s — slider di titik mati, berbalik arah`,
      active: Math.abs(vC) < 0.05,
      color: "#ffcd56",
    },
    {
      icon: "📌",
      label: "Posisi Singular",
      desc: "Aktif saat θ ≈ 0° atau 180° — crank segaris dengan connecting rod",
      activeDesc: `θ = ${(tNorm * 180 / Math.PI).toFixed(1)}° — crank segaris dengan rod`,
      active: Math.abs(tNorm) < 0.08 || Math.abs(tNorm - Math.PI) < 0.08,
      color: "#a3e635",
    },
  ]

  return (
    <div className="panel" style={{ marginTop: 12 }}>
      <h2>Equation Validation</h2>

      <p style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#ccc", margin: "0 0 10px" }}>
        x(θ) = {xExpr}
      </p>

      <div style={{ display: "flex", gap: 24, fontSize: "0.83rem", color: "#aaa", marginBottom: 14, flexWrap: "wrap" }}>
        <span>r = <strong style={{ color: "#fff" }}>{safeR} m</strong></span>
        <span>l = <strong style={{ color: "#fff" }}>{safeL} m</strong></span>
        <span>ω = <strong style={{ color: "#fff" }}>{safeO} rad/s</strong></span>
        <span>θ = <strong style={{ color: "#fff" }}>{tNorm.toFixed(2)} rad</strong> ({(tNorm * 180 / Math.PI).toFixed(1)}°)</span>
        <span>λ = <strong style={{ color: "#fff" }}>{lambda.toFixed(3)}</strong></span>
      </div>

      {/* Anotasi — selalu tampil, warna berubah sesuai kondisi */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {annotations.map((n, i) => {
          const color  = n.active ? n.color : "#4a5568"
          const border = n.active ? `${n.color}55` : "#2d3748"
          const bg     = n.active ? `${n.color}18` : "rgba(255,255,255,0.03)"
          return (
            <div key={i} style={{
              padding: "7px 10px", borderRadius: 6,
              background: bg, border: `1px solid ${border}`,
              display: "flex", gap: 10, alignItems: "flex-start",
              transition: "all 0.3s",
            }}>
              <span style={{ color, fontSize: "0.85rem", minWidth: 18, marginTop: 1 }}>{n.icon}</span>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: "bold", color, marginBottom: 1 }}>
                  {n.label}
                </div>
                <div style={{ fontSize: "0.75rem", color: n.active ? color : "#4a5568" }}>
                  {n.active ? n.activeDesc : n.desc}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
