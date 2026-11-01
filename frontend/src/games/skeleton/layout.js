// Scene coordinates for the skeleton game. The SVG is 1100 x 640 and everything is
// drawn inside a <g translate(50 0)> so the body (centred on x=500) sits in the middle.

export const SCENE_W = 1100;
export const SCENE_H = 640;

// How close (scene units) a bone must be dropped to its place. Generous on purpose.
export const TOL = 60;

// Stage 1: where each loose bone starts (its centre) and how it is tilted.
export const HOMES = {
  head: { x: 110, y: 100, r: -10 },
  armR: { x: 235, y: 255, r: 38 },
  hips: { x: 95, y: 395, r: -6 },
  handL: { x: 250, y: 445, r: -20 },
  footL: { x: 120, y: 550, r: -8 },
  ribs: { x: 890, y: 105, r: 10 },
  armL: { x: 790, y: 275, r: -35 },
  handR: { x: 945, y: 335, r: 20 },
  legL: { x: 870, y: 445, r: 80 },
  legR: { x: 850, y: 530, r: -82 },
  footR: { x: 760, y: 595, r: 6 },
};

// Stage 2: the body moves left to make room for the word blocks and the word list.
export const BODY_SHIFT = -100;
export const BLOCK_W = 160;
export const BLOCK_H = 44;
export const CHIP_X = 880;
export const BLOCK_X = { L: -40, R: 690 };

// Each word, the block it belongs to, the body spot its leader line points at
// (before BODY_SHIFT) and what moves when it is placed.
export const LABELS = [
  { id: 'head', text: 'Head', color: '#8b5cf6', side: 'L', y: 20, anchor: [456, 70], parts: ['head'] },
  { id: 'nose', text: 'Nose', color: '#22c55e', side: 'L', y: 92, anchor: [496, 126], fx: 'nose' },
  { id: 'hips', text: 'Hips', color: '#ef4444', side: 'L', y: 300, anchor: [450, 372], parts: ['hips'] },
  { id: 'hand', text: 'Hand', color: '#3b82f6', side: 'L', y: 400, anchor: [352, 398], parts: ['handL', 'handR'] },
  { id: 'foot', text: 'Foot', color: '#f59e0b', side: 'L', y: 540, anchor: [420, 598], parts: ['footL', 'footR'] },
  { id: 'eyes', text: 'Eyes', color: '#ef4444', side: 'R', y: 50, anchor: [520, 98], fx: 'eyes' },
  { id: 'ribs', text: 'Ribs', color: '#3b82f6', side: 'R', y: 160, anchor: [548, 236], parts: ['ribs'] },
  { id: 'arm', text: 'Arm', color: '#22c55e', side: 'R', y: 270, anchor: [608, 284], parts: ['armL', 'armR'] },
  { id: 'leg', text: 'Leg', color: '#8b5cf6', side: 'R', y: 420, anchor: [536, 490], parts: ['legL', 'legR'] },
];

export const PRAISE = ['Great!', 'Well done!', 'Super!', 'Awesome!', 'Perfect!', 'Nice one!'];
export const pickPraise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];
