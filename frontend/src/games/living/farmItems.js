import background from '../../assets/farm/background.webp';
import pond from '../../assets/farm/pond.webp';
import hay from '../../assets/farm/hay.webp';
import barn from '../../assets/farm/barn.webp';
import house from '../../assets/farm/house.webp';
import tractor from '../../assets/farm/tractor.webp';
import rabbit from '../../assets/farm/rabbit.webp';
import ducks from '../../assets/farm/ducks.webp';
import hen from '../../assets/farm/hen.webp';
import cow from '../../assets/farm/cow.webp';
import sheep from '../../assets/farm/sheep.webp';

export const BACKGROUND = background;

// Listed back to front (same order as farm.json) so overlapping pictures stack correctly.
// `why` is the reason shown to the child after a drop.
export const ITEMS = [
  { id: 'pond', name: 'Pond', kind: 'nonliving', src: pond, why: 'Water cannot grow, move on its own or eat.' },
  { id: 'hay', name: 'Hay', kind: 'nonliving', src: hay, why: 'Hay is dry grass. It cannot grow or move.' },
  { id: 'barn', name: 'Barn', kind: 'nonliving', src: barn, why: 'A barn cannot grow, move or eat.' },
  { id: 'house', name: 'House', kind: 'nonliving', src: house, why: 'A house cannot grow, move or eat.' },
  { id: 'tractor', name: 'Tractor', kind: 'nonliving', src: tractor, why: 'A tractor only moves when a person drives it. It does not grow or eat.' },
  { id: 'rabbit', name: 'Rabbit', kind: 'living', src: rabbit, why: 'A rabbit grows, hops around and needs food and water.' },
  { id: 'ducks', name: 'Ducks', kind: 'living', src: ducks, why: 'Ducks grow, swim and need food and water.' },
  { id: 'hen', name: 'Hen', kind: 'living', src: hen, why: 'A hen grows, walks around and needs food and water.' },
  { id: 'cow', name: 'Cow', kind: 'living', src: cow, why: 'A cow grows, moves and needs food and water.' },
  { id: 'sheep', name: 'Sheep', kind: 'living', src: sheep, why: 'A sheep grows, moves and needs food and water.' },
];
