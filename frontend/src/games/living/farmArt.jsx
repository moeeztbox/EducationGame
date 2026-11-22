// Vector farm scene. Everything is plain SVG so it stays sharp at any screen size.
// The scene is 1550 x 835; each object is drawn from its own (0, 0) corner.

const OL = '#3b2f4a';
const line = { stroke: OL, strokeWidth: 3.5, strokeLinejoin: 'round', strokeLinecap: 'round' };

/* ---------- objects (non-living) ---------- */

export function Barn() {
  const planks = Array.from({ length: 9 }, (_, i) => 50 + i * 33);
  return (
    <g {...line}>
      <path d="M190 14 L78 98 L45 206 L335 206 L302 98 Z" fill="#d9534d" />
      <rect x="45" y="206" width="290" height="158" fill="#d9534d" />
      <g stroke="#b83c3c" strokeWidth="3">
        {planks.map((x) => <line key={x} x1={x} y1="215" x2={x} y2="360" />)}
        {[90, 130, 170, 215, 250, 290].map((x) => <line key={x} x1={x} y1="52" x2={x} y2="200" />)}
      </g>
      <path d="M190 4 L68 92 L20 214 M190 4 L312 92 L360 214" fill="none" stroke="#eef0f6" strokeWidth="22" />
      <path d="M190 4 L68 92 L20 214 M190 4 L312 92 L360 214" fill="none" strokeWidth="3.5" />
      <rect x="45" y="206" width="290" height="158" fill="none" stroke="#fff" strokeWidth="9" />
      <rect x="45" y="206" width="290" height="158" fill="none" />
      <rect x="148" y="104" width="84" height="44" rx="4" fill="#5b3f45" />
      <g stroke="#3b2f4a" strokeWidth="2.5"><line x1="148" y1="118" x2="232" y2="118" /><line x1="148" y1="132" x2="232" y2="132" /></g>
      <rect x="126" y="256" width="128" height="108" fill="#4f9d6a" />
      <rect x="136" y="266" width="52" height="98" fill="#f3dcc0" strokeWidth="2.5" />
      <rect x="192" y="266" width="52" height="98" fill="#f3dcc0" strokeWidth="2.5" />
      <path d="M136 266 L188 364 M188 266 L136 364 M192 266 L244 364 M244 266 L192 364" fill="none" stroke="#9c6b4e" strokeWidth="3" />
    </g>
  );
}

export function Hay() {
  return (
    <g {...line}>
      <path d="M4 146 C0 64 40 14 86 4 C124 22 148 84 148 146 Z" fill="#f2b93f" />
      <g fill="none" stroke="#c98a1c" strokeWidth="3">
        <path d="M24 130 C50 100 80 80 100 40" />
        <path d="M50 140 C80 108 104 84 124 60" />
        <path d="M14 100 C34 80 56 56 70 20" />
        <path d="M86 140 C110 118 126 100 138 84" />
        <path d="M30 144 C60 126 86 122 130 122" />
      </g>
    </g>
  );
}

export function House() {
  return (
    <g {...line}>
      <rect x="226" y="124" width="84" height="94" fill="#f4f4f8" />
      <path d="M214 128 L236 98 L296 98 L312 128 Z" fill="#c8374f" />
      <rect x="244" y="152" width="34" height="34" fill="#f9d878" strokeWidth="3" />
      <path d="M261 152 V186 M244 169 H278" fill="none" strokeWidth="2.5" />
      <rect x="32" y="96" width="196" height="124" fill="#f4f4f8" />
      <rect x="32" y="204" width="196" height="16" fill="#c8374f" strokeWidth="2.5" />
      <path d="M2 102 L130 8 L258 102 Z" fill="#c8374f" />
      <path d="M26 96 L130 24 L234 96" fill="none" stroke="#e86b7f" strokeWidth="6" strokeLinecap="round" />
      <path d="M96 100 L130 40 L164 100 Z" fill="#f4f4f8" strokeWidth="2.5" />
      <rect x="112" y="58" width="36" height="34" fill="#f9d878" strokeWidth="3" />
      <path d="M130 58 V92 M112 75 H148" fill="none" strokeWidth="2.5" />
      <rect x="50" y="128" width="36" height="38" fill="#f9d878" strokeWidth="3" />
      <path d="M68 128 V166 M50 147 H86" fill="none" strokeWidth="2.5" />
      <rect x="174" y="128" width="36" height="38" fill="#f9d878" strokeWidth="3" />
      <path d="M192 128 V166 M174 147 H210" fill="none" strokeWidth="2.5" />
      <path d="M104 220 V162 Q104 146 124 146 Q144 146 144 162 V220 Z" fill="#8fb59a" />
      <circle cx="136" cy="190" r="3" fill={OL} stroke="none" />
      <rect x="98" y="218" width="52" height="8" fill="#d9d9e0" strokeWidth="2.5" />
    </g>
  );
}

