// Smooth the masks, write RGBA sprites, build the clean background (objects inpainted away).
const fs = require('fs');
const sharp = require('sharp');
const cvReady = require('@techstark/opencv-js');
const W = 1550, H = 835;
const OUT = process.argv[2];
const names = ['pond', 'hay', 'barn', 'house', 'tractor', 'rabbit', 'ducks', 'hen', 'cow', 'sheep']; // back to front

(async () => {
  let cv = cvReady;
  if (typeof cv.then === 'function') cv = await cv; else await new Promise(r => { cv.onRuntimeInitialized = r; });
  fs.mkdirSync(OUT, { recursive: true });
  const { data } = await sharp('base_full.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const img = cv.matFromArray(H, W, cv.CV_8UC3, Array.from(data));
  const kernel = (r) => cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(2 * r + 1, 2 * r + 1));
  const load = (n) => cv.matFromArray(H, W, cv.CV_8UC1, Array.from(fs.readFileSync(`mask_${n}.raw`)));

  const smooth = (m) => {
    const out = new cv.Mat();
    cv.GaussianBlur(m, out, new cv.Size(5, 5), 0);
    cv.threshold(out, out, 127, 255, cv.THRESH_BINARY);
    cv.erode(out, out, kernel(1));
    cv.GaussianBlur(out, out, new cv.Size(3, 3), 0);
    return out;
  };

  const masks = {}, bbox = {};
  const union = cv.Mat.zeros(H, W, cv.CV_8UC1);
  for (const n of names) {
    const raw = load(n);
    masks[n] = smooth(raw);
    cv.bitwise_or(union, raw, union);
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (masks[n].data[y * W + x] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const pad = 2;
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(W - 1, x1 + pad); y1 = Math.min(H - 1, y1 + pad);
    bbox[n] = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
    raw.delete();
  }

  // pond sprite: remove the ducks from the water first
  const ducksD = new cv.Mat(); cv.dilate(masks.ducks, ducksD, kernel(4)); cv.threshold(ducksD, ducksD, 20, 255, cv.THRESH_BINARY);
  const pondFixed = new cv.Mat(); cv.inpaint(img, ducksD, pondFixed, 6, cv.INPAINT_TELEA);
  console.log('pond water refilled');

  for (const n of names) {
    const src = n === 'pond' ? pondFixed : img;
    const b = bbox[n];
    const rgba = Buffer.alloc(b.w * b.h * 4);
    for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) {
      const si = (y + b.y) * W + (x + b.x), di = (y * b.w + x) * 4;
      rgba[di] = src.data[si * 3]; rgba[di + 1] = src.data[si * 3 + 1]; rgba[di + 2] = src.data[si * 3 + 2]; rgba[di + 3] = masks[n].data[si];
    }
    await sharp(rgba, { raw: { width: b.w, height: b.h, channels: 4 } }).webp({ quality: 88, alphaQuality: 95 }).toFile(`${OUT}/${n}.webp`);
  }

  // clean background: every cut object (grown a little) inpainted away
  const holes = new cv.Mat(); cv.dilate(union, holes, kernel(9)); cv.threshold(holes, holes, 20, 255, cv.THRESH_BINARY);
  // Fill the holes with a smooth colour field (harmonic fill at 1/4 size, SOR-accelerated),
  // which looks like soft ground instead of the streaks that inpainting leaves.
  const SW = Math.round(W / 4), SH = Math.round(H / 4);
  const small = new cv.Mat(); cv.resize(img, small, new cv.Size(SW, SH), 0, 0, cv.INTER_AREA);
  const sm = new cv.Mat(); cv.resize(holes, sm, new cv.Size(SW, SH), 0, 0, cv.INTER_NEAREST);
  const val = new Float32Array(SW * SH * 3);
  for (let i = 0; i < SW * SH * 3; i++) val[i] = small.data[i];
  const idx = []; for (let i = 0; i < SW * SH; i++) if (sm.data[i] > 127) idx.push(i);
  // start from the average of the known pixels
  const avg = [0, 0, 0]; let known = 0;
  for (let i = 0; i < SW * SH; i++) if (sm.data[i] <= 127) { for (let k = 0; k < 3; k++) avg[k] += val[i * 3 + k]; known++; }
  for (const i of idx) for (let k = 0; k < 3; k++) val[i * 3 + k] = avg[k] / known;
  const omega = 1.88;
  for (let it = 0; it < 1200; it++) {
    for (const i of idx) {
      const x = i % SW, y = (i - x) / SW;
      const l = y * SW + Math.max(0, x - 1), r = y * SW + Math.min(SW - 1, x + 1);
      const u = Math.max(0, y - 1) * SW + x, d = Math.min(SH - 1, y + 1) * SW + x;
      for (let k = 0; k < 3; k++) {
        const nv = (val[l * 3 + k] + val[r * 3 + k] + val[u * 3 + k] + val[d * 3 + k]) / 4;
        val[i * 3 + k] += omega * (nv - val[i * 3 + k]);
      }
    }
  }
  const fillSmall = cv.matFromArray(SH, SW, cv.CV_8UC3, Array.from(val, (v) => Math.max(0, Math.min(255, Math.round(v)))));
  const fillBig = new cv.Mat(); cv.resize(fillSmall, fillBig, new cv.Size(W, H), 0, 0, cv.INTER_CUBIC);
  const feather = new cv.Mat(); cv.GaussianBlur(holes, feather, new cv.Size(21, 21), 0);
  const clean = img.clone();
  for (let i = 0; i < W * H; i++) {
    const a = feather.data[i] / 255;
    if (a <= 0) continue;
    for (let k = 0; k < 3; k++) clean.data[i * 3 + k] = Math.round(clean.data[i * 3 + k] * (1 - a) + fillBig.data[i * 3 + k] * a);
  }
  console.log('background filled');  await sharp(Buffer.from(clean.data), { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 85 }).toFile(`${OUT}/background.webp`);
  await sharp(Buffer.from(clean.data), { raw: { width: W, height: H, channels: 3 } }).png().toFile('clean_preview.png');
  // grab areas: the mask outline, grown a little so small things are easy to pick up
  const hit = {};
  for (const n of names) {
    const grown = new cv.Mat(); cv.dilate(masks[n], grown, kernel(9)); cv.threshold(grown, grown, 20, 255, cv.THRESH_BINARY);
    const contours = new cv.MatVector(), hier = new cv.Mat();
    cv.findContours(grown, contours, hier, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let d = '';
    for (let i = 0; i < contours.size(); i++) {
      const c = contours.get(i);
      if (cv.contourArea(c) < 120) continue;
      const ap = new cv.Mat(); cv.approxPolyDP(c, ap, 2.5, true);
      for (let k = 0; k < ap.rows; k++) d += (k ? 'L' : 'M') + ap.data32S[k * 2] + ',' + ap.data32S[k * 2 + 1];
      d += 'Z';
      ap.delete();
    }
    hit[n] = d;
    grown.delete(); contours.delete(); hier.delete();
  }
  fs.writeFileSync(`${OUT}/farm.json`, JSON.stringify({ width: W, height: H, order: names, sprites: bbox, hit }, null, 2));
  console.log(JSON.stringify(bbox));
})();




