import { useCallback, useEffect, useRef, useState } from 'react';
import GameHeader from '../../components/GameHeader.jsx';
import Draggable from '../../components/Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { BACKGROUND, ITEMS } from './farmItems.js';
import farm from '../farm.json';
import { sfx } from '../../sfx.js';
import '../game.css';

// Scene is in the farm picture's own pixels (1550 x 835) with the two baskets underneath.
const W = farm.width;
const IMG_H = farm.height;
const H = 1110;
const BIN_Y = 880;
const BIN_W = 730;
const BIN_H = 220;
const BINS = {
  living: { label: 'Living things', icon: '🌱', color: '#16a34a', x: 30, tab: 340 },
  nonliving: { label: 'Non-living things', icon: '🧱', color: '#2563eb', x: 790, tab: 470 },
};
const HINT = 'Can it grow? Can it move on its own? Does it need food or water? Sort the things from the farm.';

const spriteOf = (id) => farm.sprites[id];
const centreOf = (id) => {
  const s = spriteOf(id);
  return [s.x + s.w / 2, s.y + s.h / 2];
};
// Where the nth picture rests inside a basket, and how small it becomes to fit.
const slot = (kind, n) => ({ x: BINS[kind].x + 85 + n * 140, y: BIN_Y + 112 });
const BOOST = { ducks: 1.25 }; // spread-out pictures read small otherwise
const fitScale = (id) => Math.min(1, ((BOOST[id] || 1) * 124) / Math.max(spriteOf(id).w, spriteOf(id).h));

// Chapter "Living and Non-living Things": sort the farm picture into two baskets.
export default function LivingGame({ chapter, classId, onExit }) {
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p) => setProgress(p), []);

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        classId={classId}
        stages={['Sort the farm']}
        stage={1}
        progress={progress}
        onExit={onExit}
        onRestart={() => setRun((r) => r + 1)}
      />
      <FarmLevel key={run} onProgress={onProgress} onReplay={() => setRun((r) => r + 1)} onExit={onExit} />
    </div>
  );
}

function FarmLevel({ onProgress, onReplay, onExit }) {
  const total = ITEMS.length;
  const [placed, setPlaced] = useState({}); // id -> slot position
  const [settled, setSettled] = useState({});
  const [hot, setHot] = useState(null);
  const [cheer, setCheer] = useState(false);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const count = Object.keys(placed).length;
  const inBin = (kind) => Object.keys(placed).filter((id) => ITEMS.find((i) => i.id === id).kind === kind).length;

  useEffect(() => onProgress(count / total), [count, total, onProgress]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const flash = (text, ms = 3200) => {
    setMsg(text);
    later(() => setMsg(''), ms);
  };

  // Which basket is under the pointer (the finger decides, not the picture's centre).
  const binAt = (p) =>
    Object.keys(BINS).find((k) => {
      const b = BINS[k];
      return p.x > b.x - 20 && p.x < b.x + BIN_W + 20 && p.y > BIN_Y - 60 && p.y < BIN_Y + BIN_H + 40;
    }) || null;

  const onMove = (id, off, p) => setHot(off ? binAt(p) : null);

  const onDrop = ({ id, pointer }) => {
    setHot(null);
    const item = ITEMS.find((i) => i.id === id);
    const bin = binAt(pointer);
    if (!bin) return null;
    if (bin !== item.kind) {
      sfx.bad();
      flash(`${item.why} So it is ${item.kind === 'living' ? 'a living thing' : 'non-living'}!`);
      return null;
    }
    const s = slot(bin, inBin(bin));
    const n = count + 1;
    setPlaced((p) => ({ ...p, [id]: s }));
    sfx.ok();
    if (n === total) {
      setMsg('');
      later(() => { setCheer(true); sfx.win(); }, 500);
      later(() => setDone(true), 2300);
    } else {
      flash(item.why);
    }
    const [cx, cy] = centreOf(id);
    return { ok: true, to: { x: s.x - cx, y: s.y - cy }, scale: fitScale(id) };
  };

  const sprite = (item) => {
    const s = spriteOf(item.id);
    return (
      <g className={item.kind === 'living' ? `idle idle-${item.id}` : undefined}>
        <image href={item.src} x={s.x} y={s.y} width={s.w} height={s.h} pointerEvents="none" />
      </g>
    );
  };

  return (
    <div className="stage">
      <div className={`hint wide ${msg ? 'hint-pop' : ''}`}>{msg || HINT}</div>
      <div className="scene-wrap meadow">
        <svg className="scene" viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="lower" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a9d27c" />
              <stop offset="1" stopColor="#8cc563" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#lower)" />
          <image href={BACKGROUND} x="0" y="0" width={W} height={IMG_H} preserveAspectRatio="none" />

          {Object.entries(BINS).map(([kind, b]) => (
            <g key={kind}>
              <rect
                className={`bin${hot === kind ? ' hot' : ''}`}
                x={b.x} y={BIN_Y} width={BIN_W} height={BIN_H} rx="36"
                style={{ '--c': b.color }}
              />
              <rect x={b.x + 30} y={BIN_Y - 32} width={b.tab} height="62" rx="31" fill={b.color} />
              <text x={b.x + 30 + b.tab / 2} y={BIN_Y + 12} textAnchor="middle" className="bin-label big">{b.icon} {b.label}</text>
            </g>
          ))}

          {ITEMS.filter((i) => settled[i.id]).map((i, n) => {
            const s = placed[i.id];
            const [cx, cy] = centreOf(i.id);
            return (
              <g key={i.id} transform={`translate(${s.x} ${s.y}) scale(${fitScale(i.id)}) translate(${-cx} ${-cy})`}>
                <g
                  className={`settle ${i.kind}${cheer ? ' cheer' : ''}`}
                  style={{ animationDelay: cheer ? `${n * 0.08}s` : '0s' }}
                >
                  {sprite(i)}
                </g>
              </g>
            );
          })}

          {ITEMS.filter((i) => settled[i.id]).map((i) => {
            const s = placed[i.id];
            return <text key={`n-${i.id}`} x={s.x} y={s.y + 80} textAnchor="middle" className="item-name big">{i.name}</text>;
          })}

          {ITEMS.filter((i) => !settled[i.id]).map((i) => {
            const s = spriteOf(i.id);
            return (
              <Draggable
                key={i.id}
                id={i.id}
                box={[s.x, s.y, s.w, s.h]}
                center={centreOf(i.id)}
                home={{ x: 0, y: 0 }}
                hit={<path d={farm.hit[i.id]} fill="transparent" />}
                onMove={onMove}
                onDrop={onDrop}
                onSettle={(id) => setSettled((st) => ({ ...st, [id]: true }))}
              >
                {sprite(i)}
              </Draggable>
            );
          })}
        </svg>
      </div>
      {done && (
        <Celebration
          title="Well done!"
          text="You can tell living things from non-living things."
          actions={[
            { label: 'Play again', primary: true, onClick: onReplay },
            { label: 'Back to chapters', onClick: onExit },
          ]}
        />
      )}
    </div>
  );
}
