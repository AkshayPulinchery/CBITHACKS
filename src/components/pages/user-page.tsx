
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UsersRound, User, Loader2 } from 'lucide-react';
import AuthButton from '@/components/auth-button';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function UserPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/');
    } else if (!user.role) {
      router.replace('/role-selection');
    } else if (user.role !== 'job-seeker') {
      router.replace('/recruiter');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'job-seeker') {
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <User />
                    Job Seeker Dashboard
                </CardTitle>
                <CardDescription>
                    Welcome, {user.displayName}! This is your personal dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    The job seeker experience is currently under construction. Check back soon for features that help you match with the perfect job!
                </p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
