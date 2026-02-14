'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, User, Loader2, UsersRound } from 'lucide-react';

const RoleCard = ({ icon, title, description, onSelect, isLoading }: { icon: React.ReactNode, title: string, description: string, onSelect: () => void, isLoading: boolean }) => (
    <Card onClick={onSelect} className="cursor-pointer hover:border-primary transition-colors text-center flex flex-col items-center pt-6">
        <CardHeader className="p-0">
            <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full">
                {icon}
            </div>
        </CardHeader>
        <CardContent className="pt-4">
            <CardTitle className="font-headline mb-2">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            {isLoading && <Loader2 className="mt-4 h-5 w-5 animate-spin mx-auto" />}
        </CardContent>
    </Card>
);


export default function RoleSelectionPage() {
    const { user, setUserRole, loading: authLoading } = useAuth();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<'recruiter' | 'job-seeker' | null>(null);

    useEffect(() => {
        if (authLoading) return; // Wait until auth state is determined

        if (!user) {
            router.replace('/');
        } else if (user.role) {
            if (user.role === 'recruiter') {
                router.replace('/recruiter');
            } else if (user.role === 'job-seeker') {
                router.replace('/user');
            }
        }
    }, [user, authLoading, router]);

    const handleRoleSelect = async (role: 'recruiter' | 'job-seeker') => {
        if (selectedRole) return;
        setSelectedRole(role);
        try {
            await setUserRole(role);
            if (role === 'recruiter') {
              router.push('/recruiter');
            } else {
              router.push('/user');
            }
        } catch (error) {
            console.error("Failed to set user role:", error);
            setSelectedRole(null);
        }
    };
    
    if (authLoading || !user || user.role) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col">
             <header className="py-4 px-4 md:px-8 border-b bg-background sticky top-0 backdrop-blur-sm z-10">
                <div className="container mx-auto flex items-center justify-start">
                <div className="flex items-center gap-3">
                    <UsersRound className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-headline font-bold">
                    SkillRank AI
                    </h1>
                </div>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="container mx-auto p-4 md:p-8 max-w-2xl text-center">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">One last step, {user?.displayName}!</h2>
                    <p className="text-muted-foreground mb-8">
                        To help us tailor your experience, please select your role.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <RoleCard
                            icon={<Briefcase className="w-10 h-10" />}
                            title="Recruiter"
                            description="I'm here to find and rank top talent for open positions."
                            onSelect={() => handleRoleSelect('recruiter')}
                            isLoading={selectedRole === 'recruiter'}
                        />
                        <RoleCard
                            icon={<User className="w-10 h-10" />}
                            title="Job Seeker"
                            description="I'm looking to see how my skills match up with job roles."
                            onSelect={() => handleRoleSelect('job-seeker')}
                            isLoading={selectedRole === 'job-seeker'}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
