"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const ChallengeSchema = z.object({
    title: z.string(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    estimatedTime: z.string(),
    steps: z.array(z.string()),
    funFact: z.string(),
});

export type Challenge = z.infer<typeof ChallengeSchema>;

export async function generateChallenge(category: string, userContext: string = "") {
    "use server";

    const prompt = `Generate a fun and engaging "dare" challenge for the category: "${category}".
  Context specifically for this user: "${userContext}".
  The challenge should be actionable, exciting, and help them break their boredom loop.`;

    const { object } = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: ChallengeSchema,
        prompt: prompt,
    });

    return object;
}
