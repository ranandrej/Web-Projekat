import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuiz } from '@/hooks/useQuiz'
import { LeaderboardResponse, LeaderboardTimeframe, CategoryResponse, QuizListResponse } from '@/types'
import { TrophyIcon, ClockIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

const Leaderboard = () => {
  const { getLeaderboard, getCategories, getQuizzes, loading } = useQuiz()

  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [quizzes, setQuizzes] = useState<QuizListResponse[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<LeaderboardTimeframe>(LeaderboardTimeframe.ALL_TIME)
  const [selectedQuizId, setSelectedQuizId] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const pageSize = 20

  useEffect(() => {
    const loadInitialData = async () => {
      const [cats, qs] = await Promise.all([
        getCategories(),
        getQuizzes({ pageSize: 100, sortBy: 'title', sortOrder: 'asc' })
      ])
      if (cats) setCategories(cats)
      if (qs) setQuizzes(qs.data)
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    const loadLeaderboard = async () => {
      const result = await getLeaderboard({
        quizId: selectedQuizId || undefined,
        timeframe: selectedTimeframe,
        pageNumber: currentPage,
        pageSize
      })
      if (result) setLeaderboard(result)
    }
    loadLeaderboard()
  }, [selectedTimeframe, selectedQuizId, currentPage])

  const getTimeframeName = (t: LeaderboardTimeframe) => {
    switch (t) {
      case LeaderboardTimeframe.ALL_TIME: return 'All Time'
      case LeaderboardTimeframe.TODAY: return 'Today'
      case LeaderboardTimeframe.THIS_WEEK: return 'This Week'
      case LeaderboardTimeframe.THIS_MONTH: return 'This Month'
      case LeaderboardTimeframe.THIS_YEAR: return 'This Year'
      default: return 'All Time'
    }
  }

  const formatDuration = (duration: string) => {
    const match = duration.match(/(\d+):(\d+):(\d+)/)
    if (!match) return duration
    const [, h, m, s] = match.map(Number)
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  if (loading && !leaderboard) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading leaderboard...</p>
      </div>
    )
  }

  const avgScore = leaderboard?.entries.length
    ? (leaderboard.entries.reduce((acc, e) => acc + e.percentage, 0) / leaderboard.entries.length).toFixed(1)
    : '0'

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="p-6 bg-white rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-600 text-sm mt-1">
              {leaderboard?.quiz ? `Rankings for "${leaderboard.quiz.title}"` : 'Global Rankings'} • {getTimeframeName(selectedTimeframe)}
            </p>
          </div>
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        {/* Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => { setSelectedTimeframe(Number(e.target.value)); setCurrentPage(1) }}
              className="p-2 rounded border w-full"
            >
              <option value={LeaderboardTimeframe.ALL_TIME}>All Time</option>
              <option value={LeaderboardTimeframe.TODAY}>Today</option>
              <option value={LeaderboardTimeframe.THIS_WEEK}>This Week</option>
              <option value={LeaderboardTimeframe.THIS_MONTH}>This Month</option>
              <option value={LeaderboardTimeframe.THIS_YEAR}>This Year</option>
            </select>
            <select
              value={selectedQuizId}
              onChange={(e) => { setSelectedQuizId(e.target.value); setCurrentPage(1) }}
              className="p-2 rounded border w-full"
            >
              <option value="">All Quizzes</option>
              {quizzes.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
          </div>
        )}
        {/* Stats */}
        {leaderboard && leaderboard.entries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col items-start">
              <div className="text-sm text-gray-500">Total Players</div>
              <div className="text-xl font-bold text-gray-900">{leaderboard.totalCount}</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col items-start">
              <div className="text-sm text-gray-500">Top Score</div>
              <div className="text-xl font-bold text-gray-900">{leaderboard.entries[0]?.percentage.toFixed(1)}%</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col items-start">
              <div className="text-sm text-gray-500">Average Score</div>
              <div className="text-xl font-bold text-gray-900">{avgScore}%</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col items-start">
              <div className="text-sm text-gray-500">Timeframe</div>
              <div className="text-xl font-bold text-gray-900">{getTimeframeName(selectedTimeframe)}</div>
            </div>
          </div>
        )}
        {/* Leaderboard Table */}
        {leaderboard && leaderboard.entries.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Player</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Score</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Percentage</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-700">Completed</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.entries.map(entry => (
                  <tr key={entry.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold">{entry.rank}</td>
                    <td className="px-4 py-3 space-x-6 flex"><UserIcon height={25}/> {entry.user.firstName} {entry.user.lastName}</td>
                    <td className="px-4 py-3">{entry.score}/{entry.totalPoints}</td>
                    <td className="px-4 py-3">{entry.percentage.toFixed(1)}%</td>
                    <td className="px-4 py-3">{formatDuration(entry.duration)}</td>
                    <td className="px-4 py-3">{new Date(entry.completedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {leaderboard.totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <Button onClick={() => setCurrentPage(Math.max(1, currentPage-1))} disabled={!leaderboard.hasPreviousPage}>Previous</Button>
                <div className="text-gray-600 text-sm">{((currentPage-1)*pageSize)+1} - {Math.min(currentPage*pageSize, leaderboard.totalCount)} / {leaderboard.totalCount}</div>
                <Button onClick={() => setCurrentPage(Math.min(leaderboard.totalPages, currentPage+1))} disabled={!leaderboard.hasNextPage}>Next</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center bg-gray-50 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings Available</h3>
            <p className="text-gray-600 mb-4">
              {selectedQuizId ? 'No attempts for this quiz in selected timeframe.' : 'No attempts in selected timeframe.'}
            </p>
            <Link to="/quizzes"><Button variant="primary">Browse Quizzes</Button></Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
