'use client';
import styles from './page.module.css'
import { RefObject, useEffect, useRef, useState } from "react";
import Game, { IndexedColors } from "@/game/game";

export default function Home() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [game] = useGame(ref);

  const [position, setPosition] = useState({x: 250, y: 250});
  const [velocity, setVelocity] = useState({x: 5, y: 5});
  const [size, setSize] = useState({height: 20, width: 20})
  const [color, setColor] = useState(0);

  const [count, setCount] = useState(10000);

  return (
    <main className={styles.main}>
      <div>
        <canvas ref={ref} width={500} height={500}></canvas>
      </div>
      <div>
        <div className={styles.new}>
          <label>Position:</label>
          <br/>
          <label>x: </label>
          <input type="number" value={position.x} onChange={(test) => setPosition({...position, x: Number(test.currentTarget.value)})}/>
          <br/>
          <label>y: </label>
          <input type="number" value={position.y} onChange={(test) => setPosition({...position, y: Number(test.currentTarget.value)})}/>
          <br/>
          <br/>

          <label>Velocity:</label>
          <br/>
          <label>x: </label>
          <input type="number" value={velocity.x} onChange={(test) => setVelocity({...velocity, x: Number(test.currentTarget.value)})}/>
          <br/>
          <label>y: </label>
          <input type="number" value={velocity.y} onChange={(test) => setVelocity({...velocity, y: Number(test.currentTarget.value)})}/>
          <br/>
          <br/>

          <label>Size:</label>
          <br/>
          <label>h: </label>
          <input type="number" value={size.height} onChange={(test) => setSize({...size, height: Number(test.currentTarget.value)})}/>
          <br/>
          <label>w: </label>
          <input type="number" value={size.width} onChange={(test) => setSize({...size, width: Number(test.currentTarget.value)})}/>
          <br/>
          <br/>

          <label>Color: </label>
          <br/>
          <label>i:</label>
          <input type="number" min={0} max={IndexedColors.length - 1}  value={color} onChange={(test) => setColor(Number(test.currentTarget.value))}/>
          <br/>
          <button onClick={() => game?.initEntity(
            position,
            velocity,
            size,
            color
          )}>Create entity</button>
        </div>
        <br/>
        <div>
          <label>Count:</label>
          <input type="number" min={0} value={count} onChange={(e) => setCount(Number(e.currentTarget.value))}/>
          <button onClick={() => game?.initEntities(count)}>Create random entities</button>
        </div>
        <br/>
        <button onClick={() => game?.start()}>Start</button>
        <button onClick={() => game?.stop()}>Stop</button>
        <button onClick={() => game?.removeAllEntity()}>RemoveEntities</button>
      </div>
    </main>
  )
}

function useGame(canvasRef: RefObject<HTMLCanvasElement>) {
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    let context;
    if (!canvasRef.current) return;
    context = canvasRef.current.getContext("2d");
    if (!context) return;
    const game = new Game(context);
    game.start();
    setGame(game);

    return () => {
      game.stop();
      setGame(undefined);
    };
  }, [canvasRef]);

  return [game] as const;
}
