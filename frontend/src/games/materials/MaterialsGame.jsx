import { useCallback, useEffect, useRef, useState } from 'react';
import GameHeader from '../../components/GameHeader.jsx';
import Draggable from '../../components/Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { doneActions } from '../../components/roundActions.js';
import { sfx } from '../../sfx.js';
import wood from '../../assets/materials/wood.webp';
import cotton from '../../assets/materials/cotton.webp';
import chair from '../../assets/materials/chair.webp';
import bed from '../../assets/materials/bed.webp';
import house from '../../assets/materials/house.webp';
import pillow from '../../assets/materials/pillow.webp';
import towel from '../../assets/materials/towel.webp';
import '../game.css';

const W = 1100;
const H = 720;
const CARD_W = 220;
const CARD_H = 165;
const SRC_W = 200;
const SRC_H = 150;

const MATERIALS = {
  wood: { name: 'Wood', src: wood, color: '#8b5a2b', from: 'Wood comes from trees.', x: 50, y: 110 },
  cotton: { name: 'Cotton', src: cotton, color: '#2563eb', from: 'Cotton comes from the cotton plant.', x: 50, y: 400 },
};

// Targets start grey. The right material turns them into the real thing.
const THINGS = [
  { id: 'house', name: 'House', made: 'wood', src: house, line: 'Houses are built with wood.' },
  { id: 'chair', name: 'Chair', made: 'wood', src: chair, line: 'Chairs are made of wood.' },
  { id: 'bed', name: 'Bed', made: 'wood', src: bed, line: 'Beds are made of wood.' },
  { id: 'pillow', name: 'Pillow', made: 'cotton', src: pillow, line: 'Pillows are made of cotton.' },
  { id: 'towel', name: 'Towel', made: 'cotton', src: towel, line: 'Towels are made of cotton.' },
];
const SLOTS = [[330, 60], [580, 60], [830, 60], [455, 340], [705, 340]];
const HINT = 'Wood and cotton come from plants. Drag wood or cotton onto each grey picture to make it.';
const CREDITS =
  'Photos from Wikimedia Commons: wood - Beentree (CC BY-SA 4.0); cotton plant - public domain; chair - Thomas Chippendale, The Met (CC0); bed - R-E-AL (CC BY-SA 3.0); ' +
  'log house - Kjetil Bjornsrud (CC BY-SA 3.0); pillows - Amin (CC BY-SA 4.0); towels - Mattes (public domain).';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Chapter "Wood and Cotton": build things from the material they are made of.
export default function MaterialsGame({ chapter, classId, round, onExit }) {
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p) => setProgress(p), []);

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        round={round}
        classId={classId}
        stages={['Make things']}
        stage={1}
        progress={progress}
        onExit={onExit}
        onRestart={() => setRun((r) => r + 1)}
      />
      <MaterialsLevel key={run} onProgress={onProgress} onReplay={() => setRun((r) => r + 1)} round={round} onExit={onExit} />
      <p className="credits">{CREDITS}</p>
    </div>
  );
}

