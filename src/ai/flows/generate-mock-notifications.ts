'use server';
/**
 * @fileOverview A Genkit flow that generates a list of mock, realistic notifications for a job seeker.
 *
 * - generateMockNotifications - A function that handles the notification generation.
 * - MockNotificationsInput - The input type for the function.
 * - MockNotificationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MockNotificationsInputSchema = z.object({
  userName: z.string().describe("The job seeker's name."),
});
export type MockNotificationsInput = z.infer<typeof MockNotificationsInputSchema>;

const NotificationSchema = z.object({
  id: z.number().describe('A unique numeric ID for the notification.'),
  company: z.string().describe('The name of the company, e.g., "Innovate Inc.", "Tech Solutions".'),
  message: z.string().describe('The notification message, e.g., "has viewed your profile.", "sent you an interview invitation."'),
  time: z.string().describe('A relative time string, e.g., "2h ago", "1d ago".'),
  status: z.enum(['viewed', 'invited', 'rejected']).describe('The status of the notification.'),
});

const MockNotificationsOutputSchema = z.object({
  notifications: z.array(NotificationSchema).describe('A list of 3-4 realistic but mock notifications.'),
});
export type MockNotificationsOutput = z.infer<typeof MockNotificationsOutputSchema>;

const mockNotificationsPrompt = ai.definePrompt({
  name: 'mockNotificationsPrompt',
  input: {schema: MockNotificationsInputSchema},
  output: {schema: MockNotificationsOutputSchema},
  prompt: `You are an AI for a job-seeking platform. Your task is to generate a list of 3 to 4 realistic, mock notifications for a user named {{{userName}}}.

The notifications should be varied and include profile views, interview invitations, and rejections. Use plausible, fictional company names. The output must be a JSON object with a single key "notifications" which is an array of notification objects.
`,
});

const generateMockNotificationsFlow = ai.defineFlow(
  {
    name: 'generateMockNotificationsFlow',
    inputSchema: MockNotificationsInputSchema,
    outputSchema: MockNotificationsOutputSchema,
  },
  async input => {
    const {output} = await mockNotificationsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate mock notifications.');
    }
    return output;
  }
);

export async function generateMockNotifications(
  input: MockNotificationsInput
): Promise<MockNotificationsOutput> {
  return generateMockNotificationsFlow(input);
}
