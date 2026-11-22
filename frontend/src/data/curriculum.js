// Menu content lives here as data. Only the entries with `open: true` are playable;
// the rest are placeholders so the app already looks like a full product.

export const CLASSES = [
  { id: 1, name: 'Class 1', emoji: '🐣', color: '#f59e0b', open: false },
  { id: 2, name: 'Class 2', emoji: '🌱', color: '#10b981', open: false },
  { id: 3, name: 'Class 3', emoji: '🚀', color: '#3b82f6', open: true },
  { id: 4, name: 'Class 4', emoji: '🔭', color: '#8b5cf6', open: false },
  { id: 5, name: 'Class 5', emoji: '🧪', color: '#ec4899', open: false },
];

export const CHAPTERS = {
  3: [
    { id: 1, title: 'The Human Body', subject: 'Science', emoji: '🦴', color: '#3b82f6', open: true, game: 'skeleton' },
    { id: 2, title: 'Plants and Animals', subject: 'Science', emoji: '🌳', color: '#10b981', open: true, game: 'sorting' },
    { id: 3, title: 'Living and Non-living Things', subject: 'Science', emoji: '🐄', color: '#f59e0b', open: true, game: 'living' },
    { id: 4, title: 'Plants Around You', subject: 'Science', emoji: '🌳', color: '#16a34a', open: true, game: 'photosort', config: 'plants' },
    { id: 5, title: 'Types of Flowering Plants', subject: 'Science', emoji: '🌹', color: '#be185d', open: true, game: 'photosort', config: 'flowertypes' },
    { id: 6, title: 'Fruits, Vegetables and Grains', subject: 'Science', emoji: '🥕', color: '#ea580c', open: true, game: 'photosort', config: 'foods' },
    { id: 7, title: 'Plants Give Us Shelter', subject: 'Science', emoji: '🐿️', color: '#b45309', open: true, game: 'homes' },
    { id: 8, title: 'Water and Weather', subject: 'Science', emoji: '🌦️', color: '#06b6d4', open: false },
    { id: 9, title: 'Light and Shadows', subject: 'Science', emoji: '💡', color: '#0ea5e9', open: false },
    { id: 10, title: 'Habitats and Homes', subject: 'Science', emoji: '🦁', color: '#8b5cf6', open: false },
  ],
};

export const findClass = (id) => CLASSES.find((c) => c.id === id);
export const findChapter = (classId, id) => (CHAPTERS[classId] || []).find((c) => c.id === id);
