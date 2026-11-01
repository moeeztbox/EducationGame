import { CLASSES } from '../data/curriculum.js';

export default function ClassSelect({ onBack, onPick }) {
  return (
    <div className="screen menu">
      <button className="btn btn-ghost back" onClick={onBack}>← Back</button>
      <h1 className="menu-title">Choose your class</h1>
      <div className="card-grid">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            className={`pick-card ${c.open ? '' : 'locked'}`}
            style={{ '--c': c.color }}
            disabled={!c.open}
            onClick={() => onPick(c.id)}
          >
            <span className="pick-emoji">{c.emoji}</span>
            <span className="pick-name">{c.name}</span>
            {!c.open && <span className="pick-tag">🔒 Coming soon</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
