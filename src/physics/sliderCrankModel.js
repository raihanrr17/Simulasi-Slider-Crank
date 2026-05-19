export function computeSliderCrank(r,l,omega,theta){

const sinT=Math.sin(theta)
const cosT=Math.cos(theta)

const sinPhi=(r/l)*sinT
const phi=Math.asin(sinPhi)

const cosPhi=Math.sqrt(1-sinPhi*sinPhi)

const xB=r*cosT
const yB=r*sinT

const xC=r*cosT+l*cosPhi

const vBx=-r*omega*sinT
const vBy=r*omega*cosT

const omegaRod=(r*omega*cosT)/(l*cosPhi)

const vC=-r*omega*sinT-l*omegaRod*Math.sin(phi)

return{

A:{x:0,y:0},
B:{x:xB,y:yB},
C:{x:xC,y:0},
vB:{x:vBx,y:vBy},
vC,
phi,
omegaRod

}
}
