import * as THREE from 'three'
const damp = THREE.MathUtils.damp

export function rgbaFromHEX(hex, alpha) {
  const r = parseInt(hex[1] + hex[2], 16)
  const g = parseInt(hex[3] + hex[4], 16)
  const b = parseInt(hex[5] + hex[6], 16)
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
}

export function dampMatrix(cur, target, delta, lambda) {
  return[
    damp(cur.x, target[0], lambda, delta),
    damp(cur.y, target[1], lambda, delta),
    damp(cur.z, target[2], lambda, delta),
  ]
}