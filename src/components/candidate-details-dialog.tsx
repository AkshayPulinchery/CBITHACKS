'use client';

import Image from 'next/image';
import { BarChart, GitFork, Linkedin, BrainCircuit, Star, Tag } from 'lucide-react';
import type { RankedCandidate } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CandidateDetailsDialogProps {
  candidate: RankedCandidate | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScoreCard = ({ icon, title, score, children }: { icon: React.ReactNode, title: string, score: number, children: React.ReactNode }) => (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
                {icon}
                <span>{title}</span>
            </div>
            <Badge variant={score > 70 ? "default" : "secondary"}>{score}</Badge>
        </div>
        <div className="text-sm text-muted-foreground pl-1">{children}</div>
    </div>
);

export default function CandidateDetailsDialog({
  candidate,
  isOpen,
  onOpenChange,
}: CandidateDetailsDialogProps) {
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle asChild>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                 <AvatarImage asChild src={candidate.avatarUrl}>
                    <Image src={candidate.avatarUrl} alt={candidate.name} width={64} height={64} data-ai-hint={candidate.dataAiHint} />
                </AvatarImage>
                <AvatarFallback className="text-2xl">{candidate.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-headline font-bold">{candidate.name}</h2>
                <p className="text-muted-foreground">Overall Suitability Score: <span className="font-bold text-primary">{candidate.totalScore}</span></p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div>
                <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-primary"/>AI-Generated Summary</h3>
                <p className="text-sm text-muted-foreground italic mb-2">"{candidate.keyStrength}"</p>
                <p className="text-sm leading-relaxed">{candidate.explanation}</p>
            </div>
            <Separator />
            <div>
                 <h3 className="font-headline text-lg font-semibold mb-4">Score Breakdown</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <ScoreCard icon={<BarChart className="w-4 h-4"/>} title="LeetCode" score={candidate.details.leetcode.score}>
                        Solved: {candidate.details.leetcode.solved} problems
                     </ScoreCard>
                     <ScoreCard icon={<GitFork className="w-4 h-4"/>} title="GitHub" score={candidate.details.github.score}>
                        {candidate.details.github.relevantRepos.length} relevant repos
                     </ScoreCard>
                     <ScoreCard icon={<Linkedin className="w-4 h-4"/>} title="LinkedIn" score={candidate.details.linkedin.score}>
                       {candidate.details.linkedin.matchedSkills.length} matching skills
                     </ScoreCard>
                 </div>
            </div>
            {candidate.details.github.relevantRepos.length > 0 && (
                 <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" />Relevant Repositories</h4>
                    <ul className="space-y-2">
                        {candidate.details.github.relevantRepos.map(repo => (
                            <li key={repo.name} className="text-sm text-muted-foreground">{repo.name}</li>
                        ))}
                    </ul>
                 </div>
            )}
             {candidate.details.linkedin.matchedSkills.length > 0 && (
                 <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><Tag className="w-4 h-4 text-sky-500" />Matched Skills</h4>
                     <div className="flex flex-wrap gap-2">
                        {candidate.details.linkedin.matchedSkills.map(skill => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                    </div>
                 </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
