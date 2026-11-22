import { useCallback, useEffect, useRef, useState } from 'react';
import GameHeader from '../../components/GameHeader.jsx';
import Draggable from '../../components/Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { sfx } from '../../sfx.js';
import crowHome from '../../assets/homes/crow_home.webp';
import crowImg from '../../assets/homes/crow.webp';
import squirrelHome from '../../assets/homes/squirrel_home.webp';
import squirrelImg from '../../assets/homes/squirrel.webp';
import ladybirdHome from '../../assets/homes/ladybird_home.webp';
import ladybirdImg from '../../assets/homes/ladybird.webp';
import hopperHome from '../../assets/homes/hopper_home.webp';
import hopperImg from '../../assets/homes/hopper.webp';
import '../game.css';

const W = 1100;
const H = 860;
const PHOTO_W = 460;
const TRAY_Y = 745;
const TRAY_X = [160, 420, 680, 940];
const TRAY_SIZE = 150;

// w/h: the book photo's size; sprite: where the animal sits inside it (same pixels).
// Each photo is placed on the board at (x, y) at PHOTO_W wide.
const ANIMALS = [
  {
    id: 'crow', name: 'Crow', home: crowHome, img: crowImg, x: 60, y: 20, w: 1008, h: 558,
    sprite: { x: 544, y: 227, w: 147, h: 159 },
    caption: 'Birds build nests in trees.',
    wrong: 'A crow lives in a nest. Birds build nests in trees.',
  },
  {
    id: 'squirrel', name: 'Squirrel', home: squirrelHome, img: squirrelImg, x: 580, y: 20, w: 1056, h: 522,
    sprite: { x: 16, y: 56, w: 849, h: 457 },
    caption: 'Squirrels live in trees and bushes.',
    wrong: 'Squirrels live in trees and bushes.',
  },
  {
    id: 'ladybird', name: 'Ladybird', home: ladybirdHome, img: ladybirdImg, x: 60, y: 307, w: 822, h: 528,
    sprite: { x: 261, y: 44, w: 390, h: 265 },
    caption: 'Insects live in plants and flowers.',
    wrong: 'A ladybird is an insect. Insects live in plants and flowers - find the flower.',
  },
  {
    id: 'hopper', name: 'Grasshopper', home: hopperHome, img: hopperImg, x: 580, y: 307, w: 1236, h: 684,
    sprite: { x: 220, y: 36, w: 570, h: 352 },
    caption: 'Insects live in plants and flowers.',
    wrong: 'A grasshopper is an insect. Insects live in plants and flowers - find the leaf.',
  },
];
const HINT = 'Where does each animal live? Drag every animal to its home.';
const PRAISE = ['Great!', 'Well done!', 'Super!', 'Perfect!'];

// Geometry of each animal on the board (scene units).
const geo = (a) => {
  const k = PHOTO_W / a.w;
  const ph = Math.round(a.h * k);
  const sw = a.sprite.w * k;
  const sh = a.sprite.h * k;
  const sx = a.x + a.sprite.x * k;
  const sy = a.y + a.sprite.y * k;
  const trayScale = TRAY_SIZE / Math.max(sw, sh);
  return { k, ph, sw, sh, sx, sy, cx: sx + sw / 2, cy: sy + sh / 2, trayScale };
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Chapter "Plants Give Us Shelter": put each animal back at its home in the book photo.
export default function HomesGame({ chapter, classId, onExit }) {
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p) => setProgress(p), []);

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        classId={classId}
        stages={['Find the homes']}
        stage={1}
        progress={progress}
        onExit={onExit}
        onRestart={() => setRun((r) => r + 1)}
      />
      <HomesLevel key={run} onProgress={onProgress} onReplay={() => setRun((r) => r + 1)} onExit={onExit} />
    </div>
  );
}

