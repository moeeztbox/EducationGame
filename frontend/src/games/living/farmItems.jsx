import { Pond, Hay, Barn, House, Tractor, Rabbit, Ducks, Hen, Cow, Sheep } from './farmArt.jsx';

const box = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}Z`;

// Listed back to front so overlapping pictures stack correctly.
// x, y, w, h place each picture on the 1550 x 835 farm scene. `hit` is the grab area.
// `why` is the reason shown to the child after a drop.
export const ITEMS = [
  { id: 'pond', name: 'Pond', kind: 'nonliving', Art: Pond, x: 0, y: 612, w: 640, h: 225,
    hit: 'M0 628C120 612 300 620 420 654C520 682 548 734 584 772C604 796 624 816 640 837H0Z',
    why: 'Water cannot grow, move on its own or eat.' },
  { id: 'hay', name: 'Hay', kind: 'nonliving', Art: Hay, x: 440, y: 332, w: 150, h: 150, hit: box(440, 332, 150, 150),
    why: 'Hay is dry grass. It cannot grow or move.' },
  { id: 'barn', name: 'Barn', kind: 'nonliving', Art: Barn, x: 90, y: 120, w: 380, h: 365, hit: box(100, 130, 360, 355),
    why: 'A barn cannot grow, move or eat.' },
  { id: 'house', name: 'House', kind: 'nonliving', Art: House, x: 1146, y: 40, w: 314, h: 226, hit: box(1146, 40, 314, 226),
    why: 'A house cannot grow, move or eat.' },
  { id: 'tractor', name: 'Tractor', kind: 'nonliving', Art: Tractor, x: 784, y: 98, w: 130, h: 112, hit: box(784, 98, 130, 112),
    why: 'A tractor only moves when a person drives it. It does not grow or eat.' },
  { id: 'rabbit', name: 'Rabbit', kind: 'living', Art: Rabbit, x: 190, y: 488, w: 122, h: 98, hit: box(184, 484, 134, 108),
    why: 'A rabbit grows, hops around and needs food and water.' },
  { id: 'ducks', name: 'Ducks', kind: 'living', Art: Ducks, x: 96, y: 626, w: 330, h: 200, hit: box(96, 626, 330, 200),
    why: 'Ducks grow, swim and need food and water.' },
  { id: 'hen', name: 'Hen', kind: 'living', Art: Hen, x: 681, y: 553, w: 138, h: 138, hit: box(676, 548, 150, 148),
    why: 'A hen grows, walks around and needs food and water.' },
  { id: 'cow', name: 'Cow', kind: 'living', Art: Cow, x: 623, y: 326, w: 266, h: 200, hit: box(618, 322, 276, 208),
    why: 'A cow grows, moves and needs food and water.' },
  { id: 'sheep', name: 'Sheep', kind: 'living', Art: Sheep, x: 1298, y: 566, w: 160, h: 126, hit: box(1292, 560, 172, 138),
    why: 'A sheep grows, moves and needs food and water.' },
];
