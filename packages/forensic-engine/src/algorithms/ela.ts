import sharp from 'sharp';

/**
 * Performs Error Level Analysis (ELA) on an image buffer.
 * Strategy:
 * 1. Compress the image to a known quality (e.g., 90%).
 * 2. Compute the difference between the original and the compressed version.
 * 3. High difference areas indicate potential manipulation (inconsistent compression levels).
 * 
 * @param imageBuffer Original image buffer
 * @returns A score between 0 and 1 indicating the likelihood of manipulation based on ELA noise.
 */
export async function analyzeELA(imageBuffer: Buffer): Promise<number> {
  try {
    const original = sharp(imageBuffer);
    const metadata = await original.metadata();
    
    // 1. Resave at 90% quality
    const compressedBuffer = await original
      .jpeg({ quality: 90 })
      .toBuffer();
      
    // 2. Get raw pixel data for both
    const originalRaw = await original
      .ensureAlpha()
      .raw()
      .toBuffer();
      
    const compressedRaw = await sharp(compressedBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer();
      
    if (originalRaw.length !== compressedRaw.length) {
      // Dimensions changed (unlikely with just compression) or error
      return 0;
    }
    
    // 3. Calculate mean absolute difference
    let totalDiff = 0;
    for (let i = 0; i < originalRaw.length; i++) {
        totalDiff += Math.abs(originalRaw[i] - compressedRaw[i]);
    }
    
    const avgDiff = totalDiff / originalRaw.length;
    
    // Normalize score (heuristic). Typical ELA noise is low for untouched images.
    // An average pixel difference > 5 is suspicious. > 15 is high.
    // Map 0-20 to 0-1
    return Math.min(avgDiff / 20, 1.0);
    
  } catch (error) {
    console.error("ELA Analysis failed:", error);
    return 0;
  }
}
