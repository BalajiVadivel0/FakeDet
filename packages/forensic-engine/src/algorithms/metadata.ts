import sharp from 'sharp';

interface MetadataParams {
    width?: number;
    height?: number;
    format?: string;
    hasProfile?: boolean; // Checks if standard color profile exists
    isProgressive?: boolean;
}

export async function analyzeMetadata(imageBuffer: Buffer): Promise<{ score: number, details: MetadataParams }> {
    try {
        const metadata = await sharp(imageBuffer).metadata();

        // Check for suspicious signs:
        // 1. Stripped metadata (missing EXIF often happens in web downloads/edits)
        // 2. Unusual dimensions (not standard camera ratios) - skipped for now

        let suspicionScore = 0.1; // Baseline

        if (!metadata.exif && !metadata.icc) {
            suspicionScore += 0.3; // Metadata stripping is common in deepfakes/web-images
        }

        return {
            score: Math.min(suspicionScore, 1.0),
            details: {
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                hasProfile: !!metadata.icc,
                isProgressive: metadata.isProgressive
            }
        };
    } catch (e) {
        return { score: 0, details: {} };
    }
}
