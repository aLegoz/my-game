"use client";
import { RefObject, useEffect, useState } from "react";
import Game from "@/game/game";

export default function useGame(canvasRef: RefObject<HTMLDivElement>) {
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    if (typeof window === undefined) return;
    let container;
    if (!canvasRef.current) return;
    container = canvasRef.current;
    if (!container) return;
    const game = new Game(container);
    game.start();
    setGame(game);

    return () => {
      game.stop();
      game.unmount();
      setGame(undefined);
    };
  }, [canvasRef]);

  return [game] as const;
}