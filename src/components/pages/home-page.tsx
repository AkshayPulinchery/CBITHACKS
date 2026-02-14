
'use client';

import { UsersRound, FileText, BarChart, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthButton from '@/components/auth-button';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { AuthDialog } from '@/components/auth-dialog';

export default function HomePage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleGetStartedClick = () => {
    if (user) {
      if (user.role === 'recruiter') {
        router.push('/recruiter');
      } else if (user.role === 'job-seeker') {
        router.push('/user');
      } else {
        router.push('/role-selection');
      }
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-4 px-4 md:px-8 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UsersRound className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold">
              SkillRank AI
            </h1>
          </div>
          <AuthButton />
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto text-center py-20 md:py-32 px-4">
          <h2 className="text-4xl md:text-6xl font-headline font-bold mb-4 leading-tight">
            Find the Perfect Candidate, Faster.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            SkillRank AI uses advanced artificial intelligence to analyze your job descriptions and automatically rank candidates based on their true qualifications. Say goodbye to manual screening.
          </p>
          <Button size="lg" onClick={handleGetStartedClick} disabled={loading}>
             {user ? "Go to Dashboard" : "Get Started Now"}
          </Button>
        </section>

        {/* How It Works Section */}
        <section className="bg-muted/50 py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-headline font-bold mb-4">How It Works</h3>
              <p className="text-muted-foreground mb-12">
                A simple, three-step process to find your ideal hire.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <FileText className="w-8 h-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="mb-2 text-xl font-headline font-semibold">1. Paste Job Description</h4>
                  <p className="text-muted-foreground">
                    Provide the complete job description for the role you're looking to fill. Our AI will instantly parse the requirements.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                </CardHeader>
                <CardContent>
                   <h4 className="mb-2 text-xl font-headline font-semibold">2. AI Analysis</h4>
                  <p className="text-muted-foreground">
                    Our system evaluates candidates against key skills, technologies, and experience levels mentioned in your description.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                     <BarChart className="w-8 h-8" />
                  </div>
                </CardHeader>
                <CardContent>
                   <h4 className="mb-2 text-xl font-headline font-semibold">3. Get Ranked Results</h4>
                  <p className="text-muted-foreground">
                    Receive a clear, ranked list of applicants with detailed scoring breakdowns, helping you focus on the best-fit candidates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-20 md:py-24 px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-headline font-bold mb-4">Features for Modern Recruiting</h3>
               <p className="text-muted-foreground mb-12">
                Everything you need to make smarter hiring decisions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-headline font-bold text-xl mb-2">AI-Powered Skill Extraction</h4>
                    <p className="text-muted-foreground">Goes beyond keywords to understand the context and importance of different skills.</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                    <h4 className="font-headline font-bold text-xl mb-2">Holistic Candidate Scoring</h4>
                    <p className="text-muted-foreground">Evaluates profiles from multiple sources like GitHub and LinkedIn for a complete picture.</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                    <h4 className="font-headline font-bold text-xl mb-2">In-depth Candidate Insights</h4>
                    <p className="text-muted-foreground">Generates AI summaries explaining why a candidate is a good match for the role.</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                    <h4 className="font-headline font-bold text-xl mb-2">Fair & Unbiased Ranking</h4>
                    <p className="text-muted-foreground">Focuses purely on skills and experience to reduce hiring bias.</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                    <h4 className="font-headline font-bold text-xl mb-2">Easy to Use</h4>
                    <p className="text-muted-foreground">No complex setup. Just paste your job description and see the results.</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                    <h4 className="font-headline font-bold text-xl mb-2">Saves Time & Effort</h4>
                    <p className="text-muted-foreground">Dramatically reduce the time you spend on initial candidate screening.</p>
                </div>
            </div>
        </section>
      </main>

        {/* Footer */}
        <footer className="border-t py-6 bg-muted/50">
            <div className="container mx-auto text-center text-muted-foreground px-4">
                <p>&copy; {year} SkillRank AI. All rights reserved.</p>
            </div>
        </footer>
    </div>
    <AuthDialog open={isAuthDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
