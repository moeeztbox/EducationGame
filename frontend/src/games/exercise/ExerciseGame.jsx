import { useCallback, useEffect, useRef, useState } from 'react';
import GameHeader from '../../components/GameHeader.jsx';
import Draggable from '../../components/Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { doneActions } from '../../components/roundActions.js';
import { sfx } from '../../sfx.js';
import { TRUE_FALSE, CATEGORIES, CHIPS, checkExample } from './exerciseData.js';
import { PIECES, REGIONS, PALETTE } from './FlowerParts.jsx';
import '../game.css';

const SECTIONS = ['True or false', 'Match examples', 'Type examples', 'Build a flower', 'Colour it'];
const W = 1100;
const H = 720;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Last round of the chapter: "Let's complete the exercise".
export default function ExerciseGame({ chapter, classId, round, onExit }) {
  const [run, setRun] = useState(0);
  const [section, setSection] = useState(0);
  const [frac, setFrac] = useState(0);
  const [done, setDone] = useState(false);
  const onProgress = useCallback((p) => setFrac(p), []);
  const next = useCallback(() => {
    setFrac(0);
    setSection((s) => s + 1);
  }, []);

  const restart = () => {
    setRun((r) => r + 1);
    setSection(0);
    setFrac(0);
    setDone(false);
  };
  const progress = done ? 1 : (section + frac) / SECTIONS.length;
  const props = { onProgress, onDone: next };

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        classId={classId}
        stages={SECTIONS}
        stage={section + 1}
        progress={progress}
        onExit={onExit}
        onRestart={restart}
      />
      <div key={`${run}-${section}`} className="stage">
        {section === 0 && <TrueFalse {...props} />}
        {section === 1 && <MatchExamples {...props} />}
        {section === 2 && <TypeExamples {...props} />}
        {section === 3 && <BuildFlower {...props} />}
        {section === 4 && <ColourFlower onProgress={onProgress} onDone={() => setDone(true)} />}
      </div>
      {done && (
        <Celebration
          title="Exercise complete!"
          text="You answered every question and coloured your own flower. Brilliant work!"
          actions={doneActions(round && { ...round, onNext: null }, restart, onExit)}
        />
      )}
    </div>
  );
}

/* ---------- 1. true or false ---------- */

function TrueFalse({ onProgress, onDone }) {
  const [i, setI] = useState(0);
  const [res, setRes] = useState(null); // null | 'right' | 'wrong'
  const q = TRUE_FALSE[i];
  const last = i + 1 === TRUE_FALSE.length;

  useEffect(() => onProgress(i / TRUE_FALSE.length), [i, onProgress]);

  const answer = (v) => {
    if (res === 'right') return;
    if (v === q.answer) { setRes('right'); sfx.ok(); } else { setRes('wrong'); sfx.bad(); }
  };
  const next = () => {
    if (last) { onDone(); return; }
    setI(i + 1);
    setRes(null);
  };

  return (
    <div className="ex-panel">
      <p className="ex-kicker">Let's complete the exercise</p>
      <h2 className="ex-title">Write true or false</h2>
      <div className={`ex-card${res === 'wrong' ? ' shake' : ''}`} key={`${i}-${res}`}>
        <div className="ex-emoji">{q.emoji}</div>
        <p className="ex-q"><span className="ex-num">{i + 1}</span>{q.text}</p>
        <div className={`ex-blank ${res || ''}`}>{res === 'right' ? (q.answer ? '✔ True' : '✘ False') : '?'}</div>
        <div className="ex-btns">
          <button className="btn ex-true" disabled={res === 'right'} onClick={() => answer(true)}>✔ True</button>
          <button className="btn ex-false" disabled={res === 'right'} onClick={() => answer(false)}>✘ False</button>
        </div>
        {res && (
          <p className={`ex-why ${res}`}>
            {res === 'right' ? `Correct! ${q.why}` : `Not quite. ${q.hint}`}
          </p>
        )}
        {res === 'right' && <button className="btn btn-primary" onClick={next}>{last ? 'Continue ▶' : 'Next ▶'}</button>}
      </div>
    </div>
  );
}

