export default function ControlPanel({ r, l, omega, setR, setL, setOmega }) {
  const invalid = r >= l

  function handleSetR(val) {
    setR(val)
    // jika r >= l, paksa l naik jadi r + 0.5
    if (val >= l) setL(parseFloat((val + 0.5).toFixed(1)))
  }

  function handleSetL(val) {
    // jangan biarkan l turun ke <= r
    if (val <= r) return
    setL(val)
  }

  return (
    <div className="panel">
      <h2>Parameters</h2>

      <label>Crank Length (r)</label>
      <input type="range" min="0.5" max="4.5" step="0.1" value={r}
        onChange={e => handleSetR(parseFloat(e.target.value))} />
      <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: "#aaa" }}>r = {r} m</p>

      <label>Rod Length (l)</label>
      <input type="range" min="1" max="5" step="0.1" value={l}
        onChange={e => handleSetL(parseFloat(e.target.value))} />
      <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#aaa" }}>l = {l} m</p>

      {/* Peringatan jika hampir melanggar syarat */}
      {(l - r) < 0.6 && (
        <p style={{
          margin: "0 0 10px", fontSize: "0.75rem",
          color: "#ffcd56", background: "rgba(255,205,86,0.08)",
          border: "1px solid rgba(255,205,86,0.3)",
          borderRadius: 4, padding: "4px 8px",
        }}>
          ⚠️ r mendekati l — jaga agar r &lt; l supaya mekanisme valid
        </p>
      )}
      {!((l - r) < 0.6) && (
        <p style={{ margin: "0 0 10px" }} />
      )}

      <label>Angular Velocity (ω)</label>
      <input type="range" min="1" max="20" step="1" value={omega}
        onChange={e => setOmega(parseFloat(e.target.value))} />
      <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#aaa" }}>ω = {omega} rad/s</p>

      <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#4a5568" }}>
        Syarat: r &lt; l &nbsp;|&nbsp; λ = r/l = {(r/l).toFixed(3)}
      </p>
    </div>
  )
}
