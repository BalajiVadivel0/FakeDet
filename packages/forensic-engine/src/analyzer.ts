import { analyzeELA } from './algorithms/ela.js';
import { analyzeMetadata } from './algorithms/metadata.js';
import { analyzeBlink } from './algorithms/blink.js';

export interface ForensicResult {
    elaScore: number;
    metadataScore: number;
    blinkScore: number;
    overallScore: number;
    details: any;
}

export class ForensicAnalyzer {

    async analyzeFrame(imageBuffer: Buffer): Promise<ForensicResult> {
        const [ela, metadata, blink] = await Promise.all([
            analyzeELA(imageBuffer),
            analyzeMetadata(imageBuffer),
            analyzeBlink(imageBuffer)
        ]);

        // Weighted scoring
        // ELA is currently the most robust implemented feature
        const contentScore = (ela * 0.6) + (metadata.score * 0.2) + (blink * 0.2);

        return {
            elaScore: ela,
            metadataScore: metadata.score,
            blinkScore: blink,
            overallScore: contentScore,
            details: metadata.details
        };
    }
}
