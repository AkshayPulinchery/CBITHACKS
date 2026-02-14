'use server';

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

  // FAKE skill extraction: just split the job description into words.
  const allJobSkills = jobDescription.toLowerCase().split(/[\s,.;:()]+/).filter(word => word.length > 3);

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

  const rankedCandidates: RankedCandidate[] = sortedCandidates.map((candidate, index) => {
    // FAKE explanation
    const keyStrength = "Matches key skills from job description.";
    const explanation = `Based on a direct keyword analysis of the job description, ${candidate.name}'s profile shows a strong correlation with the required skills. Their experience in relevant technologies and a solid problem-solving background contribute to their high score. (Note: This is a simplified analysis as AI features are currently disabled.)`;

    return {
      id: candidate.id,
      rank: index + 1,
      name: candidate.name,
      avatarUrl: candidate.avatarUrl,
      dataAiHint: candidate.dataAiHint,
      totalScore: Math.round(candidate.totalScore),
      keyStrength: keyStrength,
      explanation: explanation,
      details: {
        leetcode: { ...candidate.details.leetcode, score: Math.round(candidate.details.leetcode.score) },
        github: { ...candidate.details.github, score: Math.round(candidate.details.github.score) },
        linkedin: { ...candidate.details.linkedin, score: Math.round(candidate.details.linkedin.score) },
      },
    };
  });

  return rankedCandidates;
}

export async function getAiChatResponse(
  context: 'recruiter-assistant' | 'career-coach',
  history: ChatMessage[],
  question: string
): Promise<string> {
  const responses = {
    'recruiter-assistant': "Thank you for your question. AI-powered chat is currently in a simplified mode. For now, focus on providing a detailed job description to get the best results.",
    'career-coach': "Thanks for asking! AI-powered career coaching is in a simplified mode. I recommend ensuring your GitHub and LinkedIn profiles are connected and up-to-date for an accurate score."
  };
  // Add a small delay to simulate a network request
  await new Promise(resolve => setTimeout(resolve, 500));
  return responses[context];
}

export async function getProfileAnalysis(
  userName: string,
  profileSummary: string
): Promise<string> {
  // Add a small delay to simulate a network request
  await new Promise(resolve => setTimeout(resolve, 300));
  return `Your profile summary shows: "${profileSummary}". To improve, consider adding more projects to your GitHub that showcase a variety of technologies. A detailed README for each project is also highly recommended. (Note: This is a generic analysis as AI features are currently disabled.)`;
}

export async function getMockNotifications(
  userName: string
): Promise<Notification[]> {
  // Add a small delay to simulate a network request
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    {
      "id": 1,
      "company": "Innovate Inc.",
      "message": "has viewed your profile.",
      "time": "2h ago",
      "status": "viewed"
    },
    {
      "id": 2,
      "company": "Tech Solutions",
      "message": "sent you an interview invitation.",
      "time": "1d ago",
      "status": "invited"
    },
    {
      "id": 3,
      "company": "DataCorp",
      "message": "is no longer considering your application.",
      "time": "3d ago",
      "status": "rejected"
    }
  ];
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
