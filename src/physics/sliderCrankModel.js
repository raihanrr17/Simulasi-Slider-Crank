export function computeSliderCrank(r, l, omega, theta) {

  const sinT = Math.sin(theta)
  const cosT = Math.cos(theta)

  const sinPhi = (r / l) * sinT
  const phi = Math.asin(sinPhi)
  const cosPhi = Math.sqrt(1 - sinPhi * sinPhi)

  // --- Posisi ---
  const xB = r * cosT
  const yB = r * sinT
  const xC = r * cosT + l * cosPhi

  // --- Kecepatan ---
  const vBx = -r * omega * sinT
  const vBy =  r * omega * cosT

  const omegaRod = (r * omega * cosT) / (l * cosPhi)

  const vC = -r * omega * sinT - l * omegaRod * Math.sin(phi)

  // --- Akselerasi ---
  // Akselerasi angular crank = 0 (omega konstan)
  // Akselerasi titik B (ujung crank)
  const aBx = -r * omega ** 2 * cosT
  const aBy = -r * omega ** 2 * sinT

  // Akselerasi angular connecting rod:
  // alphaRod = (-r*omega²*sinT - l*omegaRod²*cosPhi) / (l*cosPhi)  -- simplified
  // Turunan lengkap dari omegaRod terhadap waktu:
  const alphaRod = (
    -r * omega ** 2 * sinT * cosPhi
    - r * omega * cosT * (-omegaRod * sinPhi)   // chain rule d(cosPhi)/dt
    - l * omegaRod ** 2 * sinPhi * cosPhi        // centripetal dari rod
  ) / (l * cosPhi ** 2)

  // Akselerasi slider C (hanya sumbu x):
  const aC = aBx - l * (alphaRod * Math.sin(phi) + omegaRod ** 2 * Math.cos(phi))

  return {
    A: { x: 0, y: 0 },
    B: { x: xB, y: yB },
    C: { x: xC, y: 0 },
    vB: { x: vBx, y: vBy },
    vC,
    aC,       
    phi,
    omegaRod,
    alphaRod,
  }
}
