// Tiny PNG reader (8-bit RGB/RGBA, non-interlaced) for pixel checks; no deps.
import { inflateSync } from "node:zlib"
export class PNG {
  static parse(buf) {
    let off = 8, w = 0, h = 0, channels = 0, idat = []
    while (off < buf.length) {
      const len = buf.readUInt32BE(off); const type = buf.toString("ascii", off + 4, off + 8)
      const data = buf.subarray(off + 8, off + 8 + len)
      if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); channels = data[9] === 6 ? 4 : data[9] === 2 ? 3 : 1 }
      if (type === "IDAT") idat.push(data)
      off += 12 + len
    }
    const raw = inflateSync(Buffer.concat(idat)); const stride = w * channels; const px = Buffer.alloc(h * stride)
    let prev = Buffer.alloc(stride)
    for (let y = 0; y < h; y++) {
      const filter = raw[y * (stride + 1)]; const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)); const out = Buffer.alloc(stride)
      for (let i = 0; i < stride; i++) {
        const a = i >= channels ? out[i - channels] : 0, b = prev[i], c = i >= channels ? prev[i - channels] : 0; let v = line[i]
        if (filter === 1) v += a; else if (filter === 2) v += b; else if (filter === 3) v += (a + b) >> 1
        else if (filter === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
        out[i] = v & 255
      }
      out.copy(px, y * stride); prev = out
    }
    return new PNG(w, h, channels, px)
  }
  constructor(w, h, channels, px) { this.w = w; this.h = h; this.channels = channels; this.px = px }
  at(x, y) { const i = (y * this.w + x) * this.channels; return [this.px[i], this.px[i + 1], this.px[i + 2]] }
}
