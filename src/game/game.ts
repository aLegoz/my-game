import {
  addComponent,
  addEntity,
  createWorld,
  IWorld,
  pipe,
} from 'bitecs';
import { randomInt } from "@/app/utils";
import {
  ColorComponent,
  PositionComponent,
  SizeComponent,
  VelocityComponent
} from "@/game/ecs/definedComponents";
import boundarySystem from "@/game/ecs/systems/boundarySystem";
import movementSystem from "@/game/ecs/systems/movementSystem";
import renderSystem from "@/game/ecs/systems/renderSystem";

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
    this.fixedPipeline = pipe(boundarySystem, movementSystem);
    this.renderPipeline = pipe((world: IWorld) => renderSystem(context, world, this.delta));
    this.initEntities();
  }

  initEntities() {
    const count = 10000;
    for(let i = 0; i < count; i++) {
      const id = addEntity(this.world);
      addComponent(this.world, PositionComponent, id);
      addComponent(this.world, VelocityComponent, id);
      addComponent(this.world, ColorComponent, id);
      addComponent(this.world, SizeComponent, id);
      VelocityComponent.x[id] = randomInt(-100, 100);
      VelocityComponent.y[id] = randomInt(-100, 100);
      PositionComponent.x[id] = randomInt(0, 500);
      PositionComponent.y[id] = randomInt(0, 500);
      SizeComponent.height[id] = 20;
      SizeComponent.width[id] = 20;
      ColorComponent.colorIndex[id] = randomInt(0, 6);
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
    const MS_PER_UPDATE = 50;


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
