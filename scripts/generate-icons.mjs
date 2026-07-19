// Generates the PWA raster icons from an inline SVG using sharp.
// Run with: npm run icons
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

// Standard icon: rounded badge with the network glyph.
const standardSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="14" fill="#1C2B4A"/>
  <path d="M14 44C22 26 30 18 40 18s12 8 10 26" fill="none" stroke="#E17041" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="14" cy="44" r="6" fill="#E17041"/>
  <circle cx="50" cy="44" r="6" fill="#E17041"/>
  <circle cx="34" cy="18" r="6" fill="#EEF1F7"/>
</svg>`

// Maskable icon: full-bleed background with the glyph in the safe zone.
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <rect width="64" height="64" fill="#1C2B4A"/>
  <g transform="translate(9 9) scale(0.72)">
    <path d="M14 44C22 26 30 18 40 18s12 8 10 26" fill="none" stroke="#E17041" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="14" cy="44" r="6" fill="#E17041"/>
    <circle cx="50" cy="44" r="6" fill="#E17041"/>
    <circle cx="34" cy="18" r="6" fill="#EEF1F7"/>
  </g>
</svg>`

async function render(svg, size, name) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(publicDir, name))
  console.log('  wrote', name)
}

console.log('Generating icons…')
await render(standardSvg(512), 192, 'icon-192.png')
await render(standardSvg(512), 512, 'icon-512.png')
await render(standardSvg(512), 180, 'apple-touch-icon.png')
await render(maskableSvg, 512, 'icon-maskable-512.png')
console.log('Done.')
