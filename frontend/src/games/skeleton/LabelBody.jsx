import { useEffect, useMemo, useRef, useState } from 'react';
import Draggable from './Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { PARTS, PartArt, PartSkin, PartGroup } from './parts.jsx';
import {
  LABELS, BODY_SHIFT, BLOCK_W, BLOCK_H, BLOCK_X, CHIP_X, SCENE_W, SCENE_H, pickPraise,
} from './layout.js';
import { sfx } from '../../sfx.js';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const blockPos = (l) => ({ x: BLOCK_X[l.side], y: l.y });

function Word({ x, y, color, text }) {
  return (
    <g>
      <rect x={x} y={y} width={BLOCK_W} height={BLOCK_H} rx="12" fill={color} />
      <rect x={x} y={y} width={BLOCK_W} height={BLOCK_H / 2} rx="12" fill="#fff" opacity=".16" />
      <text x={x + BLOCK_W / 2} y={y + BLOCK_H / 2 + 8} textAnchor="middle" className="word-text">
        {text}
      </text>
    </g>
  );
}

// Stage 2: drag each word into the block that points at that body part.
export default function LabelBody({ onProgress, onReplay, onExit }) {
  const total = LABELS.length;
  const order = useMemo(() => shuffle(LABELS), []);
  const [placed, setPlaced] = useState({});
  const [settled, setSettled] = useState({});
  const [plays, setPlays] = useState({});
  const [hot, setHot] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [bodyFx, setBodyFx] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const count = Object.keys(placed).length;

  useEffect(() => onProgress(count / total), [count, total, onProgress]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const flash = (text) => {
    setMsg(text);
    later(() => setMsg(''), 1700);
  };

  const chipHome = (id) => ({ x: CHIP_X, y: 34 + order.findIndex((l) => l.id === id) * 62 });

  // Which block (if any) is under the dragged word's centre.
  const blockAt = (id, off) => {
    const h = chipHome(id);
    const cx = h.x + BLOCK_W / 2 + off.x;
    const cy = h.y + BLOCK_H / 2 + off.y;
    let best = null;
    let bestD = Infinity;
    LABELS.forEach((l) => {
      if (placed[l.id]) return;
      const b = blockPos(l);
      const inside = cx > b.x - 16 && cx < b.x + BLOCK_W + 16 && cy > b.y - 16 && cy < b.y + BLOCK_H + 16;
      const d = Math.hypot(cx - (b.x + BLOCK_W / 2), cy - (b.y + BLOCK_H / 2));
      if (inside && d < bestD) { best = l; bestD = d; }
    });
    return best;
  };

  const onMove = (id, off) => setHot(off ? blockAt(id, off)?.id ?? null : null);

  const bump = (keys) => setPlays((p) => {
    const next = { ...p };
    keys.forEach((k) => { next[k] = (next[k] || 0) + 1; });
    return next;
  });

  const onDrop = ({ id, offset }) => {
    setHot(null);
    const target = blockAt(id, offset);
    if (!target) return null;
    if (target.id !== id) {
      sfx.bad();
      setWrong(target.id);
      later(() => setWrong(null), 500);
      flash('That is not the right box!');
      return null;
    }
    const label = LABELS.find((l) => l.id === id);
    const b = blockPos(label);
    const h = chipHome(id);
    const n = count + 1;
    setPlaced((p) => ({ ...p, [id]: true }));
    bump(label.parts || [label.fx]);
    sfx.ok();
    if (n === total) {
      setMsg('');
      later(() => { setBodyFx('celebrate'); sfx.win(); }, 700);
      later(() => setBodyFx(''), 2800);
      later(() => setDone(true), 3000);
    } else {
      flash(pickPraise());
    }
    return { ok: true, to: { x: b.x - h.x, y: b.y - h.y } };
  };

  const fx = { nose: plays.nose, eyes: plays.eyes };

  return (
    <div className="stage">
      <div className={`hint ${msg ? 'hint-pop' : ''}`}>{msg || 'Drag each word into the box that points to it.'}</div>
      <div className="scene-wrap">
        <svg className="scene" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}>
          <g transform="translate(50 0)">
            <g transform={`translate(${BODY_SHIFT} 0)`}>
              <ellipse cx="500" cy="616" rx="150" ry="9" fill="#000" opacity=".12" />
              <g className={`body-fx ${bodyFx}`}>
                {PARTS.map((p) => (
                  <PartGroup key={p.id} id={p.id} playKey={plays[p.id]}>
                    <g className="skin" style={{ opacity: 0.6 }}><PartSkin part={p} /></g>
                  </PartGroup>
                ))}
                {PARTS.map((p) => (
                  <PartGroup key={p.id} id={p.id} playKey={plays[p.id]}>
                    <PartArt part={p} fx={fx} />
                  </PartGroup>
                ))}
              </g>
            </g>

            {LABELS.map((l) => {
              const b = blockPos(l);
              const x1 = l.side === 'L' ? b.x + BLOCK_W : b.x;
              return (
                <g key={`line-${l.id}`}>
                  <line x1={x1} y1={b.y + BLOCK_H / 2} x2={l.anchor[0] + BODY_SHIFT} y2={l.anchor[1]} stroke={l.color} strokeWidth="4" strokeLinecap="round" />
                  <circle cx={l.anchor[0] + BODY_SHIFT} cy={l.anchor[1]} r="7" fill="#fff" stroke={l.color} strokeWidth="4" />
                </g>
              );
            })}

            {LABELS.map((l) => {
              const b = blockPos(l);
              if (settled[l.id]) return <Word key={`blk-${l.id}`} x={b.x} y={b.y} color={l.color} text={l.text} />;
              const cls = `block${hot === l.id ? ' hot' : ''}${wrong === l.id ? ' wrong' : ''}`;
              return (
                <rect key={`blk-${l.id}`} className={cls} x={b.x} y={b.y} width={BLOCK_W} height={BLOCK_H} rx="12" style={{ '--c': l.color }} />
              );
            })}

            {order.filter((l) => !settled[l.id]).map((l) => {
              const h = chipHome(l.id);
              return (
                <Draggable
                  key={l.id}
                  id={l.id}
                  box={[h.x, h.y, BLOCK_W, BLOCK_H]}
                  center={[h.x + BLOCK_W / 2, h.y + BLOCK_H / 2]}
                  home={{ x: 0, y: 0 }}
                  onMove={onMove}
                  onDrop={onDrop}
                  onSettle={(id) => setSettled((s) => ({ ...s, [id]: true }))}
                >
                  <Word x={h.x} y={h.y} color={l.color} text={l.text} />
                </Draggable>
              );
            })}
          </g>
        </svg>
      </div>
      {done && (
        <Celebration
          title="Chapter complete!"
          text="You know the parts of the body now. Brilliant work!"
          actions={[
            { label: 'Play again', primary: true, onClick: onReplay },
            { label: 'Back to chapters', onClick: onExit },
          ]}
        />
      )}
    </div>
  );
}
