// Small SVG drawing helpers shared by every skeleton part.
export const BLUE = '#3b7ec9';
export const INK = '#1d3f6e';
export const SKIN = '#eab9a0';
export const SKIN_LINE = '#3c2a3a';

// A long bone: white shaft with a knob on each side of both ends, blue outline.
export function Bone({ x1, y1, x2, y2, w = 14 }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const o = w * 0.5;
  const r = w * 0.62;
  const ends = [
    [x1 + nx * o, y1 + ny * o],
    [x1 - nx * o, y1 - ny * o],
    [x2 + nx * o, y2 + ny * o],
    [x2 - nx * o, y2 - ny * o],
  ];
  return (
    <g strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BLUE} strokeWidth={w + 8} />
      {ends.map(([x, y], i) => <circle key={`o${i}`} cx={x} cy={y} r={r + 4} fill={BLUE} />)}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={w} />
      {ends.map(([x, y], i) => <circle key={`i${i}`} cx={x} cy={y} r={r} fill="#fff" />)}
    </g>
  );
}

// A round joint (shoulder, elbow, knee).
export const Ball = ({ cx, cy, r }) => (
  <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={BLUE} strokeWidth="4.5" />
);

// A skin-coloured tube following a polyline (arms, legs).
export function Limb({ pts, w }) {
  const p = pts.map((q) => q.join(',')).join(' ');
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={p} stroke={SKIN_LINE} strokeWidth={w + 8} />
      <polyline points={p} stroke={SKIN} strokeWidth={w} />
    </g>
  );
}

// Flat skin shapes with the dark outline.
export const SkinShape = ({ children }) => (
  <g fill={SKIN} stroke={SKIN_LINE} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
    {children}
  </g>
);

// Flip a left-side drawing to the right side of the body (scene is 1000 wide).
export const Mirror = ({ children }) => <g transform="translate(1000 0) scale(-1 1)">{children}</g>;
