import { useRef, useEffect } from "react"

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

  // arrowhead
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

export default function MechanismView({ state, r, l }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // ── Skala & posisi pivot ──
    const maxReach     = r + l
    const verticalReach = r
    const margin       = 40

    const scaleX = (W - margin * 2) / (maxReach * 2)
    const scaleY = (H - margin * 2) / (verticalReach * 2)
    const scale  = Math.min(scaleX, scaleY)

    const pivot = { x: W / 2 - maxReach * scale * 0.15, y: H / 2 }

    const A = { x: pivot.x,                         y: pivot.y }
    const B = { x: pivot.x + state.B.x * scale,     y: pivot.y - state.B.y * scale }
    const C = { x: pivot.x + state.C.x * scale,     y: pivot.y }

    // ── Ground line ──
    ctx.strokeStyle = "rgba(255,255,255,0.15)"
    ctx.lineWidth   = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(margin, pivot.y)
    ctx.lineTo(W - margin, pivot.y)
    ctx.stroke()
    ctx.setLineDash([])

    // ── Crank A→B ──
    ctx.lineWidth   = Math.max(3, scale * 0.08)
    ctx.strokeStyle = "#00e5ff"
    ctx.lineCap     = "round"
    ctx.beginPath()
    ctx.moveTo(A.x, A.y)
    ctx.lineTo(B.x, B.y)
    ctx.stroke()

    // ── Connecting rod B→C ──
    ctx.strokeStyle = "#ff6b35"
    ctx.beginPath()
    ctx.moveTo(B.x, B.y)
    ctx.lineTo(C.x, C.y)
    ctx.stroke()

    const dotR = Math.max(5, scale * 0.06)

    // ── Joint A ──
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

    // ── Joint B ──
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(B.x, B.y, dotR, 0, Math.PI * 2)
    ctx.fill()

    // ── Slider C ──
    const sliderW = dotR * 4
    const sliderH = dotR * 3
    ctx.fillStyle   = "#ff6b35"
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth   = 2
    ctx.beginPath()
    ctx.roundRect(C.x - sliderW / 2, C.y - sliderH / 2, sliderW, sliderH, 4)
    ctx.fill()
    ctx.stroke()

    // ── Velocity vectors ──
    // Skala vektor: max arrow = 60px
    const maxSpeed = Math.max(
      Math.hypot(state.vB.x, state.vB.y),
      Math.abs(state.vC),
      0.01
    )
    const vScale = 60 / maxSpeed

    // vB di titik B
    drawArrow(
      ctx,
      B.x, B.y,
      B.x + state.vB.x * vScale,
      B.y - state.vB.y * vScale,   // flip Y
      "#a3e635",
      `vB=${Math.hypot(state.vB.x, state.vB.y).toFixed(1)}`
    )

    // vC di titik C (horizontal)
    drawArrow(
      ctx,
      C.x, C.y,
      C.x + state.vC * vScale,
      C.y,
      "#f0abfc",
      `vC=${state.vC.toFixed(1)}`
    )

    // ── Info label ──
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
      <canvas ref={canvasRef} width="400" height="300" />
      <div style={{ marginTop: 6, fontSize: "0.75rem", color: "#aaa" }}>
        <span style={{ color: "#00e5ff" }}>■</span> Crank &nbsp;
        <span style={{ color: "#ff6b35" }}>■</span> Rod / Slider &nbsp;
        <span style={{ color: "#a3e635" }}>■</span> vB &nbsp;
        <span style={{ color: "#f0abfc" }}>■</span> vC &nbsp;
        <span style={{ color: "#ffcd56" }}>■</span> ωrod
      </div>
    </div>
  )
}
