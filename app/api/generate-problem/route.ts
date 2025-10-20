import { generateMathProblem } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import type { Difficulty, ProblemType } from '../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const difficulty: Difficulty = body.difficulty || 'medium';
    const problemType: ProblemType = body.problemType || 'general';

    // Generate math problem using our utility function with difficulty and type
    const problemData = await generateMathProblem(difficulty, problemType);

    // Save to database
    const { data, error } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: problemData.problem_text,
        correct_answer: problemData.final_answer,
        difficulty: problemData.difficulty,
        problem_type: problemData.problem_type,
        hint_text: problemData.hint_text,
        solution_steps: problemData.solution_steps
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save problem to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: data.id,
      problem: {
        problem_text: problemData.problem_text,
        final_answer: problemData.final_answer,
        difficulty: problemData.difficulty,
        problem_type: problemData.problem_type,
        hint_text: problemData.hint_text,
        solution_steps: problemData.solution_steps
      }
    });

  } catch (error) {
    console.error('Error generating problem:', error);
    return NextResponse.json(
      { error: 'Failed to generate problem' },
      { status: 500 }
    );
  }
}
