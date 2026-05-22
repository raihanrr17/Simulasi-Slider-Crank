export default function ValidationPanel({ r, l, omega, theta }) {
  const safeTheta = ((theta ?? 0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
  const safeR = r ?? 0
  const safeL = l ?? 0
  const safeOmega = omega ?? 0

  const xExpr =
    `${safeR} cos(${safeTheta.toFixed(2)}) + √(${safeL}² − ${safeR}² sin(${safeTheta.toFixed(2)})²)`

  return (
    <div className="panel">
      <h2>Equation Validation</h2>
      <p><b>Slider Position Equation</b></p>
      <p style={{ fontFamily: "monospace" }}>
        x(θ) = {xExpr}
      </p>
      <p>r = {safeR}</p>
      <p>l = {safeL}</p>
      <p>ω = {safeOmega}</p>
      <p>θ = {safeTheta.toFixed(2)} rad ({(safeTheta * 180 / Math.PI).toFixed(1)}°)</p>
    </div>
  )
}
