import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import supertest from 'supertest';
import { analyzeELA } from '../src/algorithms/ela';
import { analyzeMetadata } from '../src/algorithms/metadata';
import { ForensicAnalyzer } from '../src/analyzer';

// Mock API test needs the app export or a running instance. 
// For unit tests, we focus on the algorithms.

const createTestImage = async (color: string) => {
    return sharp({
        create: {
            width: 100,
            height: 100,
            channels: 3,
            background: color
        }
    })
        .jpeg()
        .toBuffer();
};

describe('Forensic Algorithms', () => {

    it('analyzeELA should return a score between 0 and 1 for a clean image', async () => {
        const imageBuffer = await createTestImage('red');
        const score = await analyzeELA(imageBuffer);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
        // A pure digital image should have very low ELA noise
        expect(score).toBeLessThan(0.1);
    });

    it('analyzeMetadata should detect missing EXIF', async () => {
        const imageBuffer = await createTestImage('blue');
        const result = await analyzeMetadata(imageBuffer);

        expect(result.score).toBeGreaterThan(0);
        expect(result.details.width).toBe(100);
        expect(result.details.format).toBe('jpeg');
    });

});

describe('ForensicAnalyzer', () => {
    it('should aggregate scores', async () => {
        const analyzer = new ForensicAnalyzer();
        const imageBuffer = await createTestImage('green');

        const result = await analyzer.analyzeFrame(imageBuffer);

        expect(result.overallScore).toBeDefined();
        expect(result.elaScore).toBeDefined();
        expect(result.metadataScore).toBeDefined();
        expect(result.blinkScore).toBe(0.5); // Placeholder value
    });
});
