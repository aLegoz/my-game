"use client";
import { defineComponent } from "bitecs";
import { Vector2 } from "@/game/ecs/components/Vector2";
import { Size } from "@/game/ecs/components/Size";
import { Speed } from "@/game/ecs/components/Speed";

export const PositionComponent = defineComponent(Vector2);
export const SizeComponent = defineComponent(Size);
export const SpeedComponent = defineComponent(Speed);
export const DirectionComponent = defineComponent(Vector2);