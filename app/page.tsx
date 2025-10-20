'use client'

import { useState, useEffect } from 'react'
import type { Difficulty, ProblemType, MathProblem, UserStats } from '../lib/types'

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
  const [solutionSteps, setSolutionSteps] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  
  // Settings
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [problemType, setProblemType] = useState<ProblemType>('general')
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showStats, setShowStats] = useState(false)
  
  // Stats and History
  const [stats, setStats] = useState<UserStats | null>(null)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats?userId=anonymous')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/history?userId=anonymous&limit=20')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.sessions)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const generateProblem = async () => {
    setIsLoading(true)
    setFeedback('')
    setIsCorrect(null)
    setUserAnswer('')
    setCorrectAnswer(null)
    setShowHint(false)
    setShowSolution(false)
    setHintsUsed(0)
    setSolutionSteps([])
    setStartTime(Date.now())
    
    try {
      const response = await fetch('/api/generate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, problemType }),
      })

      if (!response.ok) throw new Error('Failed to generate problem')

      const data = await response.json()
      setProblem(data.problem)
      setSessionId(data.sessionId)
    } catch (error) {
      console.error('Error generating problem:', error)
      alert('Failed to generate problem. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId || !userAnswer) return
    
    setIsLoading(true)
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    
    try {
      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userAnswer: parseFloat(userAnswer),
          hintsUsed,
          timeSpent
        }),
      })

      if (!response.ok) throw new Error('Failed to submit answer')

      const data = await response.json()
      setFeedback(data.feedback)
      setIsCorrect(data.isCorrect)
      setCorrectAnswer(data.correctAnswer)
      setSolutionSteps(data.solutionSteps || [])
      await loadStats()
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowHint = () => {
    setShowHint(true)
    if (!showHint) {
      setHintsUsed(prev => prev + 1)
    }
  }

  const resetProblem = () => {
    setFeedback('')
    setIsCorrect(null)
    setUserAnswer('')
    setProblem(null)
    setSessionId(null)
    setCorrectAnswer(null)
    setShowHint(false)
    setShowSolution(false)
    setHintsUsed(0)
    setSolutionSteps([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Math Problem Generator
          </h1>
          <p className="text-gray-600 text-lg">Practice Primary 5 Mathematics Problems</p>
          
          {/* Stats Bar */}
          {stats && (
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <span className="text-gray-600">Score:</span>
                <span className="ml-2 font-bold text-blue-600">{stats.total_score}</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <span className="text-gray-600">Accuracy:</span>
                <span className="ml-2 font-bold text-green-600">
                  {stats.total_problems > 0 ? Math.round((stats.correct_answers / stats.total_problems) * 100) : 0}%
                </span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <span className="text-gray-600">Streak:</span>
                <span className="ml-2 font-bold text-orange-600">🔥 {stats.streak}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => {
              setShowStats(!showStats)
              if (!showStats) loadStats()
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            📊 Stats
          </button>
          <button
            onClick={() => {
              setShowHistory(!showHistory)
              if (!showHistory) loadHistory()
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            📜 History
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Problem Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                        difficulty === d
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Type
                </label>
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value as ProblemType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General (Mixed Topics)</option>
                  <option value="addition">Addition</option>
                  <option value="subtraction">Subtraction</option>
                  <option value="multiplication">Multiplication</option>
                  <option value="division">Division</option>
                  <option value="mixed">Mixed Operations</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stats Panel */}
        {showStats && stats && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total_problems}</div>
                <div className="text-sm text-gray-600">Problems Solved</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.correct_answers}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.best_streak}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.total_score}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
            </div>

            <h3 className="font-semibold mb-2 text-gray-700">Difficulty Breakdown</h3>
            <div className="space-y-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
                const diffStats = stats.difficulty_stats[d]
                const percentage = diffStats.total > 0 ? Math.round((diffStats.correct / diffStats.total) * 100) : 0
                return (
                  <div key={d} className="flex items-center gap-2">
                    <span className="w-20 text-sm capitalize">{d}:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16">{percentage}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Problems</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No problems solved yet!</p>
            ) : (
              <div className="space-y-3">
                {history.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 line-clamp-2">{session.problem_text}</p>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        session.math_problem_submissions?.[0]?.is_correct
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {session.math_problem_submissions?.[0]?.is_correct ? '✓ Correct' : '✗ Wrong'}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span className="capitalize">{session.difficulty}</span>
                      <span>•</span>
                      <span className="capitalize">{session.problem_type}</span>
                      <span>•</span>
                      <span>{new Date(session.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Generate Problem Button */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={generateProblem}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Problem...
              </div>
            ) : (
              <span className="text-lg">🎯 Generate New Problem</span>
            )}
          </button>
          
          {problem && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="capitalize inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full mr-2">
                {problem.difficulty}
              </span>
              <span className="capitalize inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                {problem.problem_type}
              </span>
            </div>
          )}
        </div>

        {/* Problem Display */}
        {problem && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              📝 Solve This Problem:
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
              <p className="text-lg text-gray-800 leading-relaxed">
                {problem.problem_text}
              </p>
            </div>
            
            {/* Hint Button */}
            {problem.hint_text && !showHint && !feedback && (
              <button
                onClick={handleShowHint}
                className="mb-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
              >
                💡 Show Hint
              </button>
            )}

            {/* Hint Display */}
            {showHint && problem.hint_text && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">💡 Hint:</p>
                <p className="text-gray-700">{problem.hint_text}</p>
              </div>
            )}
            
            <form onSubmit={submitAnswer} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter your answer"
                  required
                  disabled={!!feedback}
                />
              </div>
              
              {!feedback && (
                <button
                  type="submit"
                  disabled={!userAnswer || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Checking Answer...
                    </div>
                  ) : (
                    '✅ Submit Answer'
                  )}
                </button>
              )}
            </form>
          </div>
        )}

        {/* Feedback Display */}
        {feedback && (
          <div className={`rounded-lg shadow-lg p-6 mb-6 ${isCorrect ? 'bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300' : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300'}`}>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{isCorrect ? '🎉' : '💪'}</div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isCorrect ? 'Excellent Work!' : 'Keep Learning!'}
              </h2>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-gray-800 leading-relaxed">{feedback}</p>
            </div>

            {!isCorrect && correctAnswer !== null && (
              <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-red-500">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Your answer:</strong> {userAnswer}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Correct answer:</strong> {correctAnswer}
                </p>
              </div>
            )}

            {/* Solution Steps */}
            {solutionSteps && solutionSteps.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition mb-2"
                >
                  {showSolution ? '🔼 Hide' : '🔽 Show'} Step-by-Step Solution
                </button>
                
                {showSolution && (
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    {solutionSteps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {hintsUsed > 0 && (
              <p className="text-sm text-gray-600 mb-4">💡 Hints used: {hintsUsed}</p>
            )}

            <button
              onClick={resetProblem}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out shadow-lg"
            >
              ➡️ Try Another Problem
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
