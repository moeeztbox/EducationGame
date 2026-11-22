// Flat cartoon art for the sorting level. Every picture is drawn around (0, 0),
// roughly 90 x 90 units, so it can be placed anywhere with a translate.

const OL = '#3b2f4a';
const line = { stroke: OL, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' };

/* ---------- animals ---------- */

function Cat() {
  return (
    <g {...line}>
      <path d="M24 26 Q50 14 38 -6" fill="none" stroke="#f59e0b" strokeWidth="9" />
      <ellipse cx="0" cy="20" rx="26" ry="20" fill="#fbbf24" />
      <path d="M-22 -22 L-16 -44 L-3 -28 Z" fill="#fbbf24" />
      <path d="M22 -22 L16 -44 L3 -28 Z" fill="#fbbf24" />
      <path d="M-17 -30 L-14 -38 L-9 -31 Z M17 -30 L14 -38 L9 -31 Z" fill="#fda4af" stroke="none" />
      <circle cx="0" cy="-10" r="23" fill="#fbbf24" />
      <path d="M-6 -30 V-22 M0 -31 V-21 M6 -30 V-22" fill="none" stroke="#d97706" />
      <circle cx="-9" cy="-12" r="3.5" fill={OL} stroke="none" />
      <circle cx="9" cy="-12" r="3.5" fill={OL} stroke="none" />
      <path d="M-3 -4 L3 -4 L0 0 Z" fill="#fb7185" strokeWidth="2" />
      <path d="M0 0 Q-5 6 -9 3 M0 0 Q5 6 9 3" fill="none" strokeWidth="2" />
      <path d="M-14 -3 L-30 -6 M-14 0 L-30 3 M14 -3 L30 -6 M14 0 L30 3" fill="none" strokeWidth="1.8" />
    </g>
  );
}

function Bird() {
  return (
    <g {...line}>
      <path d="M-22 6 L-46 -4 L-42 12 L-48 22 L-24 18 Z" fill="#0284c7" />
      <ellipse cx="0" cy="8" rx="28" ry="23" fill="#38bdf8" />
      <ellipse cx="2" cy="12" rx="16" ry="11" fill="#e0f2fe" stroke="none" />
      <circle cx="18" cy="-14" r="16" fill="#38bdf8" />
      <path d="M30 -18 L46 -12 L30 -8 Z" fill="#fb923c" />
      <circle cx="22" cy="-18" r="3.5" fill={OL} stroke="none" />
      <path d="M-8 4 Q-22 -6 -4 -14 Q4 -2 -8 4 Z" fill="#0284c7" />
      <path d="M-4 31 V42 M6 31 V42 M-10 42 H0 M0 42 H12" fill="none" stroke="#f59e0b" strokeWidth="3" />
    </g>
  );
}

function Fish() {
  return (
    <g {...line}>
      <path d="M-26 0 L-50 -20 L-50 20 Z" fill="#f43f5e" />
      <path d="M-8 -18 Q4 -36 18 -18 Z" fill="#f43f5e" />
      <ellipse cx="0" cy="0" rx="34" ry="22" fill="#fb7185" />
      <path d="M-6 -12 Q2 0 -6 12 M6 -14 Q14 0 6 14" fill="none" stroke="#fecdd3" strokeWidth="3" />
      <circle cx="19" cy="-6" r="6" fill="#fff" />
      <circle cx="21" cy="-6" r="3" fill={OL} stroke="none" />
      <path d="M32 6 Q26 10 22 6" fill="none" strokeWidth="2" />
      <ellipse cx="-2" cy="10" rx="8" ry="5" fill="#f43f5e" transform="rotate(25 -2 10)" />
    </g>
  );
}

function Rabbit() {
  return (
    <g {...line}>
      <circle cx="28" cy="30" r="9" fill="#fff" />
      <ellipse cx="0" cy="24" rx="26" ry="20" fill="#e5e7eb" />
      <ellipse cx="-10" cy="-36" rx="7" ry="19" fill="#e5e7eb" transform="rotate(-8 -10 -36)" />
      <ellipse cx="10" cy="-36" rx="7" ry="19" fill="#e5e7eb" transform="rotate(8 10 -36)" />
      <ellipse cx="-10" cy="-36" rx="3" ry="12" fill="#fda4af" stroke="none" transform="rotate(-8 -10 -36)" />
      <ellipse cx="10" cy="-36" rx="3" ry="12" fill="#fda4af" stroke="none" transform="rotate(8 10 -36)" />
      <circle cx="0" cy="-8" r="21" fill="#e5e7eb" />
      <circle cx="-8" cy="-11" r="3.5" fill={OL} stroke="none" />
      <circle cx="8" cy="-11" r="3.5" fill={OL} stroke="none" />
      <path d="M-3 -3 L3 -3 L0 1 Z" fill="#fb7185" strokeWidth="2" />
      <path d="M0 1 V5 M-3 6 H3" fill="none" strokeWidth="2" />
      <path d="M-14 0 L-28 -2 M-14 3 L-28 6 M14 0 L28 -2 M14 3 L28 6" fill="none" strokeWidth="1.8" />
    </g>
  );
}

function Butterfly() {
  return (
    <g {...line}>
      <ellipse cx="-24" cy="-14" rx="22" ry="17" fill="#c084fc" transform="rotate(-25 -24 -14)" />
      <ellipse cx="24" cy="-14" rx="22" ry="17" fill="#c084fc" transform="rotate(25 24 -14)" />
      <ellipse cx="-18" cy="16" rx="15" ry="12" fill="#f472b6" transform="rotate(20 -18 16)" />
      <ellipse cx="18" cy="16" rx="15" ry="12" fill="#f472b6" transform="rotate(-20 18 16)" />
      <circle cx="-26" cy="-14" r="5" fill="#fde68a" stroke="none" />
      <circle cx="26" cy="-14" r="5" fill="#fde68a" stroke="none" />
      <ellipse cx="0" cy="2" rx="6" ry="24" fill="#4c1d95" />
      <path d="M-2 -22 Q-10 -40 -18 -38 M2 -22 Q10 -40 18 -38" fill="none" strokeWidth="2.5" />
    </g>
  );
}

/* ---------- plants ---------- */

function Tree() {
  return (
    <g {...line}>
      <path d="M-8 44 L-6 6 H6 L8 44 Z" fill="#a16207" />
      <circle cx="-20" cy="-2" r="21" fill="#4ade80" />
      <circle cx="20" cy="-2" r="21" fill="#4ade80" />
      <circle cx="0" cy="-20" r="26" fill="#22c55e" />
      <circle cx="-10" cy="-8" r="4.5" fill="#ef4444" strokeWidth="2" />
      <circle cx="14" cy="-22" r="4.5" fill="#ef4444" strokeWidth="2" />
      <circle cx="18" cy="2" r="4.5" fill="#ef4444" strokeWidth="2" />
    </g>
  );
}

function Daisy() {
  return (
    <g {...line}>
      <path d="M0 6 V46" fill="none" stroke="#16a34a" strokeWidth="6" />
      <path d="M0 34 Q-22 28 -26 14 Q-8 14 0 30 Z" fill="#4ade80" />
      <path d="M0 40 Q20 34 24 22 Q8 22 0 36 Z" fill="#4ade80" />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-30" rx="8" ry="15" fill="#fff" transform={`rotate(${i * 45} 0 -12)`} />
      ))}
      <circle cx="0" cy="-12" r="10" fill="#facc15" />
    </g>
  );
}

