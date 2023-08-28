import kaboom from "kaboom";

const k = kaboom({
  width: 500,
  height: 500,
  background: [0, 0, 0, 0],
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
});

export const {
  add,
  rect,
  pos,
  outline,
  area,
  debug,
  text,
  anchor,
  color,
  width,
  center,
  height,
  opacity,
  scene,
  go,
  vec2,
  setCursor,
  scale,
  rgb,
} = k;
