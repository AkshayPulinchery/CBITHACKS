'use client';

import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface JobDescriptionFormProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function JobDescriptionForm({
  jobDescription,
  setJobDescription,
  onSubmit,
  isLoading,
}: JobDescriptionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Job Description Analyzer
        </CardTitle>
        <CardDescription>
          Paste a job description below to extract skills and rank candidates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="e.g., 'We are looking for a Senior React Developer with 5+ years of experience...'"
          className="min-h-[300px] resize-y"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isLoading}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ranking...
            </>
          ) : (
            'Rank Candidates'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
