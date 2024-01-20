'use client';
import styles from './page.module.css'
import { RefObject, useEffect, useRef, useState } from "react";
import Game from "@/game/game";

export default function Home() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [game] = useGame(ref);

  return (
    <main className={styles.main}>
      <div>
        <button onClick={() => game?.start()}>Start</button>
        <button onClick={() => game?.stop()}>Stop</button>
      </div>
      <div>
        <canvas ref={ref} width={500} height={500}></canvas>
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
