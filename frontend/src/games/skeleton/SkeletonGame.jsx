import { useCallback, useState } from 'react';
import MatchBones from './MatchBones.jsx';
import LabelBody from './LabelBody.jsx';
import { findClass } from '../../data/curriculum.js';
import { isMuted, setMuted } from '../../sfx.js';
import './skeleton.css';

const STAGES = ['Build the skeleton', 'Name the parts'];

// Chapter "The Human Body": stage 1 builds the skeleton, stage 2 names the parts.
export default function SkeletonGame({ chapter, classId, onExit }) {
  const [stage, setStage] = useState(1);
  const [run, setRun] = useState(0); // bump to restart the current stage
  const [progress, setProgress] = useState(0);
  const [muted, setMutedState] = useState(isMuted());
  const cls = findClass(classId);

  const onProgress = useCallback((p) => setProgress(p), []);
  const toggleSound = () => {
    setMuted(!muted);
    setMutedState(!muted);
  };

  return (
    <div className="screen game">
      <header className="game-head">
        <button className="btn btn-ghost" onClick={onExit}>← Chapters</button>
        <div className="crumbs">
          <strong>{cls?.name} · Chapter {chapter?.id}</strong>
          <span>{chapter?.title}</span>
        </div>
        <div className="stage-pills">
          {STAGES.map((s, i) => (
            <span key={s} className={`pill ${stage === i + 1 ? 'on' : ''} ${stage > i + 1 ? 'done' : ''}`}>
              {i + 1}. {s}
            </span>
          ))}
        </div>
        <div className="head-tools">
          <button className="btn btn-ghost icon" onClick={toggleSound} title="Sound" aria-label="Toggle sound">
            {muted ? '🔇' : '🔊'}
          </button>
          <button className="btn btn-ghost icon" onClick={() => setRun((r) => r + 1)} title="Restart stage" aria-label="Restart stage">
            ↻
          </button>
        </div>
      </header>
      <div className="progress"><div style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      <div className="rotate-tip">📱 Turn your device sideways for a bigger board.</div>

      {stage === 1 ? (
        <MatchBones
          key={`s1-${run}`}
          onProgress={onProgress}
          onNext={() => { setProgress(0); setStage(2); }}
          onExit={onExit}
        />
      ) : (
        <LabelBody
          key={`s2-${run}`}
          onProgress={onProgress}
          onReplay={() => { setProgress(0); setStage(1); setRun((r) => r + 1); }}
          onExit={onExit}
        />
      )}
    </div>
  );
}
