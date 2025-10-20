import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QuizAttempt } from '@/types'
import quizService from '@/services/quizService'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrophyIcon,
  ClockIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ChartBarIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

const MyResults = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchAttempts()
  }, [currentPage])

  const fetchAttempts = async () => {
    setLoading(true)
    try {
      const response = await quizService.getUserAttempts(currentPage, pageSize)
      setAttempts(response.data)
      setTotalPages(response.totalPages)
      setTotalAttempts(response.totalCount)
    } catch (error) {
      console.error('Error fetching attempts:', error)
      toast.error('Failed to load quiz results')
    } finally {
      setLoading(false)
    }
  }

  const filteredAttempts = attempts.filter(attempt =>
    attempt.quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attempt.quiz.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime()
    const end = new Date(endTime || startTime).getTime()
    const durationSeconds = Math.floor((end - start) / 1000)
    const minutes = Math.floor(durationSeconds / 60)
    const seconds = durationSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-indigo-700'
    if (percentage >= 60) return 'text-yellow-700'
    return 'text-red-600'
  }

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-indigo-50 border-indigo-200'
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getScoreGrade = (percentage: number) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (loading && attempts.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 text-lg">Loading your results...</p>
      </div>
    )
  }

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
    : 0
  const passedCount = attempts.filter(a => a.percentage >= 70).length
  const uniqueQuizzes = new Set(attempts.map(a => a.quizId)).size
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gray-100">
            <TrophyIcon className="h-10 w-10 text-gray-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
            <p className="text-gray-500 mt-1 text-sm">Track your quiz performance and progress</p>
          </div>
        </div>
        {totalAttempts > 0 && (
          <Badge variant="secondary" size="lg" className="gap-2 bg-gray-100 text-gray-700">
            <SparklesIcon className="h-5 w-5" />
            {totalAttempts} Total Attempts
          </Badge>
        )}
      </div>

      {/* Stats Overview */}
      {totalAttempts > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Attempts */}
          <div className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 rounded-lg bg-gray-100">
                <ChartBarIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Total Attempts</div>
                <div className="text-xl font-bold text-gray-900">{totalAttempts}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gray-400 transition-all duration-500"
                style={{ width: `${avgScore}%` }}
              />
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 rounded-lg bg-gray-100">
                <TrophyIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Average Score</div>
                <div className="text-xl font-bold text-gray-900">{avgScore}%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gray-400 transition-all duration-500"
                style={{ width: `${avgScore}%` }}
              />
            </div>
          </div>

          {/* Passed */}
          <div className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 rounded-lg bg-gray-100">
                <CheckCircleIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Passed (≥70%)</div>
                <div className="text-xl font-bold text-gray-900">{passedCount}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gray-400 transition-all duration-500"
                style={{ width: `${totalAttempts > 0 ? (passedCount / totalAttempts) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Unique Quizzes */}
          <div className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 rounded-lg bg-gray-100">
                <AcademicCapIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Unique Quizzes</div>
                <div className="text-xl font-bold text-gray-900">{uniqueQuizzes}</div>
              </div>
            </div>
            <Badge variant="secondary" className="mt-2 bg-gray-100 text-gray-700 gap-1">
              <SparklesIcon className="h-3 w-3" />
              Best: {bestScore}%
            </Badge>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white shadow-sm rounded-xl p-4 relative">
        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by quiz name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      {/* Quiz History */}
      <div className="bg-white shadow-sm rounded-xl">
        {filteredAttempts.length > 0 ? (
          <>
            <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Quiz History</h2>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {filteredAttempts.length} {filteredAttempts.length === 1 ? 'result' : 'results'}
              </Badge>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredAttempts.map((attempt) => (
                <div key={attempt.id} className="p-4 hover:bg-gray-50 flex flex-col lg:flex-row lg:justify-between gap-4">
                  {/* Quiz Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="text-3xl flex-shrink-0">{attempt.quiz.category.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-md font-semibold text-gray-900 truncate">{attempt.quiz.title}</h3>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                        <div className="flex items-center gap-1"><CalendarIcon className="h-4 w-4"/> {formatDate(attempt.finishedAt || attempt.startedAt)}</div>
                        <div className="flex items-center gap-1"><ClockIcon className="h-4 w-4"/> {formatDuration(attempt.startedAt, attempt.finishedAt || attempt.startedAt)}</div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">{attempt.quiz.category.name}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Score & View */}
                  <div className="flex items-center gap-4 flex-shrink-0 mt-2 lg:mt-0">
                    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border ${getScoreBgColor(attempt.percentage)} ${getScoreColor(attempt.percentage)} text-sm font-semibold`}>
                      <div>{Math.round(attempt.percentage)}%</div>
                      <div className="text-xs">{getScoreGrade(attempt.percentage)}</div>
                    </div>
                    <Link to={`/results/${attempt.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <EyeIcon className="h-4 w-4"/>
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 flex justify-between items-center text-gray-500">
                <div>Page {currentPage} of {totalPages} • {totalAttempts} attempts</div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}><ChevronLeftIcon className="h-4 w-4"/></Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    if (page > totalPages) return null
                    return (
                      <button key={page} onClick={() => handlePageChange(page)} className={`w-8 h-8 rounded text-sm font-semibold ${currentPage === page ? 'bg-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>{page}</button>
                    )
                  })}
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)}><ChevronRightIcon className="h-4 w-4"/></Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex p-4 rounded-xl bg-gray-100 mb-4">
              {searchTerm ? <MagnifyingGlassIcon className="h-12 w-12 text-gray-500"/> : <TrophyIcon className="h-12 w-12 text-gray-500"/>}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{searchTerm ? 'No Results Found' : 'No Quiz Attempts Yet'}</h3>
            <p className="text-gray-500 mb-6">{searchTerm ? `No quiz results match "${searchTerm}".` : 'Start taking quizzes to track your learning.'}</p>
            {!searchTerm && (
              <Link to="/quizzes">
                <Button variant="primary" size="sm" className="gap-1">
                  <SparklesIcon className="h-4 w-4"/>
                  Browse Quizzes
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyResults
