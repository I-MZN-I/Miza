'use server';
/**
 * @fileOverview Extracts key information from lease documents using AI.
 *
 * - extractLeaseDetails - A function that extracts details from lease documents.
 * - ExtractLeaseDetailsInput - The input type for the extractLeaseDetails function.
 * - ExtractLeaseDetailsOutput - The return type for the extractLeaseDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractLeaseDetailsInputSchema = z.object({
  leaseDocumentDataUri: z
    .string()
    .describe(
      'A lease document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type ExtractLeaseDetailsInput = z.infer<typeof ExtractLeaseDetailsInputSchema>;

const ExtractLeaseDetailsOutputSchema = z.object({
  tenantName: z.string().describe('The name of the tenant.'),
  rentAmount: z.number().describe('The monthly rent amount.'),
  leaseDuration: z.string().describe('The duration of the lease (e.g., 12 months).'),
  renewalDate: z.string().describe('The lease renewal date (e.g., 2024-12-31).'),
});
export type ExtractLeaseDetailsOutput = z.infer<typeof ExtractLeaseDetailsOutputSchema>;

export async function extractLeaseDetails(
  input: ExtractLeaseDetailsInput
): Promise<ExtractLeaseDetailsOutput> {
  return extractLeaseDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractLeaseDetailsPrompt',
  input: {schema: ExtractLeaseDetailsInputSchema},
  output: {schema: ExtractLeaseDetailsOutputSchema},
  prompt: `You are an expert in real estate document analysis.  Your job is to extract key information from lease documents.

  Analyze the provided lease document and extract the following information:

  - Tenant Name: The full name of the tenant.
  - Rent Amount: The monthly rent amount specified in the lease.
  - Lease Duration: The total duration of the lease agreement (e.g., 12 months, 1 year).
  - Renewal Date: The date on which the lease is up for renewal.

  Here is the lease document:
  {{media url=leaseDocumentDataUri}}

  Ensure that the extracted information is accurate and complete. If any information is missing or unclear, indicate it as "N/A".
  Output in JSON format.
`,
});

const extractLeaseDetailsFlow = ai.defineFlow(
  {
    name: 'extractLeaseDetailsFlow',
    inputSchema: ExtractLeaseDetailsInputSchema,
    outputSchema: ExtractLeaseDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
