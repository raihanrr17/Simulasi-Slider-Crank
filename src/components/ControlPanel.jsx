export default function ControlPanel({ r, l, omega, method, setR, setL, setOmega, setMethod }) {
  return (
    <div className="panel">
      <h2>Parameters</h2>

      <label>Crank Length (r)</label>
      <input type="range" min="0.5" max="2" step="0.1" value={r}
        onChange={e => setR(parseFloat(e.target.value))} />
      <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: "#aaa" }}>r = {r} m</p>

      <label>Rod Length (l)</label>
      <input type="range" min="1" max="5" step="0.1" value={l}
        onChange={e => setL(parseFloat(e.target.value))} />
      <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: "#aaa" }}>l = {l} m</p>

      <label>Angular Velocity (ω)</label>
      <input type="range" min="1" max="20" step="1" value={omega}
        onChange={e => setOmega(parseFloat(e.target.value))} />
      <p style={{ margin: "0 0 14px", fontSize: "0.85rem", color: "#aaa" }}>ω = {omega} rad/s</p>

      <label style={{ display: "block", marginBottom: 6 }}>Integration Method</label>
      <div style={{ display: "flex", gap: 8 }}>
        {["euler", "rk4"].map(m => (
          <button key={m} onClick={() => setMethod(m)} style={{
            flex: 1, padding: "6px 0", borderRadius: 6, cursor: "pointer",
            fontWeight: "bold", fontSize: "0.82rem",
            background: method === m ? (m === "euler" ? "#00e5ff22" : "#c084fc22") : "transparent",
            border: `1px solid ${method === m ? (m === "euler" ? "#00e5ff" : "#c084fc") : "#334"}`,
            color: method === m ? (m === "euler" ? "#00e5ff" : "#c084fc") : "#888",
          }}>
            {m === "euler" ? "Euler" : "RK4"}
          </button>
        ))}
      </div>
      <p style={{ margin: "6px 0 0", fontSize: "0.75rem", color: "#666" }}>
        {method === "euler"
          ? "Euler: sederhana, akurasi O(dt)"
          : "Runge-Kutta 4: akurasi O(dt⁴)"}
      </p>
    </div>
  )
}
