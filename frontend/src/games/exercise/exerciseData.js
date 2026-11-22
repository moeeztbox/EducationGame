// Content of the end-of-chapter exercise (from the textbook's "Unit 1" review page).

export const TRUE_FALSE = [
  {
    text: 'Living things need water and food to live.', answer: true, emoji: '🐄',
    why: 'A cow, a tree and you all need water and food to live.',
    hint: 'Think about a cow, a tree or yourself. Can they live without water and food?',
  },
  {
    text: 'Non-living things move on their own.', answer: false, emoji: '🏠',
    why: 'A house or a stone cannot move on its own. Only living things move by themselves.',
    hint: 'Does a house or a stone walk around by itself?',
  },
  {
    text: 'We use wood to build furniture.', answer: true, emoji: '🪑',
    why: 'Chairs, tables and beds are made of wood.',
    hint: 'What is your chair or your bed made of?',
  },
  {
    text: 'Plants help us to breathe.', answer: true, emoji: '🌳',
    why: 'Plants give out oxygen. It is the air we breathe in.',
    hint: 'Plants give us fresh air. Think about a garden full of trees.',
  },
];

export const CATEGORIES = [
  { id: 'fruit', label: 'Fruit', color: '#dc2626', a: 'a fruit' },
  { id: 'vegetable', label: 'Vegetable', color: '#ea580c', a: 'a vegetable' },
  { id: 'bush', label: 'Bush', color: '#be185d', a: 'a bush' },
  { id: 'tree', label: 'Tree', color: '#16a34a', a: 'a tree' },
];

// Words to match: two for each box.
export const CHIPS = [
  { id: 'mango', text: 'Mango', kind: 'fruit' },
  { id: 'apple', text: 'Apple', kind: 'fruit' },
  { id: 'peas', text: 'Peas', kind: 'vegetable' },
  { id: 'carrot', text: 'Carrot', kind: 'vegetable' },
  { id: 'rose', text: 'Rose', kind: 'bush' },
  { id: 'oleander', text: 'Oleander', kind: 'bush' },
  { id: 'oak', text: 'Oak tree', kind: 'tree' },
  { id: 'maple', text: 'Maple tree', kind: 'tree' },
];

// Names the child may type. Anything not listed is accepted gently (the teacher can check it).
export const KNOWN = {
  fruit: ['mango', 'apple', 'banana', 'orange', 'grape', 'guava', 'pear', 'peach', 'plum', 'cherry', 'strawberry', 'watermelon', 'melon',
    'pineapple', 'papaya', 'pomegranate', 'lemon', 'lychee', 'apricot', 'kiwi', 'date', 'fig', 'coconut', 'berry', 'blueberry', 'tomato', 'mulberry'],
  vegetable: ['carrot', 'pea', 'potato', 'tomato', 'onion', 'cabbage', 'cauliflower', 'spinach', 'cucumber', 'brinjal', 'eggplant', 'okra',
    'lady finger', 'ladyfinger', 'radish', 'turnip', 'beetroot', 'pumpkin', 'lettuce', 'broccoli', 'capsicum', 'garlic', 'ginger', 'bean',
    'chilli', 'pepper', 'celery', 'peas'],
  bush: ['rose', 'jasmine', 'hibiscus', 'oleander', 'lavender', 'hydrangea', 'azalea', 'camellia', 'bougainvillea', 'holly', 'privet',
    'gardenia', 'lilac', 'forsythia', 'rhododendron', 'boxwood', 'bush'],
  tree: ['oak', 'neem', 'banyan', 'peepal', 'pine', 'maple', 'palm', 'date palm', 'eucalyptus', 'cedar', 'deodar', 'willow', 'birch',
    'acacia', 'sheesham', 'shisham', 'walnut', 'almond', 'poplar', 'elm', 'ash', 'cypress', 'chinar', 'teak', 'bamboo'],
};

const clean = (s) => s.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const singular = (w) => (w.endsWith('ies') ? w.slice(0, -3) + 'y' : w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);

// Check a typed example for a category. Returns { ok, text }.
export function checkExample(kind, raw) {
  const cat = CATEGORIES.find((c) => c.id === kind);
  let w = clean(raw);
  if (w.length < 2) return { ok: false, text: `Type the name of ${cat.a}.` };
  const base = w.replace(/ (tree|plant|bush|fruit)$/, '');
  const options = [w, base, singular(w), singular(base)];
  if (kind === 'tree' && /tree$/.test(w)) return { ok: true, text: `Yes! ${raw.trim()} is a tree.` };
  if (options.some((o) => KNOWN[kind].includes(o))) return { ok: true, text: `Yes! ${raw.trim()} is ${cat.a}.` };
  const other = CATEGORIES.find((c) => c.id !== kind && options.some((o) => KNOWN[c.id].includes(o)));
  if (other) return { ok: false, text: `${raw.trim()} is ${other.a}, not ${cat.a}. Try another one.` };
  return { ok: true, text: `Nice! Your teacher can check that ${raw.trim()} is ${cat.a}.` };
}
