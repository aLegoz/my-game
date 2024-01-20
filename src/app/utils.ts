export function randomInt(min: number, max: number) : number {
  if (min >= max) throw Error("Wtf man?");
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function lerp( a: number, b: number, alpha: number) : number {
  return a + alpha * ( b - a );
}