interface HeroPalette {
  soft: string;
  halo: string;
  accent: string;
  blob1: string;
  blob2: string;
  blob3: string;
  blobSoftA: string;
  blobSoftB: string;
  squiggle: string;
  ribbonA: string;
  ribbonB: string;
  ribbonC: string;
  ribbonD: string;
}

const HERO_PALETTE_DEFAULT: HeroPalette = {
  soft: "#FAF8FC",
  halo: "rgba(107,56,251,0.14)",
  accent: "#6B38FB",
  blob1: "#6B38FB",
  blob2: "#4c1d95",
  blob3: "#312e81",
  blobSoftA: "rgba(107,56,251,.55)",
  blobSoftB: "rgba(76,29,149,.45)",
  squiggle: "#F5C518",
  ribbonA: "#DB00FF",
  ribbonB: "#7000FF",
  ribbonC: "#00FFB2",
  ribbonD: "#FFE600",
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function calculateHue(
  r: number,
  g: number,
  b: number,
  d: number,
  max: number,
): number {
  if (max === r) return (g - b) / d + (g < b ? 6 : 0);
  if (max === g) return (b - r) / d + 2;
  return (r - g) / d + 4;
}

function rgbToHsl(r: number, g: number, b: number) {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;
  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = calculateHue(normR, normG, normB, d, max) / 6;

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  function normalizeHue(t: number): number {
    if (t < 0) return t + 1;
    if (t > 1) return t - 1;
    return t;
  }

  function calcHueVal(hue: number, p: number, q: number): number {
    if (hue < 1 / 6) return p + (q - p) * 6 * hue;
    if (hue < 1 / 2) return q;
    if (hue < 2 / 3) return p + (q - p) * (2 / 3 - hue) * 6;
    return p;
  }

  function hue2rgb(t: number, p: number, q: number) {
    return calcHueVal(normalizeHue(t), p, q);
  }

  return {
    r: Math.round(hue2rgb(h + 1 / 3, p, q) * 255),
    g: Math.round(hue2rgb(h, p, q) * 255),
    b: Math.round(hue2rgb(h - 1 / 3, p, q) * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  function hex(n: number) {
    return `0${clamp(Math.round(n), 0, 255).toString(16)}`.slice(-2);
  }
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function mixRgb(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number,
) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function shiftHsl(
  rgb: { r: number; g: number; b: number },
  dh: number,
  ds: number,
  dl: number,
) {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + dh + 1) % 1;
  hsl.s = clamp(hsl.s + ds, 0.2, 1);
  hsl.l = clamp(hsl.l + dl, 0.12, 0.72);
  return hslToRgb(hsl.h, hsl.s, hsl.l);
}

function rgbaString(rgb: { r: number; g: number; b: number }, alpha: number) {
  return `rgba(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)},${alpha})`;
}

function applyHeroPalette(heroEl: HTMLElement, palette: HeroPalette) {
  heroEl.style.setProperty("--hero-soft", palette.soft);
  heroEl.style.setProperty("--hero-halo", palette.halo);
  heroEl.style.setProperty("--hero-accent", palette.accent);
  heroEl.style.setProperty("--hero-blob-1", palette.blob1);
  heroEl.style.setProperty("--hero-blob-2", palette.blob2);
  heroEl.style.setProperty("--hero-blob-3", palette.blob3);
  heroEl.style.setProperty("--hero-blob-soft-a", palette.blobSoftA);
  heroEl.style.setProperty("--hero-blob-soft-b", palette.blobSoftB);
  heroEl.style.setProperty("--hero-squiggle", palette.squiggle);
  heroEl.style.setProperty("--hero-ribbon-a", palette.ribbonA);
  heroEl.style.setProperty("--hero-ribbon-b", palette.ribbonB);
  heroEl.style.setProperty("--hero-ribbon-c", palette.ribbonC);
  heroEl.style.setProperty("--hero-ribbon-d", palette.ribbonD);
}

export function resetHeroPalette(heroEl: HTMLElement) {
  applyHeroPalette(heroEl, HERO_PALETTE_DEFAULT);
}

function hueDistance(a: number, b: number) {
  const d = Math.abs(a - b);
  return Math.min(d, 1 - d);
}

type ColorBucket = {
  r: number;
  g: number;
  b: number;
  n: number;
  h: number;
  s: number;
  l: number;
};

type RankedColor = {
  rgb: { r: number; g: number; b: number };
  h: number;
  s: number;
  l: number;
  score: number;
};

function isEdgePixel(x: number, y: number, size: number): boolean {
  return (
    x < size * 0.12 || x > size * 0.88 || y < size * 0.08 || y > size * 0.96
  );
}

function isInvalidLuminance(l: number): boolean {
  return l < 0.1 || l > 0.9;
}

function shouldSkipPixel(
  x: number,
  y: number,
  size: number,
  data: Uint8ClampedArray,
  i: number,
): boolean {
  if (isEdgePixel(x, y, size)) return true;
  if (data[i + 3] < 120) return true;
  return false;
}

function shouldSkipHsl(hsl: { h: number; s: number; l: number }): boolean {
  return isInvalidLuminance(hsl.l) || hsl.s < 0.16;
}

function processPixel(
  x: number,
  y: number,
  size: number,
  data: Uint8ClampedArray,
  buckets: Record<string, ColorBucket>,
) {
  const i = (y * size + x) * 4;
  if (shouldSkipPixel(x, y, size, data, i)) return;

  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const hsl = rgbToHsl(r, g, b);

  if (shouldSkipHsl(hsl)) return;

  const key = `${Math.floor(hsl.h * 18)}:${Math.floor(hsl.s * 5)}:${Math.floor(hsl.l * 5)}`;
  if (!buckets[key]) {
    buckets[key] = { r: 0, g: 0, b: 0, n: 0, h: hsl.h, s: hsl.s, l: hsl.l };
  }
  buckets[key].r += r;
  buckets[key].g += g;
  buckets[key].b += b;
  buckets[key].n += 1;
}

function sampleImageBuckets(
  data: Uint8ClampedArray,
  size: number,
): Record<string, ColorBucket> {
  const buckets: Record<string, ColorBucket> = {};
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      processPixel(x, y, size, data, buckets);
    }
  }
  return buckets;
}

function rankColorBuckets(buckets: Record<string, ColorBucket>): RankedColor[] {
  return Object.keys(buckets)
    .map((key) => {
      const bucket = buckets[key];
      const avg = {
        r: bucket.r / bucket.n,
        g: bucket.g / bucket.n,
        b: bucket.b / bucket.n,
      };
      return {
        rgb: avg,
        h: bucket.h,
        s: bucket.s,
        l: bucket.l,
        score: bucket.n * (0.35 + bucket.s * 0.65),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function buildPaletteFromRanked(ranked: RankedColor[]): HeroPalette {
  const primary = ranked[0].rgb;
  let secondary = ranked[0].rgb;
  for (let j = 1; j < ranked.length; j += 1) {
    if (hueDistance(ranked[j].h, ranked[0].h) > 0.08) {
      secondary = ranked[j].rgb;
      break;
    }
  }

  const soft = mixRgb(primary, { r: 255, g: 255, b: 255 }, 0.92);
  const blob2 = shiftHsl(primary, 0.03, 0.05, -0.14);
  const blob3 = shiftHsl(primary, 0.06, 0.02, -0.28);
  const squiggle = shiftHsl(secondary, 0.02, 0.12, 0.08);

  return {
    soft: rgbToHex(soft.r, soft.g, soft.b),
    halo: rgbaString(primary, 0.13),
    accent: rgbToHex(primary.r, primary.g, primary.b),
    blob1: rgbToHex(primary.r, primary.g, primary.b),
    blob2: rgbToHex(blob2.r, blob2.g, blob2.b),
    blob3: rgbToHex(blob3.r, blob3.g, blob3.b),
    blobSoftA: rgbaString(primary, 0.52),
    blobSoftB: rgbaString(blob2, 0.42),
    squiggle: rgbToHex(squiggle.r, squiggle.g, squiggle.b),
    ribbonA: rgbToHex(primary.r, primary.g, primary.b),
    ribbonB: rgbToHex(blob2.r, blob2.g, blob2.b),
    ribbonC: "#00FFB2",
    ribbonD: rgbToHex(squiggle.r, squiggle.g, squiggle.b),
  };
}

function extractPaletteFromImage(img: HTMLImageElement): HeroPalette {
  const canvas = document.createElement("canvas");
  const size = 96;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return HERO_PALETTE_DEFAULT;

  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  const buckets = sampleImageBuckets(data, size);
  const ranked = rankColorBuckets(buckets);

  if (!ranked.length) return HERO_PALETTE_DEFAULT;

  return buildPaletteFromRanked(ranked);
}

export function loadHeroPaletteFromPhoto(
  photo: HTMLImageElement,
  heroEl: HTMLElement,
) {
  function applyFromImage() {
    try {
      if (!photo.naturalWidth) return;
      applyHeroPalette(heroEl, extractPaletteFromImage(photo));
    } catch {
      resetHeroPalette(heroEl);
    }
  }

  photo.onload = applyFromImage;
  if (photo.complete) applyFromImage();
}
