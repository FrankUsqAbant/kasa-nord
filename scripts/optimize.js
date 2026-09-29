// optimize.js — convierte el JPEG del home a WebP y genera tamaños
// múltiples para las fotos que sí se muestran. No toca las 44 fotos:
// en el home solo se cargan 4, y convertir 12 MB que nadie descarga
// solo infla el repo.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'assets', 'img');
const WEBP = path.join(ROOT, 'assets', 'webp');
fs.mkdirSync(WEBP, { recursive: true });

// [subcarpeta, archivo, ancho grande, ancho pequeño]
const TARGETS = [
  ['hero',      '02', 1920, 1280],
  ['sanborja',  '01', 1200,  800],
  ['miraflores','01', 1200,  800],
  ['barranco',  '01', 1200,  800],
];

// shell:false — en Windows execSync con shell rompe las rutas con comillas
function run(bin, args) {
  return execFileSync(bin, args, { encoding: 'utf8' });
}

let before = 0, after = 0;

for (const [dir, file, big, small] of TARGETS) {
  const src = path.join(IMG, dir, `${file}.jpg`);
  if (!fs.existsSync(src)) { console.log(`SKIP (no existe) ${src}`); continue; }

  const srcSize = fs.statSync(src).size;
  before += srcSize;

  for (const w of [big, small]) {
    const out = path.join(WEBP, dir, `${file}-${w}.webp`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    run('ffmpeg', [
      '-y', '-loglevel', 'error', '-i', src,
      '-vf', `scale=${w}:-1:flags=lanczos`,
      '-c:v', 'libwebp', '-quality', '80',
      '-compression_level', '6', '-preset', 'picture',
      out,
    ]);
  }

  // mobile small variant for the hero only (it is full-bleed)
  if (dir === 'hero') {
    const out = path.join(WEBP, dir, `${file}-720.webp`);
    run('ffmpeg', [
      '-y', '-loglevel', 'error', '-i', src,
      '-vf', 'scale=720:-1:flags=lanczos',
      '-c:v', 'libwebp', '-quality', '78', '-compression_level', '6',
      out,
    ]);
  }

  const produced = fs.readdirSync(path.join(WEBP, dir))
    .filter(f => f.startsWith(`${file}-`))
    .map(f => fs.statSync(path.join(WEBP, dir, f)).size);
  after += produced.reduce((a, b) => a + b, 0);

  console.log(
    `${(dir + '/' + file).padEnd(18)} JPEG ${(srcSize / 1024).toFixed(0).padStart(4)} KB` +
    `  ->  WebP ${(produced.reduce((a, b) => a + b, 0) / 1024).toFixed(0).padStart(4)} KB` +
    `  (${produced.length} variantes)`
  );
}

console.log('─'.repeat(64));
console.log(`JPEG original: ${(before / 1024).toFixed(0)} KB`);
console.log(`WebP total:    ${(after / 1024).toFixed(0)} KB`);
console.log(`Ahorro:        ${(100 - (after / before) * 100).toFixed(0)}%`);
