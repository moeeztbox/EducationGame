import { useCallback, useEffect, useRef, useState } from 'react';
import GameHeader from '../../components/GameHeader.jsx';
import Draggable from '../../components/Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { sfx } from '../../sfx.js';
import maple from '../../assets/plants/maple.webp';
import oak from '../../assets/plants/oak.webp';
import grass1 from '../../assets/plants/grass1.webp';
import grass2 from '../../assets/plants/grass2.webp';
import flower1 from '../../assets/plants/flower1.webp';
import flower2 from '../../assets/plants/flower2.webp';
import '../game.css';

const W = 1100;
const H = 720;
const CARD_W = 220;
const CARD_H = 165;
const BIN_Y = 455;
const BIN_W = 326;
const BIN_H = 250;

const BINS = {
  tree: {
    label: '🌳 Trees', color: '#8b5a2b', x: 30, tab: 170, a: 'a tree',
    fact: 'A tree is a tall plant with tall stems and thick branches. Trees live for a long time.',
  },
  grass: {
    label: '🌿 Grass', color: '#16a34a', x: 387, tab: 170, a: 'grass',
    fact: 'Grass is a green plant with thin, soft leaves. They grow close together in a large number.',
  },
  flower: {
    label: '🌸 Flowering plants', color: '#c026d3', x: 744, tab: 270, a: 'a flowering plant',
    fact: 'Plants that give us flowers and fruits are called flowering plants.',
  },
};

// The same pictures the children see in their book.
const PHOTOS = [
  { id: 'maple', kind: 'tree', name: 'Maple tree', src: maple },
  { id: 'oak', kind: 'tree', name: 'Oak tree', src: oak },
  { id: 'grass1', kind: 'grass', name: 'Grass', src: grass1 },
  { id: 'grass2', kind: 'grass', name: 'Grass', src: grass2 },
  { id: 'flower1', kind: 'flower', name: 'Flowering plant', src: flower1 },
  { id: 'flower2', kind: 'flower', name: 'Flowering plant', src: flower2 },
];
const HINT = 'Look at each photo. Is it a tree, grass or a flowering plant? Drag it into the right box.';
const SLOT_SCALE = 0.55;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Where each photo starts (in a random order each time) and where it rests inside a box.
const START = [[100, 40], [440, 40], [780, 40], [100, 234], [440, 234], [780, 234]];
const TILT = [-3, 2, -2, 3, -3, 2];
const slot = (kind, n) => ({ x: BINS[kind].x + 90 + n * 146, y: BIN_Y + 108 });

// Chapter "Plants Around You": match each photo to trees, grass or flowering plants.
export default function PlantsGame({ chapter, classId, onExit }) {
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p) => setProgress(p), []);

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        classId={classId}
        stages={['Match the plants']}
        stage={1}
        progress={progress}
        onExit={onExit}
        onRestart={() => setRun((r) => r + 1)}
      />
      <PlantsLevel key={run} onProgress={onProgress} onReplay={() => setRun((r) => r + 1)} onExit={onExit} />
    </div>
  );
}

function Photo({ src }) {
  return (
    <g>
      <rect x="-8" y="-8" width={CARD_W + 16} height={CARD_H + 16} rx="18" fill="#fff" stroke="#3b2f4a" strokeWidth="3" />
      <image href={src} width={CARD_W} height={CARD_H} preserveAspectRatio="xMidYMid slice" clipPath="url(#photoClip)" pointerEvents="none" />
    </g>
  );
}

