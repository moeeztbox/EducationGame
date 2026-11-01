import { useEffect, useRef, useState } from 'react';
import Draggable from './Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { PARTS, PartArt, PartSkin, PartGroup } from './parts.jsx';
import { HOMES, TOL, SCENE_W, SCENE_H, pickPraise } from './layout.js';
import { sfx } from '../../sfx.js';

// Stage 1: drag every loose bone onto its place on the skin-coloured body.
export default function MatchBones({ onProgress, onNext, onExit }) {
  const total = PARTS.length;
  const [placed, setPlaced] = useState({});
  const [settled, setSettled] = useState({});
  const [plays, setPlays] = useState({});
  const [near, setNear] = useState(null);
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
  const playBody = (name, ms) => {
    setBodyFx(name);
    later(() => setBodyFx(''), ms);
  };

  const place = (id) => {
    const n = count + 1;
    setPlaced((p) => ({ ...p, [id]: true }));
    setPlays((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
    sfx.ok();
    if (n === total) {
      setMsg('');
      later(() => { playBody('celebrate', 2100); sfx.win(); }, 600);
      later(() => setDone(true), 2500);
    } else if (n === Math.ceil(total / 2)) {
      flash('Halfway there! 🎉');
      later(() => playBody('jump', 900), 500);
    } else {
      flash(pickPraise());
    }
  };

  const onMove = (id, off) => setNear(off && Math.hypot(off.x, off.y) <= TOL ? id : null);

  const onDrop = ({ id, offset }) => {
    setNear(null);
    if (Math.hypot(offset.x, offset.y) <= TOL) {
      place(id);
      return { ok: true, to: { x: 0, y: 0 } };
    }
    sfx.bad();
    flash('Not here. Try another place!');
    return null;
  };

  return (
    <div className="stage">
      <div className={`hint ${msg ? 'hint-pop' : ''}`}>{msg || 'Drag each bone to its place on the body.'}</div>
      <div className="scene-wrap">
        <svg className="scene" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}>
          <g transform="translate(50 0)">
            <ellipse cx="500" cy="616" rx="150" ry="9" fill="#000" opacity=".12" />
            <g className={`body-fx ${bodyFx}`}>
              {PARTS.map((p) => (
                <g key={p.id} className="skin" style={{ opacity: placed[p.id] ? 0.28 : 1 }}>
                  <PartSkin part={p} />
                </g>
              ))}
              {PARTS.filter((p) => !placed[p.id]).map((p) => (
                <g key={p.id} className={`ghost${near === p.id ? ' hot' : ''}`}>
                  <PartArt part={p} />
                </g>
              ))}
              {PARTS.filter((p) => settled[p.id]).map((p) => (
                <PartGroup key={p.id} id={p.id} playKey={plays[p.id]}>
                  <PartArt part={p} />
                </PartGroup>
              ))}
            </g>
            {PARTS.filter((p) => !settled[p.id]).map((p) => {
              const h = HOMES[p.id];
              return (
                <Draggable
                  key={p.id}
                  id={p.id}
                  box={p.box}
                  center={p.center}
                  home={{ x: h.x - p.center[0], y: h.y - p.center[1] }}
                  homeRot={h.r}
                  onMove={onMove}
                  onDrop={onDrop}
                  onSettle={(id) => setSettled((s) => ({ ...s, [id]: true }))}
                >
                  <PartArt part={p} />
                </Draggable>
              );
            })}
          </g>
        </svg>
      </div>
      {done && (
        <Celebration
          title="Congratulations!"
          text="You built the whole skeleton! Now let's learn the names of the body parts."
          actions={[
            { label: 'Next stage ▶', primary: true, onClick: onNext },
            { label: 'Back to chapters', onClick: onExit },
          ]}
        />
      )}
    </div>
  );
}
