export default function SimulationControls({ play, pause, step, reset, isPlaying, theta, setTheta }) {
  const tDeg = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) * 180 / Math.PI

  return (
    <div className="panel">
      <h2>Simulation Control</h2>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={play}>▶ Play</button>
        <button onClick={pause}>⏸ Pause</button>
        <button onClick={step}>⏭ Step</button>
        <button onClick={reset} style={{ background: "#5c1a1a", borderColor: "#a33" }}>⏹ Reset</button>
      </div>

      {/* Slider posisi — hanya aktif saat pause */}
      <div style={{ opacity: isPlaying ? 0.35 : 1, transition: "opacity 0.2s" }}>
        <label style={{ fontSize: "0.82rem", color: isPlaying ? "#555" : "#aaa" }}>
          Posisi θ manual {isPlaying && <span style={{ color: "#ff6384", fontSize: "0.72rem" }}>(pause dulu)</span>}
        </label>
        <input
          type="range"
          min="0" max="360" step="1"
          value={Math.round(tDeg)}
          disabled={isPlaying}
          onChange={e => setTheta(parseFloat(e.target.value) * Math.PI / 180)}
          style={{ width: "100%", marginBottom: 4, cursor: isPlaying ? "not-allowed" : "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#666" }}>
          <span>0°</span>
          <span style={{ color: isPlaying ? "#555" : "#ccc", fontWeight: "bold" }}>
            θ = {Math.round(tDeg)}°
          </span>
          <span>360°</span>
        </div>
      </div>
    </div>
  )
}
