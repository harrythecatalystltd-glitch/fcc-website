// Remove white backgrounds from partner logos using sharp pixel manipulation
const sharp = require('sharp');
const path = require('path');

async function removeWhiteBg(inputFile, outputFile, threshold = 240, tolerance = 30) {
  const img = sharp(inputFile);
  const { width, height } = await img.metadata();

  // Get raw RGBA pixels
  const { data } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Detect near-white pixels
    if (r > threshold && g > threshold && b > threshold) {
      // Smooth transition near the edge of the threshold
      const whiteness = Math.min(r, g, b);
      const alpha = Math.max(0, Math.round(((255 - whiteness) / tolerance) * 255));
      pixels[i + 3] = Math.min(alpha, pixels[i + 3]);
    }
  }

  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels: 4 }
  })
    .png({ compressionLevel: 9 })
    .toFile(outputFile);

  console.log(`Done: ${outputFile}`);
}

(async () => {
  await removeWhiteBg('images/napier.png',   'images/napier-t.png',   232, 25);
  await removeWhiteBg('images/hiberian.png', 'images/hiberian-t.png', 232, 25);
  await removeWhiteBg('images/platform.png', 'images/platform-t.png', 220, 35);
  console.log('All complete.');
})();
