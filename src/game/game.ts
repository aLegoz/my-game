import {
  addComponent,
  addEntity,
  createWorld, getAllEntities,
  IWorld,
  pipe, removeEntity,
} from 'bitecs';
import { randomInt } from "@/app/utils";
import {
  ColorComponent, DirectionComponent,
  PositionComponent,
  SizeComponent, SpeedComponent,
} from "@/game/ecs/definedComponents";
import boundarySystem from "@/game/ecs/systems/boundarySystem";
import movementSystem from "@/game/ecs/systems/movementSystem";
import renderSystem from "@/game/ecs/systems/renderSystem";
import rotatingSystem from "@/game/ecs/systems/rotatingSystem";

export const IndexedColors = [
  "red",
  "green",
  "blue",
  "purple",
  "white",
  "pink"
];

export default class Game {
  private isRunning = false;
  private delta = 0;
  private isAwaitedAnimationFrame = false;
  private world: IWorld;
  private fixedPipeline;
  private renderPipeline;

  constructor(context: CanvasRenderingContext2D) {
    this.isRunning = false;
    this.world = createWorld();
    this.fixedPipeline = pipe(rotatingSystem, boundarySystem, movementSystem);
    this.renderPipeline = pipe((world: IWorld) => renderSystem(context, world, this.delta));
    this.initEntities(1000);
  }

  initEntities(count: number) {
    for(let i = 0; i < count; i++) {
      this.initEntity(
        {x: randomInt(0, 500), y: randomInt(0, 500)},
        randomInt(1, 5),
        {x: Math.random(), y: Math.random()},
        {width: randomInt(5, 30), height: randomInt(5, 30)},
        randomInt(0, 6)
      );
    }
  }

  initEntity(
    position: {x: number, y: number},
    speed: number,
    direction: {x: number, y: number},
    size: {width: number, height: number},
    color: number
    ) {
    const id = addEntity(this.world);
    addComponent(this.world, PositionComponent, id);
    addComponent(this.world, ColorComponent, id);
    addComponent(this.world, SizeComponent, id);
    addComponent(this.world, SpeedComponent, id);
    addComponent(this.world, DirectionComponent, id);
    SpeedComponent.current[id] = speed;
    DirectionComponent.x[id] = direction.x;
    DirectionComponent.y[id] = direction.y;
    PositionComponent.x[id] = position.x;
    PositionComponent.y[id] = position.y;
    SizeComponent.height[id] = size.height;
    SizeComponent.width[id] = size.width;
    ColorComponent.colorIndex[id] = color;
  }

  removeAllEntity() {
    for (const id of getAllEntities(this.world)) {
      removeEntity(this.world, id);
    }
  }

  fixedTick() {
    this.fixedPipeline(this.world);
  }

  renderTick() {
    this.renderPipeline(this.world);
    this.isAwaitedAnimationFrame = false;
  }

  start() {
    console.log("Start");
    if (this.isRunning) {
      console.log("The game is already running");
      return;
    }
    this.isRunning = true;
    new Promise(() => this.gameLoop());
  }

  async gameLoop() {
    console.log("GameLoop");
    let previous = performance.now();
    let current: number;
    let elapsed: number;
    let lag: number = 0;
    const FPS = 20;
    const MS_PER_UPDATE = 1000 / FPS;


    while (this.isRunning) {
      current = performance.now();
      elapsed = current - previous;
      previous = current;
      lag += elapsed;

      while (lag >= MS_PER_UPDATE) {
        this.fixedTick();
        lag -= MS_PER_UPDATE;
      }

      if (!this.isAwaitedAnimationFrame) {
        this.isAwaitedAnimationFrame = true;
        requestAnimationFrame(() => this.renderTick());
      }
      this.delta = lag / MS_PER_UPDATE;
      await new Promise(r => setTimeout(r, 0));
    }
  }

  stop() {
    console.log("Stop");
    if (!this.isRunning) {
      console.log("The game hasn't started yet");
      return;
    }
    this.isRunning = false;
  }
}
