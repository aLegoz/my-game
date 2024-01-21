"use client";
import { IWorld } from "bitecs";
import { debugRenderFrameQuery } from "@/game/ecs/definedQueries";
import {
  DirectionComponent,
  PositionComponent,
  SizeComponent,
} from "@/game/ecs/definedComponents";
import { Container, DisplayObject, Graphics } from "pixi.js";
import { debug } from "@/game/config";

const debugMap = new Map<number, Graphics>;
export default function debugRenderFramePixiSystem(
  stage: Container<DisplayObject>,
  world: IWorld,
) {
  if (!debug) {
    if (debugMap.size > 0) {
      for (const [,value] of debugMap) {
        value.destroy();
      }
      debugMap.clear()
    }
    return world;
  }

  const entities = debugRenderFrameQuery(world);
  for (const id of entities) {
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

    graphic.x = PositionComponent.x[id];
    graphic.y = PositionComponent.y[id];
    graphic.rotation = Math.atan2(DirectionComponent.y[id], DirectionComponent.x[id]);
  }
  return world;
}
