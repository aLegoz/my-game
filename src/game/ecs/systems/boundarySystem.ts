import { IWorld } from "bitecs";
import { movementQuery } from "@/game/ecs/definedQueries";
import { PositionComponent, VelocityComponent } from "@/game/ecs/definedComponents";

export default function boundarySystem(world: IWorld) {
  const entities = movementQuery(world);
  for (const id of entities) {
    if (PositionComponent.x[id] < 0) {
      if (VelocityComponent.x[id] < 0) {
        VelocityComponent.x[id] *= -1;
      }
    }

    if (PositionComponent.x[id] > 500) {
      if (VelocityComponent.x[id] > 0) {
        VelocityComponent.x[id] *= -1;
      }
    }

    if (PositionComponent.y[id] < 0) {
      if (VelocityComponent.y[id] < 0) {
        VelocityComponent.y[id] *= -1;
      }
    }

    if (PositionComponent.y[id] > 500) {
      if (VelocityComponent.y[id] > 0) {
        VelocityComponent.y[id] *= -1;
      }
    }
  }
  return world;
}