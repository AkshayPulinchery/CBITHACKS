'use client';

import { useState } from 'react';
import { UsersRound } from 'lucide-react';
import type { RankedCandidate } from '@/lib/types';
import { getRankedCandidates } from '@/app/actions';
import JobDescriptionForm from '@/components/job-description-form';
import CandidateTable from '@/components/candidate-table';
import CandidateDetailsDialog from '@/components/candidate-details-dialog';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [jobDescription, setJobDescription] = useState('');
  const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);
  const { toast } = useToast();

  const handleRanking = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Job Description Empty',
        description: 'Please paste a job description before ranking.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setRankedCandidates([]);
    const result = await getRankedCandidates(jobDescription);
    
    if ('error' in result) {
      toast({
        title: 'An Error Occurred',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      setRankedCandidates(result);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 md:px-8 border-b">
        <div className="container mx-auto flex items-center gap-3">
          <UsersRound className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-foreground">
            SkillRank AI
          </h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-8">
            <JobDescriptionForm
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              onSubmit={handleRanking}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <CandidateTable
              candidates={rankedCandidates}
              isLoading={isLoading}
              onSelectCandidate={setSelectedCandidate}
            />
          </div>
        </div>
      </main>
      <CandidateDetailsDialog
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onOpenChange={(isOpen) => !isOpen && setSelectedCandidate(null)}
      />
    </div>
  );
}
