import { useState } from 'react';
import { findClass } from '../data/curriculum.js';
import { isMuted, setMuted } from '../sfx.js';

// Top bar shared by every game: back, where we are, stage tags, sound, restart, progress.
export default function GameHeader({ chapter, classId, stages, stage, progress, onExit, onRestart }) {
  const [muted, setMutedState] = useState(isMuted());
  const cls = findClass(classId);
  const toggleSound = () => {
    setMuted(!muted);
    setMutedState(!muted);
  };

  return (
    <>
      <header className="game-head">
        <button className="btn btn-ghost" onClick={onExit}>← Chapters</button>
        <div className="crumbs">
          <strong>{cls?.name} · Chapter {chapter?.id}</strong>
          <span>{chapter?.title}</span>
        </div>
        <div className="stage-pills">
          {stages.map((s, i) => (
            <span key={s} className={`pill ${stage === i + 1 ? 'on' : ''} ${stage > i + 1 ? 'done' : ''}`}>
              {i + 1}. {s}
            </span>
          ))}
        </div>
        <div className="head-tools">
          <button className="btn btn-ghost icon" onClick={toggleSound} title="Sound" aria-label="Toggle sound">
            {muted ? '🔇' : '🔊'}
          </button>
          <button className="btn btn-ghost icon" onClick={onRestart} title="Restart" aria-label="Restart">
            ↻
          </button>
        </div>
      </header>
      <div className="progress"><div style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      <div className="rotate-tip">📱 Turn your device sideways for a bigger board.</div>
    </>
  );
}
