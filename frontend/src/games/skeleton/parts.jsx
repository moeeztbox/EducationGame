import { Bone, Ball, Limb, Mirror, SkinShape, BLUE, INK } from './draw.jsx';

// Every part is drawn directly at its final position on the body (scene is 1000 wide,
// body centred on x=500). Right-hand parts are the left ones mirrored.

const white = { fill: '#fff', stroke: BLUE, strokeWidth: 4.5, strokeLinejoin: 'round' };

/* ---------- bone art ---------- */

function Skull({ fx = {} }) {
  return (
    <g>
      <path d="M470 138 Q470 164 500 166 Q530 164 530 138" {...white} />
      <path
        d="M500 50 C462 50 448 84 455 110 C458 122 466 128 470 134 L472 148 Q500 154 528 148 L530 134 C534 128 542 122 545 110 C552 84 538 50 500 50 Z"
        {...white}
      />
      <g key={`e${fx.eyes || 0}`} className={fx.eyes ? 'fx-eyes play' : 'fx-eyes'}>
        <ellipse cx="482" cy="98" rx="11" ry="13" fill={INK} />
        <ellipse cx="518" cy="98" rx="11" ry="13" fill={INK} />
        <circle cx="479" cy="93" r="3" fill="#fff" />
        <circle cx="515" cy="93" r="3" fill="#fff" />
      </g>
      <g key={`n${fx.nose || 0}`} className={fx.nose ? 'fx-nose play' : 'fx-nose'}>
        <path d="M500 112 L492 130 Q500 125 508 130 Z" fill={INK} />
      </g>
      <rect x="484" y="134" width="32" height="13" rx="3" fill="#fff" stroke={BLUE} strokeWidth="3" />
      {[492, 500, 508].map((x) => (
        <line key={x} x1={x} y1="134" x2={x} y2="147" stroke={BLUE} strokeWidth="2" />
      ))}
    </g>
  );
}

function Ribs() {
  const ys = [190, 208, 226, 244, 262];
  const scale = [1, 1, 0.96, 0.9, 0.82];
  const rib = (y, s, d) =>
    `M${500 + d * 5} ${y} C${500 + d * 48 * s} ${y - 10} ${500 + d * 66 * s} ${y + 12} ${500 + d * 46 * s} ${y + 36} Q${500 + d * 26 * s} ${y + 44} ${500 + d * 8} ${y + 34}`;
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={493 - i * 0.2} y={168 + i * 13} width={14 + i * 0.4} height="10" rx="3" fill="#fff" stroke={BLUE} strokeWidth="3" />
      ))}
      {ys.map((y, i) =>
        [-1, 1].map((d) => (
          <g key={`${i}${d}`} fill="none" strokeLinecap="round">
            <path d={rib(y, scale[i], d)} stroke={BLUE} strokeWidth="12" />
            <path d={rib(y, scale[i], d)} stroke="#fff" strokeWidth="6.5" />
          </g>
        )),
      )}
      {[-1, 1].map((d) => (
        <g key={`c${d}`} fill="none" strokeLinecap="round">
          <path d={`M${500 + d * 3} 188 Q${500 + d * 30} 176 ${500 + d * 62} 186`} stroke={BLUE} strokeWidth="11" />
          <path d={`M${500 + d * 3} 188 Q${500 + d * 30} 176 ${500 + d * 62} 186`} stroke="#fff" strokeWidth="6" />
        </g>
      ))}
      <path d="M493 184 H507 L506 262 L500 276 L494 262 Z" {...white} />
    </g>
  );
}

