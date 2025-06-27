'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a compelling product description from transcribed text.
 *
 * - generateProductDescription - A function that takes transcribed text as input and returns a generated product description.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  transcribedText: z
    .string()
    .describe('The transcribed text of the product description.'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z
    .string()
    .describe('A compelling, grammatically correct product description.'),
  suggestedCategory: z
    .string()
    .describe('A category the product should belong to.'),
  suggestedTitle: z
    .string()
    .describe('A suitable title for the product.'),
  suggestedKeywords: z
    .string()
    .describe('Keywords which can be used to promote the product.'),
  suggestedPrice: z
    .number()
    .describe('A suggested price for the product in INR. Do not include currency symbols.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling product descriptions.

  Based on the transcribed text, generate a grammatically correct and engaging product description, suggest a category for the product, provide a title for the product, provide keywords to promote the product, and suggest a reasonable price in INR for the product.

  Transcribed Text: {{{transcribedText}}}`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
