import { useCallback, useState } from 'react';
import MatchBones from './MatchBones.jsx';
import LabelBody from './LabelBody.jsx';
import GameHeader from '../../components/GameHeader.jsx';
import '../game.css';

const STAGES = ['Build the skeleton', 'Name the parts'];

// Chapter "The Human Body": stage 1 builds the skeleton, stage 2 names the parts.
export default function SkeletonGame({ chapter, classId, onExit }) {
  const [stage, setStage] = useState(1);
  const [run, setRun] = useState(0); // bump to restart the current stage
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p) => setProgress(p), []);

  return (
    <div className="screen game">
      <GameHeader
        chapter={chapter}
        classId={classId}
        stages={STAGES}
        stage={stage}
        progress={progress}
        onExit={onExit}
        onRestart={() => setRun((r) => r + 1)}
      />
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