'use client';

import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobTemplate {
  id: string;
  title: string;
  responsibilities: string;
  qualifications: string;
}

interface JobDescriptionFormProps {
  jobDetails: {
    title: string;
    responsibilities: string;
    qualifications: string;
  };
  onJobDetailsChange: (fieldName: string, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  templates: JobTemplate[];
  onTemplateSelect: (templateId: string) => void;
}

export default function JobDescriptionForm({
  jobDetails,
  onJobDetailsChange,
  onSubmit,
  isLoading,
  templates,
  onTemplateSelect,
}: JobDescriptionFormProps) {
  const isSubmitDisabled = isLoading || !jobDetails.title || !jobDetails.qualifications;

  const selectedTemplate = templates.find(
    (t) =>
      t.title === jobDetails.title &&
      t.responsibilities === jobDetails.responsibilities &&
      t.qualifications === jobDetails.qualifications
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Job Description
        </CardTitle>
        <CardDescription>
          Select a template or fill out the details for the role you're hiring for.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="job-template">Job Template</Label>
          <Select
            value={selectedTemplate?.id || ''}
            onValueChange={onTemplateSelect}
            disabled={isLoading}
          >
            <SelectTrigger id="job-template">
              <SelectValue placeholder="Select a job template..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-- Custom Job Description --</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Senior React Developer"
            value={jobDetails.title}
            onChange={(e) => onJobDetailsChange('title', e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsibilities">Key Responsibilities</Label>
          <Textarea
            id="responsibilities"
            name="responsibilities"
            placeholder="e.g., Building and maintaining web applications, collaborating with designers..."
            value={jobDetails.responsibilities}
            onChange={(e) => onJobDetailsChange('responsibilities', e.target.value)}
            disabled={isLoading}
            rows={8}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qualifications">Required Skills & Qualifications</Label>
          <Textarea
            id="qualifications"
            name="qualifications"
            placeholder="e.g., 5+ years of experience with React, TypeScript, and Node.js..."
            value={jobDetails.qualifications}
            onChange={(e) => onJobDetailsChange('qualifications', e.target.value)}
            disabled={isLoading}
            rows={8}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isSubmitDisabled} className="w-full">
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