function HomesLevel({ onProgress, onReplay, onExit }) {
  const total = ANIMALS.length;
  const [order] = useState(() => shuffle(ANIMALS)); // animal waiting at TRAY_X[i]
  const [placed, setPlaced] = useState({});
  const [settled, setSettled] = useState({});
  const [hot, setHot] = useState(null);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const count = Object.keys(placed).length;

  useEffect(() => onProgress(count / total), [count, total, onProgress]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const flash = (text, ms = 3600) => {
    setMsg(text);
    later(() => setMsg(''), ms);
  };

  // Which photo is under the pointer.
  const photoAt = (p) =>
    ANIMALS.find((a) => p.x > a.x && p.x < a.x + PHOTO_W && p.y > a.y && p.y < a.y + geo(a).ph) || null;

  const onMove = (id, off, p) => setHot(off ? photoAt(p)?.id ?? null : null);

  const onDrop = ({ id, pointer }) => {
    setHot(null);
    const animal = ANIMALS.find((a) => a.id === id);
    const target = photoAt(pointer);
    if (!target) return null;
    if (target.id !== id) {
      sfx.bad();
      flash(animal.wrong);
      return null;
    }
    const n = count + 1;
    setPlaced((p) => ({ ...p, [id]: true }));
    sfx.ok();
    if (n === total) {
      setMsg('');
      later(() => sfx.win(), 500);
      later(() => setDone(true), 1500);
    } else {
      flash(`${animal.caption} ${PRAISE[n % PRAISE.length]}`);
    }
    return { ok: true, to: { x: 0, y: 0 }, scale: 1 };
  };

  return (
    <div className="stage">
      <div className={`hint wide ${msg ? 'hint-pop' : ''}`}>{msg || HINT}</div>
      <div className="scene-wrap plants">
        <svg className="scene" viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <clipPath id="homeClip" clipPathUnits="objectBoundingBox"><rect width="1" height="1" rx="0.035" ry="0.05" /></clipPath>
          </defs>

          {ANIMALS.map((a) => {
            const g = geo(a);
            return (
              <g key={a.id}>
                <rect x={a.x - 6} y={a.y - 6} width={PHOTO_W + 12} height={g.ph + 12} rx="22" className={`photo-frame${hot === a.id ? ' hot' : ''}`} />
                <image href={a.home} x={a.x} y={a.y} width={PHOTO_W} height={g.ph} clipPath="url(#homeClip)" pointerEvents="none" />
                {!placed[a.id] && (
                  <image href={a.img} x={g.sx} y={g.sy} width={g.sw} height={g.sh} className="ghost-img" pointerEvents="none" />
                )}
                {settled[a.id] && (
                  <g>
                    <image href={a.img} x={g.sx} y={g.sy} width={g.sw} height={g.sh} className="settle-img" pointerEvents="none" />
                    <rect x={a.x} y={a.y + g.ph - 40} width={Math.min(PHOTO_W - 20, 40 + a.caption.length * 11.5)} height="40" rx="0" className="caption-tab" />
                    <text x={a.x + 16} y={a.y + g.ph - 14} className="caption-text">{a.caption}</text>
                  </g>
                )}
              </g>
            );
          })}

          {order.filter((a) => !settled[a.id]).map((a) => {
            const g = geo(a);
            const i = order.findIndex((q) => q.id === a.id);
            return (
              <Draggable
                key={a.id}
                id={a.id}
                box={[g.sx - 10, g.sy - 10, g.sw + 20, g.sh + 20]}
                center={[g.cx, g.cy]}
                home={{ x: TRAY_X[i] - g.cx, y: TRAY_Y - g.cy }}
                homeScale={g.trayScale}
                onMove={onMove}
                onDrop={onDrop}
                onSettle={(id) => setSettled((s) => ({ ...s, [id]: true }))}
              >
                <image href={a.img} x={g.sx} y={g.sy} width={g.sw} height={g.sh} pointerEvents="none" />
              </Draggable>
            );
          })}
        </svg>
      </div>
      {done && (
        <Celebration
          title="Well done!"
          text="Plants give animals a home. You found every home."
          actions={[
            { label: 'Play again', primary: true, onClick: onReplay },
            { label: 'Back to chapters', onClick: onExit },
          ]}
        />
      )}
    </div>
  );
}
