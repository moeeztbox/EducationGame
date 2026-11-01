import Confetti from './Confetti.jsx';

// Full-screen "well done" card shown when a stage is finished.
export default function Celebration({ title, text, actions }) {
  return (
    <div className="celebrate-overlay" role="dialog" aria-modal="true">
      <Confetti />
      <div className="celebrate-card">
        <div className="celebrate-emoji">🎉</div>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="celebrate-actions">
          {actions.map((a) => (
            <button key={a.label} className={`btn ${a.primary ? 'btn-primary' : 'btn-ghost'}`} onClick={a.onClick}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