/* ---------- 2. match examples to boxes (drag) ---------- */

const BOX_W = 250;
const BOX_H = 250;
const BOX_Y = 70;
const boxX = (i) => 25 + i * 268;
const CHIP_W = 180;
const CHIP_H = 52;

function Chip({ chip, x, y }) {
  return (
    <g>
      <rect x={x} y={y} width={CHIP_W} height={CHIP_H} rx="26" fill="#6366f1" />
      <rect x={x} y={y} width={CHIP_W} height={CHIP_H / 2} rx="26" fill="#fff" opacity=".16" />
      <text x={x + CHIP_W / 2} y={y + CHIP_H / 2 + 8} textAnchor="middle" className="word-text">{chip.text}</text>
    </g>
  );
}

function MatchExamples({ onProgress, onDone }) {
  const [order] = useState(() => shuffle(CHIPS)); // chip waiting at its tray position
  const [placed, setPlaced] = useState({});
  const [settled, setSettled] = useState({});
  const [hot, setHot] = useState(null);
  const [msg, setMsg] = useState('');
  const timers = useRef([]);
  const count = Object.keys(placed).length;
  const total = CHIPS.length;

  useEffect(() => onProgress(count / total), [count, total, onProgress]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (count === total) {
      sfx.win();
      timers.current.push(setTimeout(onDone, 1300));
    }
  }, [count, total, onDone]);

  const flash = (text) => {
    setMsg(text);
    timers.current.push(setTimeout(() => setMsg(''), 3000));
  };
  const home = (i) => ({ x: boxX(i % 4) + (BOX_W - CHIP_W) / 2, y: i < 4 ? 400 : 480 });
  const inBox = (kind) => Object.keys(placed).filter((id) => CHIPS.find((c) => c.id === id).kind === kind).length;
  const boxAt = (p) => CATEGORIES.findIndex((_, i) => p.x > boxX(i) - 12 && p.x < boxX(i) + BOX_W + 12 && p.y > BOX_Y - 30 && p.y < BOX_Y + BOX_H + 20);

  const onMove = (id, off, p) => setHot(off ? boxAt(p) : null);
  const onDrop = ({ id, pointer }) => {
    setHot(null);
    const chip = CHIPS.find((c) => c.id === id);
    const bi = boxAt(pointer);
    if (bi < 0) return null;
    const cat = CATEGORIES[bi];
    if (cat.id !== chip.kind) {
      sfx.bad();
      const right = CATEGORIES.find((c) => c.id === chip.kind);
      flash(`${chip.text} is ${right.a}. Put it in the ${right.label} box.`);
      return null;
    }
    sfx.ok();
    const slot = { x: boxX(bi) + (BOX_W - CHIP_W) / 2, y: BOX_Y + 62 + inBox(cat.id) * 76 };
    const i = order.findIndex((c) => c.id === id);
    setPlaced((p) => ({ ...p, [id]: true }));
    flash(`Yes! ${chip.text} is ${cat.a}.`);
    return { ok: true, to: { x: slot.x - home(i).x, y: slot.y - home(i).y } };
  };

  return (
    <div className="ex-wrap">
      <div className={`hint wide ${msg ? 'hint-pop' : ''}`}>{msg || 'Give one example of each. Drag every word into the right box.'}</div>
      <div className="scene-wrap plants">
        <svg className="scene" viewBox={`0 0 ${W} ${H}`}>
          {CATEGORIES.map((c, i) => (
            <g key={c.id}>
              <rect className={`bin${hot === i ? ' hot' : ''}`} x={boxX(i)} y={BOX_Y} width={BOX_W} height={BOX_H} rx="28" style={{ '--c': c.color }} />
              <rect x={boxX(i) + 30} y={BOX_Y - 28} width="190" height="54" rx="27" fill={c.color} />
              <text x={boxX(i) + 125} y={BOX_Y + 8} textAnchor="middle" className="bin-label">{c.label}</text>
            </g>
          ))}
          {order.filter((c) => settled[c.id]).map((c) => {
            const bi = CATEGORIES.findIndex((k) => k.id === c.kind);
            const n = order.filter((o) => o.kind === c.kind && settled[o.id]).findIndex((o) => o.id === c.id);
            return <Chip key={c.id} chip={c} x={boxX(bi) + (BOX_W - CHIP_W) / 2} y={BOX_Y + 62 + n * 76} />;
          })}
          {order.filter((c) => !settled[c.id]).map((c) => {
            const i = order.findIndex((o) => o.id === c.id);
            const h = home(i);
            return (
              <Draggable
                key={c.id}
                id={c.id}
                box={[h.x, h.y, CHIP_W, CHIP_H]}
                center={[h.x + CHIP_W / 2, h.y + CHIP_H / 2]}
                home={{ x: 0, y: 0 }}
                onMove={onMove}
                onDrop={onDrop}
                onSettle={(id) => setSettled((s) => ({ ...s, [id]: true }))}
              >
                <Chip chip={c} x={h.x} y={h.y} />
              </Draggable>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ---------- 3. type your own example ---------- */

function TypeExamples({ onProgress, onDone }) {
  const [vals, setVals] = useState({});
  const [results, setResults] = useState({});
  const good = CATEGORIES.filter((c) => results[c.id]?.ok).length;

  useEffect(() => onProgress(good / CATEGORIES.length), [good, onProgress]);

  const check = () => {
    const next = {};
    CATEGORIES.forEach((c) => { next[c.id] = checkExample(c.id, vals[c.id] || ''); });
    setResults(next);
    const ok = CATEGORIES.every((c) => next[c.id].ok);
    if (ok) sfx.win(); else sfx.bad();
  };
  const allOk = CATEGORIES.every((c) => results[c.id]?.ok);

  return (
    <div className="ex-panel">
      <h2 className="ex-title">Give one example of each</h2>
      <p className="ex-sub">Now type the name of any one yourself.</p>
      <form className="ex-form" onSubmit={(e) => { e.preventDefault(); if (allOk) onDone(); else check(); }}>
        {CATEGORIES.map((c, i) => {
          const r = results[c.id];
          return (
            <label key={c.id} className="ex-row">
              <span className="ex-cat" style={{ background: c.color }}>{i + 1}. {c.label}</span>
              <input
                className={`ex-input${r ? (r.ok ? ' ok' : ' bad') : ''}`}
                value={vals[c.id] || ''}
                placeholder={`Type any ${c.label.toLowerCase()}`}
                onChange={(e) => { setVals({ ...vals, [c.id]: e.target.value }); setResults({ ...results, [c.id]: null }); }}
                autoComplete="off"
              />
              <span className={`ex-note${r ? (r.ok ? ' ok' : ' bad') : ''}`}>{r ? (r.ok ? '✔ ' : '✘ ') + r.text : ''}</span>
            </label>
          );
        })}
        <button type="submit" className="btn btn-primary ex-go">{allOk ? 'Continue ▶' : 'Check my answers'}</button>
      </form>
    </div>
  );
}

/* ---------- 4. build the flower (drag the parts) ---------- */

const TOL = 70;

function BuildFlower({ onProgress, onDone }) {
  const [placed, setPlaced] = useState({});
  const [settled, setSettled] = useState({});
  const [hot, setHot] = useState(null);
  const [msg, setMsg] = useState('');
  const timers = useRef([]);
  const count = Object.keys(placed).length;

  useEffect(() => onProgress(count / PIECES.length), [count, onProgress]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (count === PIECES.length) {
      sfx.win();
      timers.current.push(setTimeout(onDone, 1400));
    }
  }, [count, onDone]);

  const flash = (text) => {
    setMsg(text);
    timers.current.push(setTimeout(() => setMsg(''), 2400));
  };
  const onMove = (id, off) => setHot(off && Math.hypot(off.x, off.y) <= TOL ? id : null);
  const onDrop = ({ id, offset }) => {
    setHot(null);
    const piece = PIECES.find((p) => p.id === id);
    if (Math.hypot(offset.x, offset.y) <= TOL) {
      sfx.ok();
      setPlaced((p) => ({ ...p, [id]: true }));
      flash(`${piece.name} fixed!`);
      return { ok: true, to: { x: 0, y: 0 }, scale: 1 };
    }
    sfx.bad();
    flash('Move the part onto its dotted shape.');
    return null;
  };

  return (
    <div className="ex-wrap">
      <div className={`hint wide ${msg ? 'hint-pop' : ''}`}>{msg || 'Draw a flower: drag the stem, leaves, petals and centre to the dotted flower.'}</div>
      <div className="scene-wrap plants">
        <svg className="scene" viewBox={`0 0 ${W} ${H}`}>
          <g className="flower-ghosts">
            {PIECES.filter((p) => !placed[p.id]).map((p) => (
              <g key={p.id} className={`flower-ghost${hot === p.id ? ' hot' : ''}`}>{p.ghost()}</g>
            ))}
          </g>
          {PIECES.filter((p) => settled[p.id]).map((p) => <g key={p.id} className="settle-img">{p.node()}</g>)}
          {PIECES.filter((p) => !settled[p.id]).map((p) => (
            <Draggable
              key={p.id}
              id={p.id}
              box={p.box}
              center={p.center}
              home={{ x: p.tray[0] - p.center[0], y: p.tray[1] - p.center[1] }}
              homeRot={p.rot}
              homeScale={p.scale || 1}
              dragScale={1}
              onMove={onMove}
              onDrop={onDrop}
              onSettle={(id) => setSettled((s) => ({ ...s, [id]: true }))}
            >
              {p.node()}
            </Draggable>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ---------- 5. colour the flower ---------- */

function ColourFlower({ onProgress, onDone }) {
  const [colours, setColours] = useState({});
  const [pick, setPick] = useState(0);
  const [pop, setPop] = useState(null);
  const count = Object.keys(colours).length;
  const all = count === REGIONS.length;

  useEffect(() => onProgress(count / REGIONS.length), [count, onProgress]);

  const paint = (id) => {
    sfx.pick();
    setColours((c) => ({ ...c, [id]: PALETTE[pick].c }));
    setPop(id);
    setTimeout(() => setPop(null), 400);
  };

  return (
    <div className="ex-wrap">
      <div className="hint wide">
        {all ? 'Beautiful! Your flower is ready.' : `Colour your flower: pick a colour, then tap a part. ${count} of ${REGIONS.length} coloured.`}
      </div>
      <div className="scene-wrap plants">
        <svg className="scene" viewBox={`0 0 ${W} ${H}`}>
          {REGIONS.map((r) => (
            <g key={r.id} className={`region${pop === r.id ? ' pop' : ''}`}>
              {r.render(colours[r.id] || '#fff', { onClick: () => paint(r.id), style: { cursor: 'pointer' } })}
            </g>
          ))}
          {PALETTE.map((p, i) => (
            <g key={p.name} onClick={() => setPick(i)} style={{ cursor: 'pointer' }}>
              <circle cx={190 + i * 90} cy="685" r={pick === i ? 26 : 21} fill={p.c} stroke="#3b2f4a" strokeWidth="3.5" />
              {pick === i && <circle cx={190 + i * 90} cy="685" r="33" fill="none" stroke="#f59e0b" strokeWidth="5" />}
            </g>
          ))}
        </svg>
      </div>
      <div className="ex-actions">
        <button className="btn btn-ghost" onClick={() => setColours({})} disabled={count === 0}>Start again</button>
        <button className="btn btn-primary" disabled={!all} onClick={onDone}>I have finished ✓</button>
      </div>
    </div>
  );
}
