
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'recruiter' | 'job-seeker' | null;
}

export interface Student {
  id: number;
  name: string;
  avatarUrl: string;
  dataAiHint: string;
  leetcodeSolved: number;
  githubRepos: {
    name: string;
    tech: string[];
  }[];
  linkedinSkills: string[];
}

export interface RankedCandidate {
  id: number;
  rank: number;
  name: string;
  avatarUrl: string;
  dataAiHint: string;
  totalScore: number;
  keyStrength: string;
  explanation: string;
  details: {
    leetcode: {
      score: number;
      solved: number;
    };
    github: {
      score: number;
      relevantRepos: { name: string; tech: string[] }[];
    };
    linkedin: {
      score: number;
      matchedSkills: string[];
    };
  };
}

export interface JobSkills {
  requiredSkills: string[];
  experienceKeywords: string[];
  technologies: string[];
}
