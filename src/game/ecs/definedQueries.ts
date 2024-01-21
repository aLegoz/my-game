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

export const debugRenderFrameQuery = defineQuery([
  PositionComponent,
  SizeComponent,
  DirectionComponent
]);

export const debugRenderDirectionQuery = defineQuery([
  DirectionComponent,
  PositionComponent,
]);