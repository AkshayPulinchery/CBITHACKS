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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JobDescriptionFormProps {
  jobInputs: {
    jobTitle: string;
    requiredSkills: string;
    experienceKeywords: string;
    technologies: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function JobDescriptionForm({
  jobInputs,
  onInputChange,
  onSubmit,
  isLoading,
}: JobDescriptionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Job Description
        </CardTitle>
        <CardDescription>
          Enter the details for the role you are looking to fill.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="e.g., Senior React Developer"
              value={jobInputs.jobTitle}
              onChange={onInputChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requiredSkills">Required Skills</Label>
            <Input
              id="requiredSkills"
              name="requiredSkills"
              placeholder="e.g., JavaScript, TypeScript, Team Leadership"
              value={jobInputs.requiredSkills}
              onChange={onInputChange}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Comma-separated skills.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experienceKeywords">Experience Keywords</Label>
            <Input
              id="experienceKeywords"
              name="experienceKeywords"
              placeholder="e.g., 5+ years, startup experience, agile"
              value={jobInputs.experienceKeywords}
              onChange={onInputChange}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Comma-separated keywords.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies</Label>
            <Input
              id="technologies"
              name="technologies"
              placeholder="e.g., React, Node.js, AWS, Docker"
              value={jobInputs.technologies}
              onChange={onInputChange}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Comma-separated technologies.</p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isLoading || !jobInputs.jobTitle} className="w-full">
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