export function Tractor() {
  return (
    <g {...line}>
      <rect x="112" y="14" width="7" height="40" fill="#6b7280" />
      <path d="M34 54 L34 16 L88 16 L92 54" fill="#cfe9f7" />
      <rect x="28" y="10" width="68" height="9" rx="3" fill="#c93a3a" />
      <path d="M62 18 V54" fill="none" strokeWidth="3" />
      <path d="M8 60 Q10 46 30 46 L96 46 L122 52 Q128 54 128 66 V86 H14 Q6 86 8 70 Z" fill="#d9403a" />
      <rect x="96" y="56" width="26" height="6" rx="3" fill="#a52d2d" strokeWidth="2.5" />
      <circle cx="40" cy="80" r="29" fill="#3a3a45" />
      <circle cx="40" cy="80" r="13" fill="#c7cbd4" strokeWidth="3" />
      <circle cx="40" cy="80" r="4" fill="#6b7280" strokeWidth="2" />
      <circle cx="104" cy="92" r="17" fill="#3a3a45" />
      <circle cx="104" cy="92" r="7" fill="#c7cbd4" strokeWidth="2.5" />
    </g>
  );
}

export function Pond() {
  return (
    <g {...line}>
      <path d="M0 16 C120 0 300 8 420 42 C520 70 548 122 584 160 C604 184 624 206 640 225 L0 225 Z" fill="#a7d1ec" stroke="#5f9ac4" strokeWidth="5" />
      <g fill="none" stroke="#d3eaf8" strokeWidth="3.5">
        <path d="M40 60 Q120 40 200 60" />
        <path d="M250 40 Q340 36 400 70" />
        <path d="M60 150 Q150 130 240 150" />
        <path d="M300 130 Q380 118 450 150" />
        <path d="M400 190 Q470 180 520 210" />
        <path d="M20 205 Q80 190 140 208" />
      </g>
    </g>
  );
}

/* ---------- animals (living) ---------- */

export function Cow() {
  return (
    <g {...line}>
      <path d="M232 70 C252 90 256 130 248 160" fill="none" stroke="#b5543c" strokeWidth="7" />
      <ellipse cx="248" cy="166" rx="8" ry="12" fill="#6b3b2a" />
      {[[105, 140], [133, 148], [186, 140], [214, 148]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 11} y={y} width="22" height="46" rx="6" fill="#fff" />
          <rect x={x - 11} y={y + 36} width="22" height="14" rx="4" fill="#4a4358" />
        </g>
      ))}
      <ellipse cx="166" cy="98" rx="94" ry="58" fill="#fff" />
      <ellipse cx="190" cy="60" rx="26" ry="18" fill="#b5543c" stroke="none" />
      <ellipse cx="224" cy="104" rx="16" ry="30" fill="#b5543c" stroke="none" />
      <ellipse cx="136" cy="118" rx="18" ry="22" fill="#b5543c" stroke="none" />
      <path d="M150 146 Q166 168 182 146" fill="#f6a7b5" />
      <path d="M52 22 Q40 4 54 -2 Q64 10 62 26 Z M96 22 Q108 4 94 -2 Q84 10 86 26 Z" fill="#cfcad6" />
      <ellipse cx="38" cy="58" rx="22" ry="12" fill="#fff" transform="rotate(30 38 58)" />
      <ellipse cx="108" cy="58" rx="22" ry="12" fill="#fff" transform="rotate(-30 108 58)" />
      <circle cx="74" cy="66" r="44" fill="#fff" />
      <ellipse cx="66" cy="34" rx="26" ry="14" fill="#b5543c" stroke="none" />
      <ellipse cx="72" cy="98" rx="34" ry="24" fill="#f6a7b5" />
      <ellipse cx="60" cy="98" rx="5" ry="8" fill="#9b4a63" stroke="none" />
      <ellipse cx="86" cy="98" rx="5" ry="8" fill="#9b4a63" stroke="none" />
      <circle cx="54" cy="58" r="8" fill="#fff" strokeWidth="2.5" />
      <circle cx="92" cy="58" r="8" fill="#fff" strokeWidth="2.5" />
      <circle cx="56" cy="60" r="4" fill={OL} stroke="none" />
      <circle cx="90" cy="60" r="4" fill={OL} stroke="none" />
    </g>
  );
}

