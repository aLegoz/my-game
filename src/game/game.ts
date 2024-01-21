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
  DirectionComponent,
  PositionComponent,
  SizeComponent,
  SpeedComponent,
} from "@/game/ecs/definedComponents";
import boundarySystem from "@/game/ecs/systems/boundarySystem";
import movementSystem from "@/game/ecs/systems/movementSystem";
import rotatingSystem from "@/game/ecs/systems/rotatingSystem";
import { MS_PER_UPDATE } from "@/game/config";
import { Application, Assets } from "pixi.js";
import pixieRenderSystem from "@/game/ecs/systems/pixieRenderSystem";
import debugRenderFramePixiSystem from "@/game/ecs/systems/debugRenderFramePixiSystem";
import debugRenderDirectionPixiSystem from "@/game/ecs/systems/debugRenderDirectionPixiSystem";

export default class Game {
  private renderApplication;
  private isRunning = false;
  private delta = 0;
  private isAwaitedAnimationFrame = false;
  private world: IWorld;
  private fixedPipeline;
  private renderPipeline;
  private fps = 0;
  private ups = 0;

  constructor(ref: HTMLDivElement) {
      this.renderApplication = new Application<HTMLCanvasElement>();
      this.renderApplication.renderer.background.color = "darkgray";
      Assets.load([
        '/textures/garbage_truck.png',
        '/textures/garbage_container.png'
      ]);
      ref.appendChild(this.renderApplication.view);
      this.isRunning = false;
      this.world = createWorld();
      this.fixedPipeline = pipe(
        rotatingSystem,
        (world: IWorld) => boundarySystem(world, this.getScreenSize()),
        movementSystem
      );
      this.renderPipeline = pipe(
        (world: IWorld) => pixieRenderSystem(this.renderApplication.stage, world, this.delta, this.fps, this.ups),
        (world: IWorld) => debugRenderFramePixiSystem(this.renderApplication.stage, world),
        (world: IWorld) => debugRenderDirectionPixiSystem(this.renderApplication.stage, world)
      );
  }

  getScreenSize() {
    return { width: this.renderApplication.screen.width, height: this.renderApplication.screen.height};
  }

  unmount() {
    this.renderApplication.destroy(true);
  }

  initEntities(count: number) {
    for(let i = 0; i < count; i++) {
      this.initEntity(
        {x: randomInt(0, this.renderApplication.screen.width), y: randomInt(0, this.renderApplication.screen.height)},
        randomInt(5, 10),
        {x: Math.random(), y: Math.random()},
        {width: 357, height: 124, ratio: 0.33},
      );
    }
  }

  initEntity(
    position: {x: number, y: number},
    speed: number,
    direction: {x: number, y: number},
    size: { width: number, height: number, ratio: number },
    ) {
    const id = addEntity(this.world);
    addComponent(this.world, PositionComponent, id);
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
    SizeComponent.ratio[id] = size.ratio;
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
    let renderFrameCount = 0;
    let fixedFrameCount = 0;
    let fpsTimer = performance.now();

    let current: number;
    let elapsed: number;

    while (this.isRunning) {
      current = performance.now();
      elapsed = current - previous;
      previous = current;
      lag += elapsed;

      while (lag >= MS_PER_UPDATE) {
        this.fixedTick();
        fixedFrameCount += 1;
        lag -= MS_PER_UPDATE;
      }

      this.delta = lag / MS_PER_UPDATE;
      this.renderTick();
      renderFrameCount += 1;

      if ((performance.now() - fpsTimer) > 1000) {
        fpsTimer += 1000;
        this.ups = fixedFrameCount;
        this.fps = renderFrameCount;
        renderFrameCount = 0;
        fixedFrameCount = 0;
      }

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
