// convert-all.js — convierte TODOS los JPEG masters a WebP.
// Deja en assets/webp/ el juego completo que usarán las páginas de
// detalle. Los JPEG se conservan solo como fuente local (ignorados por
// git): el repo y el sitio publicado viven en WebP.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'assets', 'img');
const OUT = path.join(ROOT, 'assets', 'webp');

// shell:false — en Windows, execSync con shell rompe las rutas con comillas
const run = (bin, args) => execFileSync(bin, args, { encoding: 'utf8' });

const WIDTHS = [1280, 800];
const Q = { 1280: 80, 800: 78 };

let jpgTotal = 0, webpTotal = 0, made = 0, skipped = 0;

for (const dir of fs.readdirSync(IMG)) {
  const dpath = path.join(IMG, dir);
  if (!fs.statSync(dpath).isDirectory()) continue;

  for (const f of fs.readdirSync(dpath).filter(f => f.endsWith('.jpg'))) {
    const base = f.replace(/\.jpg$/, '');
    const src = path.join(dpath, f);
    jpgTotal += fs.statSync(src).size;

    for (const w of WIDTHS) {
      const out = path.join(OUT, dir, `${base}-${w}.webp`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      if (fs.existsSync(out) && fs.statSync(out).size > 0) { skipped++; continue; }
      run('ffmpeg', [
        '-y', '-loglevel', 'error', '-i', src,
        '-vf', `scale=${w}:-1:flags=lanczos`,
        '-c:v', 'libwebp', '-quality', String(Q[w]),
        '-compression_level', '6', '-preset', 'picture',
        out,
      ]);
      made++;
    }
    webpTotal += fs.readdirSync(path.join(OUT, dir))
      .filter(x => x.startsWith(base + '-'))
      .reduce((a, x) => a + fs.statSync(path.join(OUT, dir, x)).size, 0);
  }
}

console.log(`variantes nuevas:  ${made}`);
console.log(`ya existian:       ${skipped}`);
console.log('─'.repeat(52));
console.log(`JPEG masters:  ${(jpgTotal / 1024 / 1024).toFixed(1)} MB`);
console.log(`WebP (2 por foto): ${(webpTotal / 1024 / 1024).toFixed(1)} MB`);
console.log(`Total en assets/webp: ${(made + skipped)} archivos`);
