import { useState, useEffect, useRef } from "react"
import { computeSliderCrank } from "./physics/sliderCrankModel"
import ControlPanel from "./components/ControlPanel"
import SimulationControls from "./components/SimulationControl"
import MechanismView from "./components/MechanismView"
import Graph3Panel from "./chart/Graph3Panel"
import ValidationPanel from "./components/ValidationPanel"
import TheoryPanel from "./components/TheoryPanel"
import GuideModal from "./components/GuideModal"

export default function App() {
  const [r, setR]         = useState(1)
  const [l, setL]         = useState(2.5)
  const [omega, setOmega] = useState(2)
  const [theta, setTheta]     = useState(0)
  const [history, setHistory] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed]     = useState(1)
  const [showGuide, setShowGuide] = useState(false)

  const ref         = useRef(null)
  const lastTimeRef = useRef(null)
  const thetaRef    = useRef(0)
  const omegaRef    = useRef(2)
  const speedRef    = useRef(1)

  useEffect(() => { thetaRef.current  = theta  }, [theta])
  useEffect(() => { omegaRef.current  = omega  }, [omega])
  useEffect(() => { speedRef.current  = speed  }, [speed])

  useEffect(() => {
    function animate(timestamp) {
      if (isPlaying) {
        const dt = lastTimeRef.current
          ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05) * speedRef.current
          : 0
        lastTimeRef.current = timestamp
        const next = thetaRef.current + omegaRef.current * dt
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

  const state = computeSliderCrank(r, l, omega, theta, 5, 5)
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
  function step()  { setTheta(prev => prev + omega * 0.05) }
  function reset() { setTheta(0); thetaRef.current = 0; setHistory([]) }
  function setThetaManual(val) { thetaRef.current = val; setTheta(val) }

  return (
    <div style={{ position: "relative" }}>
      {/* Floating help button */}
      <button
        onClick={() => setShowGuide(true)}
        title="Panduan Penggunaan"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 900,
          width: 40, height: 40, borderRadius: "50%",
          background: "#1e2d50", border: "1px solid #3a4f7a",
          color: "#7cb3ff", fontSize: "1.1rem", fontWeight: "bold",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        }}
      >?</button>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "16px 16px 0" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Slider Crank Educational Simulator</h1>

      </div>

      {/* Guide modal */}
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

      {/* Main layout */}
      <div className="layout">
        <div>
          <ControlPanel r={r} l={l} omega={omega} setR={setR} setL={setL} setOmega={setOmega} />
          <SimulationControls
            play={play} pause={pause} step={step} reset={reset}
            isPlaying={isPlaying} theta={theta} setTheta={setThetaManual}
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

      {/* Footer */}
      <footer style={{
        textAlign: "center", padding: "12px 16px 20px",
        fontSize: "0.78rem", color: "#4a5568",
        borderTop: "1px solid #1a2340",
      }}>
        © {new Date().getFullYear()} Raihan_MKB23 — Slider-Crank Educational Simulator
      </footer>
    </div>
  )
}
