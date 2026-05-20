export default function VectorDiagram({state}) {

  return (
    <div className="panel">
      <h2>Velocity Vectors</h2>

      <p>vB: ({state.vB.x.toFixed(2)}, {state.vB.y.toFixed(2)}) m/s</p>
      <p>vC: {state.vC.toFixed(2)} m/s</p>
      <p>ω rod: {state.omegaRod.toFixed(2)} rad/s</p>

    </div>
  )
}