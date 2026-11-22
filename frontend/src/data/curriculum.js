// Menu content lives here as data. Only the entries with `open: true` are playable;
// the rest are placeholders so the app already looks like a full product.

export const CLASSES = [
  { id: 1, name: 'Class 1', emoji: '🐣', color: '#f59e0b', open: true },
  { id: 2, name: 'Class 2', emoji: '🌱', color: '#10b981', open: false },
  { id: 3, name: 'Class 3', emoji: '🚀', color: '#3b82f6', open: true },
  { id: 4, name: 'Class 4', emoji: '🔭', color: '#8b5cf6', open: false },
  { id: 5, name: 'Class 5', emoji: '🧪', color: '#ec4899', open: false },
];

export const CHAPTERS = {
  1: [
    { id: 1, title: 'Characteristics of Organisms', subject: 'Science', emoji: '🌱', color: '#16a34a', open: true, game: 'rounds' },
    { id: 2, title: 'Water and Weather', subject: 'Science', emoji: '🌦️', color: '#06b6d4', open: false },
    { id: 3, title: 'Light and Shadows', subject: 'Science', emoji: '💡', color: '#0ea5e9', open: false },
    { id: 4, title: 'Habitats and Homes', subject: 'Science', emoji: '🦁', color: '#8b5cf6', open: false },
  ],
  3: [
    { id: 1, title: 'The Human Body', subject: 'Science', emoji: '🦴', color: '#3b82f6', open: true, game: 'skeleton' },
    { id: 2, title: 'Plants Around Us', subject: 'Science', emoji: '🌿', color: '#10b981', open: false },
    { id: 3, title: 'Animals and Habitats', subject: 'Science', emoji: '🐾', color: '#f59e0b', open: false },
    { id: 4, title: 'Water and Weather', subject: 'Science', emoji: '🌦️', color: '#06b6d4', open: false },
  ],
};
export const findClass = (id) => CLASSES.find((c) => c.id === id);
export const findChapter = (classId, id) => (CHAPTERS[classId] || []).find((c) => c.id === id);
