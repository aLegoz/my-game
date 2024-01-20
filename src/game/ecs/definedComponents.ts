import { defineComponent } from "bitecs";
import { Vector2 } from "@/game/ecs/components/Vector2";
import { Size } from "@/game/ecs/components/Size";
import { Color } from "@/game/ecs/components/Color";

export const PositionComponent = defineComponent(Vector2);
export const VelocityComponent = defineComponent(Vector2);
export const SizeComponent = defineComponent(Size);
export const ColorComponent = defineComponent(Color);