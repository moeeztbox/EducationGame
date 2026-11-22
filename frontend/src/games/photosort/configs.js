import maple from '../../assets/plants/maple.webp';
import oak from '../../assets/plants/oak.webp';
import grass1 from '../../assets/plants/grass1.webp';
import grass2 from '../../assets/plants/grass2.webp';
import flower1 from '../../assets/plants/flower1.webp';
import flower2 from '../../assets/plants/flower2.webp';
import rose from '../../assets/flowertypes/rose.webp';
import oleander from '../../assets/flowertypes/oleander.webp';
import rosemary from '../../assets/flowertypes/rosemary.webp';
import parsley from '../../assets/flowertypes/parsley.webp';
import grape from '../../assets/flowertypes/grape.webp';
import pumpkin from '../../assets/flowertypes/pumpkin.webp';
import carrot from '../../assets/foods/carrot.webp';
import cauliflower from '../../assets/foods/cauliflower.webp';
import apple from '../../assets/foods/apple.webp';
import banana from '../../assets/foods/banana.webp';
import wheat from '../../assets/foods/wheat.webp';
import rice from '../../assets/foods/rice.webp';

// One entry per photo-sorting chapter (see `config` in data/curriculum.js).
// bins: the three boxes. `a` completes "This is ...", `fact` is the reason shown after a drop.
export const CONFIGS = {
  plants: {
    stage: 'Match the plants',
    hint: 'Look at each photo. Is it a tree, grass or a flowering plant? Drag it into the right box.',
    doneText: 'You can tell trees, grass and flowering plants apart.',
    bins: {
      tree: { label: '🌳 Trees', color: '#8b5a2b', a: 'a tree', fact: 'A tree is a tall plant with tall stems and thick branches. Trees live for a long time.' },
      grass: { label: '🌿 Grass', color: '#16a34a', a: 'grass', fact: 'Grass is a green plant with thin, soft leaves. They grow close together in a large number.' },
      flower: { label: '🌸 Flowering plants', color: '#c026d3', a: 'a flowering plant', fact: 'Plants that give us flowers and fruits are called flowering plants.' },
    },
    photos: [
      { id: 'maple', kind: 'tree', name: 'Maple tree', src: maple },
      { id: 'oak', kind: 'tree', name: 'Oak tree', src: oak },
      { id: 'grass1', kind: 'grass', name: 'Grass', src: grass1 },
      { id: 'grass2', kind: 'grass', name: 'Grass', src: grass2 },
      { id: 'flower1', kind: 'flower', name: 'Flowering plant', src: flower1 },
      { id: 'flower2', kind: 'flower', name: 'Flowering plant', src: flower2 },
    ],
  },
  flowertypes: {
    stage: 'Bushes, herbs and vines',
    hint: 'These are all flowering plants. Is each one a bush, an herb or a vine? Drag it into the right box.',
    doneText: 'You can tell bushes, herbs and vines apart.',
    bins: {
      bush: { label: '🌹 Bushes', color: '#be185d', a: 'a bush', fact: 'Bushes are smaller than trees and have many stems.' },
      herb: { label: '🌿 Herbs', color: '#16a34a', a: 'an herb', fact: 'Herbs are small plants with small green stems.' },
      vine: { label: '🍇 Vines', color: '#7c3aed', a: 'a vine', fact: 'Vines are plants with weak stems. Their stem needs support.' },
    },
    photos: [
      { id: 'rose', kind: 'bush', name: 'Rose bush', src: rose },
      { id: 'oleander', kind: 'bush', name: 'Oleander bush', src: oleander },
      { id: 'rosemary', kind: 'herb', name: 'Rosemary', src: rosemary },
      { id: 'parsley', kind: 'herb', name: 'Parsley', src: parsley },
      { id: 'grape', kind: 'vine', name: 'Grape vine', src: grape },
      { id: 'pumpkin', kind: 'vine', name: 'Pumpkin', src: pumpkin },
    ],
  },
  foods: {
    stage: 'Vegetables, fruits and grains',
    hint: 'Look at each photo. Is it a vegetable, a fruit or a grain? Drag it into the right box.',
    doneText: 'You can tell vegetables, fruits and grains apart.',
    credits: 'Photos: Carrots - domdomegg (CC BY 4.0); Cauliflower - Coyau (CC BY-SA 3.0); Apples - Dllu (CC BY-SA 4.0); Banana - Evan-Amos (CC BY-SA 3.0); Wheat - Melissa Askew (CC0); Rice - China News Service (CC BY 3.0). Via Wikimedia Commons.',
    bins: {
      vegetable: { label: '🥕 Vegetables', color: '#ea580c', a: 'a vegetable', fact: 'Vegetables are parts of plants that we cook and eat, such as roots, leaves, stems and flowers.' },
      fruit: { label: '🍎 Fruits', color: '#dc2626', a: 'a fruit', fact: 'Fruits grow from the flowers of a plant and hold its seeds. Many are sweet.' },
      grain: { label: '🌾 Grains', color: '#ca8a04', a: 'a grain', fact: 'Grains are the small, hard seeds of plants like wheat and rice. We make flour and rice from them.' },
    },
    photos: [
      { id: 'carrot', kind: 'vegetable', name: 'Carrots', src: carrot },
      { id: 'cauliflower', kind: 'vegetable', name: 'Cauliflower', src: cauliflower },
      { id: 'apple', kind: 'fruit', name: 'Apples', src: apple },
      { id: 'banana', kind: 'fruit', name: 'Banana', src: banana },
      { id: 'wheat', kind: 'grain', name: 'Wheat', src: wheat },
      { id: 'rice', kind: 'grain', name: 'Rice', src: rice },
    ],
  },
};
