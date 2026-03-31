#!/usr/bin/env node
/**
 * Generates placeholder PWA icons using node-canvas (optional).
 * If you don't have node-canvas installed, replace the files in
 * public/icons/ with real PNG assets (e.g. from https://realfavicongenerator.net).
 *
 * Usage: node scripts/generate-icons.js
 */

const fs   = require('fs')
const path = require('path')

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons')

fs.mkdirSync(ICONS_DIR, { recursive: true })

// Try to use canvas for real PNG generation
try {
  const { createCanvas } = require('canvas')

  SIZES.forEach((size) => {
    const canvas = createCanvas(size, size)
    const ctx    = canvas.getContext('2d')

    // Background gradient (rose)
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0,   '#f43f5e')
    grad.addColorStop(1,   '#fb7185')
    ctx.fillStyle = grad

    // Rounded rectangle
    const radius = size * 0.22
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
    ctx.fill()

    // Simple droplet / moon shape
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    const cx = size / 2
    const cy = size / 2
    const r  = size * 0.22

    // Moon crescent
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#f43f5e'
    ctx.beginPath()
    ctx.arc(cx + r * 0.45, cy - r * 0.1, r * 0.8, 0, Math.PI * 2)
    ctx.fill()

    const out = path.join(ICONS_DIR, `icon-${size}.png`)
    fs.writeFileSync(out, canvas.toBuffer('image/png'))
    console.log(`✓ Generated ${out}`)
  })

  // Also write apple-touch-icon
  fs.copyFileSync(
    path.join(ICONS_DIR, 'icon-192.png'),
    path.join(ICONS_DIR, 'apple-touch-icon.png')
  )
  console.log('✓ All icons generated.')
} catch {
  console.warn('⚠️  node-canvas not found – creating SVG fallback icons.')
  console.warn('   For production, replace public/icons/ with real PNGs.')

  // Write a minimal SVG that browsers can use as fallback
  const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="100%" stop-color="#fb7185"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size*0.22}" fill="url(#g)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.22}" fill="rgba(255,255,255,0.92)"/>
  <circle cx="${size/2+size*0.1}" cy="${size/2-size*0.025}" r="${size*0.176}" fill="#f43f5e"/>
</svg>`

  SIZES.forEach((size) => {
    const out = path.join(ICONS_DIR, `icon-${size}.png`)
    // Write SVG with .png extension as placeholder – replace with real files
    fs.writeFileSync(out.replace('.png', '.svg'), svg(size))
    console.log(`  Wrote SVG placeholder: icon-${size}.svg`)
  })
  console.warn('\n  ⚠️  Rename or convert .svg → .png before deploying.')
}
