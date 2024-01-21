import { IWorld } from "bitecs";
import { movementQuery } from "@/game/ecs/definedQueries";
import { DirectionComponent, PositionComponent } from "@/game/ecs/definedComponents";

export default function boundarySystem(world: IWorld, boundary: {width: number, height: number}) {
  const entities = movementQuery(world);
  for (const id of entities) {

    if (PositionComponent.x[id] < 0) {
      if (DirectionComponent.x[id] < 0) {
        DirectionComponent.x[id] *= -1;
      }
    }

    if (PositionComponent.x[id] > boundary.width) {
      if (DirectionComponent.x[id] > 0) {
        DirectionComponent.x[id] *= -1;
      }
    }

    if (PositionComponent.y[id] < 0) {
      if (DirectionComponent.y[id] < 0) {
        DirectionComponent.y[id] *= -1;
      }
    }

    if (PositionComponent.y[id] > boundary.height) {
      if (DirectionComponent.y[id] > 0) {
        DirectionComponent.y[id] *= -1;
      }
    }
  }
  return world;
}