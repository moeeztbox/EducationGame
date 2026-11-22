// A flower drawn from separate parts (scene is 1100 x 720, flower centred on x = 550).
// Used first as pieces to assemble, then as regions to colour.

const OUT = '#3b2f4a';
const line = { stroke: OUT, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' };
export const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export const Stem = ({ fill = '#fff', ...p }) => <path d="M541 336 H559 V650 H541 Z" fill={fill} {...line} {...p} />;
export const LeafL = ({ fill = '#fff', ...p }) => <path d="M545 540 C480 565 425 530 412 468 C482 462 530 488 545 540 Z" fill={fill} {...line} {...p} />;
export const LeafR = ({ fill = '#fff', ...p }) => <path d="M555 540 C620 565 675 530 688 468 C618 462 570 488 555 540 Z" fill={fill} {...line} {...p} />;
export const Petal = ({ a, fill = '#fff', ...p }) => (
  <ellipse cx="550" cy="202" rx="36" ry="72" transform={`rotate(${a} 550 280)`} fill={fill} {...line} {...p} />
);
export const Centre = ({ fill = '#fff', ...p }) => <circle cx="550" cy="280" r="44" fill={fill} {...line} {...p} />;

// The pieces to assemble: where each rests at home (tray) and how it is grabbed.
export const PIECES = [
  { id: 'stem', name: 'Stem', node: () => <Stem />, ghost: () => <Stem fill="none" />, box: [515, 330, 70, 325], center: [550, 493], tray: [985, 500], rot: 18 },
  { id: 'leafL', name: 'Leaf', node: () => <LeafL />, ghost: () => <LeafL fill="none" />, box: [405, 455, 150, 110], center: [478, 510], tray: [150, 590], rot: -12 },
  { id: 'leafR', name: 'Leaf', node: () => <LeafR />, ghost: () => <LeafR fill="none" />, box: [545, 455, 150, 110], center: [622, 510], tray: [960, 280], rot: 14 },
  {
    id: 'petals', name: 'Petals',
    node: () => ANGLES.map((a) => <Petal key={a} a={a} />),
    ghost: () => ANGLES.map((a) => <Petal key={a} a={a} fill="none" />),
    box: [394, 124, 312, 312], center: [550, 280], tray: [150, 215], rot: -6, scale: 0.5,
  },
  { id: 'centre', name: 'Centre', node: () => <Centre />, ghost: () => <Centre fill="none" />, box: [500, 230, 100, 100], center: [550, 280], tray: [150, 430], rot: 0 },
];

// The parts that can be coloured, back to front.
export const REGIONS = [
  { id: 'stem', render: (fill, p) => <Stem fill={fill} {...p} /> },
  { id: 'leafL', render: (fill, p) => <LeafL fill={fill} {...p} /> },
  { id: 'leafR', render: (fill, p) => <LeafR fill={fill} {...p} /> },
  ...ANGLES.map((a) => ({ id: `petal${a}`, render: (fill, p) => <Petal a={a} fill={fill} {...p} /> })),
  { id: 'centre', render: (fill, p) => <Centre fill={fill} {...p} /> },
];

export const PALETTE = [
  { name: 'Red', c: '#ef4444' }, { name: 'Orange', c: '#f97316' }, { name: 'Yellow', c: '#facc15' },
  { name: 'Pink', c: '#ec4899' }, { name: 'Purple', c: '#8b5cf6' }, { name: 'Blue', c: '#3b82f6' },
  { name: 'Green', c: '#22c55e' }, { name: 'Brown', c: '#a16207' }, { name: 'White', c: '#ffffff' },
];
