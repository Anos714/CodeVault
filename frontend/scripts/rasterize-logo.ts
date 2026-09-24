import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "..", "public");
const appDir = resolve(__dirname, "..", "src", "app");
const svg = readFileSync(resolve(publicDir, "favicon.svg"));

mkdirSync(publicDir, { recursive: true });
mkdirSync(appDir, { recursive: true });

/* ---------- PNG icons ---------- */
const pngSizes = [
  { name: "apple-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

for (const { name, size } of pngSizes) {
  await sharp(svg, { density: 384 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(resolve(publicDir, name));
  console.log("wrote", name, `${size}x${size}`);
}

/* ---------- Multi-resolution .ico (Vista-style, PNG-encoded) ---------- */
// ICO header (6 bytes) + one 16-byte directory entry per size, then the
// PNG payloads. This is the format modern browsers expect for /favicon.ico.
const icoSizes = [16, 32, 48, 64];
const entries: { size: number; png: Buffer }[] = [];

for (const size of icoSizes) {
  const png = await sharp(svg, { density: 384 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  entries.push({ size, png });
}

// images must appear in ascending size order in the directory
entries.sort((a, b) => a.size - b.size);

const headerSize = 6;
const entrySize = 16;
const directorySize = headerSize + entrySize * entries.length;
let dataOffset = directorySize;

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(entries.length, 4); // image count

const directory: Buffer[] = [header];
const images: Buffer[] = [];

for (const { size, png } of entries) {
  const entry = Buffer.alloc(entrySize);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // image size
  entry.writeUInt32LE(dataOffset, 12); // image offset
  directory.push(entry);
  images.push(png);
  dataOffset += png.length;
}

writeFileSync(resolve(publicDir, "favicon.ico"), Buffer.concat([...directory, ...images]));
console.log("wrote favicon.ico", icoSizes.join("/"));

/* ---------- Next.js auto-detected app/icon.svg ---------- */
writeFileSync(resolve(appDir, "icon.svg"), svg);
console.log("wrote src/app/icon.svg");
