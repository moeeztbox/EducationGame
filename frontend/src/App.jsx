import { useState } from 'react';
import Welcome from './screens/Welcome.jsx';
import ClassSelect from './screens/ClassSelect.jsx';
import ChapterSelect from './screens/ChapterSelect.jsx';
import SkeletonGame from './games/skeleton/SkeletonGame.jsx';
import SortingGame from './games/sorting/SortingGame.jsx';
import LivingGame from './games/living/LivingGame.jsx';
import PhotoSortGame from './games/photosort/PhotoSortGame.jsx';
import HomesGame from './games/homes/HomesGame.jsx';
import MaterialsGame from './games/materials/MaterialsGame.jsx';
import { findChapter } from './data/curriculum.js';

// Which game component plays each chapter (see `game` in data/curriculum.js).
const GAMES = { skeleton: SkeletonGame, sorting: SortingGame, living: LivingGame, photosort: PhotoSortGame, homes: HomesGame, materials: MaterialsGame };

// Very small screen switcher: welcome -> class -> chapter -> game.
export default function App() {
  const [route, setRoute] = useState({ screen: 'welcome' });
  const go = (screen, extra = {}) => setRoute({ screen, ...extra });

  switch (route.screen) {
    case 'class':
      return <ClassSelect onBack={() => go('welcome')} onPick={(classId) => go('chapter', { classId })} />;
    case 'chapter':
      return (
        <ChapterSelect
          classId={route.classId}
          onBack={() => go('class')}
          onPick={(chapterId) => go('game', { classId: route.classId, chapterId })}
        />
      );
    case 'game': {
      const chapter = findChapter(route.classId, route.chapterId);
      const Game = GAMES[chapter?.game];
      return (
        <Game
          chapter={chapter}
          config={chapter?.config}
          classId={route.classId}
          onExit={() => go('chapter', { classId: route.classId })}
        />
      );
    }
    default:
      return <Welcome onStart={() => go('class')} />;
  }
}