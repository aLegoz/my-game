export function randomInt(min: number, max: number) : number {
  if (min >= max) throw Error("Wtf man?");
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function lerp( a: number, b: number, alpha: number) : number {
  return a + alpha * ( b - a );
}

export function rotateVector(x: number, y: number, angle: number) {
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);

  const newX = x * cosTheta - y * sinTheta;
  const newY = x * sinTheta + y * cosTheta;

  return {x: newX, y: newY} as const;
}

export function degreesToRadians(degrees: number) : number {
  return degrees * (Math.PI / 180);
}