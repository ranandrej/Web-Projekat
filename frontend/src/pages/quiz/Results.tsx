import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuiz } from '@/hooks/useQuiz'
import { QuizAttempt } from '@/types'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  HomeIcon,
  ArrowPathIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

const Results = () => {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const { getAttemptDetails, loading } = useQuiz()
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)

  useEffect(() => {
    loadResults()
  }, [attemptId])

  const loadResults = async () => {
    if (!attemptId) return
    const result = await getAttemptDetails(attemptId)
    if (result) setAttempt(result)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDuration = (startTime: string, endTime: string): string => {
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const durationSeconds = Math.floor((end - start) / 1000)
    return formatTime(durationSeconds)
  }

  const getScoreGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const getPerformanceMessage = (percentage: number): string => {
    if (percentage >= 90) return 'Outstanding! 🌟'
    if (percentage >= 80) return 'Great Job! 🎉'
    if (percentage >= 70) return 'Good Work! 👍'
    if (percentage >= 60) return 'Not Bad! 💪'
    return 'Keep Practicing! 📚'
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 text-lg">Loading results...</p>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center card-premium p-12">
          <div className="inline-flex p-6 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-16 w-16 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Results Not Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find the results you're looking for.</p>
          <Button variant="primary" onClick={() => navigate('/my-results')}>
            View All Results
          </Button>
        </div>
      </div>
    )
  }

  const correctAnswers = attempt.userAnswers.filter(a => a.isCorrect).length
  const totalQuestions = attempt.userAnswers.length

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="card-premium p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="inline-flex p-6 rounded-[24px] bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-xl mb-6">
            <TrophyIcon className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-3">
            {getPerformanceMessage(attempt.percentage)}
          </h1>
          <p className="text-xl text-gray-600 mb-8">{attempt.quiz.title}</p>

          {/* Score Display */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className={`text-6xl font-black ${
              attempt.percentage >= 80 ? 'text-teal-600' :
              attempt.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {Math.round(attempt.percentage)}%
            </div>
            <div className={`text-4xl font-black px-6 py-3 rounded-2xl border-4 ${
              attempt.percentage >= 80 ? 'bg-teal-50 border-teal-300 text-teal-700' :
              attempt.percentage >= 60 ? 'bg-amber-50 border-amber-300 text-amber-700' :
              'bg-red-50 border-red-300 text-red-700'
            }`}>
              {getScoreGrade(attempt.percentage)}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckIcon className="h-5 w-5 text-teal-600" />
                <span className="text-2xl font-black text-gray-900">{correctAnswers}/{totalQuestions}</span>
              </div>
              <div className="text-xs text-gray-600 font-bold uppercase">Correct</div>
            </div>

            <div className="card p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ClockIcon className="h-5 w-5 text-violet-600" />
                <span className="text-2xl font-black text-gray-900">{formatDuration(attempt.startedAt, attempt.finishedAt || attempt.startedAt)}</span>
              </div>
              <div className="text-xs text-gray-600 font-bold uppercase">Time</div>
            </div>

            <div className="card p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrophyIcon className="h-5 w-5 text-amber-600" />
                <span className="text-2xl font-black text-gray-900">{attempt.score}/{attempt.totalPoints}</span>
              </div>
              <div className="text-xs text-gray-600 font-bold uppercase">Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="card p-6">
        <h2 className="text-2xl font-black text-gray-900 mb-6">📝 Question Review</h2>

        <div className="space-y-4">
          {attempt.userAnswers.map((userAnswer, index) => (
            <div
              key={userAnswer.id}
              className={`card-interactive p-5 border-2 ${
                userAnswer.isCorrect
                  ? 'bg-teal-50/50 border-teal-200'
                  : 'bg-red-50/50 border-red-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-white shadow-lg ${
                    userAnswer.isCorrect
                      ? 'bg-gradient-to-br from-teal-500 to-emerald-500'
                      : 'bg-gradient-to-br from-red-500 to-pink-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {userAnswer.isCorrect ? (
                      <CheckCircleIcon className="h-6 w-6 text-teal-600" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-600" />
                    )}
                    <span className={`font-bold ${
                      userAnswer.isCorrect ? 'text-teal-700' : 'text-red-700'
                    }`}>
                      {userAnswer.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>
                <Badge variant={userAnswer.isCorrect ? 'success' : 'danger'}>
                  {userAnswer.pointsEarned}/{userAnswer.question.points} pts
                </Badge>
              </div>

              {/* Question Text */}
              <p className="text-lg font-semibold text-gray-900 mb-4">
                {userAnswer.question.questionText}
              </p>

              {/* Answers */}
              <div className="space-y-2">
                {userAnswer.question.answers.map((answer, ansIdx) => {
                  const isSelected = userAnswer.selectedAnswerIds.includes(answer.id)
                  const isCorrect = answer.isCorrect

                  let bgClass = 'bg-white border-gray-200'
                  let textClass = 'text-gray-700'

                  if (isSelected && isCorrect) {
                    bgClass = 'bg-teal-50 border-teal-300'
                    textClass = 'text-teal-900'
                  } else if (isSelected && !isCorrect) {
                    bgClass = 'bg-red-50 border-red-300'
                    textClass = 'text-red-900'
                  } else if (!isSelected && isCorrect) {
                    bgClass = 'bg-violet-50 border-violet-300'
                    textClass = 'text-violet-900'
                  }

                  return (
                    <div
                      key={answer.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 ${bgClass}`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                        isSelected || isCorrect ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + ansIdx)}
                      </div>
                      <span className={`flex-1 font-medium ${textClass}`}>
                        {answer.answerText}
                      </span>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                            Your choice
                          </Badge>
                        )}
                        {isCorrect && !isSelected && (
                          <Badge variant="primary" size="sm">
                            Correct
                          </Badge>
                        )}
                        {isSelected && isCorrect && (
                          <CheckIcon className="h-5 w-5 text-teal-600" strokeWidth={3} />
                        )}
                        {isSelected && !isCorrect && (
                          <XMarkIcon className="h-5 w-5 text-red-600" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="accent"
            size="md"
            onClick={() => navigate(`/quizzes/${attempt.quizId}/take`)}
            className="gap-2"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Retake Quiz
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/quizzes/${attempt.quizId}`)}
            className="gap-2"
          >
            <EyeIcon className="h-5 w-5" />
            Quiz Details
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/my-results')}
            className="gap-2"
          >
            <ChartBarIcon className="h-5 w-5" />
            All Results
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <HomeIcon className="h-5 w-5" />
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Results