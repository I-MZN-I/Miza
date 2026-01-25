'use server';
/**
 * @fileOverview An AI agent that provides rent predictions for properties.
 *
 * - predictRent - A function that handles the rent prediction process.
 * - PredictRentInput - The input type for the predictRent function.
 * - PredictRentOutput - The return type for the predictRent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictRentInputSchema = z.object({
  propertyDescription: z.string().describe('A detailed description of the property, including size, number of rooms, amenities, and location.'),
  currentRent: z.number().describe('The current monthly rent of the property.'),
  areaDemand: z.string().describe('A description of the current demand for properties in the area.'),
  pastPerformance: z.string().describe('A summary of the property past performance, including occupancy rates and rental history.'),
});
export type PredictRentInput = z.infer<typeof PredictRentInputSchema>;

const PredictRentOutputSchema = z.object({
  recommendedRent: z.number().describe('The AI-recommended optimal monthly rent for the property.'),
  insight: z.string().describe('A brief explanation of why the AI recommends this rent, considering area demand and past performance.'),
});
export type PredictRentOutput = z.infer<typeof PredictRentOutputSchema>;

export async function predictRent(input: PredictRentInput): Promise<PredictRentOutput> {
  return predictRentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictRentPrompt',
  input: {schema: PredictRentInputSchema},
  output: {schema: PredictRentOutputSchema},
  prompt: `You are an AI real estate analyst specializing in rent prediction.

You will use the provided information about a property, its current rent, the area demand, and its past performance to suggest an optimal rent value.

Property Description: {{{propertyDescription}}}
Current Rent: {{{currentRent}}}
Area Demand: {{{areaDemand}}}
Past Performance: {{{pastPerformance}}}

Consider all these factors and provide:
1.  recommendedRent: An optimal monthly rent for the property.
2.  insight: A brief explanation (one or two short sentences) of why you recommend this rent, considering area demand and past performance.

Ensure that the recommended rent is a realistic and justifiable number.
`,
});

const predictRentFlow = ai.defineFlow(
  {
    name: 'predictRentFlow',
    inputSchema: PredictRentInputSchema,
    outputSchema: PredictRentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
