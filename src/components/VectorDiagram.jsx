import { useRef, useEffect } from "react"

export default function VectorDiagram({ state }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // Skala vektor — normalkan ke ukuran canvas
    const speeds  = [
      Math.hypot(state.vB.x, state.vB.y),
      Math.abs(state.vC),
    ]
    const maxSpeed = Math.max(...speeds, 0.01)
    const maxArrow = Math.min(W, H) * 0.38
    const scale    = maxArrow / maxSpeed

    // Posisi titik di canvas
    const cx = W / 2
    const cy = H / 2 + 20

    const pts = {
      A: { x: cx - 80, y: cy },
      B: { x: cx,      y: cy - 60 },
      C: { x: cx + 80, y: cy },
    }

    // ── helpers ──
    function drawArrow(ctx, x1, y1, x2, y2, color, label) {
      const dx = x2 - x1
      const dy = y2 - y1
      const len = Math.hypot(dx, dy)
      if (len < 2) return

      ctx.strokeStyle = color
      ctx.fillStyle   = color
      ctx.lineWidth   = 2.5
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()

      // arrowhead
      const angle = Math.atan2(dy, dx)
      const hw = 8, hl = 14
      ctx.beginPath()
      ctx.moveTo(x2, y2)
      ctx.lineTo(
        x2 - hl * Math.cos(angle - 0.35),
        y2 - hl * Math.sin(angle - 0.35)
      )
      ctx.lineTo(
        x2 - hl * Math.cos(angle + 0.35),
        y2 - hl * Math.sin(angle + 0.35)
      )
      ctx.closePath()
      ctx.fill()

      // label
      if (label) {
        ctx.font      = "bold 11px monospace"
        ctx.fillStyle = color
        ctx.fillText(label, x2 + 6, y2 - 4)
      }
    }

    function drawDot(ctx, x, y, color, label) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
      if (label) {
        ctx.font      = "bold 12px monospace"
        ctx.fillStyle = "#fff"
        ctx.fillText(label, x + 8, y - 6)
      }
    }

    // ── Gambar skeleton mekanisme (tipis, redup) ──
    ctx.strokeStyle = "rgba(255,255,255,0.15)"
    ctx.lineWidth   = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(pts.A.x, pts.A.y)
    ctx.lineTo(pts.B.x, pts.B.y)
    ctx.lineTo(pts.C.x, pts.C.y)
    ctx.stroke()
    ctx.setLineDash([])

    // ── Vektor vB (di titik B) ──
    const vBx = state.vB.x * scale
    const vBy = -state.vB.y * scale   // flip Y (canvas Y ke bawah)
    drawArrow(
      ctx,
      pts.B.x, pts.B.y,
      pts.B.x + vBx, pts.B.y + vBy,
      "#00e5ff",
      `vB=${Math.hypot(state.vB.x, state.vB.y).toFixed(2)}`
    )

    // ── Vektor vC (di titik C, horizontal saja) ──
    const vCx = state.vC * scale
    drawArrow(
      ctx,
      pts.C.x, pts.C.y,
      pts.C.x + vCx, pts.C.y,
      "#ff6b35",
      `vC=${state.vC.toFixed(2)}`
    )

    // ── Titik-titik ──
    drawDot(ctx, pts.A.x, pts.A.y, "#ffffff", "A")
    drawDot(ctx, pts.B.x, pts.B.y, "#00e5ff", "B")
    drawDot(ctx, pts.C.x, pts.C.y, "#ff6b35", "C")

    // ── Info ωrod ──
    ctx.font      = "11px monospace"
    ctx.fillStyle = "#ffcd56"
    ctx.fillText(`ωrod = ${state.omegaRod.toFixed(3)} rad/s`, 8, H - 10)

  }, [state])

  return (
    <div className="panel">
      <h2>Velocity Diagram</h2>
      <canvas ref={canvasRef} width="260" height="200" />
      <div style={{ marginTop: 8, fontSize: "0.78rem", color: "#aaa", lineHeight: 1.6 }}>
        <span style={{ color: "#00e5ff" }}>■</span> vB &nbsp;
        <span style={{ color: "#ff6b35" }}>■</span> vC &nbsp;
        <span style={{ color: "#ffcd56" }}>■</span> ωrod
      </div>
    </div>
  )
}
