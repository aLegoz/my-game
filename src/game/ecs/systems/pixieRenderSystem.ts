"use client";
import { IWorld } from "bitecs";
import { renderQuery } from "@/game/ecs/definedQueries";
import {
  DirectionComponent,
  PositionComponent,
  SizeComponent,
  SpeedComponent
} from "@/game/ecs/definedComponents";
import { lerp, lerpRadian, rotatePoint } from "@/app/utils";
import { Assets, Container, DisplayObject, Sprite, Text } from "pixi.js";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import emitterConfig from "../../../../public/emitter.json";
import { showFps } from "@/game/config";

const testMap = new Map<number, Sprite>;
const ttestMap = new Map<number, Emitter>;
let text: Text | null;
let container: Container;

export default function pixieRenderSystem(
  stage: Container<DisplayObject>,
  world: IWorld,
  delta: number,
  fps: number,
  ups: number
) {
  const entities = renderQuery(world);
  let entityCounter = 0;
  for (const id of entities) {
    entityCounter += 1;
    let sprite;
    if (!testMap.has(id)) {
      sprite = new Sprite(Assets.get("/textures/garbage_truck.png"));
      sprite.width = SizeComponent.width[id] * SizeComponent.ratio[id];
      sprite.height = SizeComponent.height[id] * SizeComponent.ratio[id];
      sprite.anchor.set(0.5, 0.5);
      sprite.cacheAsBitmap = true;
      testMap.set(id, sprite);
      stage.addChild(sprite);
    }
    sprite = sprite ?? testMap.get(id);
    if (!sprite) continue;

    let emitter;
    if (!ttestMap.has(id)) {
      if (!container) {
        container = new Container();
      }
      emitter = new Emitter(container, upgradeConfig(emitterConfig, ['/textures/smokeparticle.png']));
      emitter.emit = true;
      emitter.autoUpdate = false;
      ttestMap.set(id, emitter);
      stage.addChild(container);
    }
    emitter = emitter ?? ttestMap.get(id);
    if (!emitter) continue;

    const { x, y } = rotatePoint(
      sprite.x - (sprite.width / 2) / 2,
      sprite.y - (sprite.height / 2) / 2,
      sprite.x,
      sprite.y,
      sprite.rotation
    )

    emitter.updateOwnerPos(x, y);
    emitter.update(delta / 250);


    const posX = PositionComponent.x[id];
    const posY = PositionComponent.y[id];

    sprite.x = lerp(posX, posX + (DirectionComponent.x[id] * SpeedComponent.current[id]), delta);
    sprite.y = lerp(posY, posY + (DirectionComponent.y[id] * SpeedComponent.current[id]), delta);

    sprite.rotation = lerpRadian(sprite.rotation, Math.atan2(DirectionComponent.y[id], DirectionComponent.x[id]), delta);
  }

  if (showFps) {
    let line = `fps: ${fps} \nups: ${ups}\nentity: ${entityCounter}`;
    if (!text) {
      text = new Text(line);
      text.x = 0;
      text.y = 0;
      text.scale.x = 0.5;
      text.scale.y = 0.5;
    }
    text.text = line
    stage.addChild(text);
  } else {
    if (text) {
      text.destroy();
      text = null;
    }
  }

  return world;
}
