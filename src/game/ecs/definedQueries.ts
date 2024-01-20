import { defineQuery } from "bitecs";
import {
  ColorComponent, DirectionComponent,
  PositionComponent,
  SizeComponent,
  SpeedComponent,
} from "@/game/ecs/definedComponents";

export const movementQuery = defineQuery([
  PositionComponent,
  SpeedComponent,
  DirectionComponent
]);
export const renderQuery = defineQuery([
  PositionComponent,
  SpeedComponent,
  DirectionComponent,
  SizeComponent,
  ColorComponent
]);