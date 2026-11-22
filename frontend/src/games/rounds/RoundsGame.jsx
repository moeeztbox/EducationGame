import { useState } from 'react';
import SortingGame from '../sorting/SortingGame.jsx';
import LivingGame from '../living/LivingGame.jsx';
import PhotoSortGame from '../photosort/PhotoSortGame.jsx';
import HomesGame from '../homes/HomesGame.jsx';
import MaterialsGame from '../materials/MaterialsGame.jsx';
import ExerciseGame from '../exercise/ExerciseGame.jsx';

// The rounds of a chapter, played one after the other. The last one is the exercise.
const ROUNDS = [
  { title: 'Plants and animals', Game: SortingGame },
  { title: 'Living and non-living things', Game: LivingGame },
  { title: 'Plants around you', Game: PhotoSortGame, config: 'plants' },
  { title: 'Types of flowering plants', Game: PhotoSortGame, config: 'flowertypes' },
  { title: 'Fruits, vegetables and grains', Game: PhotoSortGame, config: 'foods' },
  { title: 'Plants give us shelter', Game: HomesGame },
  { title: 'Wood and cotton', Game: MaterialsGame },
  { title: "Let's complete the exercise", Game: ExerciseGame },
];

export default function RoundsGame({ chapter, classId, onExit }) {
  // In development, ?round=N jumps straight to a round (handy for testing).
  const [i, setI] = useState(() => (import.meta.env.DEV ? Math.max(0, Math.min(ROUNDS.length - 1, Number(new URLSearchParams(location.search).get('round')) - 1 || 0)) : 0));
  const { Game, config, title } = ROUNDS[i];
  const round = { index: i + 1, total: ROUNDS.length, title, onNext: i + 1 < ROUNDS.length ? () => setI(i + 1) : null };
  return <Game key={i} chapter={chapter} classId={classId} config={config} round={round} onExit={onExit} />;
}