function Hips() {
  return (
    <g>
      {[300, 313, 326].map((y) => (
        <rect key={y} x="492" y={y} width="16" height="10" rx="3" fill="#fff" stroke={BLUE} strokeWidth="3" />
      ))}
      <path
        d="M440 346 C432 368 448 406 478 412 L500 394 L522 412 C552 406 568 368 560 346 C548 332 524 338 500 352 C476 338 452 332 440 346 Z"
        {...white}
      />
      <ellipse cx="472" cy="378" rx="9" ry="13" fill="#cfe3f7" stroke={BLUE} strokeWidth="3" />
      <ellipse cx="528" cy="378" rx="9" ry="13" fill="#cfe3f7" stroke={BLUE} strokeWidth="3" />
      <path d="M490 340 L510 340 L500 382 Z" fill="#e6f1fb" stroke={BLUE} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

function Arm() {
  return (
    <g>
      <Bone x1={432} y1={192} x2={392} y2={282} w={15} />
      <Bone x1={388} y1={292} x2={360} y2={358} w={8} />
      <Bone x1={400} y1={292} x2={372} y2={360} w={8} />
      <Ball cx={432} cy={192} r={13} />
      <Ball cx={392} cy={284} r={11} />
    </g>
  );
}

function Hand() {
  const fingers = [[343, 394, 8], [353, 396, 11], [364, 396, 10], [374, 392, 7]];
  return (
    <g>
      {fingers.map(([x, y, len], i) => (
        <g key={i}>
          <Bone x1={x} y1={y} x2={x - 4} y2={y + len + 6} w={5} />
          <Bone x1={x - 4} y1={y + len + 6} x2={x - 8} y2={y + len * 2 + 8} w={4.5} />
        </g>
      ))}
      <Bone x1={378} y1={372} x2={398} y2={388} w={5.5} />
      <Bone x1={398} y1={388} x2={408} y2={402} w={5} />
      <path d="M340 360 Q360 350 380 362 L376 394 Q358 404 338 396 Z" {...white} />
    </g>
  );
}

function Leg() {
  return (
    <g>
      <Bone x1={470} y1={402} x2={464} y2={497} w={17} />
      <Bone x1={464} y1={507} x2={458} y2={566} w={13} />
      <Bone x1={475} y1={507} x2={471} y2={560} w={7} />
      <Ball cx={470} cy={400} r={13} />
      <Ball cx={464} cy={500} r={13} />
    </g>
  );
}

function Foot() {
  return (
    <g>
      <path
        d="M450 576 L470 576 C474 590 470 604 456 606 L420 606 C412 606 412 596 420 594 L446 590 Z"
        {...white}
      />
      <path d="M424 606 V598 M432 606 V596 M440 606 V594" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/* ---------- skin art (the child's body that the bones go into) ---------- */

const HeadSkin = () => (
  <SkinShape>
    <rect x="482" y="150" width="36" height="42" rx="10" />
    <circle cx="500" cy="104" r="58" />
  </SkinShape>
);
const RibsSkin = () => (
  <SkinShape>
    <path d="M434 186 Q500 168 566 186 L574 312 L426 312 Z" />
  </SkinShape>
);
const HipsSkin = () => (
  <SkinShape>
    <path d="M426 306 L574 306 L584 404 Q500 422 416 404 Z" />
  </SkinShape>
);
const ArmSkin = () => <Limb pts={[[432, 194], [392, 284], [362, 364]]} w={34} />;
const HandSkin = () => (
  <SkinShape>
    <circle cx="352" cy="394" r="32" />
  </SkinShape>
);
const LegSkin = () => <Limb pts={[[474, 398], [466, 497], [458, 576]]} w={46} />;
const FootSkin = () => (
  <SkinShape>
    <ellipse cx="438" cy="598" rx="42" ry="18" />
  </SkinShape>
);

/* ---------- part table ---------- */

const mirrorBox = ([x, y, w, h]) => [1000 - x - w, y, w, h];
const mirrorPt = ([x, y]) => [1000 - x, y];

// Listed back-to-front. `box` is the grab area, `center` the rotation origin at home.
const left = (id, name, Art, Skin, box, center) => ({ id, name, Art, Skin, box, center, mirror: false });
const right = (id, name, Art, Skin, box, center) => ({
  id, name, Art, Skin, box: mirrorBox(box), center: mirrorPt(center), mirror: true,
});

export const PARTS = [
  left('legL', 'Left leg', Leg, LegSkin, [432, 386, 80, 200], [466, 490]),
  right('legR', 'Right leg', Leg, LegSkin, [432, 386, 80, 200], [466, 490]),
  left('footL', 'Left foot', Foot, FootSkin, [402, 570, 82, 46], [440, 590]),
  right('footR', 'Right foot', Foot, FootSkin, [402, 570, 82, 46], [440, 590]),
  left('hips', 'Hips', Hips, HipsSkin, [428, 296, 144, 126], [500, 362]),
  left('ribs', 'Ribs', Ribs, RibsSkin, [428, 164, 144, 150], [500, 238]),
  left('armL', 'Left arm', Arm, ArmSkin, [336, 170, 126, 206], [398, 275]),
  right('armR', 'Right arm', Arm, ArmSkin, [336, 170, 126, 206], [398, 275]),
  left('handL', 'Left hand', Hand, HandSkin, [328, 348, 90, 90], [368, 396]),
  right('handR', 'Right hand', Hand, HandSkin, [328, 348, 90, 90], [368, 396]),
  left('head', 'Head', Skull, HeadSkin, [440, 44, 120, 128], [500, 108]),
];

export function PartArt({ part, fx }) {
  const Art = part.Art;
  const node = <Art fx={fx} />;
  return part.mirror ? <Mirror>{node}</Mirror> : node;
}

export function PartSkin({ part }) {
  const Skin = part.Skin;
  const node = <Skin />;
  return part.mirror ? <Mirror>{node}</Mirror> : node;
}

// Wrapper that plays a CSS animation (see skeleton.css, `.pt-<id>.play`) whenever
// `playKey` changes. Remounting via `key` restarts the animation.
export function PartGroup({ id, playKey = 0, children, style }) {
  return (
    <g key={playKey} className={`pt-${id}${playKey ? ' play' : ''}`} style={style}>
      {children}
    </g>
  );
}
