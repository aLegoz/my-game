"use client";
import { IWorld } from "bitecs";
import { movementQuery } from "@/game/ecs/definedQueries";
import { DirectionComponent, PositionComponent, SpeedComponent } from "@/game/ecs/definedComponents";

export default function movementSystem(world: IWorld) {
  const entities = movementQuery(world);
  for (const id of entities) {
    PositionComponent.x[id] += DirectionComponent.x[id] * SpeedComponent.current[id];
    PositionComponent.y[id] += DirectionComponent.y[id] * SpeedComponent.current[id];
  }
  return world;
}