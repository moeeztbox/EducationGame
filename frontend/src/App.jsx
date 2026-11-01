import { useState } from 'react';
import Welcome from './screens/Welcome.jsx';
import ClassSelect from './screens/ClassSelect.jsx';
import ChapterSelect from './screens/ChapterSelect.jsx';
import SkeletonGame from './games/skeleton/SkeletonGame.jsx';
import { findChapter } from './data/curriculum.js';

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
      return (
        <SkeletonGame
          chapter={chapter}
          classId={route.classId}
          onExit={() => go('chapter', { classId: route.classId })}
        />
      );
    }
    default:
      return <Welcome onStart={() => go('class')} />;
  }
}
