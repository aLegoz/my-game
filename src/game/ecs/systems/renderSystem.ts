import { IWorld } from "bitecs";
import { renderQuery } from "@/game/ecs/definedQueries";
import { ColorComponent, PositionComponent, SizeComponent, VelocityComponent } from "@/game/ecs/definedComponents";
import { lerp } from "@/app/utils";
import { IndexedColors } from "@/game/game";

export default function renderSystem(
  drawContext: CanvasRenderingContext2D,
  world: IWorld,
  delta: number
) {
  const entities = renderQuery(world);
  drawContext.clearRect(0, 0, 500, 500);
  for (const id of entities) {
    drawContext.fillStyle = IndexedColors[ColorComponent.colorIndex[id]];
    drawContext.fillRect(
      lerp(PositionComponent.x[id], PositionComponent.x[id] + VelocityComponent.x[id], delta),
      lerp(PositionComponent.y[id], PositionComponent.y[id] + VelocityComponent.y[id], delta),
      SizeComponent.width[id],
      SizeComponent.height[id]
    );
  }
  return world;
}
