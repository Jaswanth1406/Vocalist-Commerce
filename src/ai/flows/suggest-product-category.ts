// 'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting product categories and keywords based on a product description.
 *
 * - suggestProductCategory - A function that handles the product category suggestion process.
 * - SuggestProductCategoryInput - The input type for the suggestProductCategory function.
 * - SuggestProductCategoryOutput - The return type for the suggestProductCategory function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductCategoryInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A detailed description of the product for which categories and keywords are to be suggested.'),
});
export type SuggestProductCategoryInput = z.infer<typeof SuggestProductCategoryInputSchema>;

const SuggestProductCategoryOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe('An array of suggested product categories based on the product description.'),
  suggestedKeywords: z
    .array(z.string())
    .describe('An array of suggested keywords to improve the product listing visibility.'),
});
export type SuggestProductCategoryOutput = z.infer<typeof SuggestProductCategoryOutputSchema>;

export async function suggestProductCategory(input: SuggestProductCategoryInput): Promise<SuggestProductCategoryOutput> {
  return suggestProductCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductCategoryPrompt',
  input: {schema: SuggestProductCategoryInputSchema},
  output: {schema: SuggestProductCategoryOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant product categories and keywords for product listings based on the provided product description.

  Given the following product description:
  {{productDescription}}

  Suggest at least 3 product categories that would be most relevant for this product:
  {{#each suggestedCategories}}- {{this}}\n{{/each}}

  Also, suggest at least 5 keywords that would help improve the visibility of this product listing:
  {{#each suggestedKeywords}}- {{this}}\n{{/each}}
  `,
});

const suggestProductCategoryFlow = ai.defineFlow(
  {
    name: 'suggestProductCategoryFlow',
    inputSchema: SuggestProductCategoryInputSchema,
    outputSchema: SuggestProductCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