function MaterialsLevel({ onProgress, onReplay, round, onExit }) {
  const total = THINGS.length;
  const [order] = useState(() => shuffle(THINGS)); // thing shown in SLOTS[i]
  const [built, setBuilt] = useState({});
  const [hot, setHot] = useState(null);
  const [wobble, setWobble] = useState(null);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const count = Object.keys(built).length;

  useEffect(() => onProgress(count / total), [count, total, onProgress]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const flash = (text, ms = 3800) => {
    setMsg(text);
    later(() => setMsg(''), ms);
  };

  const slotOf = (id) => SLOTS[order.findIndex((t) => t.id === id)];
  const thingAt = (p) =>
    THINGS.find((t) => {
      const [x, y] = slotOf(t.id);
      return p.x > x - 8 && p.x < x + CARD_W + 8 && p.y > y - 8 && p.y < y + CARD_H + 8;
    }) || null;

  const onMove = (id, off, p) => setHot(off ? thingAt(p)?.id ?? null : null);

  // The materials are always available, so the card returns home after every drop.
  const onDrop = ({ id, pointer }) => {
    setHot(null);
    const thing = thingAt(pointer);
    if (!thing) return { ok: false };
    const lower = thing.name.toLowerCase();
    if (built[thing.id]) {
      flash(`The ${lower} is already made.`, 2200);
      return { ok: false, calm: true };
    }
    if (thing.made !== id) {
      sfx.bad();
      setWobble(thing.id);
      later(() => setWobble(null), 450);
      flash(`A ${lower} is not made of ${id}. It is made of ${thing.made}. ${MATERIALS[thing.made].from}`);
      return { ok: false, calm: true };
    }
    const n = count + 1;
    setBuilt((b) => ({ ...b, [thing.id]: true }));
    sfx.ok();
    if (n === total) {
      setMsg('');
      later(() => sfx.win(), 500);
      later(() => setDone(true), 1800);
    } else {
      flash(`${thing.line} ${MATERIALS[id].from}`);
    }
    return { ok: false, calm: true };
  };

  return (
    <div className="stage">
      <div className={`hint wide ${msg ? 'hint-pop' : ''}`}>{msg || HINT}</div>
      <div className="scene-wrap plants">
        <svg className="scene" viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <clipPath id="photoClip" clipPathUnits="objectBoundingBox"><rect width="1" height="1" rx="0.07" ry="0.09" /></clipPath>
          </defs>

          {order.map((t, i) => {
            const [x, y] = SLOTS[i];
            const m = MATERIALS[t.made];
            return (
              <g key={t.id} className={built[t.id] ? 'build-pop' : undefined}>
                <rect
                  x={x - 8} y={y - 8} width={CARD_W + 16} height={CARD_H + 16} rx="18"
                  className={`mat-frame${hot === t.id ? ' hot' : ''}${wobble === t.id ? ' wobble' : ''}`}
                />
                <image
                  href={t.src} x={x} y={y} width={CARD_W} height={CARD_H} preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#photoClip)" className={`mat-img${built[t.id] ? ' built' : ''}`} pointerEvents="none"
                />
                {built[t.id] && (
                  <g>
                    <rect x={x} y={y + CARD_H - 32} width={CARD_W} height="32" fill={m.color} opacity=".92" />
                    <text x={x + CARD_W / 2} y={y + CARD_H - 10} textAnchor="middle" className="caption-text" style={{ fontSize: 15 }}>{t.line}</text>
                  </g>
                )}
                <text x={x + CARD_W / 2} y={y + CARD_H + 36} textAnchor="middle" className="item-name">{built[t.id] ? t.name : `? ${t.name}`}</text>
              </g>
            );
          })}

          {Object.entries(MATERIALS).map(([id, m]) => (
            <Draggable
              key={id}
              id={id}
              box={[m.x - 8, m.y - 8, SRC_W + 16, SRC_H + 16]}
              center={[m.x + SRC_W / 2, m.y + SRC_H / 2]}
              home={{ x: 0, y: 0 }}
              onMove={onMove}
              onDrop={onDrop}
            >
              <g>
                <rect x={m.x - 8} y={m.y - 8} width={SRC_W + 16} height={SRC_H + 16} rx="18" fill="#fff" stroke={m.color} strokeWidth="6" />
                <image href={m.src} x={m.x} y={m.y} width={SRC_W} height={SRC_H} preserveAspectRatio="xMidYMid slice" clipPath="url(#photoClip)" pointerEvents="none" />
                <rect x={m.x + 30} y={m.y + SRC_H + 18} width={SRC_W - 60} height="40" rx="20" fill={m.color} />
                <text x={m.x + SRC_W / 2} y={m.y + SRC_H + 46} textAnchor="middle" className="bin-label">{m.name}</text>
              </g>
            </Draggable>
          ))}
        </svg>
      </div>
      {done && (
        <Celebration
          title="Well done!"
          text="Wood makes houses, chairs and beds. Cotton makes pillows and towels."
          actions={doneActions(round, onReplay, onExit)}
        />
      )}
    </div>
  );
}
