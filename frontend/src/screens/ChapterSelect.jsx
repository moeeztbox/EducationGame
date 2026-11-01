import { CHAPTERS, findClass } from '../data/curriculum.js';

export default function ChapterSelect({ classId, onBack, onPick }) {
  const cls = findClass(classId);
  const chapters = CHAPTERS[classId] || [];
  return (
    <div className="screen menu">
      <button className="btn btn-ghost back" onClick={onBack}>← Back</button>
      <p className="menu-sub">{cls?.name}</p>
      <h1 className="menu-title">Choose a chapter</h1>
      <div className="card-grid wide">
        {chapters.map((c) => (
          <button
            key={c.id}
            className={`pick-card ${c.open ? '' : 'locked'}`}
            style={{ '--c': c.color }}
            disabled={!c.open}
            onClick={() => onPick(c.id)}
          >
            <span className="pick-emoji">{c.emoji}</span>
            <span className="pick-num">Chapter {c.id}</span>
            <span className="pick-name">{c.title}</span>
            <span className="pick-sub">{c.subject}</span>
            {!c.open && <span className="pick-tag">🔒 Coming soon</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
