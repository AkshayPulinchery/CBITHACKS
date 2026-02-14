
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogIn, Loader2 } from 'lucide-react';

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut, setUserRole } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button onClick={signInWithGoogle}>
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  }
  
  const showRoleDialog = user && !user.role;

  return (
    <>
      <AlertDialog open={showRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to SkillRank AI!</AlertDialogTitle>
            <AlertDialogDescription>
              To get started, please select your role. This will help us tailor your experience.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center flex-row gap-2">
            <Button onClick={() => setUserRole('recruiter')} className="w-full sm:w-auto">I'm a Recruiter</Button>
            <Button onClick={() => setUserRole('job-seeker')} className="w-full sm:w-auto" variant="secondary">I'm a Job Seeker</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
              <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
