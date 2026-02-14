'use server';

import { extractJobDescriptionSkills } from '@/ai/flows/extract-job-description-skills';
import { generateCandidateExplanation } from '@/ai/flows/generate-candidate-explanation';
import {
  generateChatResponse,
} from '@/ai/flows/generate-chat-response';
import { generateProfileAnalysis } from '@/ai/flows/generate-profile-analysis';
import { generateMockNotifications } from '@/ai/flows/generate-mock-notifications';
import studentsData from '@/data/students.json';
import type { RankedCandidate, Student, Notification, ChatMessage } from '@/lib/types';

const WEIGHTS = {
  leetCode: 0.3,
  github: 0.4,
  linkedin: 0.3,
};

export async function getRankedCandidates(
  jobDescription: string
): Promise<RankedCandidate[] | { error: string }> {
  if (!jobDescription) {
    return [];
  }

  try {
    const jobSkills = await extractJobDescriptionSkills({ jobDescription });
    const allJobSkills = [
      ...jobSkills.requiredSkills,
      ...jobSkills.experienceKeywords,
      ...jobSkills.technologies,
    ].map(skill => skill.toLowerCase());

    if (allJobSkills.length === 0) {
      return [];
    }
    
    const students: Student[] = studentsData;

    const maxLeetCodeSolved = Math.max(...students.map(s => s.leetcodeSolved), 1);

    const candidatesWithScores = students.map(student => {
      const leetCodeScore = (student.leetcodeSolved / maxLeetCodeSolved) * 100;

      const relevantRepos = student.githubRepos.filter(repo =>
        repo.tech.some(t => allJobSkills.includes(t.toLowerCase()))
      );
      const githubScore = student.githubRepos.length > 0
        ? (relevantRepos.length / student.githubRepos.length) * 100
        : 0;

      const matchedSkills = student.linkedinSkills.filter(skill =>
        allJobSkills.includes(skill.toLowerCase())
      );
      const linkedinScore = allJobSkills.length > 0 ? (matchedSkills.length / allJobSkills.length) * 100 : 0;
      
      const totalScore = 
        leetCodeScore * WEIGHTS.leetCode +
        githubScore * WEIGHTS.github +
        linkedinScore * WEIGHTS.linkedin;

      return {
        ...student,
        totalScore,
        details: {
          leetcode: { score: leetCodeScore, solved: student.leetcodeSolved },
          github: { score: githubScore, relevantRepos },
          linkedin: { score: linkedinScore, matchedSkills },
        },
      };
    });

    const sortedCandidates = candidatesWithScores.sort((a, b) => b.totalScore - a.totalScore);

    const rankedCandidates: RankedCandidate[] = [];
    for (const [index, candidate] of sortedCandidates.entries()) {
      const aiExplanation = await generateCandidateExplanation({
        candidateName: candidate.name,
        candidateScore: Math.round(candidate.totalScore),
        jobDescription,
        requiredSkills: allJobSkills,
        candidateLeetCodeSolved: candidate.leetcodeSolved,
        candidateGithubRepos: candidate.githubRepos,
        candidateLinkedInSkills: candidate.linkedinSkills,
      });

      rankedCandidates.push({
        id: candidate.id,
        rank: index + 1,
        name: candidate.name,
        avatarUrl: candidate.avatarUrl,
        dataAiHint: candidate.dataAiHint,
        totalScore: Math.round(candidate.totalScore),
        keyStrength: aiExplanation.keyStrengthsSummary,
        explanation: aiExplanation.explanation,
        details: {
          leetcode: { ...candidate.details.leetcode, score: Math.round(candidate.details.leetcode.score) },
          github: { ...candidate.details.github, score: Math.round(candidate.details.github.score) },
          linkedin: { ...candidate.details.linkedin, score: Math.round(candidate.details.linkedin.score) },
        },
      });
    }

    return rankedCandidates;
  } catch (error) {
    console.error("Error in getRankedCandidates:", error);
    if (error instanceof Error && error.message.includes('RESOURCE_EXHAUSTED')) {
      return { error: "The request could not be processed due to API rate limits. Please try again in a few moments." };
    }
    return { error: "An unexpected error occurred while ranking candidates. Please try again." };
  }
}

export async function getAiChatResponse(
  context: 'recruiter-assistant' | 'career-coach',
  history: ChatMessage[],
  question: string
): Promise<string> {
  try {
    const response = await generateChatResponse({
      context,
      history: history,
      question,
    });
    return response;
  } catch (error) {
    console.error('Error in getAiChatResponse:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

export async function getProfileAnalysis(
  userName: string,
  profileSummary: string
): Promise<string> {
  try {
    const analysis = await generateProfileAnalysis({ userName, profileSummary });
    return analysis;
  } catch (error) {
    console.error('Error in getProfileAnalysis:', error);
    return 'Could not generate profile analysis at this time.';
  }
}

export async function getMockNotifications(
  userName: string
): Promise<Notification[]> {
  try {
    const result = await generateMockNotifications({ userName });
    return result.notifications;
  } catch (error) {
    console.error('Error in getMockNotifications:', error);
    return [
      {
        id: 1,
        company: 'Error',
        message: 'Could not fetch notifications.',
        time: 'Just now',
        status: 'rejected',
      },
    ];
  }
}

export async function getUserProfileData(
  // In a real app, you'd use the userId to find the correct user
  userId: string
): Promise<Student> {
  // For demonstration, we'll always return the first student
  // to represent the logged-in user.
  const students: Student[] = studentsData;
  return students[0];
}

export async function getProfileStrengthScore(
  userId: string
): Promise<{ score: number, summary: string }> {
    const students: Student[] = studentsData;
    // For demo, we use the first student as the logged-in user
    const currentUser = students[0]; 

    const maxLeetCode = Math.max(...students.map(s => s.leetcodeSolved), 1);
    const maxGithubRepos = Math.max(...students.map(s => s.githubRepos.length), 1);
    const maxLinkedinSkills = Math.max(...students.map(s => s.linkedinSkills.length), 1);

    const leetCodeScore = (currentUser.leetcodeSolved / maxLeetCode) * 100;
    const githubScore = (currentUser.githubRepos.length / maxGithubRepos) * 100;
    const linkedinScore = (currentUser.linkedinSkills.length / maxLinkedinSkills) * 100;

    const totalScore = 
        leetCodeScore * WEIGHTS.leetCode +
        githubScore * WEIGHTS.github +
        linkedinScore * WEIGHTS.linkedin;

    // Generate a simple summary
    let summary = 'Well-rounded profile';
    const scores = {
        'Software Development': githubScore,
        'Problem Solving': leetCodeScore,
        'Professional Skills': linkedinScore,
    };

    const topCategory = Object.keys(scores).reduce((a, b) => scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b);

    if (totalScore > 75) {
        summary = `Excellent profile with strong ${topCategory} skills.`;
    } else if (totalScore > 50) {
        summary = `Solid profile with good ${topCategory} skills.`;
    } else {
        summary = `Profile with potential, especially in ${topCategory}.`;
    }

    return {
        score: Math.round(totalScore),
        summary: summary,
    };
}