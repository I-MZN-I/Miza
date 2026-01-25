'use server';

/**
 * @fileOverview Automatically generates a property report with key data, charts, and AI insights.
 *
 * - generateReport - A function that generates the report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  propertySummary: z.string().describe('Summary of the property.'),
  income: z.number().describe('Total income from the property.'),
  expenses: z.number().describe('Total expenses for the property.'),
  profit: z.number().describe('Total profit from the property.'),
  charts: z.string().describe('Base64 encoded chart data.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated report in PDF format (base64 encoded).'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const incorporateInsights = ai.defineTool({
  name: 'incorporateInsights',
  description: 'Incorporate property insights into a financial report.',
  inputSchema: z.object({
    reportContent: z.string().describe('The main content of the report.'),
    propertySummary: z.string().describe('Summary of the property.'),
    income: z.number().describe('Total income from the property.'),
    expenses: z.number().describe('Total expenses for the property.'),
    profit: z.number().describe('Total profit from the property.'),
  }),
  outputSchema: z.string().describe('The report content with incorporated insights.'),
},
async (input) => {
    // For now, just returning the report content without adding insights.
    // The actual implementation will require LLM to enrich the report.
    return input.reportContent;
  }
);

const generateReportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  tools: [incorporateInsights],
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are an AI report generator. You will create a financial report for a property.

Property Summary: {{{propertySummary}}}
Income: {{{income}}}
Expenses: {{{expenses}}}
Profit: {{{profit}}}
Charts: {{{charts}}}

Generate a PDF report (base64 encoded) summarizing the property, income, expenses and profit, including relevant charts.  Incorporate insights using the incorporateInsights tool.
`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const reportContent = `Property Summary: ${input.propertySummary}\nIncome: ${input.income}\nExpenses: ${input.expenses}\nProfit: ${input.profit}\nCharts: ${input.charts}`;

    const updatedReportContent = await incorporateInsights({
      reportContent: reportContent,
      propertySummary: input.propertySummary,
      income: input.income,
      expenses: input.expenses,
      profit: input.profit,
    });

    // Mock PDF generation (replace with actual PDF generation logic)
    const pdfBase64 = Buffer.from(updatedReportContent).toString('base64');

    return {report: pdfBase64};
  }
);
