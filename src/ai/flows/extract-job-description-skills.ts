'use server';
/**
 * @fileOverview A Genkit flow for extracting required skills, experience keywords, and technologies from a job description.
 *
 * - extractJobDescriptionSkills - A function that handles the extraction process.
 * - JobDescriptionSkillExtractorInput - The input type for the extractJobDescriptionSkills function.
 * - JobDescriptionSkillExtractorOutput - The return type for the extractJobDescriptionSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobDescriptionSkillExtractorInputSchema = z.object({
  jobDescription: z.string().describe('The full text of the job description.'),
});
export type JobDescriptionSkillExtractorInput = z.infer<
  typeof JobDescriptionSkillExtractorInputSchema
>;

const JobDescriptionSkillExtractorOutputSchema = z.object({
  requiredSkills:
    z.array(z.string()).describe('A list of required technical and soft skills.'),
  experienceKeywords:
    z.array(z.string()).describe(
      'A list of keywords related to required experience levels or types (e.g., "senior", "team lead", "startup experience").'
    ),
  technologies:
    z.array(z.string()).describe(
      'A list of specific technologies, frameworks, or programming languages mentioned (e.g., "React", "Node.js", "Python", "AWS").'
    ),
});
export type JobDescriptionSkillExtractorOutput = z.infer<
  typeof JobDescriptionSkillExtractorOutputSchema
>;

export async function extractJobDescriptionSkills(
  input: JobDescriptionSkillExtractorInput
): Promise<JobDescriptionSkillExtractorOutput> {
  return jobDescriptionSkillExtractorFlow(input);
}

const jobDescriptionSkillExtractorPrompt = ai.definePrompt({
  name: 'jobDescriptionSkillExtractorPrompt',
  input: {schema: JobDescriptionSkillExtractorInputSchema},
  output: {schema: JobDescriptionSkillExtractorOutputSchema},
  prompt: `You are an expert recruiter AI. Your task is to analyze a job description and extract the required skills, experience keywords, and technologies.

The output must be a JSON object with three fields: \`requiredSkills\` (an array of strings), \`experienceKeywords\` (an array of strings), and \`technologies\` (an array of strings).

Job Description:
{{{jobDescription}}}`,
});

const jobDescriptionSkillExtractorFlow = ai.defineFlow(
  {
    name: 'jobDescriptionSkillExtractorFlow',
    inputSchema: JobDescriptionSkillExtractorInputSchema,
    outputSchema: JobDescriptionSkillExtractorOutputSchema,
  },
  async input => {
    const {output} = await jobDescriptionSkillExtractorPrompt(input);
    if (!output) {
      throw new Error('Failed to extract job description skills.');
    }
    return output;
  }
);
