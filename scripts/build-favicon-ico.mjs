import fs from "node:fs";
import path from "node:path";

// Build an .ico file that embeds PNG images (modern ICO format supports this).
// Inputs are expected to be in public/ and already sized.
const root = process.cwd();
const publicDir = path.join(root, "public");
const outPath = path.join(publicDir, "favicon.ico");

const sizes = [16, 32, 48];
const inputs = sizes.map((s) => ({
  size: s,
  file: path.join(publicDir, `favicon-${s}x${s}.png`),
}));

for (const i of inputs) {
  if (!fs.existsSync(i.file)) {
    console.error(`Missing ${i.file}. Create it first.`);
    process.exit(1);
  }
}

const images = inputs.map((i) => ({
  size: i.size,
  data: fs.readFileSync(i.file),
}));

// ICONDIR header
const count = images.length;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type = 1 (icon)
header.writeUInt16LE(count, 4);

// Directory entries (ICONDIRENTRY)
const entries = Buffer.alloc(16 * count);
let offset = 6 + 16 * count;

for (let idx = 0; idx < images.length; idx++) {
  const { size, data } = images[idx];
  const entryOffset = idx * 16;

  // Width/height are 1 byte; 0 means 256. We only generate <= 48 here.
  entries.writeUInt8(size, entryOffset + 0);
  entries.writeUInt8(size, entryOffset + 1);
  entries.writeUInt8(0, entryOffset + 2); // color palette
  entries.writeUInt8(0, entryOffset + 3); // reserved
  entries.writeUInt16LE(1, entryOffset + 4); // planes
  entries.writeUInt16LE(32, entryOffset + 6); // bit count
  entries.writeUInt32LE(data.length, entryOffset + 8); // bytes
  entries.writeUInt32LE(offset, entryOffset + 12); // image offset

  offset += data.length;
}

const body = Buffer.concat(images.map((i) => i.data));
fs.writeFileSync(outPath, Buffer.concat([header, entries, body]));
console.log(`Wrote ${outPath}`);

