import { useCallback, useEffect, useRef, useState } from 'react';
import GameHeader from '../../components/GameHeader.jsx';
import Draggable from '../../components/Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { CONFIGS } from './configs.js';
import { sfx } from '../../sfx.js';
import '../game.css';

const W = 1100;
const H = 720;
const CARD_W = 220;
const CARD_H = 165;
const BIN_Y = 455;
const BIN_W = 326;
const BIN_H = 250;
const BIN_X = [30, 387, 744];
const SLOT_SCALE = 0.55;
// Where each photo starts (in a random order each time) and its small tilt.
const START = [[100, 40], [440, 40], [780, 40], [100, 234], [440, 234], [780, 234]];
const TILT = [-3, 2, -2, 3, -3, 2];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Photo-sorting game: drag each photo into the box it belongs to.
// What is sorted (photos, boxes, texts) comes from a config in configs.js.
export default function PhotoSortGame({ chapter, classId, config: configKey, onExit }) {
  const config = CONFIGS[configKey];
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p) => setProgress(p), []);

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        classId={classId}
        stages={[config.stage]}
        stage={1}
        progress={progress}
        onExit={onExit}
        onRestart={() => setRun((r) => r + 1)}
      />
      <PhotoLevel key={run} config={config} onProgress={onProgress} onReplay={() => setRun((r) => r + 1)} onExit={onExit} />
      {config.credits && <p className="credits">{config.credits}</p>}
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

function PhotoLevel({ config, onProgress, onReplay, onExit }) {
  const { bins, photos } = config;
  const kinds = Object.keys(bins);
  const total = photos.length;
  const [order] = useState(() => shuffle(photos)); // photo shown at START[i]
  const [placed, setPlaced] = useState({});
  const [settled, setSettled] = useState({});
  const [hot, setHot] = useState(null);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const count = Object.keys(placed).length;
  const binX = (kind) => BIN_X[kinds.indexOf(kind)];
  const inBin = (kind) => Object.keys(placed).filter((id) => photos.find((p) => p.id === id).kind === kind).length;
  const slot = (kind, n) => ({ x: binX(kind) + 90 + n * 146, y: BIN_Y + 108 });
  const startOf = (id) => START[order.findIndex((p) => p.id === id)];

  useEffect(() => onProgress(count / total), [count, total, onProgress]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const flash = (text, ms = 4200) => {
    setMsg(text);
    later(() => setMsg(''), ms);
  };

  const binAt = (p) =>
    kinds.find((k) => {
      const x = binX(k);
      return p.x > x - 14 && p.x < x + BIN_W + 14 && p.y > BIN_Y - 50 && p.y < BIN_Y + BIN_H + 40;
    }) || null;

  const onMove = (id, off, p) => setHot(off ? binAt(p) : null);

  const onDrop = ({ id, pointer }) => {
    setHot(null);
    const photo = photos.find((p) => p.id === id);
    const bin = binAt(pointer);
    if (!bin) return null;
    if (bin !== photo.kind) {
      sfx.bad();
      flash(`This is ${bins[photo.kind].a}. ${bins[photo.kind].fact}`);
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
      flash(bins[bin].fact);
    }
    return { ok: true, to: { x: s.x - (sx + CARD_W / 2), y: s.y - (sy + CARD_H / 2) }, scale: SLOT_SCALE };
  };

  return (
    <div className="stage">
      <div className={`hint wide ${msg ? 'hint-pop' : ''}`}>{msg || config.hint}</div>
      <div className="scene-wrap plants">
        <svg className="scene" viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <clipPath id="photoClip" clipPathUnits="objectBoundingBox"><rect width="1" height="1" rx="0.07" ry="0.09" /></clipPath>
          </defs>

          {kinds.map((kind) => {
            const b = bins[kind];
            const x = binX(kind);
            const tab = 56 + b.label.length * 13;
            return (
              <g key={kind}>
                <rect
                  className={`bin${hot === kind ? ' hot' : ''}`}
                  x={x} y={BIN_Y} width={BIN_W} height={BIN_H} rx="30"
                  style={{ '--c': b.color }}
                />
                <rect x={x + 24} y={BIN_Y - 28} width={tab} height="54" rx="27" fill={b.color} />
                <text x={x + 24 + tab / 2} y={BIN_Y + 8} textAnchor="middle" className="bin-label">{b.label}</text>
              </g>
            );
          })}

          {photos.filter((p) => settled[p.id]).map((p) => {
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
            const i = order.findIndex((q) => q.id === p.id);
            const [x, y] = START[i];
            return (
              <Draggable
                key={p.id}
                id={p.id}
                box={[x - 8, y - 8, CARD_W + 16, CARD_H + 16]}
                center={[x + CARD_W / 2, y + CARD_H / 2]}
                home={{ x: 0, y: 0 }}
                homeRot={TILT[i]}
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
          text={config.doneText}
          actions={[
            { label: 'Play again', primary: true, onClick: onReplay },
            { label: 'Back to chapters', onClick: onExit },
          ]}
        />
      )}
    </div>
  );
}
