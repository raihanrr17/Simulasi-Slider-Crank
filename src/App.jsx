import { useState, useEffect, useRef } from "react"

import { computeSliderCrank } from "./physics/sliderCrankModel"

import ControlPanel from "./components/ControlPanel"
import SimulationControls from "./components/SimulationControl"
import MechanismView from "./components/MechanismView"
import Graph3Panel from "./chart/Graph3Panel"
import VectorDiagram from "./components/VectorDiagram"
import ValidationPanel from "./components/ValidationPanel"
import TheoryPanel from "./components/TheoryPanel"

export default function App() {

  const [r, setR] = useState(1)
  const [l, setL] = useState(2.5)
  const [omega, setOmega] = useState(2)

  const [theta, setTheta] = useState(0)
  const [history, setHistory] = useState([])

  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const ref = useRef(null)

  // =========================
  // SIMULATION ANIMATION LOOP
  // =========================

  useEffect(() => {
    function animate() {
      if (isPlaying) {
        setTheta(prev => prev + omega * 0.016 * speed)
      }
      ref.current = requestAnimationFrame(animate)
    }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [isPlaying, omega, speed])

  // =========================
  // COMPUTE CURRENT STATE
  // =========================

  const state = computeSliderCrank(r, l, omega, theta)

  // =========================
  // STORE HISTORY DATA
  // =========================

  useEffect(() => {
    setHistory(prev => [
      ...prev.slice(-300),
      {
        t: theta,
        x: state.C.x,
        v: state.vC,
        a: state.aC
      }
    ])
  }, [theta])

  // =========================
  // SIMULATION CONTROLS
  // =========================

  function play()  { setIsPlaying(true) }
  function pause() { setIsPlaying(false) }
  function step()  { setTheta(prev => prev + omega * 0.05) }
  function reset() { setTheta(0); setHistory([]) }

  // =========================
  // UI
  // =========================

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Slider Crank Educational Simulator
      </h1>

      {/* ── TOP: 3 kolom utama ── */}
      <div className="layout">

        {/* LEFT */}
        <div>
          <ControlPanel
            r={r} l={l} omega={omega}
            setR={setR} setL={setL} setOmega={setOmega}
          />
          <SimulationControls
            play={play} pause={pause} step={step} reset={reset}
            isPlaying={isPlaying}
          />
          <VectorDiagram state={state} />
        </div>

        {/* CENTER */}
        <div>
          <MechanismView state={state} r={r} l={l} />
          <ValidationPanel r={r} l={l} omega={omega} theta={theta} />
        </div>

        {/* RIGHT */}
        <div>
          <Graph3Panel history={history} />
        </div>

      </div>

      {/* ── BOTTOM: TheoryPanel full width 16:9 ── */}
      <div className="bottom-row">
        <div className="panel panel-wide">
          <TheoryPanel />
        <div className="panel panel-wide">
        </div>
      </div>

    </div>
  )
}
