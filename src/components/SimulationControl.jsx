import { C } from "../colors"

export default function SimulationControls({ play, pause, step, reset, isPlaying, theta, setTheta }) {
  const tDeg = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) * 180 / Math.PI

  const btnStyle = (color) => ({
    flex: 1, padding: "6px 0", borderRadius: 6, cursor: "pointer",
    fontWeight: "bold", fontSize: "0.82rem",
    background: `${color}18`, border: `1px solid ${color}`,
    color, transition: "opacity 0.15s",
  })

  return (
    <div className="panel">
      <h2>Simulation Control</h2>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <button style={btnStyle(C.frod)}    onClick={play}>▶ Play</button>
        <button style={btnStyle(C.omegrod)} onClick={pause}>⏸ Pause</button>
        <button style={btnStyle(C.crank)}   onClick={step}>⏭ Step</button>
        <button style={btnStyle(C.danger)}  onClick={reset}>⏹ Reset</button>
      </div>

      <div style={{ opacity: isPlaying ? 0.35 : 1, transition: "opacity 0.2s" }}>
        <label style={{ fontSize: "0.82rem", color: isPlaying ? C.dimmed : C.muted }}>
          Posisi θ manual {isPlaying && <span style={{ color: C.danger, fontSize: "0.72rem" }}>(pause dulu)</span>}
        </label>
        <input type="range" min="0" max="360" step="1"
          value={Math.round(tDeg)} disabled={isPlaying}
          onChange={e => setTheta(parseFloat(e.target.value) * Math.PI / 180)}
          style={{ width: "100%", marginBottom: 4, cursor: isPlaying ? "not-allowed" : "pointer", accentColor: C.crank }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: C.dimmed }}>
          <span>0°</span>
          <span style={{ color: isPlaying ? C.dimmed : "#ccc", fontWeight: "bold" }}>θ = {Math.round(tDeg)}°</span>
          <span>360°</span>
        </div>
      </div>
    </div>
  )
}
