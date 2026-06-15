import { useRef, useEffect, useMemo } from "react"
import { computeSliderCrank } from "../physics/sliderCrankModel"
import { C } from "../colors"

const MASS = 5

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const dx = x2 - x1, dy = y2 - y1
  if (Math.hypot(dx, dy) < 4) return
  const angle = Math.atan2(dy, dx), hl = 10
  ctx.strokeStyle = color; ctx.fillStyle = color
  ctx.lineWidth = 2; ctx.lineCap = "round"
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - hl * Math.cos(angle - 0.38), y2 - hl * Math.sin(angle - 0.38))
  ctx.lineTo(x2 - hl * Math.cos(angle + 0.38), y2 - hl * Math.sin(angle + 0.38))
  ctx.closePath(); ctx.fill()
}

function useTable(r, l, omega) {
  return useMemo(() => [0,45,90,135,180,225,270,315].map(deg => {
    const s = computeSliderCrank(r, l, omega, deg * Math.PI / 180, MASS, MASS)
    return { deg, vC: s.vC, omegaRod: s.omegaRod, Fslider: s.Fslider }
  }), [r, l, omega])
}

const LEGEND = [
  { color: C.crank,   label: "Crank",     key: null },
  { color: C.rod,     label: "Rod/Slider", key: null },
  { color: C.vb,      label: "vB",         key: "vb" },
  { color: C.vc,      label: "vC",         key: "vc" },
  { color: C.fslider, label: "F slider",   key: "fs" },
  { color: C.frod,    label: "F rod",      key: "fr" },
  { color: C.fpin,    label: "F pin B",    key: "fp" },
  { color: C.omegrod, label: "ωrod",       key: "wr" },
]

const tdS = { padding: "4px 8px", fontSize: "0.73rem", borderBottom: `1px solid ${C.borderDim}`, textAlign: "right" }
const thS = { padding: "5px 8px", fontSize: "0.7rem", borderBottom: `1px solid ${C.border}`, textAlign: "right", color: C.muted, fontWeight: "500" }

