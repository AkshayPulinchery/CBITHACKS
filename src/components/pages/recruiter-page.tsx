
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UsersRound, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import JobDescriptionForm from '@/components/job-description-form';
import CandidateTable from '@/components/candidate-table';
import CandidateDetailsDialog from '@/components/candidate-details-dialog';
import { getRankedCandidates } from '@/app/actions';
import type { RankedCandidate } from '@/lib/types';
import AuthButton from '@/components/auth-button';
import { useAuth } from '@/contexts/auth-context';

export default function RecruiterPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [candidates, setCandidates] = useState<RankedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/');
    } else if (!user.role) {
      router.replace('/role-selection');
    } else if (user.role !== 'recruiter') {
      router.replace('/user');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setCandidates([]);
    const result = await getRankedCandidates(jobDescription);
    if ('error' in result) {
      setError(result.error);
    } else {
      setCandidates(result);
    }
    setIsLoading(false);
  };

  if (authLoading || !user || user.role !== 'recruiter') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
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