export function Hen() {
  return (
    <g {...line}>
      <path d="M92 70 C84 28 112 6 134 22 C136 42 124 60 110 78 Z" fill="#c63a4a" />
      <path d="M96 74 C96 44 116 30 136 34 C128 54 116 70 104 82 Z" fill="#3fa65b" />
      <path d="M98 80 C100 56 116 44 130 46 C124 62 114 74 104 86 Z" fill="#f2a43a" />
      <path d="M44 128 V134 M72 128 V134 M38 134 H50 M66 134 H78" fill="none" stroke="#e8a22c" strokeWidth="5" />
      <ellipse cx="64" cy="96" rx="42" ry="36" fill="#f08a3a" />
      <path d="M44 96 Q64 78 86 96" fill="none" stroke="#c96a1e" strokeWidth="3" />
      <path d="M40 104 Q62 120 84 104" fill="none" stroke="#c96a1e" strokeWidth="3" />
      <circle cx="40" cy="44" r="25" fill="#fdf3e4" />
      <path d="M26 26 Q22 6 34 12 Q38 2 46 12 Q56 8 52 28 Z" fill="#d93a3a" />
      <path d="M14 46 L-2 52 L14 58 Z" fill="#f2b630" />
      <ellipse cx="22" cy="68" rx="7" ry="11" fill="#d93a3a" />
      <circle cx="34" cy="42" r="3.6" fill={OL} stroke="none" />
    </g>
  );
}

export function Rabbit() {
  return (
    <g {...line}>
      <circle cx="108" cy="68" r="11" fill="#fff" />
      <ellipse cx="68" cy="68" rx="42" ry="26" fill="#d5d5de" />
      <ellipse cx="22" cy="14" rx="9" ry="22" fill="#d5d5de" transform="rotate(-12 22 14)" />
      <ellipse cx="44" cy="12" rx="9" ry="22" fill="#d5d5de" transform="rotate(10 44 12)" />
      <ellipse cx="22" cy="14" rx="4" ry="14" fill="#f4a9b5" stroke="none" transform="rotate(-12 22 14)" />
      <ellipse cx="44" cy="12" rx="4" ry="14" fill="#f4a9b5" stroke="none" transform="rotate(10 44 12)" />
      <circle cx="34" cy="50" r="24" fill="#d5d5de" />
      <circle cx="26" cy="46" r="3.6" fill={OL} stroke="none" />
      <circle cx="44" cy="46" r="3.6" fill={OL} stroke="none" />
      <path d="M31 56 L37 56 L34 61 Z" fill="#f08aa0" strokeWidth="2" />
      <path d="M34 61 V66 M28 68 Q34 71 40 68" fill="none" strokeWidth="2" />
      <ellipse cx="48" cy="90" rx="14" ry="6" fill="#d5d5de" />
      <ellipse cx="80" cy="90" rx="16" ry="6" fill="#d5d5de" />
    </g>
  );
}

function Duck({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} {...line} strokeWidth={3.5 / s}>
      <ellipse cx="62" cy="104" rx="70" ry="12" fill="none" stroke="#9cc6e4" strokeWidth={3 / s} />
      <path d="M8 74 C-2 56 12 46 26 54 C20 70 22 78 36 84 Z" fill="#f4c21d" />
      <ellipse cx="58" cy="82" rx="50" ry="26" fill="#f8d23c" />
      <path d="M34 82 Q58 62 84 80" fill="none" stroke="#d9a516" strokeWidth={3 / s} />
      <path d="M86 72 C96 60 100 40 96 24 C100 8 124 8 128 24 C130 34 120 38 116 46 C114 60 112 72 106 80 Z" fill="#f8d23c" />
      <path d="M124 22 L146 28 L124 34 Z" fill="#f08a2e" />
      <circle cx="114" cy="22" r="3.6" fill={OL} stroke="none" />
    </g>
  );
}

