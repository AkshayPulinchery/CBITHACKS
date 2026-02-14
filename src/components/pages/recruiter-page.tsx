'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  UsersRound,
  AlertCircle,
  Send,
  Sparkles,
  FileUp,
  Upload,
  BrainCircuit,
  Loader2,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import JobDescriptionForm from '@/components/job-description-form';
import CandidateTable from '@/components/candidate-table';
import CandidateDetailsDialog from '@/components/candidate-details-dialog';
import { getRankedCandidates, getAiChatResponse } from '@/app/actions';
import type { RankedCandidate } from '@/lib/types';
import AuthButton from '@/components/auth-button';
import jobTemplates from '@/data/job-templates.json';

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
  const [candidateFile, setCandidateFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'ai' as const, text: 'Hello! Ask me anything about improving your job description or evaluating candidates.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { from: 'user' as const, text: chatInput };
    const newMessages = [...chatMessages, userMessage];
    
    setChatMessages(newMessages);
    const question = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
        const aiResponse = await getAiChatResponse('recruiter-assistant', [], question);
        setChatMessages(prev => [...prev, { from: 'ai' as const, text: aiResponse }]);
    } catch (error) {
        setChatMessages(prev => [...prev, { from: 'ai' as const, text: 'Sorry, I had trouble responding. Please try again.' }]);
    } finally {
        setChatLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setCandidateFile(event.target.files[0]);
      toast({
        title: "File Ready",
        description: `"${event.target.files[0].name}" is selected.`,
      });
    }
  };

  const handleUploadAndRank = () => {
    if (!candidateFile) return;
    toast({
      title: "Feature in development",
      description: "Ranking candidates from a CSV file is coming soon!",
    });
  };

  const handleJobDetailsChange = (fieldName: string, value: string) => {
    setJobDetails(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'custom') {
      setJobDetails({ title: '', responsibilities: '', qualifications: '' });
      return;
    }
    const template = jobTemplates.find((t) => t.id === templateId);
    if (template) {
      setJobDetails({
        title: template.title,
        responsibilities: template.responsibilities,
        qualifications: template.qualifications,
      });
    }
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
          <div className="lg:col-span-2 space-y-8">
            <JobDescriptionForm
              jobDetails={jobDetails}
              onJobDetailsChange={handleJobDetailsChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              templates={jobTemplates}
              onTemplateSelect={handleTemplateSelect}
            />
             <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <FileUp className="w-6 h-6" />
                  Upload Candidates
                </CardTitle>
                <CardDescription>
                  Alternatively, upload a CSV with candidate data. The AI will rank them instead of the default profiles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="csv-upload">Candidate CSV File</Label>
                    <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} disabled={isLoading}/>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUploadAndRank} disabled={!candidateFile || isLoading} className="w-full" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Rank
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="lg:col-span-3 space-y-4">
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
              <div className="flex justify-end">
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
             <Card>
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                      <BrainCircuit />
                      AI Recruiter Assistant
                  </CardTitle>
                  <CardDescription>Get personalized advice to refine your search.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg h-48 overflow-y-auto text-sm space-y-3">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-2 rounded-lg max-w-[80%] ${msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                  {msg.text}
                              </div>
                          </div>
                        ))}
                         {chatLoading && (
                          <div className="flex justify-start">
                            <div className="p-2 rounded-lg bg-background">
                              <Loader2 className="w-4 h-4 animate-spin"/>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                          <Input
                            placeholder="e.g., How to improve my job description?"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={chatLoading}
                          />
                          <Button onClick={handleSendMessage} disabled={chatLoading}>
                            {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </Button>
                      </div>
                  </div>
              </CardContent>
            </Card>
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
