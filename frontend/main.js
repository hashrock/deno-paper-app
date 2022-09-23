const canv = document.querySelector('#canv')
const ctx = canv.getContext('2d')
ctx.strokeStyle = 'red'
ctx.strokeWidth = 5

let drag = null

canv.addEventListener('pointerdown', (e) => {
  const x = e.offsetX
  const y = e.offsetY
  drag = { x, y }
})

canv.addEventListener('pointermove', (e) => {
  if (drag) {
    const x = e.offsetX
    const y = e.offsetY
    ctx.beginPath()
    ctx.moveTo(drag.x, drag.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    drag = { x, y }
  }
})

canv.addEventListener('pointerup', (e) => {
  drag = null
})

canv.addEventListener('pointerleave', (e) => {
  drag = null
})

canv.addEventListener('pointerout', (e) => {
  drag = null
})

canv.addEventListener('pointercancel', (e) => {
  drag = null
})
