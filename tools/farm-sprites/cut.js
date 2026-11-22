// Cut the objects out of base_full.png with GrabCut, inpaint the holes, write sprites.
const fs = require('fs');
const sharp = require('sharp');
const polys = require('./polys.js');
const cvReady = require('@techstark/opencv-js');

const W = 1550, H = 835;
const RECTS = {
  cow: { rect: [618, 325, 892, 532], fg: [[680, 395, 18], [790, 425, 22], [840, 440, 12]], extra: [[[700,508],[712,500],[740,500],[750,512],[746,520],[722,523],[702,520]], [[806,505],[820,498],[850,500],[864,508],[858,519],[830,522],[810,518]], [[870,440],[882,440],[886,470],[884,498],[875,500],[872,470]]] },
  duck_a: { rect: [78, 578, 262, 738], fg: [[150, 690, 18], [215, 610, 5]], group: 'ducks' },
  duck_b: { rect: [268, 698, 398, 798], fg: [[340, 765, 14]], group: 'ducks' },
  duck_c: { rect: [398, 718, 448, 778], fg: [[422, 748, 8]], group: 'ducks' },
  duck_d: { rect: [442, 758, 502, 822], fg: [[470, 792, 8]], group: 'ducks' },
  duck_e: { rect: [214, 792, 284, 835], fg: [[248, 818, 8]], group: 'ducks' },
  duck_f: { rect: [345, 788, 410, 835], fg: [[378, 818, 8]], group: 'ducks' },
};
const POLY = { barn: [10, 14], house: [8, 16], hay: [8, 12, 1], pond: [10, 14], hen: [3, 7], rabbit: [3, 7, 1], tractor: [4, 8, 1], sheep: [4, 8] }; // [core erode, band]

(async () => {
  let cv = cvReady;
  if (typeof cv.then === 'function') cv = await cv; else await new Promise(r => { cv.onRuntimeInitialized = r; });

  const { data } = await sharp('base_full.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const img = cv.matFromArray(H, W, cv.CV_8UC3, Array.from(data));

  const kernel = (r) => cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(2 * r + 1, 2 * r + 1));
  const polyMat = (pts, fill = 255) => {
    const m = cv.Mat.zeros(H, W, cv.CV_8UC1);
    const mv = new cv.MatVector();
    mv.push_back(cv.matFromArray(pts.length, 1, cv.CV_32SC2, pts.flat()));
    cv.fillPoly(m, mv, new cv.Scalar(fill));
    mv.delete();
    return m;
  };

  const runGrabCut = (init) => { // init: Mat(H,W,8UC1) with GC labels; returns binary mask 0/255
    const bg = new cv.Mat(), fg = new cv.Mat();
    cv.grabCut(img, init, new cv.Rect(0, 0, 0, 0), bg, fg, 6, cv.GC_INIT_WITH_MASK);
    const out = new cv.Mat(H, W, cv.CV_8UC1);
    for (let i = 0; i < init.data.length; i++) out.data[i] = (init.data[i] === 1 || init.data[i] === 3) ? 255 : 0;
    bg.delete(); fg.delete();
    return out;
  };

  const cleanMask = (m, minArea) => {
    const k = kernel(2);
    cv.morphologyEx(m, m, cv.MORPH_OPEN, k);
    cv.morphologyEx(m, m, cv.MORPH_CLOSE, kernel(4));
    const contours = new cv.MatVector(), hier = new cv.Mat();
    cv.findContours(m, contours, hier, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    const out = cv.Mat.zeros(H, W, cv.CV_8UC1);
    for (let i = 0; i < contours.size(); i++) {
      if (cv.contourArea(contours.get(i)) >= minArea) cv.drawContours(out, contours, i, new cv.Scalar(255), -1);
    }
    contours.delete(); hier.delete(); k.delete();
    return out;
  };

  const masks = {};
  // rectangle + seed objects
  for (const [name, o] of Object.entries(RECTS)) {
    const init = cv.Mat.zeros(H, W, cv.CV_8UC1); // 0 = GC_BGD
    const [x0, y0, x1, y1] = o.rect;
    for (let y = y0; y < Math.min(y1, H); y++) for (let x = x0; x < Math.min(x1, W); x++) init.data[y * W + x] = 3; // PR_FGD
    // frame of probable background so the object has to prove itself
    for (let y = y0; y < Math.min(y1, H); y++) for (let x = x0; x < Math.min(x1, W); x++) {
      if (x < x0 + 5 || x > x1 - 6 || y < y0 + 5 || y > y1 - 6) init.data[y * W + x] = 2; // PR_BGD
    }
    for (const [cx, cy, r] of o.fg) cv.circle(init, new cv.Point(cx, cy), r, new cv.Scalar(1), -1);
    const res = runGrabCut(init);
    const cm = cleanMask(res, 150);
    for (const poly of (o.extra || [])) { const pmx = polyMat(poly); cv.bitwise_or(cm, pmx, cm); pmx.delete(); }
    masks[name] = { m: cm, group: o.group || name };
    init.delete(); res.delete();
    console.log('cut', name);
  }
  // polygon objects: certain core, probable band, background elsewhere
  for (const [name, [er, band, direct]] of Object.entries(POLY)) {
    const pm = polyMat(polys[name][0]);
    if (direct) { masks[name] = { m: pm, group: name }; console.log('direct', name); continue; }
    const core = new cv.Mat(); cv.erode(pm, core, kernel(er));
    const wide = new cv.Mat(); cv.dilate(pm, wide, kernel(band));
    const init = cv.Mat.zeros(H, W, cv.CV_8UC1);
    for (let i = 0; i < init.data.length; i++) {
      if (core.data[i]) init.data[i] = 1; else if (pm.data[i]) init.data[i] = 3; else if (wide.data[i]) init.data[i] = 2;
    }
    const res = runGrabCut(init);
    masks[name] = { m: cleanMask(res, 400), group: name };
    pm.delete(); core.delete(); wide.delete(); init.delete(); res.delete();
    console.log('cut', name);
  }

  // merge groups (ducks)
  const groups = {};
  for (const { m, group } of Object.values(masks)) {
    if (!groups[group]) groups[group] = cv.Mat.zeros(H, W, cv.CV_8UC1);
    cv.bitwise_or(groups[group], m, groups[group]);
  }

  // keep the cut masks for the next step
  for (const [g, m] of Object.entries(groups)) {
    fs.writeFileSync(`mask_${g}.raw`, Buffer.from(m.data));
  }
  console.log('groups:', Object.keys(groups).join(', '));
})();




