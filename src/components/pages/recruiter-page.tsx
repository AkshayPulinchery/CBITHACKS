'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UsersRound, AlertCircle, Send, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import JobDescriptionForm from '@/components/job-description-form';
import CandidateTable from '@/components/candidate-table';
import CandidateDetailsDialog from '@/components/candidate-details-dialog';
import { getRankedCandidates } from '@/app/actions';
import type { RankedCandidate } from '@/lib/types';
import AuthButton from '@/components/auth-button';

const AITopPick = ({ candidate, onSelect }: { candidate: RankedCandidate, onSelect: (c: RankedCandidate) => void }) => (
    <Card className="mb-4 border-primary/50 border-2 shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="w-6 h-6 text-primary" /> AI Top Pick</CardTitle>
            <CardDescription>Our AI has identified this candidate as the strongest match for this role.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-lg">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground italic">"{candidate.keyStrength}"</p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-bold text-primary">{candidate.totalScore}</p>
                    <p className="text-xs text-muted-foreground">Suitability Score</p>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" variant="outline" onClick={() => onSelect(candidate)}>View Full Profile</Button>
        </CardFooter>
    </Card>
);

export default function RecruiterPage() {
  const [jobDetails, setJobDetails] = useState({ title: '', responsibilities: '', qualifications: '' });
  const [candidates, setCandidates] = useState<RankedCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([]);
  const { toast } = useToast();

  const handleJobDetailsChange = (fieldName: string, value: string) => {
    setJobDetails(prev => ({ ...prev, [fieldName]: value }));
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

    const jobDescription = `
      Job Title: ${jobDetails.title}

      Key Responsibilities:
      ${jobDetails.responsibilities}

      Required Skills & Qualifications:
      ${jobDetails.qualifications}
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
              jobDetails={jobDetails}
              onJobDetailsChange={handleJobDetailsChange}
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

            {!isLoading && candidates.length > 0 && (
                <AITopPick candidate={candidates[0]} onSelect={setSelectedCandidate} />
            )}

            {candidates.length > 0 && !isLoading && (
              <div className="flex justify-end mb-4">
                <Button onClick={handleSendInvitation} disabled={selectedCandidateIds.length === 0}>
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
