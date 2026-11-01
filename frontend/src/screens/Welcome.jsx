export default function Welcome({ onStart }) {
  return (
    <div className="screen welcome">
      <span className="float f1">🦴</span>
      <span className="float f2">🔬</span>
      <span className="float f3">📚</span>
      <span className="float f4">⭐</span>
      <span className="float f5">🧠</span>
      <div className="welcome-card">
        <div className="logo">🎒</div>
        <h1>Learn &amp; Play</h1>
        <p>Fun games that make lessons easy.</p>
        <button className="btn btn-primary btn-big" onClick={onStart}>
          Start Playing ▶
        </button>
      </div>
    </div>
  );
}
