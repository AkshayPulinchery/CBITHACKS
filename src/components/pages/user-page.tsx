'use client';

import Link from 'next/link';
import {
  UsersRound,
  User,
  Github,
  Linkedin,
  Code,
  FileText,
  Award,
  Bell,
  Upload,
  BrainCircuit,
  Send,
} from 'lucide-react';
import AuthButton from '@/components/auth-button';
import { useAuth } from '@/contexts/auth-context';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

function ProfileLinkInput({
  icon,
  id,
  label,
  placeholder,
}: {
  icon: React.ReactNode;
  id: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-muted p-3 rounded-full">{icon}</div>
      <div className="flex-grow">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <Input id={id} placeholder={placeholder} className="mt-1" />
      </div>
    </div>
  );
}

function DocumentUpload({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
        {icon}
        <div className="flex-grow">
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload
        </Button>
    </div>
  );
}


export default function UserPage() {
  const { user } = useAuth();
  
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'ai', text: 'Hello! How can I help you improve your portfolio today?' }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { from: 'user', text: chatInput };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');

    // Mock AI response
    setTimeout(() => {
      const aiResponse = "That's a great question. To showcase your React skills, consider building a project with custom hooks, state management (like Redux or Zustand), and integration with a REST API. Make sure to deploy it and add it to your resume!";
      setChatMessages(prev => [...prev, { from: 'ai', text: aiResponse }]);
    }, 1000);
  };

  // Mock data for notifications
  const notifications = [
      { id: 1, company: "Innovate Inc.", message: "has viewed your profile.", time: "2h ago", status: "viewed" },
      { id: 2, company: "Tech Solutions", message: "sent you an interview invitation for the Frontend Developer role.", time: "1d ago", status: "invited" },
      { id: 3, company: "Creative Minds", message: "rejected your application.", time: "3d ago", status: "rejected" }
  ];

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
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Profile & Score */}
            <div className="lg:col-span-1 flex flex-col gap-8">
                <Card>
                    <CardHeader className="text-center items-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                            <AvatarFallback className="text-4xl">{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="font-headline text-2xl">{user?.displayName || 'Job Seeker'}</CardTitle>
                        <CardDescription>This is your personal dashboard.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">Your SkillRank Score</CardTitle>
                        <CardDescription>Based on your profile and documents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-bold text-primary">88</div>
                        <p className="text-muted-foreground mt-2">Excellent Match for Frontend Roles</p>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Inputs & Notifications */}
            <div className="lg:col-span-2 flex flex-col gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Your Professional Profiles</CardTitle>
                        <CardDescription>Link your profiles to improve your score.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <ProfileLinkInput 
                            icon={<Linkedin className="w-6 h-6 text-primary" />}
                            id="linkedin"
                            label="LinkedIn Profile"
                            placeholder="https://linkedin.com/in/your-profile"
                       />
                        <ProfileLinkInput 
                            icon={<Github className="w-6 h-6 text-primary" />}
                            id="github"
                            label="GitHub Profile"
                            placeholder="https://github.com/your-username"
                       />
                       <ProfileLinkInput 
                            icon={<Code className="w-6 h-6 text-primary" />}
                            id="leetcode"
                            label="LeetCode Profile"
                            placeholder="https://leetcode.com/your-username"
                       />
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Your Documents</CardTitle>
                        <CardDescription>Upload your resume and certificates for AI analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DocumentUpload
                            icon={<FileText className="w-6 h-6 text-primary" />}
                            title="Your Resume"
                            description="Upload your latest resume (PDF, DOCX)."
                        />
                         <DocumentUpload
                            icon={<Award className="w-6 h-6 text-primary" />}
                            title="Certifications"
                            description="Upload any relevant certificates."
                        />
                    </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                      <CardTitle className="font-headline flex items-center gap-2">
                          <BrainCircuit />
                          AI Career Coach
                      </CardTitle>
                      <CardDescription>Get personalized advice to boost your profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div>
                          <h4 className="font-semibold mb-2">Resume & Score Analysis</h4>
                          <p className="text-sm text-muted-foreground">
                              Your resume is strong in React but could benefit from more project details demonstrating your Node.js experience. Consider adding a project that uses a full MERN stack to improve your backend score.
                          </p>
                      </div>
                      <Separator />
                      <div>
                          <h4 className="font-semibold mb-2">Ask a Doubt</h4>
                          <div className="space-y-4">
                              <div className="p-4 bg-muted/50 rounded-lg h-48 overflow-y-auto text-sm space-y-3">
                                {chatMessages.map((msg, index) => (
                                  <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`p-2 rounded-lg max-w-[80%] ${msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                          {msg.text}
                                      </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                  <Input 
                                    placeholder="e.g., How can I showcase my React skills?" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                  />
                                  <Button onClick={handleSendMessage}><Send className="w-4 h-4" /></Button>
                              </div>
                          </div>
                      </div>
                  </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Bell />
                            Notifications
                        </CardTitle>
                        <CardDescription>Updates from recruiters will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {notifications.map((notif, index) => (
                                <li key={notif.id}>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 text-primary p-2 rounded-full mt-1">
                                            {notif.status === 'invited' && <User className="w-5 h-5"/>}
                                            {notif.status === 'viewed' && <UsersRound className="w-5 h-5"/>}
                                            {notif.status === 'rejected' && <UsersRound className="w-5 h-5"/>}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm"><span className="font-semibold">{notif.company}</span> {notif.message}</p>
                                            <p className="text-xs text-muted-foreground">{notif.time}</p>
                                        </div>
                                    </div>
                                    {index < notifications.length - 1 && <Separator className="mt-4" />}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
