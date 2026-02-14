'use client';

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import type { RankedCandidate } from '@/lib/types';

interface CandidateTableProps {
  candidates: RankedCandidate[];
  isLoading: boolean;
  onRowClick: (candidate: RankedCandidate) => void;
  selectedIds: number[];
  onSelect: (candidateId: number) => void;
  onSelectAll: () => void;
}

const getScoreBadgeVariant = (score: number) => {
  if (score > 80) return 'default';
  if (score > 60) return 'secondary';
  return 'outline';
};

function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell className="px-4">
            <Skeleton className="h-4 w-4" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-6 rounded-full" />
          </TableCell>
          <TableCell className="font-medium">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-12 rounded-md" />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function CandidateTable({
  candidates,
  isLoading,
  onRowClick,
  selectedIds,
  onSelect,
  onSelectAll,
}: CandidateTableProps) {
  const hasCandidates = candidates.length > 0;
  const numSelected = selectedIds.length;
  const rowCount = candidates.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Candidate Rankings</CardTitle>
        <CardDescription>
          {isLoading
            ? 'Analyzing and ranking candidates...'
            : hasCandidates
            ? 'Candidates ranked by suitability. Click a row for details.'
            : 'No candidates ranked yet. Enter a job description to start.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] px-4">
                   <Checkbox
                    checked={rowCount > 0 && numSelected === rowCount}
                    onCheckedChange={onSelectAll}
                    disabled={isLoading || !hasCandidates}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead className="w-[100px]">Score</TableHead>
                <TableHead className="hidden md:table-cell">Key Strength</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableSkeleton />}
              {!isLoading && hasCandidates && candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  onClick={() => onRowClick(candidate)}
                  className="cursor-pointer"
                  data-state={selectedIds.includes(candidate.id) && "selected"}
                >
                  <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(candidate.id)}
                      onCheckedChange={() => onSelect(candidate.id)}
                      aria-label={`Select ${candidate.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-bold text-lg text-muted-foreground">{candidate.rank}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage asChild src={candidate.avatarUrl}>
                          <Image src={candidate.avatarUrl} alt={candidate.name} width={40} height={40} data-ai-hint={candidate.dataAiHint} />
                        </AvatarImage>
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getScoreBadgeVariant(candidate.totalScore)} className="text-lg">
                      {candidate.totalScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{candidate.keyStrength}</TableCell>
                </TableRow>
              ))}
              {!isLoading && !hasCandidates && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Results will appear here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
