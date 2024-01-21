'use client';
import styles from './page.module.css'
import { useRef, useState } from "react";
import { debug, setDebug, setFps, setUps, showFps, UPS } from "@/game/config";
import useGame from "@/game/useGame";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [game] = useGame(ref);
  const [position, setPosition] = useState({x: 250, y: 250});
  const [direction, setDirection] = useState({x: 1, y: 1});
  const [speed, setSpeed] = useState(5);
  const [ratio, setRatio] = useState(30);
  const [upsState, setUpsState] = useState(UPS);
  const [debugFlag, setDebugFlag] = useState(debug);
  const [fpsFlag, setFpsFlag] = useState(showFps);

  const [count, setCount] = useState(500);

  return (
    <main className={styles.main}>

      <div ref={ref}></div>
      <div>
        <div className={styles.block}>
          <label>Debug mode</label>
          <input type="checkbox" checked={debugFlag} onChange={() => {
            setDebugFlag(setDebug());
          }}/>
        </div>
        <div className={styles.block}>
          <label>Show FPS/UPS</label>
          <input type="checkbox" checked={fpsFlag} onChange={() => {
            setFpsFlag(setFps());
          }}/>
        </div>
        <div className={styles.block}>
          <label>Update per seconds (fixed):</label>
          <input type="number" value={upsState} min={1} max={60} onChange={(e) => {
            let value = Number(e.currentTarget.value);
            setUps(value);
            setUpsState(value);
          }
          }/>
        </div>

        <div className={styles.block}>
          <label>Position:</label>
          <br/>
          <label>x: </label>
          <input type="number" value={position.x} onChange={(test) => setPosition({...position, x: Number(test.currentTarget.value)})}/>
          <br/>
          <label>y: </label>
          <input type="number" value={position.y} onChange={(test) => setPosition({...position, y: Number(test.currentTarget.value)})}/>
          <br/>
          <br/>

          <label>MoveDirection:</label>
          <br/>
          <label>x: </label>
          <input type="number" value={direction.x} onChange={(test) => setDirection({...direction, x: Number(test.currentTarget.value)})}/>
          <br/>
          <label>y: </label>
          <input type="number" value={direction.y} onChange={(test) => setDirection({...direction, y: Number(test.currentTarget.value)})}/>
          <br/>
          <br/>

          <label>Speed: </label>
          <input type="number" min={0} value={speed} onChange={(test) => setSpeed(Number(test.currentTarget.value))}/>
          <br/>
          <br/>

          <label>Size %:</label>
          <input type="number" value={ratio} onChange={(test) => setRatio(Number(test.currentTarget.value))}/>
          <br/>
          <br/>

          <button onClick={() => game?.initEntity(
            position,
            speed,
            direction,
            { width: 357, height: 124, ratio: ratio / 100 },
          )}>Create entity</button>
        </div>
        <br/>
        <div className={styles.block}>
          <label>Count:</label>
          <input type="number" min={0} value={count} onChange={(e) => setCount(Number(e.currentTarget.value))}/>
          <button onClick={() => game?.initEntities(count)}>Create random entities</button>
        </div>
        <br/>
        <div className={styles.block}>
          <button onClick={() => game?.start()}>Start</button>
          <button onClick={() => game?.stop()}>Stop</button>
        </div>
      </div>
    </main>
  )
}


