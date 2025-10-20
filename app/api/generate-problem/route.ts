import { generateMathProblem } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Generate math problem using our utility function
    const problemData = await generateMathProblem();

    // Save to database
    const { data, error } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: problemData.problem_text,
        correct_answer: problemData.final_answer
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
        final_answer: problemData.final_answer
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
