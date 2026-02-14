'use server';
/**
 * @fileOverview A Genkit flow that generates a brief, AI-powered analysis of a user's profile.
 *
 * - generateProfileAnalysis - A function that handles the analysis generation.
 * - ProfileAnalysisInput - The input type for the function.
 * - ProfileAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileAnalysisInputSchema = z.object({
  userName: z.string().describe("The user's name."),
  profileSummary: z.string().describe("A one-sentence summary of the user's profile strength."),
});
export type ProfileAnalysisInput = z.infer<typeof ProfileAnalysisInputSchema>;

export type ProfileAnalysisOutput = string;

const profileAnalysisPrompt = ai.definePrompt({
  name: 'profileAnalysisPrompt',
  input: {schema: ProfileAnalysisInputSchema},
  output: {format: 'text'},
  prompt: `You are an AI Career Coach. A user named {{{userName}}} has the following summary of their profile: "{{{profileSummary}}}".

Based on this summary, generate a short (2-3 sentences), encouraging analysis of their profile. Provide one concrete, actionable suggestion for what they could add to their portfolio or resume to become an even stronger candidate.

Example: "Your resume is strong in React but could benefit from more project details demonstrating your Node.js experience. Consider adding a project that uses a full MERN stack to improve your backend score."
`,
});

const generateProfileAnalysisFlow = ai.defineFlow(
  {
    name: 'generateProfileAnalysisFlow',
    inputSchema: ProfileAnalysisInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    const {text} = await profileAnalysisPrompt(input);
    return text;
  }
);

export async function generateProfileAnalysis(
  input: ProfileAnalysisInput
): Promise<ProfileAnalysisOutput> {
  return generateProfileAnalysisFlow(input);
}
