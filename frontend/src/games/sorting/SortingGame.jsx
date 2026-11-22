import { useCallback, useEffect, useRef, useState } from 'react';
import GameHeader from '../../components/GameHeader.jsx';
import Draggable from '../../components/Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { doneActions } from '../../components/roundActions.js';
import { ITEMS } from './items.jsx';
import { sfx } from '../../sfx.js';
import '../game.css';

const SCENE_W = 1100;
const SCENE_H = 640;
const BIN_Y = 448;
const BIN_W = 480;
const BIN_H = 172;
const BINS = {
  animal: { label: 'Animals', icon: '🐾', color: '#f59e0b', x: 40 },
  plant: { label: 'Plants', icon: '🌱', color: '#16a34a', x: 580 },
};
const PRAISE = ['Great!', 'Well done!', 'Super!', 'Awesome!', 'Perfect!', 'Nice one!'];

// Where the nth picture rests inside a basket.
const slot = (kind, n) => ({ x: BINS[kind].x + 58 + n * 91, y: BIN_Y + 98 });

// Chapter "Plants and Animals": sort every picture into the right basket.
export default function SortingGame({ chapter, classId, round, onExit }) {
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p) => setProgress(p), []);

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        round={round}
        classId={classId}
        stages={['Sort them out']}
        stage={1}
        progress={progress}
        onExit={onExit}
        onRestart={() => setRun((r) => r + 1)}
      />
      <SortLevel key={run} onProgress={onProgress} onReplay={() => setRun((r) => r + 1)} round={round} onExit={onExit} />
    </div>
  );
}

function SortLevel({ onProgress, onReplay, round, onExit }) {
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
  const flash = (text) => {
    setMsg(text);
    later(() => setMsg(''), 2400);
  };

  // Which basket (if any) is under the dragged picture's centre.
  const binAt = (item, off) => {
    const cx = item.x + off.x;
    const cy = item.y + off.y;
    return Object.keys(BINS).find((k) => {
      const b = BINS[k];
      return cx > b.x - 20 && cx < b.x + BIN_W + 20 && cy > BIN_Y - 30 && cy < BIN_Y + BIN_H + 20;
    }) || null;
  };

  const onMove = (id, off) => setHot(off ? binAt(ITEMS.find((i) => i.id === id), off) : null);

  const onDrop = ({ id, offset }) => {
    setHot(null);
    const item = ITEMS.find((i) => i.id === id);
    const bin = binAt(item, offset);
    if (!bin) return null;
    if (bin !== item.kind) {
      sfx.bad();
      flash(item.kind === 'animal'
        ? `A ${item.name.toLowerCase()} is an animal. Put it in Animals!`
        : `A ${item.name.toLowerCase()} is a plant. Put it in Plants!`);
      return null;
    }
    const s = slot(bin, inBin(bin));
    const n = count + 1;
    setPlaced((p) => ({ ...p, [id]: s }));
    sfx.ok();
    if (n === total) {
      setMsg('');
      later(() => { setCheer(true); sfx.win(); }, 500);
      later(() => setDone(true), 2200);
    } else {
      flash(PRAISE[n % PRAISE.length]);
    }
    return { ok: true, to: { x: s.x - item.x, y: s.y - item.y } };
  };

  return (
    <div className="stage">
      <div className={`hint ${msg ? 'hint-pop' : ''}`}>
        {msg || 'Drag every animal into Animals and every plant into Plants.'}
      </div>
      <div className="scene-wrap meadow">
        <svg className="scene" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fd3ff" />
              <stop offset="1" stopColor="#e6f7ff" />
            </linearGradient>
          </defs>
          <rect width={SCENE_W} height={SCENE_H} fill="url(#sky)" />
          <circle cx="1010" cy="70" r="42" fill="#fde047" />
          <g fill="#fff" opacity=".9">
            <ellipse cx="210" cy="50" rx="60" ry="20" /><ellipse cx="250" cy="40" rx="40" ry="18" />
            <ellipse cx="700" cy="40" rx="55" ry="18" /><ellipse cx="735" cy="30" rx="36" ry="15" />
          </g>
          <path d="M0 400 Q200 340 420 395 T820 380 T1100 390 V640 H0 Z" fill="#a3d977" />
          <path d="M0 450 Q260 410 560 450 T1100 440 V640 H0 Z" fill="#8cc563" />

          {Object.entries(BINS).map(([kind, b]) => (
            <g key={kind}>
              <rect
                className={`bin${hot === kind ? ' hot' : ''}`}
                x={b.x} y={BIN_Y} width={BIN_W} height={BIN_H} rx="26"
                style={{ '--c': b.color }}
              />
              <rect x={b.x + 24} y={BIN_Y - 22} width="190" height="44" rx="22" fill={b.color} />
              <text x={b.x + 119} y={BIN_Y + 8} textAnchor="middle" className="bin-label">{b.icon} {b.label}</text>
            </g>
          ))}

          {ITEMS.filter((i) => settled[i.id]).map((i, n) => {
            const s = placed[i.id];
            return (
              <g
                key={i.id}
                className={`settle ${i.kind}${cheer ? ' cheer' : ''}`}
                style={{ transformOrigin: `${s.x}px ${s.y}px`, animationDelay: cheer ? `${n * 0.08}s` : '0s' }}
              >
                <g transform={`translate(${s.x} ${s.y})`}><i.Art /></g>
                <text x={s.x} y={s.y + 58} textAnchor="middle" className="item-name">{i.name}</text>
              </g>
            );
          })}

          {ITEMS.filter((i) => !settled[i.id]).map((i) => (
            <Draggable
              key={i.id}
              id={i.id}
              box={[i.x - 52, i.y - 52, 104, 118]}
              center={[i.x, i.y]}
              home={{ x: 0, y: 0 }}
              homeRot={i.rot}
              onMove={onMove}
              onDrop={onDrop}
              onSettle={(id) => setSettled((s) => ({ ...s, [id]: true }))}
            >
              <g transform={`translate(${i.x} ${i.y})`}><i.Art /></g>
              <text x={i.x} y={i.y + 62} textAnchor="middle" className="item-name">{i.name}</text>
            </Draggable>
          ))}
        </svg>
      </div>
      {done && (
        <Celebration
          title="Well done!"
          text="You sorted all the animals and plants correctly."
          actions={doneActions(round, onReplay, onExit)}
        />
      )}
    </div>
  );
}