export function Ducks() {
  return (
    <g>
      <Duck x={0} y={30} s={1.25} />
      <Duck x={200} y={96} s={0.62} />
      <Duck x={262} y={56} s={0.46} />
      <Duck x={274} y={126} s={0.46} />
      <Duck x={176} y={150} s={0.46} />
    </g>
  );
}

export function Sheep() {
  const wool = '#f6f6fa';
  return (
    <g {...line}>
      {[[42, 100], [66, 100], [104, 100], [128, 100]].map(([x, y], i) => (
        <rect key={i} x={x - 4} y={y} width="9" height="34" rx="3" fill="#5a4636" />
      ))}
      {[[22, 66, 24], [44, 48, 28], [74, 40, 30], [104, 48, 28], [128, 66, 26], [112, 88, 26], [80, 92, 28], [44, 90, 26], [20, 86, 20]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={wool} />
      ))}
      <g transform="translate(118 58)">
        <ellipse cx="32" cy="30" rx="20" ry="25" fill="#f1d3b3" />
        <circle cx="16" cy="6" r="16" fill={wool} />
        <circle cx="38" cy="2" r="14" fill={wool} />
        <ellipse cx="8" cy="34" rx="8" ry="14" fill="#e2b894" transform="rotate(18 8 34)" />
        <circle cx="38" cy="26" r="3.6" fill={OL} stroke="none" />
        <path d="M44 42 Q38 48 32 44" fill="none" strokeWidth="2.5" />
        <ellipse cx="46" cy="36" rx="3.5" ry="2.5" fill="#d9967a" stroke="none" />
      </g>
    </g>
  );
}

/* ---------- scenery (not draggable) ---------- */

const Tuft = ({ x, y, s = 1 }) => (
  <path d={`M${x} ${y} q${6 * s} ${-12 * s} ${10 * s} 0 q${4 * s} ${-14 * s} ${10 * s} 0 q${6 * s} ${-10 * s} ${10 * s} 0`} fill="none" stroke="#5f9f3a" strokeWidth="3" strokeLinecap="round" />
);
const Daisy = ({ x, y }) => (
  <g>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - 8} rx="4" ry="7" fill="#fff" transform={`rotate(${a} ${x} ${y})`} />)}
    <circle cx={x} cy={y} r="4" fill="#f6c935" />
  </g>
);