export default function MechanismView({ state, r, l, omega }) {
  const canvasRef = useRef(null)
  const table     = useTable(r, l, omega)
  const vBmag     = Math.hypot(state.vB.x, state.vB.y)

  const vals = {
    vb: `${vBmag.toFixed(2)} m/s`,
    vc: `${state.vC.toFixed(2)} m/s`,
    fs: `${state.Fslider.toFixed(1)} N`,
    fr: `${state.Frod.toFixed(1)} N`,
    fp: `${state.Fpin.toFixed(1)} N`,
    wr: `${state.omegaRod.toFixed(2)} r/s`,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const margin = 36
    const scale  = Math.min((W - margin*2) / ((r+l)*2), (H - margin*2) / (r*2))
    const pivot  = { x: W/2 - (r+l)*scale*0.15, y: H/2 }

    const A   = { x: pivot.x,                     y: pivot.y }
    const B   = { x: pivot.x + state.B.x * scale, y: pivot.y - state.B.y * scale }
    const C_  = { x: pivot.x + state.C.x * scale, y: pivot.y }
    const mid = { x: (B.x + C_.x) / 2,            y: (B.y + C_.y) / 2 }

    // Ground line
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1.5; ctx.setLineDash([5,4])
    ctx.beginPath(); ctx.moveTo(margin, pivot.y); ctx.lineTo(W-margin, pivot.y); ctx.stroke()
    ctx.setLineDash([])

    // Crank
    ctx.lineWidth = Math.max(3, scale*0.08); ctx.strokeStyle = C.crank; ctx.lineCap = "round"
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke()

    // Rod
    ctx.strokeStyle = C.rod
    ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(C_.x, C_.y); ctx.stroke()

    const dotR = Math.max(5, scale*0.06)

    // Joint A
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(A.x, A.y, dotR, 0, Math.PI*2); ctx.fill()
    ctx.fillStyle = "rgba(255,255,255,0.3)"
    ctx.beginPath(); ctx.moveTo(A.x-dotR*1.5, A.y+dotR); ctx.lineTo(A.x+dotR*1.5, A.y+dotR)
    ctx.lineTo(A.x, A.y+dotR*2.8); ctx.closePath(); ctx.fill()

    // Joint B
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(B.x, B.y, dotR, 0, Math.PI*2); ctx.fill()

    // Slider C
    const sw = dotR*4, sh = dotR*3
    ctx.fillStyle = C.rod; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2
    ctx.beginPath(); ctx.roundRect(C_.x-sw/2, C_.y-sh/2, sw, sh, 4); ctx.fill(); ctx.stroke()

    // Velocity vectors
    const maxV = Math.max(vBmag, Math.abs(state.vC), 0.01)
    const vSc  = 50 / maxV
    drawArrow(ctx, B.x, B.y, B.x + state.vB.x*vSc, B.y - state.vB.y*vSc, C.vb)
    drawArrow(ctx, C_.x, C_.y - sh/2 - 6, C_.x + state.vC*vSc, C_.y - sh/2 - 6, C.vc)

    // Force vectors
    const maxF = Math.max(Math.abs(state.Fslider), state.Frod, state.Fpin, 0.01)
    const fSc  = 40 / maxF
    drawArrow(ctx, C_.x, C_.y+sh/2+6, C_.x + state.Fslider*fSc, C_.y+sh/2+6, C.fslider)
    drawArrow(ctx, mid.x, mid.y, mid.x + state.FrodX*fSc, mid.y - state.FrodY*fSc, C.frod)
    drawArrow(ctx, B.x, B.y, B.x + state.FpinX*fSc, B.y - state.FpinY*fSc, C.fpin)

    // Info
    ctx.font = "10px monospace"
    ctx.fillStyle = "rgba(255,255,255,0.25)"
    ctx.fillText(`r=${r}  l=${l}  λ=${(r/l).toFixed(2)}`, margin, H-7)

  }, [state, r, l])

  return (
    <div className="panel">
      <h2>Animation & Data</h2>

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <canvas ref={canvasRef} width="270" height="240"
          style={{ background: C.bgCanvas, borderRadius: 8, flexShrink: 0 }} />

        <div style={{ flex: 1, overflowX: "auto" }}>
          <p style={{ margin: "0 0 8px", fontSize: "0.74rem", color: C.dimmed }}>
            Nilai pada sudut kunci — ω={omega} rad/s, m={MASS} kg
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...thS, textAlign: "left" }}>θ (°)</th>
                <th style={{ ...thS, color: C.vc }}>vC (m/s)</th>
                <th style={{ ...thS, color: C.omegrod }}>ωrod (r/s)</th>
                <th style={{ ...thS, color: C.fslider }}>Fs (N)</th>
              </tr>
            </thead>
            <tbody>
              {table.map(row => {
                const dc = Math.abs(row.vC) < 0.05
                return (
                  <tr key={row.deg} style={{ background: dc ? `${C.warn}12` : "transparent" }}>
                    <td style={{ ...tdS, textAlign: "left", color: "#ccc" }}>
                      {row.deg}°
                      {dc && <span style={{ color: C.warn, marginLeft: 3, fontSize: "0.6rem" }}>DC</span>}
                    </td>
                    <td style={{ ...tdS, color: C.vc }}>{row.vC.toFixed(2)}</td>
                    <td style={{ ...tdS, color: C.omegrod }}>{row.omegaRod.toFixed(2)}</td>
                    <td style={{ ...tdS, color: C.fslider }}>{row.Fslider.toFixed(1)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend + nilai real-time */}
      <div style={{
        marginTop: 10, paddingTop: 10,
        borderTop: `1px solid ${C.borderDim}`,
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "6px 12px",
      }}>
        {LEGEND.map(({ color, label, key }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: "0.72rem", color: C.muted }}>{label}</span>
            {key && <span style={{ fontSize: "0.72rem", color, fontFamily: "monospace", fontWeight: "bold", marginLeft: 2 }}>= {vals[key]}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
