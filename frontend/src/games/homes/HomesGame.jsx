import { useCallback, useEffect, useRef, useState } from 'react';
import GameHeader from '../../components/GameHeader.jsx';
import Draggable from '../../components/Draggable.jsx';
import Celebration from '../../components/Celebration.jsx';
import { doneActions } from '../../components/roundActions.js';
import { sfx } from '../../sfx.js';
import nest from '../../assets/homes/nest.webp';
import tree from '../../assets/homes/tree.webp';
import flower from '../../assets/homes/flower.webp';
import leaf from '../../assets/homes/leaf.webp';
import crow from '../../assets/homes/crow.webp';
import squirrel from '../../assets/homes/squirrel.webp';
import ladybird from '../../assets/homes/ladybird.webp';
import hopper from '../../assets/homes/hopper.webp';
import '../game.css';

const W = 1100;
const H = 860;
const PHOTO_W = 460;
const PHOTO_H = 307; // every habitat photo is 900 x 600
const TRAY_Y = 745;
const TRAY_X = [160, 420, 680, 940];
const TRAY_SIZE = 150;

// Each animal is a cut-out photo. `place` says where it sits on its habitat photo
// (bottom-centre x/y and width, in the habitat's 900 x 600 pixels); `aspect` is height / width.
const ANIMALS = [
  {
    id: 'crow', name: 'Crow', home: nest, img: crow, x: 60, y: 20,
    place: { bx: 441, by: 375, w: 234 }, aspect: 0.7233,
    caption: 'Birds build nests in trees.',
    wrong: 'A crow lives in a nest. Birds build nests in trees.',
  },
  {
    id: 'squirrel', name: 'Squirrel', home: tree, img: squirrel, x: 580, y: 20,
    place: { bx: 506, by: 309, w: 225 }, aspect: 0.9333,
    caption: 'Squirrels live in trees and bushes.',
    wrong: 'Squirrels live in trees and bushes.',
  },
  {
    id: 'ladybird', name: 'Ladybird', home: flower, img: ladybird, x: 60, y: 357,
    place: { bx: 450, by: 189, w: 167 }, aspect: 0.7567,
    caption: 'Insects live in plants and flowers.',
    wrong: 'A ladybird is an insect. Insects live in plants and flowers - find the flower.',
  },
  {
    id: 'hopper', name: 'Grasshopper', home: leaf, img: hopper, x: 580, y: 357,
    place: { bx: 436, by: 394, w: 267 }, aspect: 0.6,
    caption: 'Insects live in plants and flowers.',
    wrong: 'A grasshopper is an insect. Insects live in plants and flowers - find the leaf.',
  },
];
const HINT = 'Where does each animal live? Drag every animal to its home.';
const PRAISE = ['Great!', 'Well done!', 'Super!', 'Perfect!'];
const CREDITS =
  'Photos from Wikimedia Commons: crow - Alexis Lours (CC BY 4.0); squirrel - Peter Trimming (CC BY 2.0); ladybird - Francisco Welter-Schultes (CC0); ' +
  'katydid - Vishalsh521 (CC BY 3.0); nest - Knowledge and philosophy (CC BY-SA 4.0); tree - MichaelMaggs (CC BY-SA 2.5); marigold - Dmitri Popov (CC BY-SA 3.0); maple leaves - Superior National Forest (CC BY 2.0).';

// Geometry of each animal on the board (scene units).
const geo = (a) => {
  const k = PHOTO_W / 900;
  const sw = a.place.w * k;
  const sh = sw * a.aspect;
  const sx = a.x + a.place.bx * k - sw / 2;
  const sy = a.y + a.place.by * k - sh;
  return { sw, sh, sx, sy, cx: sx + sw / 2, cy: sy + sh / 2, trayScale: TRAY_SIZE / Math.max(sw, sh) };
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Chapter "Plants Give Us Shelter": put each animal back at its home.
export default function HomesGame({ chapter, classId, round, onExit }) {
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p) => setProgress(p), []);

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        round={round}
        classId={classId}
        stages={['Find the homes']}
        stage={1}
        progress={progress}
        onExit={onExit}
        onRestart={() => setRun((r) => r + 1)}
      />
      <HomesLevel key={run} onProgress={onProgress} onReplay={() => setRun((r) => r + 1)} round={round} onExit={onExit} />
      <p className="credits">{CREDITS}</p>
    </div>
  );
}

function HomesLevel({ onProgress, onReplay, round, onExit }) {
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
    ANIMALS.find((a) => p.x > a.x && p.x < a.x + PHOTO_W && p.y > a.y && p.y < a.y + PHOTO_H) || null;

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
                <rect x={a.x - 6} y={a.y - 6} width={PHOTO_W + 12} height={PHOTO_H + 12} rx="22" className={`photo-frame${hot === a.id ? ' hot' : ''}`} />
                <image href={a.home} x={a.x} y={a.y} width={PHOTO_W} height={PHOTO_H} clipPath="url(#homeClip)" pointerEvents="none" />
                {!placed[a.id] && (
                  <image href={a.img} x={g.sx} y={g.sy} width={g.sw} height={g.sh} className="ghost-img" pointerEvents="none" />
                )}
                {settled[a.id] && (
                  <g>
                    <image href={a.img} x={g.sx} y={g.sy} width={g.sw} height={g.sh} className="settle-img" pointerEvents="none" />
                    <rect x={a.x} y={a.y + PHOTO_H - 40} width={Math.min(PHOTO_W - 20, 40 + a.caption.length * 11.5)} height="40" rx="0" className="caption-tab" />
                    <text x={a.x + 16} y={a.y + PHOTO_H - 14} className="caption-text">{a.caption}</text>
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
          actions={doneActions(round, onReplay, onExit)}
        />
      )}
    </div>
  );
}
