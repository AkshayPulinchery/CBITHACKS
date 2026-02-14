'use client';

import React from 'react';
import { FileText, Loader2, Upload } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

interface JobDescriptionFormProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function JobDescriptionForm({
  jobDescription,
  onJobDescriptionChange,
  onFileChange,
  onSubmit,
  isLoading,
}: JobDescriptionFormProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Job Description
        </CardTitle>
        <CardDescription>
          Paste the full job description below, or upload a text file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Full Job Description</Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              placeholder="e.g., We're looking for a Senior React Developer with 5+ years of experience in building modern web applications with React, TypeScript, and Node.js..."
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              disabled={isLoading}
              rows={15}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                    Or
                </span>
            </div>
          </div>
          <div>
            <Input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileChange}
              accept=".txt,.md"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload from File (.txt, .md)
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isLoading || !jobDescription} className="w-full">
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
