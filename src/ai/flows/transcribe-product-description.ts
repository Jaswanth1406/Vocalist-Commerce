// 'use server';
/**
 * @fileOverview This file defines a Genkit flow for transcribing product descriptions from voice input.
 *
 * - transcribeProductDescription - A function that transcribes voice input to text.
 * - TranscribeProductDescriptionInput - The input type for transcribeProductDescription function.
 * - TranscribeProductDescriptionOutput - The return type for transcribeProductDescription function.
 */

'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeProductDescriptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio data URI of the product description, including MIME type and Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type TranscribeProductDescriptionInput = z.infer<typeof TranscribeProductDescriptionInputSchema>;

const TranscribeProductDescriptionOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text of the product description.'),
});
export type TranscribeProductDescriptionOutput = z.infer<typeof TranscribeProductDescriptionOutputSchema>;

export async function transcribeProductDescription(
  input: TranscribeProductDescriptionInput
): Promise<TranscribeProductDescriptionOutput> {
  return transcribeProductDescriptionFlow(input);
}

const transcribeProductDescriptionPrompt = ai.definePrompt({
  name: 'transcribeProductDescriptionPrompt',
  input: {schema: TranscribeProductDescriptionInputSchema},
  output: {schema: TranscribeProductDescriptionOutputSchema},
  prompt: `Transcribe the following audio recording of a product description to text:

  {{media url=audioDataUri}}`,
});

const transcribeProductDescriptionFlow = ai.defineFlow(
  {
    name: 'transcribeProductDescriptionFlow',
    inputSchema: TranscribeProductDescriptionInputSchema,
    outputSchema: TranscribeProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await transcribeProductDescriptionPrompt(input);
    return output!;
  }
);
