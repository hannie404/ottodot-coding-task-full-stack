import { generateFeedback } from '../../../lib/gemini';
import { supabase } from '../../../lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userAnswer } = await request.json();

    if (!sessionId || userAnswer === undefined || userAnswer === null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the problem session to compare answers
    const { data: session, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Problem session not found' },
        { status: 404 }
      );
    }

    const userAnswerNum = parseFloat(userAnswer);
    const isCorrect = Math.abs(userAnswerNum - session.correct_answer) < 0.01; // Allow small floating point differences

    // Generate personalized feedback using our utility function
    const feedbackText = await generateFeedback(
      session.problem_text,
      session.correct_answer,
      userAnswerNum,
      isCorrect
    );

    // Save submission to database
    const { data: submission, error: submissionError } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id: sessionId,
        user_answer: userAnswerNum,
        is_correct: isCorrect,
        feedback_text: feedbackText
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Database error:', submissionError);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      isCorrect,
      feedback: feedbackText,
      correctAnswer: session.correct_answer,
      submissionId: submission.id
    });

  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
