import { useState, useEffect, useRef } from "react"
import { computeSliderCrank } from "./physics/sliderCrankModel"
import ControlPanel from "./components/ControlPanel"
import SimulationControls from "./components/SimulationControl"
import MechanismView from "./components/MechanismView"
import Graph3Panel from "./chart/Graph3Panel"
import ValidationPanel from "./components/ValidationPanel"
import TheoryPanel from "./components/TheoryPanel"

// ── Integrasi numerik: dθ/dt = ω ──
function stepEuler(theta, omega, dt) {
  return theta + omega * dt
}

function stepRK4(theta, omega, dt) {
  // f(theta) = omega (konstan), tapi tetap pakai RK4 untuk demonstrasi
  const k1 = omega
  const k2 = omega
  const k3 = omega
  const k4 = omega
  return theta + (dt / 6) * (k1 + 2*k2 + 2*k3 + k4)
}

export default function App() {
  const [r, setR]         = useState(1)
  const [l, setL]         = useState(2.5)
  const [omega, setOmega] = useState(2)
  const [method, setMethod] = useState("euler")   // "euler" | "rk4"

  const [theta, setTheta]     = useState(0)
  const [history, setHistory] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed]     = useState(1)

  const ref         = useRef(null)
  const lastTimeRef = useRef(null)
  const thetaRef    = useRef(0)       // ref untuk akses dt loop tanpa stale closure
  const methodRef   = useRef("euler")
  const omegaRef    = useRef(2)
  const speedRef    = useRef(1)

  // sync refs
  useEffect(() => { thetaRef.current  = theta  }, [theta])
  useEffect(() => { methodRef.current = method }, [method])
  useEffect(() => { omegaRef.current  = omega  }, [omega])
  useEffect(() => { speedRef.current  = speed  }, [speed])

  useEffect(() => {
    function animate(timestamp) {
      if (isPlaying) {
        const dt = lastTimeRef.current
          ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05) * speedRef.current
          : 0
        lastTimeRef.current = timestamp

        const step = methodRef.current === "rk4" ? stepRK4 : stepEuler
        const next = step(thetaRef.current, omegaRef.current, dt)
        thetaRef.current = next
        setTheta(next)
      } else {
        lastTimeRef.current = null
      }
      ref.current = requestAnimationFrame(animate)
    }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [isPlaying])

  const state = computeSliderCrank(r, l, omega, theta)
  const tNorm = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)

  useEffect(() => {
    setHistory(prev => [
      ...prev.slice(-300),
      {
        t:        tNorm,
        x:        state.C.x,
        v:        state.vC,
        a:        state.aC,
        omegaRod: state.omegaRod,
      }
    ])
  }, [theta])

  function play()  { setIsPlaying(true) }
  function pause() { setIsPlaying(false) }
  function step()  {
    const s = methodRef.current === "rk4" ? stepRK4 : stepEuler
    setTheta(prev => s(prev, omega, 0.05))
  }
  function reset() { setTheta(0); thetaRef.current = 0; setHistory([]) }

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Slider Crank Educational Simulator</h1>

      <div className="layout">
        <div>
          <ControlPanel
            r={r} l={l} omega={omega} method={method}
            setR={setR} setL={setL} setOmega={setOmega} setMethod={setMethod}
          />
          <SimulationControls
            play={play} pause={pause} step={step} reset={reset}
            isPlaying={isPlaying}
          />
        </div>

        <div>
          <MechanismView state={state} r={r} l={l} omega={omega} />
          <ValidationPanel r={r} l={l} omega={omega} theta={theta} />
        </div>

        <div>
          <Graph3Panel history={history} />
        </div>
      </div>

      <div className="bottom-row">
        <div className="panel panel-wide">
          <TheoryPanel />
        </div>
      </div>
    </div>
  )
}
