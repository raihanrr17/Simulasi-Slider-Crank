export default function SimulationControls({play,pause,step,reset,isPlaying}){

return(

<div className="panel">
<h2>Simulation Control</h2>
<button onClick={play}>▶ Play</button>
<button onClick={pause}>⏸ Pause</button>
<button onClick={step}>⏭ Step</button>
<button onClick={reset} style={{ background: "#5c1a1a", borderColor: "#a33" }}>⏹ Reset</button>
</div>

)

}
