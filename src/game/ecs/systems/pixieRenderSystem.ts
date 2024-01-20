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

export const testMap = new Map<number, Sprite>;
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
      sprite.width = SizeComponent.width[id];
      sprite.height = SizeComponent.height[id];
      sprite.x = 0;
      sprite.y = 0;
      sprite.anchor.set(0.5, 0.5);
      testMap.set(id, sprite);
      stage.addChild(sprite);
    }
    sprite = sprite ?? testMap.get(id);
    if (!sprite) continue;

    const deltaX = Math.round(SizeComponent.width[id] / 2);
    const deltaY = Math.round(SizeComponent.height[id] / 2);
    const posX = PositionComponent.x[id] - deltaX;
    const posY = PositionComponent.y[id] - deltaY;

    sprite.x = lerp(posX, posX + (DirectionComponent.x[id] * SpeedComponent.current[id]), delta);
    sprite.y = lerp(posY, posY + (DirectionComponent.y[id] * SpeedComponent.current[id]), delta);
    sprite.rotation = Math.atan2(DirectionComponent.y[id], DirectionComponent.x[id]);
  }
  return world;
}
