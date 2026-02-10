/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const createSVG = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#df600c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff8c42;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#grad)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.35}" fill="white" opacity="0.95"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.28}" fill="none" stroke="url(#grad)" stroke-width="${size*0.08}"/>
  <circle cx="${size*0.42}" cy="${size*0.38}" r="${size*0.08}" fill="white" opacity="0.6"/>
</svg>`.trim();

async function generateIcons() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const iconsDir = path.join(__dirname, '../public/icons');
  
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('Sharp not available, creating SVG files only');
    sharp = null;
  }

  for (const size of sizes) {
    const svg = createSVG(size);
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    fs.writeFileSync(svgPath, svg);
    console.log(`✓ Created ${path.basename(svgPath)}`);
    
    if (sharp) {
      try {
        await sharp(Buffer.from(svg)).resize(size, size).png().toFile(pngPath);
        console.log(`✓ Created ${path.basename(pngPath)}`);
      } catch (e) {
        console.log(`⚠ Could not create PNG for ${size}x${size}:`, e.message);
      }
    }
  }
  
  console.log('\n✓ Icon generation complete!');
  if (!sharp) {
    console.log('\nNote: Install sharp for PNG generation: npm install --save-dev sharp');
  }
}

generateIcons().catch(console.error);
