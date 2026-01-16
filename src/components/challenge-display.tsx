import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Lightbulb, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/app/actions/generate-dare";

interface ChallengeDisplayProps {
    challenge: Challenge;
    onAccept?: () => void;
}

export function ChallengeDisplay({ challenge, onAccept }: ChallengeDisplayProps) {
    const difficultyColor = {
        Easy: "bg-green-500 hover:bg-green-600 border-transparent",
        Medium: "bg-yellow-500 hover:bg-yellow-600 border-transparent",
        Hard: "bg-red-500 hover:bg-red-600 border-transparent",
    };

    return (
        <Card className="w-full max-w-lg border-2 shadow-xl animate-in fade-in zoom-in duration-300">
            <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                    <Badge
                        className={cn("text-white capitalize px-3 py-1 text-sm font-medium shadow-sm", difficultyColor[challenge.difficulty])}
                        variant="outline"
                    >
                        {challenge.difficulty}
                    </Badge>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="mr-1 h-4 w-4" />
                        {challenge.estimatedTime}
                    </div>
                </div>
                <CardTitle className="text-3xl font-bold leading-tight tracking-tight">
                    {challenge.title}
                </CardTitle>
                <CardDescription className="flex items-start gap-2 text-base font-medium text-primary bg-primary/5 p-3 rounded-lg">
                    <Lightbulb className="h-5 w-5 shrink-0 mt-0.5" />
                    {challenge.funFact}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-semibold text-foreground/80">
                        <Trophy className="h-4 w-4" />
                        Your Mission Steps:
                    </h4>
                    <ul className="grid gap-3">
                        {challenge.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3 text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={onAccept} className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all" size="lg">
                    Accept Challenge
                </Button>
            </CardFooter>
        </Card>
    );
}
