export function computeSliderCrank(r, l, omega, theta, mSlider = 1, mRod = 1) {

  const sinT = Math.sin(theta)
  const cosT = Math.cos(theta)

  const sinPhi = (r / l) * sinT
  const phi    = Math.asin(sinPhi)
  const cosPhi = Math.sqrt(Math.max(0, 1 - sinPhi * sinPhi))

  // ── Posisi ──
  const xB = r * cosT
  const yB = r * sinT
  const xC = r * cosT + l * cosPhi

  // ── Kecepatan ──
  const vBx = -r * omega * sinT
  const vBy =  r * omega * cosT
  const omegaRod = (r * omega * cosT) / (l * cosPhi || 1e-9)
  const vC = -r * omega * sinT - l * omegaRod * Math.sin(phi)

  // ── Akselerasi ──
  const alphaRod = (
    -r * omega ** 2 * sinT * cosPhi
    - r * omega * cosT * (-omegaRod * sinPhi)
    - l * omegaRod ** 2 * sinPhi * cosPhi
  ) / (l * cosPhi ** 2 || 1e-9)

  const aBx = -r * omega ** 2 * cosT
  const aBy = -r * omega ** 2 * sinT
  const aC  = aBx - l * (alphaRod * Math.sin(phi) + omegaRod ** 2 * Math.cos(phi))

  // ── Gaya ──
  // Gaya inersia slider (Newton II): F = m * a
  const Fslider = mSlider * aC                          // N, arah horizontal

  // Gaya inersia pada rod (dimodelkan di titik tengah rod)
  // Akselerasi titik tengah rod
  const aMidX = (aBx + aC) / 2
  const aMidY = (aBy + 0)  / 2
  const FrodX = mRod * aMidX                            // komponen X
  const FrodY = mRod * aMidY                            // komponen Y
  const Frod  = Math.hypot(FrodX, FrodY)               // besar gaya resultante rod

  // Gaya pin B (reaksi dari crank ke rod)
  // = gaya inersia rod + gaya yang diteruskan ke slider (proyeksi sumbu rod)
  const FpinX = mRod * aBx + Fslider * cosPhi
  const FpinY = mRod * aBy + Fslider * (-sinPhi)
  const Fpin  = Math.hypot(FpinX, FpinY)

  return {
    A: { x: 0,   y: 0  },
    B: { x: xB,  y: yB },
    C: { x: xC,  y: 0  },
    vB: { x: vBx, y: vBy },
    vC,
    aC,
    phi,
    omegaRod,
    alphaRod,
    // Gaya
    Fslider,          // gaya inersia slider (N)
    Frod,             // gaya inersia resultante rod (N)
    FrodX, FrodY,     // komponen gaya rod
    Fpin,             // gaya pada pin B (N)
    FpinX, FpinY,
  }
}
