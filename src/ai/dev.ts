'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/extract-job-description-skills.ts';
import '@/ai/flows/generate-candidate-explanation.ts';
import '@/ai/flows/generate-chat-response.ts';
import '@/ai/flows/generate-profile-analysis.ts';
import '@/ai/flows/generate-mock-notifications.ts';
