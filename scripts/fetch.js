// fetch.js — descarga fotos de Pixabay usando largeImageURL (no hay que
// adivinar sufijos de resolución: ese truco rompe porque el hash contiene
// dígitos y cualquier regex lo tritura).
const { execSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const KEY = process.env.PIXABAY_KEY || '56811380-ae2576aaa35bf3b7dad0c143c';
const ROOT = path.join(__dirname, '..');
// keep the scratch dir inside the project: system temp paths break when they
// contain spaces, and ffprobe silently returns nothing on a bad path
const TMP = path.join(ROOT, '.dl');
fs.mkdirSync(TMP, { recursive: true });

const SETS = {
  hero:       'modern house exterior architecture',
  sanborja:   'luxury house pool garden',
  miraflores: 'apartment building modern facade',
  barranco:   'modern architecture concrete building',
  interior:   'minimalist interior living room',
  cocina:     'modern kitchen interior',
  dormitorio: 'luxury bedroom interior',
  bano:       'modern bathroom marble',
  hall:       'luxury hallway interior',
  jardin:     'house garden trees evening',
  sky:        'lima peru city skyline',
};

// execSync+shell mangles quoted paths on Windows, so shell:false everywhere
function curl(url, out) {
  return execFileSync('curl', ['-sL', '-o', out, '-w', '%{http_code}', url], { encoding: 'utf8' });
}
function dims(f) {
  try {
    return execFileSync('ffprobe',
      ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f],
      { encoding: 'utf8', shell: false }).trim();
  } catch { return 'n/a'; }
}

let ok = 0, bad = 0;
for (const [dir, q] of Object.entries(SETS)) {
  const out = path.join(ROOT, 'assets', 'img', dir);
  fs.mkdirSync(out, { recursive: true });
  const api = `https://pixabay.com/api/?key=${KEY}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&min_width=1600&per_page=8&safesearch=true`;
  let hits = [];
  try { hits = JSON.parse(execSync(`curl -s "${api}"`, { encoding: 'utf8', maxBuffer: 20e6 })).hits || []; }
  catch (e) { console.log(dir.padEnd(12), 'API FALLÓ'); continue; }

  let n = 0;
  for (const h of hits) {
    if (n >= 4) break;
    const f = path.join(out, `${String(n + 1).padStart(2, '0')}.jpg`);
    const tmp = path.join(TMP, 'x.jpg');
    const code = curl(h.largeImageURL, tmp);
    const size = fs.statSync(tmp).size;
    // reject anything that is not a real JPEG over 40KB
    if (code !== '200' || size < 40000) { bad++; continue; }
    fs.copyFileSync(tmp, f);
    const d = dims(f);
    if (d === 'n/a' || d.startsWith('0,')) { fs.unlinkSync(f); bad++; continue; }
    n++; ok++;
  }
  console.log(dir.padEnd(12), `${n} fotos`);
}
console.log(`\ndescargadas ${ok}, rechazadas ${bad}`);
