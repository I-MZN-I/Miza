'use server';

/**
 * @fileOverview Provides AI-driven budget planning suggestions for property owners.
 *
 * - aiBudgetPlanner - A function that provides budget planning insights.
 * - AiBudgetPlannerInput - The input type for the aiBudgetPlanner function.
 * - AiBudgetPlannerOutput - The return type for the aiBudgetPlanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiBudgetPlannerInputSchema = z.object({
  monthlyIncome: z.number().describe('Total monthly income from all properties.'),
  monthlyExpenses: z.number().describe('Total monthly expenses across all properties.'),
  currentSavings: z.number().describe('The current total savings amount.'),
  investmentPreferences: z.string().describe('The investment preferences of the user (e.g., low risk, high growth).'),
});
export type AiBudgetPlannerInput = z.infer<typeof AiBudgetPlannerInputSchema>;

const AiBudgetPlannerOutputSchema = z.object({
  savingsGoal: z.number().describe('The suggested monthly savings goal.'),
  expenseLimits: z.object({
    maintenance: z.number().describe('Suggested monthly spending limit for maintenance.'),
    utilities: z.number().describe('Suggested monthly spending limit for utilities.'),
    other: z.number().describe('Suggested monthly spending limit for other expenses.'),
  }).describe('Suggested expense limits by category.'),
  investmentTips: z.string().describe('AI-generated investment tips based on user preferences and financial situation.'),
});
export type AiBudgetPlannerOutput = z.infer<typeof AiBudgetPlannerOutputSchema>;

export async function aiBudgetPlanner(input: AiBudgetPlannerInput): Promise<AiBudgetPlannerOutput> {
  return aiBudgetPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiBudgetPlannerPrompt',
  input: {schema: AiBudgetPlannerInputSchema},
  output: {schema: AiBudgetPlannerOutputSchema},
  prompt: `You are an AI financial advisor specializing in property management finances. Based on the property owner's income, expenses, current savings, and investment preferences, provide personalized suggestions for a monthly savings goal, expense limits by category (maintenance, utilities, and other), and investment tips.

Income: {{{monthlyIncome}}}
Expenses: {{{monthlyExpenses}}}
Current Savings: {{{currentSavings}}}
Investment Preferences: {{{investmentPreferences}}}

Consider the following when creating your suggestion:
- The savings goal should be realistic and achievable, aiming to optimize for growth.
- Expense limits should be broken down into categories and should not affect property values.
- Investment tips should align with the user's stated preferences and overall financial goals.

Output your suggestion in JSON format. Follow the schema description to provide maximum assistance to the user.`, 
});

const aiBudgetPlannerFlow = ai.defineFlow(
  {
    name: 'aiBudgetPlannerFlow',
    inputSchema: AiBudgetPlannerInputSchema,
    outputSchema: AiBudgetPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
