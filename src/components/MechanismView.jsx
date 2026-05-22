import { useRef, useEffect } from "react"

export default function MechanismView({ state, r, l }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // Hitung skala agar mekanisme muat dalam canvas dengan margin
    const maxReach = r + l           
    const verticalReach = r          
    const margin = 40                

    const scaleX = (W - margin * 2) / (maxReach * 2)  // *2 karena bisa ke kiri juga
    const scaleY = (H - margin * 2) / (verticalReach * 2)
    const scale = Math.min(scaleX, scaleY)

    // Pivot ditaruh di tengah-tengah canvas, tapi geser ke kiri agar slider punya ruang
    const pivot = { x: W / 2 - maxReach * scale * 0.15, y: H / 2 }

    const A = { x: pivot.x, y: pivot.y }
    const B = {
      x: pivot.x + state.B.x * scale,
      y: pivot.y - state.B.y * scale,
    }
    const C = {
      x: pivot.x + state.C.x * scale,
      y: pivot.y,
    }

    // --- Ground line (slider track) ---
    ctx.strokeStyle = "rgba(255,255,255,0.15)"
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(margin, pivot.y)
    ctx.lineTo(W - margin, pivot.y)
    ctx.stroke()
    ctx.setLineDash([])

    // --- Crank (A → B) ---
    ctx.lineWidth = Math.max(3, scale * 0.08)
    ctx.strokeStyle = "#00e5ff"
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(A.x, A.y)
    ctx.lineTo(B.x, B.y)
    ctx.stroke()

    // --- Connecting rod (B → C) ---
    ctx.strokeStyle = "#ff6b35"
    ctx.beginPath()
    ctx.moveTo(B.x, B.y)
    ctx.lineTo(C.x, C.y)
    ctx.stroke()

    const dotR = Math.max(5, scale * 0.06)

    // --- Joint A (pivot tetap) ---
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(A.x, A.y, dotR, 0, Math.PI * 2)
    ctx.fill()

    // tanda ground (segitiga kecil)
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.beginPath()
    ctx.moveTo(A.x - dotR * 1.5, A.y + dotR)
    ctx.lineTo(A.x + dotR * 1.5, A.y + dotR)
    ctx.lineTo(A.x, A.y + dotR * 2.8)
    ctx.closePath()
    ctx.fill()

    // --- Joint B (pin crank-rod) ---
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(B.x, B.y, dotR, 0, Math.PI * 2)
    ctx.fill()

    // --- Slider C ---
    const sliderW = dotR * 4
    const sliderH = dotR * 3
    ctx.fillStyle = "#ff6b35"
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(C.x - sliderW / 2, C.y - sliderH / 2, sliderW, sliderH, 4)
    ctx.fill()
    ctx.stroke()

    // --- Label ukuran (opsional, debug) ---
    ctx.fillStyle = "rgba(255,255,255,0.35)"
    ctx.font = `${Math.max(10, scale * 0.12)}px monospace`
    ctx.fillText(`r=${r}  l=${l}`, margin, H - 12)
  }, [state, r, l])

  return (
    <div className="panel">
      <h2>Mechanism</h2>
      <canvas ref={canvasRef} width="400" height="300" />
    </div>
  )
}
