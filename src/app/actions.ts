
'use server';

import { transcribeProductDescription, type TranscribeProductDescriptionInput } from '@/ai/flows/transcribe-product-description';
import { generateProductDescription, type GenerateProductDescriptionInput, type GenerateProductDescriptionOutput } from '@/ai/flows/generate-product-description';

export async function handleTranscribe(input: TranscribeProductDescriptionInput): Promise<{ success: boolean; transcription?: string; error?: string; }> {
    try {
        const result = await transcribeProductDescription(input);
        return { success: true, transcription: result.transcription };
    } catch (error) {
        console.error("Transcription failed:", error);
        return { success: false, error: 'Failed to transcribe audio. Please try again.' };
    }
}

export async function handleGenerate(input: GenerateProductDescriptionInput): Promise<{ success: boolean; product?: GenerateProductDescriptionOutput; error?: string; }> {
    try {
        const result = await generateProductDescription(input);
        return { success: true, product: result };
    } catch (error) {
        console.error("Generation failed:", error);
        return { success: false, error: 'Failed to generate product listing. Please try again.' };
    }
}
