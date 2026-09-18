// One-off build helper: downscale public/images/logo.png (4315px) to a
// web-friendly width by box-sampling. Run: node scripts/resize-logo.mjs
// Node script (not part of the Next.js build).
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
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`Unsupported PNG: depth=${bitDepth} color=${colorType}`);
  }
  const bpp = colorType === 6 ? 4 : 3;
  const stride = w * bpp + 1;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * stride];
    const row = out.subarray(y * stride, (y + 1) * stride);
    const src = raw.subarray(y * stride, (y + 1) * stride);
    row[0] = 0; // leading filter byte stays 0 in our flat copy
    for (let i = 1; i < stride; i++) {
      const x = src[i];
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
  const chunk = (type, data) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length, 0);
    head.write(type, 4, "ascii");
    const crcBuf = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crcTable = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
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
  ihdr[8] = 8; // bit depth
  ihdr[9] = bpp === 4 ? 6 : 2; // color type
  chunk("IHDR", ihdr);
  chunk("IDAT", idat);
  chunk("IEND", Buffer.alloc(0));
  fs.writeFileSync(path, Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), ...chunks]));
}

const { w, h, bpp, stride, px } = decodePNG("public/images/logo.png");
const targetW = 900;
const targetH = Math.round((h / w) * targetW);
const outStride = targetW * bpp + 1;
const out = Buffer.alloc(targetH * outStride);

for (let ty = 0; ty < targetH; ty++) {
  const y0 = Math.floor((ty * h) / targetH);
  const y1 = Math.max(y0 + 1, Math.floor(((ty + 1) * h) / targetH));
  for (let tx = 0; tx < targetW; tx++) {
    const x0 = Math.floor((tx * w) / targetW);
    const x1 = Math.max(x0 + 1, Math.floor(((tx + 1) * w) / targetW));
    let r = 0, g = 0, b = 0, a = 0, n = 0;
    for (let y = y0; y < y1; y += Math.max(1, Math.floor((y1 - y0) / 24))) {
      for (let x = x0; x < x1; x += Math.max(1, Math.floor((x1 - x0) / 24))) {
        const o = y * stride + 1 + x * bpp;
        const alpha = bpp === 4 ? px[o + 3] : 255;
        r += px[o] * alpha;
        g += px[o + 1] * alpha;
        b += px[o + 2] * alpha;
        a += alpha;
        n++;
      }
    }
    if (a === 0 || n === 0) {
      out[ty * outStride + 1 + tx * bpp + 3] = 0;
      continue;
    }
    const oo = ty * outStride + 1 + tx * bpp;
    out[oo] = Math.round(r / a);
    out[oo + 1] = Math.round(g / a);
    out[oo + 2] = Math.round(b / a);
    if (bpp === 4) out[oo + 3] = Math.round(a / n);
  }
}

encodePNG("public/images/logo-small.png", targetW, targetH, bpp, outStride, out);
console.log(`wrote public/images/logo-small.png ${targetW}x${targetH}`);
