'use server';

/**
 * @fileOverview Provides AI-powered quiz recommendations based on student performance.
 *
 * - quizRecommendation - A function that generates quiz recommendations.
 * - QuizRecommendationInput - The input type for the quizRecommendation function.
 * - QuizRecommendationOutput - The return type for the quizRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizRecommendationInputSchema = z.object({
  studentPerformanceSummary: z
    .string()
    .describe(
      'A summary of the student performance, including areas of strength and weakness.'
    ),
  availableQuizzes: z
    .string()
    .describe('A list of available quizzes with their topics.'),
});
export type QuizRecommendationInput = z.infer<typeof QuizRecommendationInputSchema>;

const QuizRecommendationOutputSchema = z.object({
  recommendedQuizzes: z
    .string()
    .describe(
      'A list of recommended quizzes based on the student performance summary.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the quiz recommendations, explaining why each quiz is recommended.'
    ),
});
export type QuizRecommendationOutput = z.infer<typeof QuizRecommendationOutputSchema>;

export async function quizRecommendation(input: QuizRecommendationInput): Promise<QuizRecommendationOutput> {
  return quizRecommendationFlow(input);
}

const quizRecommendationPrompt = ai.definePrompt({
  name: 'quizRecommendationPrompt',
  input: {schema: QuizRecommendationInputSchema},
  output: {schema: QuizRecommendationOutputSchema},
  prompt: `You are an AI quiz recommendation system. You will be provided with a summary of a student's performance and a list of available quizzes.

  Based on the student's performance, recommend quizzes that will help them improve their understanding of the topics they are struggling with.

  Student Performance Summary: {{{studentPerformanceSummary}}}
  Available Quizzes: {{{availableQuizzes}}}

  Provide a list of recommended quizzes and a brief explanation of why each quiz is recommended. Include the "reasoning" and "recommendedQuizzes" in the output. Make sure the output is valid JSON.`,
});

const quizRecommendationFlow = ai.defineFlow(
  {
    name: 'quizRecommendationFlow',
    inputSchema: QuizRecommendationInputSchema,
    outputSchema: QuizRecommendationOutputSchema,
  },
  async input => {
    const {output} = await quizRecommendationPrompt(input);
    return output!;
  }
);
