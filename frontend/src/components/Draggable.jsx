import { useRef, useState } from 'react';
import { sfx } from '../sfx.js';

// Drag handle for an SVG group. `home` is where it rests (offset from its drawn
// position). On release the parent's `onDrop({ offset, pointer })` answers
// `{ ok: true, to }` to snap it there, or anything else to send it back home.
export default function Draggable({ id, home, homeRot = 0, homeScale = 1, center, box, hit, onMove, onDrop, onSettle, children }) {
  const ref = useRef(null);
  const session = useRef(null);
  const [off, setOff] = useState(home);
  const [rot, setRot] = useState(homeRot);
  const [scale, setScale] = useState(homeScale);
  const [mode, setMode] = useState('home'); // home | drag | back | placed

  const toScene = (e) => {
    const g = ref.current;
    const pt = g.ownerSVGElement.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(g.parentNode.getScreenCTM().inverse());
  };

  const down = (e) => {
    if (mode === 'placed') return;
    e.preventDefault();
    const g = ref.current;
    g.parentNode.appendChild(g); // bring to front
    g.setPointerCapture(e.pointerId);
    const p = toScene(e);
    session.current = { sx: p.x, sy: p.y, ox: off.x, oy: off.y, last: off };
    setMode('drag');
    setRot(0);
    sfx.pick();
  };

  const move = (e) => {
    const s = session.current;
    if (!s) return;
    const p = toScene(e);
    const next = { x: s.ox + p.x - s.sx, y: s.oy + p.y - s.sy };
    s.last = next;
    setOff(next);
    onMove?.(id, next, p);
  };

  const up = (e) => {
    const s = session.current;
    if (!s) return;
    session.current = null;
    const res = onDrop({ id, offset: s.last, pointer: toScene(e) });
    if (res && res.ok) {
      setOff(res.to);
      setRot(0);
      setScale(res.scale || 1);
      setMode('placed');
      setTimeout(() => onSettle?.(id), 280);
    } else {
      setOff(home);
      setRot(homeRot);
      setScale(homeScale);
      setMode(res && res.calm ? 'calm' : 'back');
      onMove?.(id, null);
      setTimeout(() => setMode('home'), 450);
    }
  };

  const [bx, by, bw, bh] = box;
  return (
    <g
      ref={ref}
      className={`drg ${mode}`}
      style={{
        transform: `translate(${off.x}px, ${off.y}px) rotate(${rot}deg) scale(${scale})`,
        transformOrigin: `${center[0]}px ${center[1]}px`,
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <g className="drg-in">
        {hit || <rect x={bx} y={by} width={bw} height={bh} fill="transparent" />}
        {children}
      </g>
    </g>
  );
}
