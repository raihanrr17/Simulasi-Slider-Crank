
import {useState,useEffect,useRef} from "react"
import {computeSliderCrank} from "./physics/sliderCrankModel"
import ControlPanel from "./components/ControlPanel"
import SimulationControls from "./components/SimulationControl"
import MechanismView from "./components/MechanismView"
import Graph3Panel from "./chart/Graph3Panel"
import TheoryPanel from "./components/TheoryPanel"

export default function App(){

const [r,setR]=useState(1)
const [l,setL]=useState(2.5)
const [omega,setOmega]=useState(2)

const [theta,setTheta]=useState(0)
const [history,setHistory]=useState([])

const ref=useRef()

useEffect(()=>{

function animate(){

setTheta(t=>t+omega*0.016)

ref.current=requestAnimationFrame(animate)

}

ref.current=requestAnimationFrame(animate)

return()=>cancelAnimationFrame(ref.current)

},[omega])

const state=computeSliderCrank(r,l,omega,theta)

useEffect(()=>{

setHistory(h=>[...h.slice(-200),{vC:state.vC}])

},[theta])

// Simulation Control
function play(){
setIsPlaying(true)
}

function pause(){
setIsPlaying(false)
}

function step(){
setTheta(prev => prev + omega * 0.05)
}

function reset(){
setTheta(0)
setHistory([])
}
  
return(

<div>

<h1 style={{textAlign:"center"}}>Slider Crank Educational Simulator</h1>

<div className="layout">

<ControlPanel
r={r}
l={l}
omega={omega}
setR={setR}
setL={setL}
setOmega={setOmega}
/>

<SimulationControls
play={play}
pause={pause}
step={step}
reset={reset}
isPlaying={isPlaying}
/>

<MechanismView
state={state}
r={r}
l={l}
/>

<div>

<Graph3Panel history={history}/>

<TheoryPanel/>

</div>

</div>

</div>

)

}
