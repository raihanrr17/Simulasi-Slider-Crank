import { useRef, useEffect, useMemo } from "react"
import { computeSliderCrank } from "../physics/sliderCrankModel"

function drawArrow(ctx, x1, y1, x2, y2, color, label) {
  const dx  = x2 - x1
  const dy  = y2 - y1
  const len = Math.hypot(dx, dy)
  if (len < 4) return

  ctx.strokeStyle = color
  ctx.fillStyle   = color
  ctx.lineWidth   = 2
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  const angle = Math.atan2(dy, dx)
  const hl = 10
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - hl * Math.cos(angle - 0.38), y2 - hl * Math.sin(angle - 0.38))
  ctx.lineTo(x2 - hl * Math.cos(angle + 0.38), y2 - hl * Math.sin(angle + 0.38))
  ctx.closePath()
  ctx.fill()

  if (label) {
    ctx.font      = "bold 10px monospace"
    ctx.fillStyle = color
    ctx.fillText(label, x2 + 6, y2 - 4)
  }
}

// Tabel: hitung vC & omegaRod di 8 posisi sudut kunci
function useTable(r, l, omega) {
  return useMemo(() => {
    const angles = [0, 45, 90, 135, 180, 225, 270, 315]
    return angles.map(deg => {
      const theta = deg * Math.PI / 180
      const s = computeSliderCrank(r, l, omega, theta)
      return {
        deg,
        vC:      s.vC,
        omegaRod: s.omegaRod,
      }
    })
  }, [r, l, omega])
}

const tdStyle = {
  padding: "3px 8px", fontSize: "0.75rem",
  borderBottom: "1px solid #1e2a44", textAlign: "right",
}
const thStyle = {
  ...{ padding: "4px 8px", fontSize: "0.72rem", color: "#aaa",
       borderBottom: "1px solid #253055", textAlign: "right" }
}

export default function MechanismView({ state, r, l, omega }) {
  const canvasRef = useRef(null)
  const table     = useTable(r, l, omega)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    const maxReach      = r + l
    const verticalReach = r
    const margin        = 40

    const scaleX = (W - margin * 2) / (maxReach * 2)
    const scaleY = (H - margin * 2) / (verticalReach * 2)
    const scale  = Math.min(scaleX, scaleY)

    const pivot = { x: W / 2 - maxReach * scale * 0.15, y: H / 2 }

    const A = { x: pivot.x,                        y: pivot.y }
    const B = { x: pivot.x + state.B.x * scale,    y: pivot.y - state.B.y * scale }
    const C = { x: pivot.x + state.C.x * scale,    y: pivot.y }

    // Ground line
    ctx.strokeStyle = "rgba(255,255,255,0.15)"
    ctx.lineWidth   = 2
    ctx.setLineDash([6, 4])
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
    ctx.fillStyle = "rgba(255,255,255,0.4)"
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
    const sliderW = dotR * 4
    const sliderH = dotR * 3
    ctx.fillStyle   = "#ff6b35"
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth   = 2
    ctx.beginPath()
    ctx.roundRect(C.x - sliderW / 2, C.y - sliderH / 2, sliderW, sliderH, 4)
    ctx.fill()
    ctx.stroke()

    // Velocity vectors
    const maxSpeed = Math.max(Math.hypot(state.vB.x, state.vB.y), Math.abs(state.vC), 0.01)
    const vScale   = 60 / maxSpeed

    drawArrow(ctx, B.x, B.y,
      B.x + state.vB.x * vScale, B.y - state.vB.y * vScale,
      "#a3e635", `vB=${Math.hypot(state.vB.x, state.vB.y).toFixed(1)}`)

    drawArrow(ctx, C.x, C.y,
      C.x + state.vC * vScale, C.y,
      "#f0abfc", `vC=${state.vC.toFixed(1)}`)

    // Labels
    ctx.fillStyle = "rgba(255,255,255,0.35)"
    ctx.font      = `${Math.max(10, scale * 0.12)}px monospace`
    ctx.fillText(`r=${r}  l=${l}`, margin, H - 22)
    ctx.fillStyle = "#ffcd56"
    ctx.font      = "10px monospace"
    ctx.fillText(`ωrod=${state.omegaRod.toFixed(2)} rad/s`, margin, H - 8)

  }, [state, r, l])

  return (
    <div className="panel">
      <h2>Mechanism &amp; Velocity Diagram</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

        {/* Canvas */}
        <div style={{ flex: "0 0 auto" }}>
          <canvas ref={canvasRef} width="280" height="260" />
          <div style={{ marginTop: 6, fontSize: "0.72rem", color: "#aaa" }}>
            <span style={{ color: "#00e5ff" }}>■</span> Crank &nbsp;
            <span style={{ color: "#ff6b35" }}>■</span> Rod/Slider &nbsp;
            <span style={{ color: "#a3e635" }}>■</span> vB &nbsp;
            <span style={{ color: "#f0abfc" }}>■</span> vC &nbsp;
            <span style={{ color: "#ffcd56" }}>■</span> ωrod
          </div>
        </div>

        {/* Tabel */}
        <div style={{ flex: 1, overflowX: "auto" }}>
          <p style={{ margin: "0 0 6px", fontSize: "0.78rem", color: "#aaa" }}>
            Nilai pada posisi sudut kunci (ω = {omega} rad/s)
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: "left" }}>θ (°)</th>
                <th style={thStyle}>vC (m/s)</th>
                <th style={thStyle}>ωrod (rad/s)</th>
              </tr>
            </thead>
            <tbody>
              {table.map(row => {
                const isDeadCenter = Math.abs(row.vC) < 0.01
                return (
                  <tr key={row.deg} style={{
                    background: isDeadCenter ? "rgba(255,205,86,0.08)" : "transparent"
                  }}>
                    <td style={{ ...tdStyle, textAlign: "left", color: "#ccc" }}>
                      {row.deg}°
                      {isDeadCenter && <span style={{ color: "#ffcd56", marginLeft: 4, fontSize: "0.68rem" }}>⬤ dead center</span>}
                    </td>
                    <td style={{ ...tdStyle, color: "#f0abfc" }}>{row.vC.toFixed(3)}</td>
                    <td style={{ ...tdStyle, color: "#ffcd56" }}>{row.omegaRod.toFixed(3)}</td>
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
