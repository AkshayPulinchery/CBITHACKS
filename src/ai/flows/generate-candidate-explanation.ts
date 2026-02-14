'use server';
/**
 * @fileOverview A Genkit flow that generates an AI-powered explanation for a candidate's suitability score,
 * highlighting their strengths and alignment with job requirements.
 *
 * - generateCandidateExplanation - A function that handles the explanation generation process.
 * - CandidateExplanationInput - The input type for the generateCandidateExplanation function.
 * - CandidateExplanationOutput - The return type for the generateCandidateExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for generating a candidate explanation
const CandidateExplanationInputSchema = z.object({
  candidateName: z.string().describe('The name of the candidate.'),
  candidateScore: z.number().describe('The suitability score calculated for the candidate.'),
  jobDescription: z.string().describe('The full job description for the role.'),
  requiredSkills: z.array(z.string()).describe('A list of skills extracted as required for the job.'),
  candidateLeetCodeSolved: z.number().optional().describe('Total number of LeetCode problems solved by the candidate.'),
  candidateGithubRepos: z.array(z.object({
    name: z.string().describe('Name of the repository.'),
    tech: z.array(z.string()).describe('Technologies used in the repository.')
  })).optional().describe('List of GitHub repositories with associated technologies.'),
  candidateLinkedInSkills: z.array(z.string()).optional().describe('List of skills mentioned on the candidate\'s LinkedIn profile.'),
});
export type CandidateExplanationInput = z.infer<typeof CandidateExplanationInputSchema>;

// Output schema for the generated explanation
const CandidateExplanationOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the candidate\'s suitability, strengths, and alignment with job requirements.'),
  keyStrengthsSummary: z.string().describe('A concise summary of the candidate\'s key strengths.'),
});
export type CandidateExplanationOutput = z.infer<typeof CandidateExplanationOutputSchema>;

// Wrapper function to call the Genkit flow
export async function generateCandidateExplanation(input: CandidateExplanationInput): Promise<CandidateExplanationOutput> {
  return generateCandidateExplanationFlow(input);
}

// Define the prompt for generating candidate explanations
const generateCandidateExplanationPrompt = ai.definePrompt({
  name: 'candidateExplanationPrompt',
  input: {schema: CandidateExplanationInputSchema},
  output: {schema: CandidateExplanationOutputSchema},
  prompt: `You are an AI assistant for a recruitment system. Your task is to generate a concise and clear explanation for a candidate's suitability score based on the provided job description and candidate profile.
Highlight the candidate's key strengths and how they align with the job requirements. Also provide a short summary of their key strengths.

Job Description:
{{{jobDescription}}}

Required Skills for the Job:
{{#each requiredSkills}}- {{{this}}}
{{/each}}

Candidate Name: {{{candidateName}}}
Candidate Suitability Score: {{{candidateScore}}}%

Candidate Profile Details:
{{#if candidateLeetCodeSolved}}
  LeetCode Problems Solved: {{{candidateLeetCodeSolved}}}
{{/if}}
{{#if candidateGithubRepos}}
  GitHub Repositories:
  {{#each candidateGithubRepos}}
    - Repo Name: "{{{name}}}", Technologies: {{#each tech}}'{{{this}}}' {{/each}}
  {{/each}}
{{/if}}
{{#if candidateLinkedInSkills}}
  LinkedIn Skills:
  {{#each candidateLinkedInSkills}}
    - {{{this}}}
  {{/each}}
{{/if}}

Based on the above information, provide a detailed explanation of why {{{candidateName}}} received a suitability score of {{{candidateScore}}}%. Focus on linking their profile details to the job's required skills and the overall job description.
Also, provide a 'keyStrengthsSummary' which is a brief, one-sentence summary of their primary strengths for this role.

Example Output Structure:
{
  "explanation": "Detailed explanation here...",
  "keyStrengthsSummary": "Brief summary here."
}
`,
});

// Define the Genkit flow for generating candidate explanations
const generateCandidateExplanationFlow = ai.defineFlow(
  {
    name: 'generateCandidateExplanationFlow',
    inputSchema: CandidateExplanationInputSchema,
    outputSchema: CandidateExplanationOutputSchema,
  },
  async (input) => {
    const {output} = await generateCandidateExplanationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate candidate explanation.');
    }
    return output;
  }
);
