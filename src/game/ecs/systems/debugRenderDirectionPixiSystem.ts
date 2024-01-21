"use client";
import { IWorld } from "bitecs";
import { debugRenderDirectionQuery } from "@/game/ecs/definedQueries";
import {
  DirectionComponent,
  PositionComponent,
} from "@/game/ecs/definedComponents";
import { Container, DisplayObject, Graphics } from "pixi.js";
import { debug } from "@/game/config";

const debugMap = new Map<number, Graphics>;
export default function debugRenderDirectionPixiSystem(
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

  const entities = debugRenderDirectionQuery(world);
  for (const id of entities) {
    let graphic;
    if (!debugMap.has(id)) {
      graphic = new Graphics();
      graphic.lineStyle(2, "red", 1);
      graphic.moveTo(0, 0);
      graphic.lineTo(100, 0);
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
