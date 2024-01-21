"use client";
import { IWorld } from "bitecs";
import { movementQuery } from "@/game/ecs/definedQueries";
import { DirectionComponent } from "@/game/ecs/definedComponents";
import { degreesToRadians, randomInt, rotateVector } from "@/app/utils";

export default function rotatingSystem(world: IWorld) {
  const entities = movementQuery(world);
  for (const id of entities) {
    const {x, y} = rotateVector(
      DirectionComponent.x[id],
      DirectionComponent.y[id],
      degreesToRadians(randomInt(-1, 1))
    );
    DirectionComponent.x[id] = x;
    DirectionComponent.y[id] = y;
  }
  return world;
}