'use client';
import styles from './page.module.css'
import { useRef, useState } from "react";
import { setUps, UPS } from "@/game/config";
import useGame from "@/app/useGame";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [game] = useGame(ref);

  const [position, setPosition] = useState({x: 250, y: 250});
  const [direction, setDirection] = useState({x: 1, y: 1});
  const [speed, setSpeed] = useState(5);
  const [size, setSize] = useState({height: 124, width: 357})
  const [color, setColor] = useState(0);
  const [upsState, setUpsState] = useState(UPS);

  const [count, setCount] = useState(10000);

  return (
    <main className={styles.main}>

      <div ref={ref}>
        {/*<canvas className={styles.block} ref={ref} width={WIDTH} height={HEIGHT}></canvas>*/}
      </div>
      <div>
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
          <br/>
          <label>value:</label>
          <input type="number" min={0} value={speed} onChange={(test) => setSpeed(Number(test.currentTarget.value))}/>
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

          {/*<label>Color: </label>
          <br/>
          <label>i:</label>
          <input type="number" min={0} max={IndexedColors.length - 1}  value={color} onChange={(test) => setColor(Number(test.currentTarget.value))}/>
          <br/>*/}
          <button onClick={() => game?.initEntity(
            position,
            speed,
            direction,
            size,
            color
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
          <button onClick={() => game?.removeAllEntity()}>RemoveEntities</button>
        </div>
      </div>
    </main>
  )
}


