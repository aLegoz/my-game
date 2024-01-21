"use client";
import { defineQuery } from "bitecs";
import {
  DirectionComponent,
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
]);