export function randomInt(min: number, max: number) : number {
  if (min >= max) throw Error("Wtf man?");
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function lerp( a: number, b: number, alpha: number) : number {
  return a + alpha * ( b - a );
}

export function lerpRadian (a: number, b: number, alpha: number) : number {
  a = a % (2 * Math.PI);
  b = b % (2 * Math.PI);
  let angleDifference = b - a;

  if (Math.abs(angleDifference) > Math.PI) {
    angleDifference += (angleDifference > 0) ? -2 * Math.PI : 2 * Math.PI;
  }

  let interpolatedAngle = a + alpha * angleDifference;
  return (interpolatedAngle + 2 * Math.PI) % (2 * Math.PI);
}

export function rotatePoint(x: number, y: number, cx: number, cy: number, theta: number) {
  let xPrime = (x - cx) * Math.cos(theta) - (y - cy) * Math.sin(theta) + cx;
  let yPrime = (x - cx) * Math.sin(theta) + (y - cy) * Math.cos(theta) + cy;

  return { x: xPrime, y: yPrime };
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