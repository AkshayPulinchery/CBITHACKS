'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UsersRound, AlertCircle, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import JobDescriptionForm from '@/components/job-description-form';
import CandidateTable from '@/components/candidate-table';
import CandidateDetailsDialog from '@/components/candidate-details-dialog';
import { getRankedCandidates } from '@/app/actions';
import type { RankedCandidate } from '@/lib/types';
import AuthButton from '@/components/auth-button';

export default function RecruiterPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [candidates, setCandidates] = useState<RankedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([]);
  const { toast } = useToast();

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJobDescription(text);
      toast({
        title: "File loaded",
        description: `Successfully loaded ${file.name}.`,
      });
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File error",
            description: "There was an error reading the file.",
        });
    }
    reader.readAsText(file);

    // Reset file input to allow re-uploading the same file
    e.target.value = '';
  };

  const handleCandidateSelect = (candidateId: number) => {
    setSelectedCandidateIds(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidateIds.length === candidates.length) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(candidates.map(c => c.id));
    }
  };
  
  const handleSendInvitation = () => {
    toast({
      title: "Invitations Sent!",
      description: `Interview invitations have been sent to ${selectedCandidateIds.length} candidate(s).`,
    });
    setSelectedCandidateIds([]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setCandidates([]);
    setSelectedCandidateIds([]);
    
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
              jobDescription={jobDescription}
              onJobDescriptionChange={handleJobDescriptionChange}
              onFileChange={handleFileChange}
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

            {selectedCandidateIds.length > 0 && (
              <div className="flex justify-end mb-4">
                <Button onClick={handleSendInvitation}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Interview Invitation ({selectedCandidateIds.length})
                </Button>
              </div>
            )}

            <CandidateTable
              candidates={candidates}
              isLoading={isLoading}
              onRowClick={setSelectedCandidate}
              selectedIds={selectedCandidateIds}
              onSelect={handleCandidateSelect}
              onSelectAll={handleSelectAll}
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
