let UPS = 20;
let MS_PER_UPDATE = Math.round(1000 / UPS);

function setUps(value: number) {
  UPS = value;
  MS_PER_UPDATE = Math.round(1000 / value);
}

export { MS_PER_UPDATE, UPS, setUps }