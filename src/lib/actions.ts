'use server';

import { quizRecommendation } from '@/ai/flows/quiz-recommendation';
import type { QuizRecommendationInput } from '@/ai/flows/quiz-recommendation';

export async function getQuizRecommendation(input: QuizRecommendationInput) {
  try {
    const result = await quizRecommendation(input);
    return result;
  } catch (error) {
    console.error('Error getting quiz recommendation:', error);
    return {
      error: 'Failed to generate recommendations. Please try again later.',
    };
  }
}
