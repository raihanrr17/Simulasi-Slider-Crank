
export default function ControlPanel({r,l,omega,setR,setL,setOmega}){

return(

<div className="panel">

<h2>Parameters</h2>

<label>Crank Length (r)</label>
<input type="range" min="0.5" max="2" step="0.1" value={r}
onChange={e=>setR(parseFloat(e.target.value))}/>

<label>Rod Length (l)</label>
<input type="range" min="1" max="5" step="0.1" value={l}
onChange={e=>setL(parseFloat(e.target.value))}/>

<label>Angular Velocity (ω)</label>
<input type="range" min="1" max="20" step="1" value={omega}
onChange={e=>setOmega(parseFloat(e.target.value))}/>

<p>r = {r} m</p>
<p>l = {l} m</p>
<p>ω = {omega} rad/s</p>

</div>

)

}
