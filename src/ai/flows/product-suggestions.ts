'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting products based on the current order.
 *
 * - suggestProducts - A function that takes the current order as input and returns a list of suggested products.
 * - SuggestProductsInput - The input type for the suggestProducts function.
 * - SuggestProductsOutput - The return type for the suggestProducts function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestProductsInputSchema = z.object({
  orderItems: z.array(
    z.object({
      productName: z.string().describe('The name of the product in the order.'),
      quantity: z.number().describe('The quantity of the product in the order.'),
    })
  ).describe('The current items in the order.'),
});
export type SuggestProductsInput = z.infer<typeof SuggestProductsInputSchema>;

const SuggestProductsOutputSchema = z.array(
  z.object({
    productName: z.string().describe('The name of the suggested product.'),
    reason: z.string().describe('The reason for suggesting the product.'),
  })
).describe('A list of suggested products and their reasons.');
export type SuggestProductsOutput = z.infer<typeof SuggestProductsOutputSchema>;

export async function suggestProducts(input: SuggestProductsInput): Promise<SuggestProductsOutput> {
  return suggestProductsFlow(input);
}

const suggestProductsPrompt = ai.definePrompt({
  name: 'suggestProductsPrompt',
  input: {
    schema: z.object({
      orderItems: z.array(
        z.object({
          productName: z.string().describe('The name of the product in the order.'),
          quantity: z.number().describe('The quantity of the product in the order.'),
        })
      ).describe('The current items in the order.'),
    }),
  },
  output: {
    schema: z.array(
      z.object({
        productName: z.string().describe('The name of the suggested product.'),
        reason: z.string().describe('The reason for suggesting the product.'),
      })
    ).describe('A list of suggested products and their reasons.'),
  },
  prompt: `Based on the current order items, suggest relevant products that the customer might also like to add to their order.

Current Order Items:
{{#each orderItems}}
- {{quantity}} x {{productName}}
{{/each}}

Suggest products that complement the existing order. Provide a brief reason for each suggestion.

Format your output as a JSON array of objects with 'productName' and 'reason' fields.`, // Changed to JSON output format
});

const suggestProductsFlow = ai.defineFlow<
  typeof SuggestProductsInputSchema,
  typeof SuggestProductsOutputSchema
>({
  name: 'suggestProductsFlow',
  inputSchema: SuggestProductsInputSchema,
  outputSchema: SuggestProductsOutputSchema,
}, async input => {
  const {output} = await suggestProductsPrompt(input);
  return output!;
});


