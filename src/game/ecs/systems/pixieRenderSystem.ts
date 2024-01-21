"use client";
import { IWorld } from "bitecs";
import { renderQuery } from "@/game/ecs/definedQueries";
import {
  DirectionComponent,
  PositionComponent,
  SizeComponent,
  SpeedComponent
} from "@/game/ecs/definedComponents";
import { lerp } from "@/app/utils";
import { Assets, Container, DisplayObject, Sprite } from "pixi.js";

const testMap = new Map<number, Sprite>;
export default function pixieRenderSystem(
  stage: Container<DisplayObject>,
  world: IWorld,
  delta: number,
) {
  const entities = renderQuery(world);
  for (const id of entities) {
    let sprite;
    if (!testMap.has(id)) {
      sprite = new Sprite(Assets.get("/textures/garbage_truck.png"));
      sprite.width = SizeComponent.width[id] * SizeComponent.ratio[id];
      sprite.height = SizeComponent.height[id] * SizeComponent.ratio[id];
      sprite.anchor.set(0.5, 0.5);
      testMap.set(id, sprite);
      stage.addChild(sprite);
    }
    sprite = sprite ?? testMap.get(id);
    if (!sprite) continue;

    const posX = PositionComponent.x[id];
    const posY = PositionComponent.y[id];

    sprite.x = lerp(posX, posX + (DirectionComponent.x[id] * SpeedComponent.current[id]), delta);
    sprite.y = lerp(posY, posY + (DirectionComponent.y[id] * SpeedComponent.current[id]), delta);
    sprite.rotation = lerp(sprite.rotation, Math.atan2(DirectionComponent.y[id], DirectionComponent.x[id]), delta);
  }
  return world;
}
