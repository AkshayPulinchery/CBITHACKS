'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UsersRound, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import JobDescriptionForm from '@/components/job-description-form';
import CandidateTable from '@/components/candidate-table';
import CandidateDetailsDialog from '@/components/candidate-details-dialog';
import { getRankedCandidates } from '@/app/actions';
import type { RankedCandidate } from '@/lib/types';
import AuthButton from '@/components/auth-button';

export default function RecruiterPage() {
  const [jobInputs, setJobInputs] = useState({
    jobTitle: '',
    requiredSkills: '',
    experienceKeywords: '',
    technologies: '',
  });
  const [candidates, setCandidates] = useState<RankedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setCandidates([]);
    
    const jobDescription = `
      Job Title: ${jobInputs.jobTitle}. 
      Required Skills: ${jobInputs.requiredSkills}. 
      Experience Keywords: ${jobInputs.experienceKeywords}. 
      Technologies: ${jobInputs.technologies}.
    `;
    
    const result = await getRankedCandidates(jobDescription);
    if ('error' in result) {
      setError(result.error);
    } else {
      setCandidates(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
       <header className="py-4 px-4 md:px-8 border-b bg-background sticky top-0 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <UsersRound className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold">
              SkillRank AI
            </h1>
          </Link>
          <AuthButton />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <JobDescriptionForm
              jobInputs={jobInputs}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-3">
            {error && (
               <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <CandidateTable
              candidates={candidates}
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
