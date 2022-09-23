const canv = document.querySelector("#canv");
const ctx = canv.getContext("2d", {
  desynchronized: true,
});
ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
ctx.lineWidth = 3;

let drag = null;

async function main() {
  const res = await loadRecent()
  if (res.data) {
    // read dataurl into canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    }
    img.src = res.data;
  }
}

//debounce save
let saveTimeout = null;
function autosave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(async () => {
    const data = canv.toDataURL();
    await saveRecent(data);
  }, 1000);
}

main()

document.addEventListener("keydown", async (e) => {
  if (e.key == "Enter") {
    const data = canv.toDataURL();
    await save(data)
    ctx.clearRect(0, 0, canv.width, canv.height);
  }
});

canv.addEventListener("pointerdown", (e) => {
  canv.setPointerCapture(e.pointerId);

  const x = e.offsetX;
  const y = e.offsetY;
  drag = { x, y };
});

canv.addEventListener("pointermove", (e) => {
  e.preventDefault();
  if (drag) {
    const x = e.offsetX;
    const y = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(drag.x, drag.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    drag = { x, y };
  }
});

canv.addEventListener("pointerup", (e) => {
  canv.releasePointerCapture(e.pointerId);
  autosave()
  drag = null;
});
canv.addEventListener("touchmove", (e) => {
  e.preventDefault();
});

canv.addEventListener("pointercancel", (e) => {
  drag = null;
});
