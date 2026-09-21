// One-off: generate src/app/icon.png (512) and src/app/apple-icon.png (180)
// from the high-res logo master. Crops to the alpha bounding box, pads onto
// a transparent square, then box-samples down. Pure Node (no deps).
// Run: node scripts/make-icons.mjs
import fs from "node:fs";
import zlib from "node:zlib";

function decodePNG(path) {
  const buf = fs.readFileSync(path);
  let pos = 8;
  let w, h, bitDepth, colorType;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      w = buf.readUInt32BE(pos + 8);
      h = buf.readUInt32BE(pos + 12);
      bitDepth = buf[pos + 16];
      colorType = buf[pos + 17];
    } else if (type === "IDAT") {
      idat.push(data);
    }
    pos += 12 + len;
  }
  if (bitDepth !== 8 || colorType !== 6) {
    throw new Error(`Unsupported PNG: depth=${bitDepth} color=${colorType}`);
  }
  const bpp = 4;
  const stride = w * bpp + 1;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * stride];
    const row = out.subarray(y * stride, (y + 1) * stride);
    for (let i = 1; i < stride; i++) {
      const x = raw[y * stride + i];
      const a = i > bpp ? row[i - bpp] : 0;
      const b = y > 0 ? out[(y - 1) * stride + i] : 0;
      const c = y > 0 && i > bpp ? out[(y - 1) * stride + i - bpp] : 0;
      let v = x;
      if (filter === 1) v = x + a;
      else if (filter === 2) v = x + b;
      else if (filter === 3) v = x + ((a + b) >> 1);
      else if (filter === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        v = x + pr;
      }
      row[i] = v & 255;
    }
  }
  return { w, h, bpp, stride, px: out };
}

function encodePNG(path, w, h, bpp, stride, px) {
  const raw = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    raw[y * stride] = 0; // filter: none
    px.copy(raw, y * stride + 1, y * stride + 1, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  const chunks = [];
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c >>> 0;
  }
  const chunk = (type, data) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length, 0);
    head.write(type, 4, "ascii");
    const crcBuf = Buffer.concat([Buffer.from(type, "ascii"), data]);
    let crc = 0xffffffff;
    for (const byte of crcBuf) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
    crc = (crc ^ 0xffffffff) >>> 0;
    const tail = Buffer.alloc(4);
    tail.writeUInt32BE(crc, 0);
    chunks.push(head, data, tail);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  chunk("IHDR", ihdr);
  chunk("IDAT", idat);
  chunk("IEND", Buffer.alloc(0));
  fs.writeFileSync(
    path,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ...chunks,
    ]),
  );
}

/** Box-sample downscale with premultiplied alpha (same as resize-logo). */
function resize(src, sw, sh, bpp, sstride, tw, th) {
  const dstride = tw * bpp + 1;
  const out = Buffer.alloc(th * dstride);
  for (let ty = 0; ty < th; ty++) {
    const y0 = Math.floor((ty * sh) / th);
    const y1 = Math.max(y0 + 1, Math.floor(((ty + 1) * sh) / th));
    for (let tx = 0; tx < tw; tx++) {
      const x0 = Math.floor((tx * sw) / tw);
      const x1 = Math.max(x0 + 1, Math.floor(((tx + 1) * sw) / tw));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let y = y0; y < y1; y += Math.max(1, Math.floor((y1 - y0) / 24))) {
        for (let x = x0; x < x1; x += Math.max(1, Math.floor((x1 - x0) / 24))) {
          const o = y * sstride + 1 + x * bpp;
          const alpha = src[o + 3];
          r += src[o] * alpha;
          g += src[o + 1] * alpha;
          b += src[o + 2] * alpha;
          a += alpha;
          n++;
        }
      }
      const oo = ty * dstride + 1 + tx * bpp;
      if (a === 0 || n === 0) {
        out[oo + 3] = 0;
        continue;
      }
      out[oo] = Math.round(r / a);
      out[oo + 1] = Math.round(g / a);
      out[oo + 2] = Math.round(b / a);
      out[oo + 3] = Math.round(a / n);
    }
  }
  return { stride: dstride, px: out };
}

const { w, h, bpp, stride, px } = decodePNG("public/images/logo.png");

// 1) Alpha bounding box (ignore faint glow below threshold).
const ALPHA_THRESHOLD = 16;
let minX = w, minY = h, maxX = -1, maxY = -1;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (px[y * stride + 1 + x * bpp + 3] > ALPHA_THRESHOLD) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const bw = maxX - minX + 1;
const bh = maxY - minY + 1;
console.log(`content bbox: ${bw}x${bh} at (${minX},${minY})`);

// 2) Square transparent canvas, mark centered with ~8% margin each side.
const side = Math.ceil(Math.max(bw, bh) * 1.16);
const canvas = Buffer.alloc(side * side * bpp); // fully transparent
const offX = Math.floor((side - bw) / 2);
const offY = Math.floor((side - bh) / 2);
for (let y = 0; y < bh; y++) {
  const srcStart = (minY + y) * stride + 1 + minX * bpp;
  const dstStart = (offY + y) * side * bpp + offX * bpp;
  for (let x = 0; x < bw * bpp; x++) {
    canvas[dstStart + x] = px[srcStart + x];
  }
}

// 3) Downscale to the two icon sizes and write.
for (const [size, file] of [
  [512, "src/app/icon.png"],
  [180, "src/app/apple-icon.png"],
]) {
  const small = resize(canvas, side, side, bpp, side * bpp + 1, size, size);
  encodePNG(file, size, size, bpp, small.stride, small.px);
  console.log(`wrote ${file} ${size}x${size}`);
}
