export default function SimulationControls({play,pause,step,isPlaying}){

return(

<div className="panel">

<h2>Simulation Control</h2>

<button onClick={play}>▶ Play</button>

<button onClick={pause}>⏸ Pause</button>

<button onClick={step}>⏭ Step</button>

</div>

)

}