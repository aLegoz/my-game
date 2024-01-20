import { IWorld } from "bitecs";
import { movementQuery } from "@/game/ecs/definedQueries";
import { PositionComponent, VelocityComponent } from "@/game/ecs/definedComponents";

export default function movementSystem(world: IWorld) {
  const entities = movementQuery(world);
  for (const id of entities) {
    PositionComponent.x[id] += VelocityComponent.x[id];
    PositionComponent.y[id] += VelocityComponent.y[id];
  }
  return world;
}