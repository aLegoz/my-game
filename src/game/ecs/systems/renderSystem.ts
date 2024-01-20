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
    const deltaX = Math.round(SizeComponent.width[id] / 2);
    const deltaY = Math.round(SizeComponent.height[id] / 2);
    const posX = PositionComponent.x[id] - deltaX;
    const posY = PositionComponent.y[id] - deltaY;

    drawContext.fillStyle = IndexedColors[ColorComponent.colorIndex[id]];
    drawContext.fillRect(
      lerp(posX, posX + VelocityComponent.x[id], delta),
      lerp(posY, posY + VelocityComponent.y[id], delta),
      SizeComponent.width[id],
      SizeComponent.height[id]
    );
  }
  return world;
}
