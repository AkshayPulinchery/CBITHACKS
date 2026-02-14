'use server';
/**
 * @fileOverview A Genkit flow that generates a response for an AI assistant chatbot.
 * The AI's persona is determined by the provided context.
 *
 * - generateChatResponse - A function that handles the chat response generation.
 * - ChatResponseInput - The input type for the generateChatResponse function.
 * - ChatResponseOutput - The return type for the generateChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message} from 'genkit/model';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({text: z.string()})),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatResponseInputSchema = z.object({
  context: z
    .enum(['recruiter-assistant', 'career-coach'])
    .describe('The context that defines the AI\'s persona and purpose.'),
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  question: z.string().describe('The user\'s latest question.'),
});
export type ChatResponseInput = z.infer<typeof ChatResponseInputSchema>;

export type ChatResponseOutput = string;

const promptMap = {
  'recruiter-assistant': `You are an expert AI recruiting assistant named SkillRank AI. Your goal is to help recruiters write better job descriptions and evaluate candidates more effectively. Provide concise, actionable advice. Keep your answers brief and to the point.`,
  'career-coach': `You are an expert AI career coach named SkillRank AI. Your goal is to help job seekers improve their professional profiles, resumes, and interview skills. Provide encouraging, clear, and actionable advice. Keep your answers brief and to the point.`,
};

export async function generateChatResponse(input: ChatResponseInput): Promise<ChatResponseOutput> {
  const {context, history, question} = input;
  const systemPrompt = promptMap[context];

  const {text} = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: question,
    history: history.map(m => new Message(m.role, m.content)),
    config: {
      systemPrompt,
    },
  });

  return text;
}
