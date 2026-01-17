"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cpu, Dumbbell, Users, BookOpen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateChallenge, type Challenge } from "./actions/generate-dare";
import { ChallengeDisplay } from "@/components/challenge-display";
import confetti from "canvas-confetti";
import { useDares } from "@/hooks/use-dares";

const categories = [
  {
    id: "tech",
    label: "Tech",
    icon: Cpu,
    description: "Coding, gadgets, and future tech.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "fitness",
    label: "Fitness",
    icon: Dumbbell,
    description: "Workouts, nutrition, and health.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: "social",
    label: "Social",
    icon: Users,
    description: "Connect, events, and community.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "learning",
    label: "Learning",
    icon: BookOpen,
    description: "Books, courses, and skills.",
    color: "bg-orange-500/10 text-orange-500",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");

  const { ongoingDares, completedDares, addDare, completeDare, deleteDare, isLoaded } = useDares();

  const handleCategorySelect = async (categoryId: string) => {
    if (loading) return;
    setSelectedCategory(categoryId);
    setLoading(true);
    setChallenge(null);

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    try {
      const result = await generateChallenge(category.label, userContext, difficulty);
      setChallenge(result);
    } catch (error) {
      console.error("Failed to generate challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChallenge = () => {
    if (challenge) {
      addDare(challenge);
      setChallenge(null);
      setSelectedCategory(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCompleteDare = (id: number) => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
    completeDare(id);
  };

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-8 font-sans transition-colors duration-300">
      <div className="flex w-full max-w-5xl flex-col items-center gap-12 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Dare <span className="text-primary">Yourself</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground sm:text-2xl">
            Escape the boredom loop. Choose your path and challenge your limits everyday.
          </p>
        </div>

        {/* Ongoing Dares Section */}
        {ongoingDares.length > 0 && (
          <div className="w-full flex flex-col items-center gap-6 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              🔥 Active Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
              {ongoingDares.map((dare) => (
                <div key={dare.id} className="relative group">
                  <button
                    onClick={() => deleteDare(dare.id, false)}
                    className="absolute -top-3 -right-3 z-10 bg-destructive text-destructive-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-destructive/90"
                    title="Give up"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChallengeDisplay
                    challenge={dare}
                    mode="ongoing"
                    onAction={() => handleCompleteDare(dare.id)}
                  />
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-border/50 my-4" />
          </div>
        )}

        {/* Generator Section */}
        <div className="w-full flex flex-col items-center justify-center min-h-[400px] gap-8">
          {loading ? (
            <div className="w-full max-w-lg space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : challenge ? (
            <ChallengeDisplay
              challenge={challenge}
              mode="preview"
              onAction={handleAcceptChallenge}
            />
          ) : (
            <>
              {/* Inputs Container */}
              <div className="w-full max-w-md space-y-4 text-left">
                {/* User Context Input */}
                <div className="space-y-2">
                  <label htmlFor="context" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Optional: Add some context (interests, mood, skills)
                  </label>
                  <Textarea
                    id="context"
                    placeholder="e.g., I have a guitar collecting dust, or I want to learn something outdoor related..."
                    className="resize-none"
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                  />
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Difficulty Level
                  </label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category Grid */}
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;

                  return (
                    <Card
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
                        isSelected
                          ? "ring-4 ring-primary ring-opacity-50 border-primary"
                          : "border-border opacity-80 hover:opacity-100"
                      )}
                    >
                      <CardHeader className="flex flex-col items-center gap-4 py-8">
                        <div className={cn("rounded-full p-4 transition-colors", category.color)}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-2xl font-bold">{category.label}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Reset / Selection Status */}
        <div className="mt-8 h-8 font-medium text-foreground">
          {challenge && (
            <button
              onClick={() => {
                setChallenge(null);
                setSelectedCategory(null);
              }}
              className="text-primary hover:underline underline-offset-4"
            >
              Choose another category
            </button>
          )}
          {!challenge && !loading && (
            selectedCategory ? (
              <span>Generating for: <span className="capitalize text-primary">{categories.find(c => c.id === selectedCategory)?.label}</span>...</span>
            ) : (
              <span className="text-muted-foreground text-sm opacity-50">Select a category using the cards above</span>
            )
          )}
        </div>

        {/* Completed Dares Section */}
        {completedDares.length > 0 && (
          <div className="w-full flex flex-col items-center gap-6 mt-12 pt-12 border-t border-border/50">
            <h2 className="text-3xl font-bold text-muted-foreground flex items-center gap-2">
              🏆 Trophy Room ({completedDares.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left opacity-80 hover:opacity-100 transition-opacity">
              {completedDares.map((dare) => (
                <div key={dare.id} className="relative group">
                  <button
                    onClick={() => deleteDare(dare.id, true)}
                    className="absolute -top-2 -right-2 z-10 bg-muted text-muted-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from history"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <ChallengeDisplay challenge={dare} mode="completed" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
