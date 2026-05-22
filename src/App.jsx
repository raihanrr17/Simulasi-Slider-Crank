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

  const state = computeSliderCrank(r, l, omega, theta)

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

  function play()  { setIsPlaying(true) }
  function pause() { setIsPlaying(false) }
  function step()  { setTheta(prev => prev + omega * 0.05) }
  function reset() { setTheta(0); setHistory([]) }

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Slider Crank Educational Simulator
      </h1>

      <div className="layout">
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

        <div>
          <MechanismView state={state} r={r} l={l} />
        </div>

        <div>
          <Graph3Panel history={history} />
        </div>
      </div>

      <div className="bottom-row">
        <div className="panel panel-wide">
          <ValidationPanel r={r} l={l} omega={omega} theta={theta} />
        </div>
        <div className="panel panel-wide">
          <TheoryPanel />
        </div>
      </div>
    </div>
  )  
}