function PlantsLevel({ onProgress, onReplay, onExit }) {
  const total = PHOTOS.length;
  const [order] = useState(() => shuffle(PHOTOS)); // photo shown at START[i]
  const [placed, setPlaced] = useState({});
  const [settled, setSettled] = useState({});
  const [hot, setHot] = useState(null);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const count = Object.keys(placed).length;
  const inBin = (kind) => Object.keys(placed).filter((id) => PHOTOS.find((p) => p.id === id).kind === kind).length;
  const startOf = (id) => START[order.findIndex((p) => p.id === id)];

  useEffect(() => onProgress(count / total), [count, total, onProgress]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const flash = (text, ms = 4200) => {
    setMsg(text);
    later(() => setMsg(''), ms);
  };

  const binAt = (p) =>
    Object.keys(BINS).find((k) => {
      const b = BINS[k];
      return p.x > b.x - 14 && p.x < b.x + BIN_W + 14 && p.y > BIN_Y - 50 && p.y < BIN_Y + BIN_H + 40;
    }) || null;

  const onMove = (id, off, p) => setHot(off ? binAt(p) : null);

  const onDrop = ({ id, pointer }) => {
    setHot(null);
    const photo = PHOTOS.find((p) => p.id === id);
    const bin = binAt(pointer);
    if (!bin) return null;
    if (bin !== photo.kind) {
      sfx.bad();
      flash(`This is ${BINS[photo.kind].a}. ${BINS[photo.kind].fact}`);
      return null;
    }
    const s = slot(bin, inBin(bin));
    const [sx, sy] = startOf(id);
    const n = count + 1;
    setPlaced((pl) => ({ ...pl, [id]: s }));
    sfx.ok();
    if (n === total) {
      setMsg('');
      later(() => sfx.win(), 500);
      later(() => setDone(true), 1400);
    } else {
      flash(BINS[bin].fact);
    }
    return { ok: true, to: { x: s.x - (sx + CARD_W / 2), y: s.y - (sy + CARD_H / 2) }, scale: SLOT_SCALE };
  };

  return (
    <div className="stage">
      <div className={`hint wide ${msg ? 'hint-pop' : ''}`}>{msg || HINT}</div>
      <div className="scene-wrap plants">
        <svg className="scene" viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <clipPath id="photoClip" clipPathUnits="objectBoundingBox"><rect width="1" height="1" rx="0.07" ry="0.09" /></clipPath>
          </defs>

          {Object.entries(BINS).map(([kind, b]) => (
            <g key={kind}>
              <rect
                className={`bin${hot === kind ? ' hot' : ''}`}
                x={b.x} y={BIN_Y} width={BIN_W} height={BIN_H} rx="30"
                style={{ '--c': b.color }}
              />
              <rect x={b.x + 24} y={BIN_Y - 28} width={b.tab} height="54" rx="27" fill={b.color} />
              <text x={b.x + 24 + b.tab / 2} y={BIN_Y + 8} textAnchor="middle" className="bin-label">{b.label}</text>
            </g>
          ))}

          {PHOTOS.filter((p) => settled[p.id]).map((p) => {
            const s = placed[p.id];
            return (
              <g key={p.id}>
                <g className="settle" transform={`translate(${s.x} ${s.y}) scale(${SLOT_SCALE}) translate(${-CARD_W / 2} ${-CARD_H / 2})`}>
                  <Photo src={p.src} />
                </g>
                <text x={s.x} y={s.y + 92} textAnchor="middle" className="item-name sm">{p.name}</text>
              </g>
            );
          })}

          {order.filter((p) => !settled[p.id]).map((p) => {
            const [x, y] = startOf(p.id);
            return (
              <Draggable
                key={p.id}
                id={p.id}
                box={[x - 8, y - 8, CARD_W + 16, CARD_H + 16]}
                center={[x + CARD_W / 2, y + CARD_H / 2]}
                home={{ x: 0, y: 0 }}
                homeRot={TILT[order.findIndex((q) => q.id === p.id)]}
                onMove={onMove}
                onDrop={onDrop}
                onSettle={(id) => setSettled((st) => ({ ...st, [id]: true }))}
              >
                <g transform={`translate(${x} ${y})`}><Photo src={p.src} /></g>
              </Draggable>
            );
          })}
        </svg>
      </div>
      {done && (
        <Celebration
          title="Well done!"
          text="You can tell trees, grass and flowering plants apart."
          actions={[
            { label: 'Play again', primary: true, onClick: onReplay },
            { label: 'Back to chapters', onClick: onExit },
          ]}
        />
      )}
    </div>
  );
}
