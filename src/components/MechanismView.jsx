import { useRef, useEffect, useMemo } from "react"
import { computeSliderCrank } from "../physics/sliderCrankModel"

const MASS = 5 // kg, tetap

function drawArrow(ctx, x1, y1, x2, y2, color, label, labelPos = "end") {
  const dx  = x2 - x1
  const dy  = y2 - y1
  const len = Math.hypot(dx, dy)
  if (len < 4) return

  const angle = Math.atan2(dy, dx)
  const hl    = 10

  ctx.strokeStyle = color
  ctx.fillStyle   = color
  ctx.lineWidth   = 2
  ctx.lineCap     = "round"
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - hl * Math.cos(angle - 0.38), y2 - hl * Math.sin(angle - 0.38))
  ctx.lineTo(x2 - hl * Math.cos(angle + 0.38), y2 - hl * Math.sin(angle + 0.38))
  ctx.closePath()
  ctx.fill()

  if (label) {
    ctx.font      = "bold 10px monospace"
    ctx.fillStyle = color
    const lx = labelPos === "end" ? x2 + 6 : (x1 + x2) / 2 + 6
    const ly = labelPos === "end" ? y2 - 4  : (y1 + y2) / 2 - 4
    ctx.fillText(label, lx, ly)
  }
}

function useTable(r, l, omega) {
  return useMemo(() => {
    const angles = [0, 45, 90, 135, 180, 225, 270, 315]
    return angles.map(deg => {
      const theta = deg * Math.PI / 180
      const s = computeSliderCrank(r, l, omega, theta, MASS, MASS)
      return { deg, vC: s.vC, omegaRod: s.omegaRod, Fslider: s.Fslider }
    })
  }, [r, l, omega])
}

const tdS = { padding: "3px 8px", fontSize: "0.73rem", borderBottom: "1px solid #1e2a44", textAlign: "right" }
const thS = { padding: "4px 8px", fontSize: "0.7rem",  borderBottom: "1px solid #253055", textAlign: "right", color: "#aaa" }

