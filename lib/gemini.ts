import { GoogleGenAI } from '@google/genai';
import type { GeminiImagePart, GeminiContentPart } from './types';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

const ai = new GoogleGenAI({});

/**
 * Simple text-only generation
 */
export async function askGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || '';
  } catch (error) {
    console.error('Error in askGemini:', error);
    throw new Error(`Failed to generate content: ${error}`);
  }
}

/**
 * Text + multiple images (for future use)
 * Note: Will need to be updated when image support is available in new SDK
 */
export async function askGeminiWithImages(
  prompt: string,
  images: GeminiImagePart[],
): Promise<string> {
  try {
    // TODO: Update when image support is available in new SDK
    console.warn('Image support not yet implemented with new SDK');
    return await askGemini(prompt);
  } catch (error) {
    console.error('Error in askGeminiWithImages:', error);
    throw new Error(`Failed to generate content with images: ${error}`);
  }
}

/**
 * Create a chat session for conversational AI
 * TODO: Update when chat support is available in new SDK
 */
export function createChatSession(systemInstruction?: string) {
  console.warn('Chat sessions not yet implemented with new SDK');
  return null;
}

/**
 * Generate math problem using structured prompt
 */
export async function generateMathProblem(): Promise<{
  problem_text: string;
  final_answer: number;
}> {
  const prompt = `
    You are a Primary 5 mathematics teacher in Singapore creating word problems based on the Singapore Primary Mathematics curriculum.
    
    Generate a single math word problem suitable for Primary 5 students (ages 10-11). The problem should focus on these Primary 5 topics:
    
    **Core Topics:**
    - Fractions: Add, subtract, multiply, divide proper and improper fractions, mixed numbers
    - Decimals: Operations with decimals up to 2 decimal places
    - Percentages: Finding percentages of quantities, percentage increase/decrease
    - Area and Perimeter: Rectangles, squares, compound shapes
    - Volume: Rectangular prisms/containers (length × width × height)
    - Ratio and Proportion: Simple ratios, sharing in given ratios
    - Rate: Speed/distance/time, rate of work problems
    - Money: Multi-step money problems, discounts, GST
    
    **Requirements:**
    - Use Singapore context (SGD currency, local places/activities)
    - Real-world scenarios (shopping at NTUC, void deck activities, school events, hawker centers, etc.)
    - Clear, solvable numerical answer (whole number or decimal up to 2 places)
    - Appropriate vocabulary for 10-11 year olds
    - Multi-step problem that requires logical thinking
    
    **Example contexts to use:**
    - Shopping for ingredients at the wet market
    - Planning a class party or school event
    - Sports day activities and timing
    - Sharing pizza or snacks among friends
    - Calculating travel time on MRT/bus
    - Playground or void deck games
    
    Return ONLY a valid JSON object with this exact format:
    {
      "problem_text": "Your Singapore-contextualized word problem here",
      "final_answer": numerical_answer_only
    }
    
    Do not include any explanation or additional text outside the JSON.
  `;

  const response = await askGemini(prompt);
  
  // Clean up the response - remove any markdown formatting
  let cleanResponse = response.trim();
  if (cleanResponse.startsWith('```json')) {
    cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/```$/, '');
  }
  if (cleanResponse.startsWith('```')) {
    cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/```$/, '');
  }

  try {
    const parsed = JSON.parse(cleanResponse);
    if (!parsed.problem_text || typeof parsed.final_answer !== 'number') {
      throw new Error('Invalid response format');
    }
    return parsed;
  } catch (error) {
    console.error('Failed to parse math problem response:', response);
    throw new Error('Failed to parse AI response for math problem');
  }
}

/**
 * Generate personalized feedback for student answers
 */
export async function generateFeedback(
  problemText: string,
  correctAnswer: number,
  userAnswer: number,
  isCorrect: boolean
): Promise<string> {
  const prompt = `
    You are a supportive Primary 5 mathematics teacher providing feedback to a student.
    
    Problem: ${problemText}
    Correct Answer: ${correctAnswer}
    Student's Answer: ${userAnswer}
    Is Correct: ${isCorrect}
    
    Provide encouraging, constructive feedback for this Primary 5 student (age 10-11):
    
    If correct:
    - Congratulate them enthusiastically
    - Briefly explain why their answer is right
    - Encourage them to try more problems
    
    If incorrect:
    - Be encouraging and supportive (no negative language)
    - Gently explain what went wrong without making them feel bad
    - Give a hint or step-by-step guidance to help them understand
    - Show them the correct answer and method
    - Encourage them to try again
    
    Keep the feedback:
    - Friendly and age-appropriate for 10-11 year olds
    - Educational but not overwhelming
    - Positive and encouraging
    - Maximum 3-4 sentences
    
    Do not mention that you are an AI. Write as a teacher.
  `;

  return await askGemini(prompt);
}

export { ai };
