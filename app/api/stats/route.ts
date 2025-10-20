import { supabase } from '../../../lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';

    // Get or create user stats
    let { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // User stats doesn't exist, create it
      const { data: newStats, error: createError } = await supabase
        .from('user_stats')
        .insert({ user_id: userId })
        .select()
        .single();

      if (createError) {
        console.error('Error creating stats:', createError);
        return NextResponse.json(
          { error: 'Failed to create user stats' },
          { status: 500 }
        );
      }
      stats = newStats;
    } else if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, isCorrect, difficulty, problemType } = await request.json();

    // Get current stats
    let { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId || 'anonymous')
      .single();

    if (error && error.code === 'PGRST116') {
      // Create new stats
      const { data: newStats, error: createError } = await supabase
        .from('user_stats')
        .insert({ user_id: userId || 'anonymous' })
        .select()
        .single();

      if (createError) throw createError;
      stats = newStats;
    } else if (error) {
      throw error;
    }

    // Update stats
    const newTotalProblems = stats.total_problems + 1;
    const newCorrectAnswers = stats.correct_answers + (isCorrect ? 1 : 0);
    const newScore = stats.total_score + (isCorrect ? (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30) : 0);
    const newStreak = isCorrect ? stats.streak + 1 : 0;
    const newBestStreak = Math.max(stats.best_streak, newStreak);

    // Update difficulty stats
    const difficultyStats = stats.difficulty_stats || { easy: { total: 0, correct: 0 }, medium: { total: 0, correct: 0 }, hard: { total: 0, correct: 0 } };
    if (difficulty && difficultyStats[difficulty]) {
      difficultyStats[difficulty].total += 1;
      difficultyStats[difficulty].correct += isCorrect ? 1 : 0;
    }

    // Update type stats
    const typeStats = stats.type_stats || { addition: 0, subtraction: 0, multiplication: 0, division: 0, mixed: 0, general: 0 };
    if (problemType && typeStats[problemType] !== undefined) {
      typeStats[problemType] += 1;
    }

    const { data: updatedStats, error: updateError } = await supabase
      .from('user_stats')
      .update({
        total_problems: newTotalProblems,
        correct_answers: newCorrectAnswers,
        total_score: newScore,
        streak: newStreak,
        best_streak: newBestStreak,
        last_activity: new Date().toISOString(),
        difficulty_stats: difficultyStats,
        type_stats: typeStats
      })
      .eq('user_id', userId || 'anonymous')
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ stats: updatedStats });

  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
}