export default function MechanismView({ state, r, l, omega }) {
  const canvasRef = useRef(null)
  const table     = useTable(r, l, omega)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const margin = 36
    const scaleX = (W - margin * 2) / ((r + l) * 2)
    const scaleY = (H - margin * 2) / (r * 2)
    const scale  = Math.min(scaleX, scaleY)
    const pivot  = { x: W / 2 - (r + l) * scale * 0.15, y: H / 2 }

    const A = { x: pivot.x,                        y: pivot.y }
    const B = { x: pivot.x + state.B.x * scale,    y: pivot.y - state.B.y * scale }
    const C = { x: pivot.x + state.C.x * scale,    y: pivot.y }
    const midRod = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 }

    // Ground line
    ctx.strokeStyle = "rgba(255,255,255,0.12)"
    ctx.lineWidth   = 1.5
    ctx.setLineDash([5, 4])
    ctx.beginPath()
    ctx.moveTo(margin, pivot.y)
    ctx.lineTo(W - margin, pivot.y)
    ctx.stroke()
    ctx.setLineDash([])

    // Crank
    ctx.lineWidth   = Math.max(3, scale * 0.08)
    ctx.strokeStyle = "#00e5ff"
    ctx.lineCap     = "round"
    ctx.beginPath()
    ctx.moveTo(A.x, A.y)
    ctx.lineTo(B.x, B.y)
    ctx.stroke()

    // Rod
    ctx.strokeStyle = "#ff6b35"
    ctx.beginPath()
    ctx.moveTo(B.x, B.y)
    ctx.lineTo(C.x, C.y)
    ctx.stroke()

    const dotR = Math.max(5, scale * 0.06)

    // Joint A
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(A.x, A.y, dotR, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "rgba(255,255,255,0.35)"
    ctx.beginPath()
    ctx.moveTo(A.x - dotR * 1.5, A.y + dotR)
    ctx.lineTo(A.x + dotR * 1.5, A.y + dotR)
    ctx.lineTo(A.x,               A.y + dotR * 2.8)
    ctx.closePath()
    ctx.fill()

    // Joint B
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(B.x, B.y, dotR, 0, Math.PI * 2)
    ctx.fill()

    // Slider C
    const sw = dotR * 4, sh = dotR * 3
    ctx.fillStyle   = "#ff6b35"
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth   = 2
    ctx.beginPath()
    ctx.roundRect(C.x - sw / 2, C.y - sh / 2, sw, sh, 4)
    ctx.fill()
    ctx.stroke()

    // Vektor kecepatan
    const maxV = Math.max(Math.hypot(state.vB.x, state.vB.y), Math.abs(state.vC), 0.01)
    const vSc  = 55 / maxV

    drawArrow(ctx, B.x, B.y,
      B.x + state.vB.x * vSc, B.y - state.vB.y * vSc,
      "#a3e635", `vB=${Math.hypot(state.vB.x, state.vB.y).toFixed(1)}`)

    drawArrow(ctx, C.x, C.y - sh / 2 - 4,
      C.x + state.vC * vSc, C.y - sh / 2 - 4,
      "#f0abfc", `vC=${state.vC.toFixed(1)}`)

    // Vektor gaya
    const maxF = Math.max(Math.abs(state.Fslider), state.Frod, state.Fpin, 0.01)
    const fSc  = 45 / maxF

    drawArrow(ctx, C.x, C.y + sh / 2 + 4,
      C.x + state.Fslider * fSc, C.y + sh / 2 + 4,
      "#ef4444", `Fs=${state.Fslider.toFixed(1)}N`)

    drawArrow(ctx, midRod.x, midRod.y,
      midRod.x + state.FrodX * fSc, midRod.y - state.FrodY * fSc,
      "#22c55e", `Fr=${state.Frod.toFixed(1)}N`, "mid")

    drawArrow(ctx, B.x, B.y,
      B.x + state.FpinX * fSc, B.y - state.FpinY * fSc,
      "#fb923c", `Fp=${state.Fpin.toFixed(1)}N`)

    // Labels
    ctx.font      = "10px monospace"
    ctx.fillStyle = "rgba(255,255,255,0.3)"
    ctx.fillText(`r=${r}  l=${l}  λ=${(r/l).toFixed(2)}`, margin, H - 20)
    ctx.fillStyle = "#ffcd56"
    ctx.fillText(`ωrod=${state.omegaRod.toFixed(2)} rad/s`, margin, H - 7)

  }, [state, r, l])

  return (
    <div className="panel">
      <h2>Mechanism, Velocity &amp; Force Diagram</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

        <div style={{ flex: "0 0 auto" }}>
          <canvas ref={canvasRef} width="290" height="270"
            style={{ background: "#0e1324", borderRadius: 8 }} />
          <div style={{ marginTop: 6, fontSize: "0.7rem", color: "#aaa", lineHeight: 1.9 }}>
            <span style={{ color: "#00e5ff" }}>■</span> Crank &nbsp;
            <span style={{ color: "#ff6b35" }}>■</span> Rod/Slider &nbsp;
            <span style={{ color: "#a3e635" }}>■</span> vB &nbsp;
            <span style={{ color: "#f0abfc" }}>■</span> vC<br />
            <span style={{ color: "#ef4444" }}>■</span> Fslider &nbsp;
            <span style={{ color: "#22c55e" }}>■</span> Frod &nbsp;
            <span style={{ color: "#fb923c" }}>■</span> Fpin B
          </div>
        </div>

        <div style={{ flex: 1, overflowX: "auto" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.75rem", color: "#aaa" }}>
            Nilai pada posisi sudut kunci (ω={omega} rad/s, m={MASS} kg)
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...thS, textAlign: "left" }}>θ (°)</th>
                <th style={thS}>vC (m/s)</th>
                <th style={thS}>ωrod (r/s)</th>
                <th style={thS}>Fs (N)</th>
              </tr>
            </thead>
            <tbody>
              {table.map(row => {
                const dc = Math.abs(row.vC) < 0.05
                return (
                  <tr key={row.deg} style={{ background: dc ? "rgba(255,205,86,0.07)" : "transparent" }}>
                    <td style={{ ...tdS, textAlign: "left", color: "#ccc" }}>
                      {row.deg}°
                      {dc && <span style={{ color: "#ffcd56", marginLeft: 4, fontSize: "0.65rem" }}>⬤ DC</span>}
                    </td>
                    <td style={{ ...tdS, color: "#f0abfc" }}>{row.vC.toFixed(2)}</td>
                    <td style={{ ...tdS, color: "#ffcd56" }}>{row.omegaRod.toFixed(2)}</td>
                    <td style={{ ...tdS, color: "#ef4444" }}>{row.Fslider.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
