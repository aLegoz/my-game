"use client";
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
import rotatingSystem from "@/game/ecs/systems/rotatingSystem";
import { HEIGHT, MS_PER_UPDATE, WIDTH } from "@/game/config";
import { Application, Assets } from "pixi.js";
import pixieRenderSystem from "@/game/ecs/systems/pixieRenderSystem";


export const IndexedColors = [
  "red",
  "green",
  "blue",
  "purple",
  "white",
  "pink"
];

if (typeof window !== "undefined") {
  Assets.load('/textures/garbage_truck.png');
}

export default class Game {
  private renderApplication;
  private isRunning = false;
  private delta = 0;
  private isAwaitedAnimationFrame = false;
  private world: IWorld;
  private fixedPipeline;
  private renderPipeline;

  constructor(ref: HTMLDivElement) {
      this.renderApplication = new Application();
      if (typeof window !== "undefined") {
        Assets.load('/textures/garbage_truck.png');
      }
      // @ts-ignore
      ref.appendChild(this.renderApplication.view);
      this.isRunning = false;
      this.world = createWorld();
      this.fixedPipeline = pipe(rotatingSystem, boundarySystem, movementSystem);
      this.renderPipeline = pipe((world: IWorld) => pixieRenderSystem(this.renderApplication.stage, world, this.delta));
    // (world: IWorld) => renderSystem(context, world, this.delta)
  }

  unmount() {
    this.renderApplication.destroy(true);
  }

  initEntities(count: number) {
    for(let i = 0; i < count; i++) {
      this.initEntity(
        {x: randomInt(0, WIDTH), y: randomInt(0, HEIGHT)},
        randomInt(1, 5),
        {x: Math.random(), y: Math.random()},
        {width: 357, height: 124},
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
    if (this.isRunning) {
      console.log("The game is already running");
      return;
    }
    this.isRunning = true;
    new Promise(() => this.gameLoop());
  }

  async gameLoop() {
    let previous = performance.now();
    let lag: number = 0;

    let current: number;
    let elapsed: number;

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
      await new Promise(r => setTimeout(r, 0)); // Hack for not lock thread
    }
  }

  stop() {
    if (!this.isRunning) {
      console.log("The game hasn't started yet");
      return;
    }
    this.isRunning = false;
  }
}
