
export const BOUNDARIES = {
  left: 0.3,
  right: 0.7,
  top: 0.15,
  bottom: 0.9
};

function clamp(value, min, max) {
  if(value < min) return min;
  if(value > max) return max;
  return value;
}

export function setBoundaries(actor){
  actor.pos.x = clamp(actor.pos.x, BOUNDARIES.left, BOUNDARIES.right);
  actor.pos.y = clamp(actor.pos.y, BOUNDARIES.top, BOUNDARIES.bottom);
}