export function Scenery() {
  return (
    <g>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0f5" /><stop offset="1" stopColor="#e6f6fd" /></linearGradient>
      </defs>
      <rect width="1550" height="835" fill="url(#skyG)" />
      <g stroke="#f6c935" strokeWidth="5" strokeLinecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i * 36 * Math.PI) / 180;
          return <line key={i} x1={1010 + Math.cos(a) * 52} y1={86 + Math.sin(a) * 52} x2={1010 + Math.cos(a) * 68} y2={86 + Math.sin(a) * 68} />;
        })}
      </g>
      <circle cx="1010" cy="86" r="40" fill="#fde047" stroke="#f6c935" strokeWidth="4" />
      <g fill="#fff" stroke="#c9dff0" strokeWidth="3">
        <path d="M470 70 q-30 0 -30 -22 q0 -22 28 -20 q10 -26 40 -22 q30 4 30 28 q30 -2 30 18 q0 18 -30 18 Z" />
        <path d="M850 62 q-26 0 -26 -18 q0 -18 24 -16 q8 -22 34 -18 q26 4 26 24 q26 -2 26 14 q0 14 -26 14 Z" />
        <path d="M150 110 q-24 0 -24 -16 q0 -16 22 -14 q8 -20 32 -16 q24 4 24 22 q22 0 22 12 q0 12 -24 12 Z" />
      </g>

      <path d="M0 300 C150 230 350 232 520 286 C700 340 900 262 1100 252 C1300 242 1450 282 1550 266 V835 H0 Z" fill="#a3d46f" />
      <g fill="#7fc04f" stroke="#5f9f3a" strokeWidth="3">
        {[420, 500, 590, 680, 760].map((x, i) => <circle key={x} cx={x} cy={196 + (i % 2) * 6} r={30 + (i % 3) * 5} />)}
      </g>
      <path d="M380 290 C500 200 760 192 900 252 L1000 334 C800 374 600 392 470 402 C400 382 360 332 380 290 Z" fill="#f2d17f" stroke="#d6aa4a" strokeWidth="4" />
      <g fill="none" stroke="#e1b95e" strokeWidth="4">
        <path d="M410 300 C540 232 740 224 880 268" />
        <path d="M416 330 C560 262 740 258 920 306" />
        <path d="M430 360 C580 296 760 296 950 336" />
      </g>
      <path d="M740 300 L1170 292 L1110 392 L700 392 Z" fill="#e8943e" stroke="#b9702a" strokeWidth="4" />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <path d={`M${770 + i * 44} ${320 + (i % 2) * 6} l8 -18 l8 18 Z`} fill="#4fa63c" />
          <path d={`M${740 + i * 44} ${362 - (i % 2) * 4} l8 -18 l8 18 Z`} fill="#4fa63c" />
        </g>
      ))}
      <g fill="#fff" stroke="#d3d6de" strokeWidth="3">
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={930 + i * 30} y={158 + (i % 2) * 6} width="22" height="70" rx="10" />)}
      </g>
      <g {...line}>
        <path d="M1000 232 V186 L1040 156 L1080 186 V232 Z" fill="#d9534d" />
        <path d="M994 190 L1040 150 L1086 190" fill="none" stroke="#eef0f6" strokeWidth="9" />
        <path d="M1024 232 V204 Q1040 190 1056 204 V232 Z" fill="#5b3f45" />
      </g>

      <path d="M0 420 C250 380 500 380 800 402 C1100 424 1350 380 1550 360 V835 H0 Z" fill="#94cb5c" />
      <path d="M0 560 C300 520 700 540 1000 560 C1250 580 1450 540 1550 520 V835 H0 Z" fill="#8cc563" />
      <path d="M1290 262 C1332 330 1332 384 1232 424 C1122 464 1052 504 962 562 C862 642 822 742 762 835 L1010 835 C1050 742 1130 652 1262 592 C1400 532 1470 452 1402 382 C1372 342 1344 300 1322 262 Z" fill="#f0d78c" stroke="#d6b65e" strokeWidth="4" />

      <g fill="none">
        <Tuft x={940} y={500} /><Tuft x={560} y={640} /><Tuft x={1180} y={640} s={1.2} /><Tuft x={300} y={420} />
        <Tuft x={1380} y={470} /><Tuft x={640} y={470} /><Tuft x={1130} y={780} /><Tuft x={420} y={780} s={1.2} />
      </g>
      <Daisy x={60} y={420} /><Daisy x={120} y={440} /><Daisy x={600} y={450} /><Daisy x={300} y={520} />
      <Daisy x={900} y={690} /><Daisy x={1220} y={700} /><Daisy x={1460} y={640} />
      <g {...line}>
        <path d="M160 548 V572 M184 556 V578" fill="none" stroke="#3f8f3a" strokeWidth="4" />
        <circle cx="160" cy="542" r="9" fill="#d93a3a" /><circle cx="184" cy="550" r="9" fill="#d93a3a" />
        <circle cx="160" cy="542" r="3" fill="#f6c935" stroke="none" /><circle cx="184" cy="550" r="3" fill="#f6c935" stroke="none" />
        <path d="M966 835 V752" fill="none" stroke="#3f8f3a" strokeWidth="7" />
        <path d="M966 790 q-30 -6 -34 -28 q26 0 34 22 Z M966 800 q28 -6 32 -26 q-24 0 -32 20 Z" fill="#59b24a" />
        {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx="966" cy="718" rx="11" ry="26" fill="#f6c935" transform={`rotate(${i * 36} 966 740)`} />)}
        <circle cx="966" cy="740" r="19" fill="#b5651d" />
      </g>
    </g>
  );
}
