import { C } from "../colors"

export default function ControlPanel({ r, l, omega, setR, setL, setOmega }) {
  function handleSetR(val) {
    setR(val)
    if (val >= l) setL(parseFloat((val + 0.5).toFixed(1)))
  }
  function handleSetL(val) {
    if (val <= r) return
    setL(val)
  }

  return (
    <div className="panel">
      <h2>Parameters</h2>

      <label style={{ fontSize: "0.82rem", color: C.muted }}>Crank Length (r)</label>
      <input type="range" min="0.5" max="4.5" step="0.1" value={r}
        onChange={e => handleSetR(parseFloat(e.target.value))}
        style={{ accentColor: C.crank }} />
      <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: C.crank }}>r = {r} m</p>

      <label style={{ fontSize: "0.82rem", color: C.muted }}>Rod Length (l)</label>
      <input type="range" min="1" max="5" step="0.1" value={l}
        onChange={e => handleSetL(parseFloat(e.target.value))}
        style={{ accentColor: C.rod }} />
      <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: C.rod }}>l = {l} m</p>

      {(l - r) < 0.6 && (
        <p style={{ margin: "0 0 10px", fontSize: "0.75rem", color: C.warn, background: `${C.warn}12`, border: `1px solid ${C.warn}44`, borderRadius: 4, padding: "4px 8px" }}>
          ⚠️ r mendekati l — jaga agar r &lt; l supaya mekanisme valid
        </p>
      )}
      {!((l - r) < 0.6) && <p style={{ margin: "0 0 10px" }} />}

      <label style={{ fontSize: "0.82rem", color: C.muted }}>Angular Velocity (ω)</label>
      <input type="range" min="1" max="20" step="1" value={omega}
        onChange={e => setOmega(parseFloat(e.target.value))}
        style={{ accentColor: C.omegrod }} />
      <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: C.omegrod }}>ω = {omega} rad/s</p>

      <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: C.dimmed }}>
        Syarat: r &lt; l &nbsp;|&nbsp; λ = {(r/l).toFixed(3)}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: C.dimmed }}>
        Massa slider & rod = <strong style={{ color: "#888" }}>5 kg</strong> (tetap)
      </p>
    </div>
  )
}
