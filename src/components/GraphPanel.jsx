
export default function GraphPanel({history}){

return(

<div className="panel">

<h2>Velocity Data</h2>

<p>Latest Slider Velocity:</p>

{history.length>0?history[history.length-1].vC.toFixed(3):0} m/s

</div>

)

}
