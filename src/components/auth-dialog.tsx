'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpDisplayName, setSignUpDisplayName] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const appUser = await signIn(signInEmail, signInPassword);
      onOpenChange(false);
      toast({ title: 'Success', description: 'Logged in successfully.' });
      
      if (appUser.role === 'recruiter') {
        router.push('/recruiter');
      } else if (appUser.role === 'job-seeker') {
        router.push('/user');
      } else {
        router.push('/role-selection');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (signUpPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
    }
    try {
      await signUp(signUpEmail, signUpPassword, signUpDisplayName);
      onOpenChange(false);
      toast({ title: 'Success', description: 'Account created successfully.' });
      router.push('/role-selection');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = (newOpenState: boolean) => {
    if (!newOpenState) {
      setError(null);
      setSignInEmail('');
      setSignInPassword('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpDisplayName('');
    }
    onOpenChange(newOpenState);
  };


  return (
    <Dialog open={open} onOpenChange={resetState}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to SkillRank AI</DialogTitle>
          <DialogDescription>
            Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full" onValueChange={() => setError(null)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="m@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                  <Label htmlFor="signup-name">Display Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="John Doe"
                    value={signUpDisplayName}
                    onChange={(e) => setSignUpDisplayName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password (min. 6 characters)</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
