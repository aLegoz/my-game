import { defineComponent } from "bitecs";
import { Vector2 } from "@/game/ecs/components/Vector2";
import { Size } from "@/game/ecs/components/Size";
import { Color } from "@/game/ecs/components/Color";
import { Speed } from "@/game/ecs/components/Speed";

export const PositionComponent = defineComponent(Vector2);
//export const VelocityComponent = defineComponent(Vector2);
export const SizeComponent = defineComponent(Size);
export const ColorComponent = defineComponent(Color);
export const SpeedComponent = defineComponent(Speed);
export const DirectionComponent = defineComponent(Vector2);