function Cactus() {
  return (
    <g {...line}>
      <path d="M-26 -4 Q-26 -22 -18 -22 Q-10 -22 -10 -6 V8 H-26 Z" fill="#22c55e" transform="translate(0 4)" />
      <path d="M26 -14 Q26 -32 18 -32 Q10 -32 10 -16 V0 H26 Z" fill="#22c55e" transform="translate(0 4)" />
      <rect x="-13" y="-44" width="26" height="90" rx="13" fill="#4ade80" />
      <path d="M-10 -10 H-26 M10 4 H26" fill="none" stroke="#22c55e" strokeWidth="0" />
      <path d="M-5 -30 V-24 M5 -18 V-12 M-5 -6 V0 M5 10 V16 M-5 24 V30" fill="none" stroke="#166534" strokeWidth="2.5" />
      <circle cx="0" cy="-44" r="7" fill="#f472b6" strokeWidth="2.5" />
    </g>
  );
}

function Tulip() {
  return (
    <g {...line}>
      <path d="M0 -4 V46" fill="none" stroke="#16a34a" strokeWidth="6" />
      <path d="M0 44 Q-26 34 -24 6 Q-4 14 0 38 Z" fill="#4ade80" />
      <path d="M0 44 Q24 38 24 14 Q6 20 0 40 Z" fill="#22c55e" />
      <path d="M-20 -30 Q-22 0 0 2 Q22 0 20 -30 L10 -18 L0 -34 L-10 -18 Z" fill="#fb7185" />
      <path d="M0 -34 Q-6 -14 0 2 Q6 -14 0 -34" fill="#f43f5e" strokeWidth="2" />
    </g>
  );
}

function Sapling() {
  return (
    <g {...line}>
      <ellipse cx="0" cy="38" rx="34" ry="12" fill="#92400e" />
      <path d="M0 36 Q-2 14 2 -12" fill="none" stroke="#16a34a" strokeWidth="6" />
      <path d="M2 -6 Q-30 -8 -34 -34 Q-6 -34 2 -8 Z" fill="#4ade80" />
      <path d="M2 -14 Q30 -14 34 -40 Q8 -40 2 -16 Z" fill="#22c55e" />
      <path d="M1 12 Q-18 12 -22 -2 Q-4 0 1 10 Z" fill="#86efac" strokeWidth="2.5" />
    </g>
  );
}

// kind decides the right basket. x/y are where the picture sits in the meadow.
export const ITEMS = [
  { id: 'cat', name: 'Cat', kind: 'animal', Art: Cat, x: 130, y: 120, rot: -5 },
  { id: 'tree', name: 'Tree', kind: 'plant', Art: Tree, x: 335, y: 135, rot: 3 },
  { id: 'bird', name: 'Bird', kind: 'animal', Art: Bird, x: 550, y: 105, rot: 6 },
  { id: 'tulip', name: 'Tulip', kind: 'plant', Art: Tulip, x: 765, y: 130, rot: -4 },
  { id: 'fish', name: 'Fish', kind: 'animal', Art: Fish, x: 965, y: 115, rot: 5 },
  { id: 'cactus', name: 'Cactus', kind: 'plant', Art: Cactus, x: 100, y: 300, rot: 4 },
  { id: 'rabbit', name: 'Rabbit', kind: 'animal', Art: Rabbit, x: 320, y: 315, rot: -3 },
  { id: 'daisy', name: 'Daisy', kind: 'plant', Art: Daisy, x: 540, y: 300, rot: 6 },
  { id: 'butterfly', name: 'Butterfly', kind: 'animal', Art: Butterfly, x: 755, y: 310, rot: -8 },
  { id: 'sapling', name: 'Sapling', kind: 'plant', Art: Sapling, x: 960, y: 305, rot: 3 },
];
