import { useState } from 'react';

const COLORS = ['#f87171', '#facc15', '#4ade80', '#60a5fa', '#c084fc', '#fb923c'];

export default function Confetti({ count = 70 }) {
  const [bits] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      dur: 2.2 + Math.random() * 2,
      color: COLORS[i % COLORS.length],
      w: 8 + Math.random() * 8,
      h: 12 + Math.random() * 10,
    })),
  );
  return (
    <div className="confetti-wrap" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `${b.left}%`,
            width: b.w,
            height: b.h,
            background: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
