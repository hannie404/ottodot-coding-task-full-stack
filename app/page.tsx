'use client'

import { useState } from 'react'

interface MathProblem {
  problem_text: string
  final_answer: number
}

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)

  const generateProblem = async () => {
    setIsLoading(true);
    setFeedback('');
    setIsCorrect(null);
    setUserAnswer('');
    setCorrectAnswer(null);
    
    try {
      const response = await fetch('/api/generate-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate problem');
      }

      const data = await response.json();
      setProblem(data.problem);
      setSessionId(data.sessionId);
    } catch (error) {
      console.error('Error generating problem:', error);
      alert('Failed to generate problem. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !userAnswer) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userAnswer: parseFloat(userAnswer),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setIsCorrect(data.isCorrect);
      setCorrectAnswer(data.correctAnswer);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Math Problem Generator
          </h1>
          <p className="text-gray-600">Practice Primary 5 Mathematics Problems</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <button
            onClick={generateProblem}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:hover:scale-100 disabled:hover:bg-gray-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Problem...
              </div>
            ) : (
              'Generate New Problem'
            )}
          </button>
        </div>

        {problem && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 flex items-center">
              Solve This Problem:
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                {problem.problem_text}
              </p>
            </div>
            
            <form onSubmit={submitAnswer} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <input
                  type="number"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your answer"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!userAnswer || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 disabled:hover:scale-100 disabled:hover:bg-gray-400"
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
            </form>
          </div>
        )}

        {feedback && (
          <div className={`rounded-lg shadow-lg p-4 sm:p-6 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
              {isCorrect ? 'Excellent work!' : 'Keep learning!'}
            </h2>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4">{feedback}</p>
            {!isCorrect && correctAnswer !== null && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Your answer:</strong> {userAnswer}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Correct answer:</strong> {correctAnswer}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setFeedback('');
                setIsCorrect(null);
                setUserAnswer('');
                setProblem(null);
                setSessionId(null);
                setCorrectAnswer(null);
              }}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
            >
              Try Another Problem
            </button>
          </div>
        )}
      </main>
    </div>
  )
}