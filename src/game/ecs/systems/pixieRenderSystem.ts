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
import { Assets, Container, DisplayObject, Graphics, Sprite } from "pixi.js";
import { debug } from "@/game/config";

export const testMap = new Map<number, Sprite>;
export const debugMap = new Map<number, Graphics>;
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
    if (debug) {
      let graphic;
      if (!debugMap.has(id)) {
        graphic = new Graphics();
        graphic.lineStyle(2, "green", 1);
        graphic.moveTo(0, 0);
        graphic.lineTo(SizeComponent.width[id] * SizeComponent.ratio[id], 0);
        graphic.lineTo(SizeComponent.width[id] * SizeComponent.ratio[id], SizeComponent.height[id] * SizeComponent.ratio[id]);
        graphic.lineTo(0, SizeComponent.height[id] * SizeComponent.ratio[id]);
        graphic.lineTo(0, 0);
        graphic.pivot.x = (SizeComponent.width[id] * SizeComponent.ratio[id]) / 2;
        graphic.pivot.y = (SizeComponent.height[id] * SizeComponent.ratio[id]) / 2;
        debugMap.set(id, graphic);
        stage.addChild(graphic);
      }
      graphic = graphic ?? debugMap.get(id);
      if (!graphic) continue;

      graphic.x = posX;
      graphic.y = posY;
      graphic.rotation = Math.atan2(DirectionComponent.y[id], DirectionComponent.x[id]);
    } else {
      if (debugMap.size > 0) {
        for (const [,value] of debugMap) {
          value.destroy();
        }
        debugMap.clear()
      }
    }
  }
  return world;
}
