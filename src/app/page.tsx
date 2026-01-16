"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, Dumbbell, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateChallenge, type Challenge } from "./actions/generate-dare";
import { ChallengeDisplay } from "@/components/challenge-display";

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

  const handleCategorySelect = async (categoryId: string) => {
    if (loading) return;
    setSelectedCategory(categoryId);
    setLoading(true);
    setChallenge(null);

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    try {
      const result = await generateChallenge(category.label);
      setChallenge(result);
    } catch (error) {
      console.error("Failed to generate challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 font-sans transition-colors duration-300">
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

        {/* Challenge Display Area */}
        <div className="w-full flex justify-center min-h-[400px]">
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
            <ChallengeDisplay challenge={challenge} />
          ) : (
            /* Category Grid - Only show when no challenge is displayed or maybe show always but dim? 
               User request: "When a category card is clicked... store selection" 
               Refined UX: Start with Grid. When clicked, show loading then Challenge. 
               Maybe hide grid? Or move it? 
               If I replace, how to go back?
               let's show Grid if !challenge && !loading.
               Or show Grid always but maybe smaller?
               Let's keep Grid VISIBLE but maybe interactive state handled.
               Actually, let's just render the grid if !challenge.
            */
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
      </div>
    </div>
  );
}
