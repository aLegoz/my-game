import { defineQuery } from "bitecs";
import {
  ColorComponent,
  PositionComponent,
  SizeComponent,
  VelocityComponent
} from "@/game/ecs/definedComponents";

export const movementQuery = defineQuery([
  PositionComponent,
  VelocityComponent
]);
export const renderQuery = defineQuery([
  PositionComponent,
  VelocityComponent,
  SizeComponent,
  ColorComponent
]);