import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useQuiz } from '@/hooks/useQuiz'
import { useAuthStore } from '@/stores/authStore'
import { QuizResponse, QuestionResponse, QuestionType, SubmitQuizAttemptRequest } from '@/types'
import {
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  FlagIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

interface QuizAnswer {
  questionId: string
  selectedAnswerIds: string[]
  textAnswer?: string
  timeSpent: number
}

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getQuizForTaking, submitQuizAttempt, loading } = useQuiz()

  if (user?.roles?.includes('Admin')) {
    return <Navigate to={`/quizzes/${id}`} replace />
  }

  const [quiz, setQuiz] = useState<QuizResponse | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [id])

  useEffect(() => {
    if (quiz?.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60)
    }
  }, [quiz])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timeRemaining])

  const loadQuiz = async () => {
    if (!id) return
    const result = await getQuizForTaking(id)
    if (result) {
      setQuiz(result)
      setQuizStartTime(Date.now())
      setQuestionStartTime(Date.now())
      const initialAnswers: QuizAnswer[] = result.questions?.map(q => ({
        questionId: q.id,
        selectedAnswerIds: [],
        textAnswer: q.type === QuestionType.SHORT_ANSWER ? '' : undefined,
        timeSpent: 0
      })) || []
      setAnswers(initialAnswers)
    }
  }

  const getCurrentQuestion = (): QuestionResponse | null => {
    if (!quiz?.questions || currentQuestionIndex >= quiz.questions.length) return null
    return quiz.questions[currentQuestionIndex]
  }

  const getCurrentAnswer = (): QuizAnswer | undefined => {
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return undefined
    return answers.find(a => a.questionId === currentQuestion.id)
  }

  const updateAnswer = useCallback((questionId: string, selectedAnswerIds: string[]) => {
    setAnswers(prev => prev.map(answer =>
      answer.questionId === questionId ? { ...answer, selectedAnswerIds } : answer
    ))
  }, [])

  const handleAnswerSelect = (answerId: string) => {
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return
    const currentAnswer = getCurrentAnswer()
    if (!currentAnswer) return

    if (currentQuestion.type === QuestionType.MULTIPLE_CHOICE || currentQuestion.type === QuestionType.TRUE_FALSE) {
      updateAnswer(currentQuestion.id, [answerId])
    } else if (currentQuestion.type === QuestionType.MULTIPLE_SELECT) {
      const newSelectedIds = currentAnswer.selectedAnswerIds.includes(answerId)
        ? currentAnswer.selectedAnswerIds.filter(id => id !== answerId)
        : [...currentAnswer.selectedAnswerIds, answerId]
      updateAnswer(currentQuestion.id, newSelectedIds)
    }
  }

  const handleTextAnswerChange = (text: string) => {
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return
    setAnswers(prev => prev.map(answer =>
      answer.questionId === currentQuestion.id ? { ...answer, textAnswer: text } : answer
    ))
  }

  const updateQuestionTime = useCallback(() => {
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return
    const timeSpent = Date.now() - questionStartTime
    setAnswers(prev => prev.map(answer =>
      answer.questionId === currentQuestion.id
        ? { ...answer, timeSpent: answer.timeSpent + timeSpent }
        : answer
    ))
  }, [currentQuestionIndex, questionStartTime])

  const goToQuestion = (index: number) => {
    if (index < 0 || !quiz?.questions || index >= quiz.questions.length) return
    updateQuestionTime()
    setCurrentQuestionIndex(index)
    setQuestionStartTime(Date.now())
  }

  const goToPrevious = () => goToQuestion(currentQuestionIndex - 1)
  const goToNext = () => goToQuestion(currentQuestionIndex + 1)

  const handleSubmitQuiz = async () => {
    if (isSubmitting || !quiz || !id) return
    setIsSubmitting(true)
    updateQuestionTime()

    try {
      const submitData: SubmitQuizAttemptRequest = {
        answers: answers.map(answer => {
          const question = quiz.questions?.find(q => q.id === answer.questionId)
          if (question?.type === QuestionType.SHORT_ANSWER) {
            const correctAnswer = question.answers[0]
            const selectedIds = answer.textAnswer?.trim() === correctAnswer?.answerText?.trim()
              ? [correctAnswer.id]
              : []
            return {
              questionId: answer.questionId,
              selectedAnswerIds: selectedIds,
              timeSpent: answer.timeSpent
            }
          }
          return {
            questionId: answer.questionId,
            selectedAnswerIds: answer.selectedAnswerIds,
            timeSpent: answer.timeSpent
          }
        }),
        startedAt: new Date(quizStartTime).toISOString(),
        finishedAt: new Date().toISOString()
      }

      const result = await submitQuizAttempt(id, submitData)
      if (result) {
        navigate(`/results/${result.id}`)
      } else {
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 text-lg font-semibold">Loading quiz...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center card-premium p-12">
          <div className="inline-flex p-6 rounded-full bg-red-100 mb-6">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-8">The quiz failed to load or doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  const currentAnswer = getCurrentAnswer()
  const progress = quiz.questions ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0
  const answeredCount = answers.filter(a =>
    a.selectedAnswerIds.length > 0 || (a.textAnswer?.trim() || '').length > 0
  ).length
  const isTimeWarning = timeRemaining !== null && timeRemaining < 300

  return (
    <div className="min-h-[calc(100vh-5rem)] -m-8 p-8">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header Bar */}
        <div className="card-premium p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="text-4xl">{quiz.category.icon}</div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-black text-gray-900 truncate">{quiz.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                  <span>Question {currentQuestionIndex + 1} of {quiz.questions?.length || 0}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4 text-teal-600" />
                    <span>{answeredCount} answered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer */}
            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-lg shadow-lg ${
                isTimeWarning
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
              }`}>
                <ClockIcon className="h-6 w-6" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 relative">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute right-0 -top-6 text-xs font-black text-violet-600 bg-violet-100 px-2 py-1 rounded-lg">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="card-premium p-8 animate-fade-in-up">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-xl font-black shadow-lg">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary" size="md" className="gap-1">
                      <BoltIcon className="h-4 w-4" />
                      {currentQuestion.points} {currentQuestion.points !== 1 ? 'points' : 'point'}
                    </Badge>
                    {currentQuestion.type === QuestionType.MULTIPLE_SELECT && (
                      <Badge variant="accent" size="md">
                        Multiple Choice
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-2xl font-black text-gray-900 mb-8 leading-relaxed">
              {currentQuestion.questionText}
            </h2>

            {/* Answer Options */}
            {currentQuestion.type === QuestionType.SHORT_ANSWER ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={currentAnswer?.textAnswer || ''}
                    onChange={(e) => handleTextAnswerChange(e.target.value)}
                    className="w-full text-lg py-5 px-6 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500 font-medium"
                    placeholder="Type your answer here..."
                    autoFocus
                  />
                </div>
                <div className="flex items-start gap-2 p-5 bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-teal-200 rounded-2xl">
                  <SparklesIcon className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-teal-800 font-semibold">
                    Enter your answer carefully. Spelling and capitalization may matter.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentQuestion.answers.map((answer, index) => {
                  const isSelected = currentAnswer?.selectedAnswerIds.includes(answer.id) || false
                  const isMultiSelect = currentQuestion.type === QuestionType.MULTIPLE_SELECT

                  return (
                    <div
                      key={answer.id}
                      onClick={() => handleAnswerSelect(answer.id)}
                      className={`group flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-400 shadow-xl scale-[1.02]'
                          : 'bg-white border-gray-200 hover:border-violet-300 hover:bg-violet-50 hover:shadow-lg'
                      }`}
                    >
                      {/* Selection Indicator */}
                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <div className={`w-7 h-7 ${isMultiSelect ? 'rounded-xl' : 'rounded-full'} border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-violet-600 bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg'
                            : 'border-gray-300 group-hover:border-violet-400 bg-white'
                        }`}>
                          {isSelected && (
                            <CheckIcon className="h-4 w-4 text-white" strokeWidth={3} />
                          )}
                        </div>
                      </div>

                      {/* Answer Letter */}
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm flex-shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 group-hover:bg-violet-100 group-hover:text-violet-700'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>

                      {/* Answer Text */}
                      <span className={`flex-1 text-lg font-semibold ${
                        isSelected
                          ? 'text-gray-900'
                          : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {answer.answerText}
                      </span>
                    </div>
                  )
                })}

                {/* Helper Text */}
                {currentQuestion.type === QuestionType.MULTIPLE_SELECT && (
                  <div className="flex items-start gap-2 p-5 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl mt-4">
                    <CheckIcon className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-violet-800 font-semibold">
                      Multiple answers are correct. Select all that apply.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Footer */}
        <div className="card-premium p-5">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <Button
              variant="secondary"
              size="md"
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              Previous
            </Button>

            {/* Question Dots Navigation */}
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {quiz.questions?.map((question, index) => {
                const answer = answers[index]
                const isAnswered = question.type === QuestionType.SHORT_ANSWER
                  ? (answer?.textAnswer?.trim() || '').length > 0
                  : (answer?.selectedAnswerIds.length || 0) > 0

                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-11 h-11 rounded-xl text-sm font-black transition-all duration-200 ${
                      index === currentQuestionIndex
                        ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl scale-110'
                        : isAnswered
                        ? 'bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 border-2 border-teal-300 hover:scale-110'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200 hover:scale-110'
                    }`}
                    title={`Question ${index + 1}${isAnswered ? ' (answered)' : ''}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>

            {/* Next/Submit Button */}
            {currentQuestionIndex === (quiz.questions?.length || 0) - 1 ? (
              <Button
                variant="accent"
                size="md"
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="gap-2 min-w-[160px]"
              >
                <FlagIcon className="h-5 w-5" />
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={goToNext}
                className="gap-2 min-w-[160px]"
              >
                Next
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="card p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-2 border-violet-200">
          <div className="flex items-center justify-between text-sm font-bold">
            <div className="flex items-center gap-2 text-violet-700">
              <FireIcon className="h-5 w-5" />
              <span>{answeredCount}/{quiz.questions?.length} questions answered</span>
            </div>
            <div className="text-gray-600">
              Keep going! 🚀
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TakeQuiz