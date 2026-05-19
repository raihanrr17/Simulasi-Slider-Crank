
import {useRef,useEffect} from "react"

export default function MechanismView({state,r,l}){

const canvasRef=useRef(null)

useEffect(()=>{

const canvas=canvasRef.current
const ctx=canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

const scale=80

const pivot={x:200,y:150}

const A={x:pivot.x,y:pivot.y}

const B={
x:pivot.x+state.B.x*scale,
y:pivot.y-state.B.y*scale
}

const C={
x:pivot.x+state.C.x*scale,
y:pivot.y
}

ctx.lineWidth=4

ctx.strokeStyle="#00e5ff"
ctx.beginPath()
ctx.moveTo(A.x,A.y)
ctx.lineTo(B.x,B.y)
ctx.stroke()

ctx.strokeStyle="#ff6b35"
ctx.beginPath()
ctx.moveTo(B.x,B.y)
ctx.lineTo(C.x,C.y)
ctx.stroke()

ctx.fillStyle="white"
ctx.beginPath()
ctx.arc(A.x,A.y,6,0,Math.PI*2)
ctx.fill()

ctx.beginPath()
ctx.arc(B.x,B.y,6,0,Math.PI*2)
ctx.fill()

ctx.fillRect(C.x-10,C.y-10,20,20)

},[state])

return(

<div className="panel">

<h2>Mechanism</h2>

<canvas ref={canvasRef} width="400" height="300"/>

</div>

)

}
