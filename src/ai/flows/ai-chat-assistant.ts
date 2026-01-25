'use server';

/**
 * @fileOverview This file defines the AI Chat Assistant flow, which allows users to ask questions about their properties and finances.
 *
 * - aiChatAssistant - A function that processes user questions and provides insights about properties and finances.
 * - AIChatAssistantInput - The input type for the aiChatAssistant function, representing the user's question.
 * - AIChatAssistantOutput - The return type for the aiChatAssistant function, representing the AI's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatAssistantInputSchema = z.object({
  question: z.string().describe('The user question about their properties and finances.'),
});
export type AIChatAssistantInput = z.infer<typeof AIChatAssistantInputSchema>;

const AIChatAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user question.'),
});
export type AIChatAssistantOutput = z.infer<typeof AIChatAssistantOutputSchema>;

export async function aiChatAssistant(input: AIChatAssistantInput): Promise<AIChatAssistantOutput> {
  return aiChatAssistantFlow(input);
}

const aiChatAssistantPrompt = ai.definePrompt({
  name: 'aiChatAssistantPrompt',
  input: {schema: AIChatAssistantInputSchema},
  output: {schema: AIChatAssistantOutputSchema},
  prompt: `You are an AI assistant for property owners. Answer the following question about their properties and finances:

Question: {{{question}}}

Answer: `,
});

const aiChatAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatAssistantFlow',
    inputSchema: AIChatAssistantInputSchema,
    outputSchema: AIChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await aiChatAssistantPrompt(input);
    return output!;
  }
);
