import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useQuiz } from '@/hooks/useQuiz'
import { QuizListResponse, CategoryResponse, QuizAttempt } from '@/types'
import {
  TrophyIcon,
  AcademicCapIcon,
  ChartBarIcon,
  PlayIcon,
  EyeIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  SparklesIcon,
  FireIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { getDifficultyLabel, getDifficultyBadgeVariant } from '@/utils/difficulty'

interface DashboardStats {
  quizzesTaken: number
  averageScore: number
  bestScore: number
  rank: number
}

const Dashboard = () => {
  const { user } = useAuthStore()
  const { getQuizzes, getCategories, getUserAttempts, loading } = useQuiz()
  const [stats, setStats] = useState<DashboardStats>({
    quizzesTaken: 0,
    averageScore: 0,
    bestScore: 0,
    rank: 0
  })
  const [recentQuizzes, setRecentQuizzes] = useState<QuizListResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [categoriesResult, quizzesResult, userAttemptsResult] = await Promise.all([
        getCategories(),
        getQuizzes({ pageSize: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
        getUserAttempts(1, 20)
      ])

      if (categoriesResult) setCategories(categoriesResult)
      if (quizzesResult) setRecentQuizzes(quizzesResult.data.slice(0, 5))
      if (userAttemptsResult) {
        setRecentAttempts(userAttemptsResult.data.slice(0, 5))
        const attempts = userAttemptsResult.data
        if (attempts.length > 0) {
          const totalAttempts = attempts.length
          const completedAttempts = attempts.filter(a => a.status === 1)
          const averageScore = completedAttempts.length > 0
            ? Math.round(completedAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / completedAttempts.length)
            : 0
          const bestScore = completedAttempts.length > 0
            ? Math.round(Math.max(...completedAttempts.map(attempt => attempt.percentage)))
            : 0
          const estimatedRank = bestScore > 90 ? Math.floor(Math.random() * 10) + 1
                              : bestScore > 75 ? Math.floor(Math.random() * 50) + 10
                              : Math.floor(Math.random() * 200) + 50
          setStats({ quizzesTaken: totalAttempts, averageScore, bestScore, rank: estimatedRank })
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Header */}
      <div className="card-premium p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Welcome back, <span className="gradient-text">{user?.firstName}</span>! 🎯
            </h1>
            <p className="text-gray-600 text-lg">Ready to challenge yourself today?</p>
          </div>
          <Link to="/quizzes">
            <Button className="btn-primary btn-lg gap-2">
              <RocketLaunchIcon className="h-5 w-5" />
              Explore Quizzes
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-interactive p-6 border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <SparklesIcon className="h-5 w-5 text-violet-600" />
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{stats.quizzesTaken}</div>
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Quizzes Taken</div>
        </div>

        <div className="card-interactive p-6 border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <FireIcon className="h-5 w-5 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{stats.averageScore}%</div>
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Average Score</div>
        </div>

        <div className="card-interactive p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
              <TrophyIcon className="h-6 w-6 text-white" />
            </div>
            <SparklesIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{stats.bestScore}%</div>
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Best Score</div>
        </div>

        <div className="card-interactive p-6 border-2 border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-lg">
              <FireIcon className="h-6 w-6 text-white" />
            </div>
            <TrophyIcon className="h-5 w-5 text-fuchsia-600" />
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">#{stats.rank}</div>
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Global Rank</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Quizzes */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">🔥 Trending Quizzes</h2>
              <Link to="/quizzes" className="text-violet-600 hover:text-violet-700 font-bold text-sm flex items-center gap-1">
                View all
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600">Loading quizzes...</p>
              </div>
            ) : recentQuizzes.length > 0 ? (
              <div className="space-y-4">
                {recentQuizzes.map((quiz, index) => (
                  <div key={quiz.id} className="card-interactive p-5 border-2 border-gray-100" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="text-3xl">{quiz.category.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1 truncate">{quiz.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{quiz.description}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant={getDifficultyBadgeVariant(quiz.difficulty)} size="sm">
                              {getDifficultyLabel(quiz.difficulty)}
                            </Badge>
                            <span className="text-xs text-gray-500 font-medium">{quiz.questionsCount} questions</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/quizzes/${quiz.id}/take`}>
                        <Button variant="primary" size="sm" className="gap-2">
                          <PlayIcon className="h-4 w-4" />
                          Start
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SparklesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No quizzes available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="card p-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">📚 Categories</h2>
            {categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {categories.slice(0, 6).map((category) => (
                  <Link key={category.id} to={`/quizzes?category=${category.id}`} className="flex items-center gap-2 p-3 rounded-2xl border-2 border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all">
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-sm font-bold text-gray-700 truncate">{category.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No categories available</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-6 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
            <h2 className="text-xl font-black mb-4">⚡ Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/leaderboard">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3">
                    <TrophyIcon className="h-5 w-5" />
                    <span className="font-bold">View Leaderboard</span>
                  </div>
                </div>
              </Link>
              <Link to="/profile">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3">
                    <AcademicCapIcon className="h-5 w-5" />
                    <span className="font-bold">My Profile</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attempts */}
      {recentAttempts.length > 0 && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900">📊 Recent Activity</h2>
            <Link to="/my-results" className="text-violet-600 hover:text-violet-700 font-bold text-sm flex items-center gap-1">
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentAttempts.map((attempt, index) => (
              <div key={attempt.id} className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 hover:border-violet-300 hover:shadow-lg transition-all" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${attempt.percentage >= 80 ? 'bg-teal-100 text-teal-600' : attempt.percentage >= 60 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{attempt.quiz.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>{new Date(attempt.startedAt).toLocaleDateString()}</span>
                      </div>
                      {attempt.status === 1 && <span className="font-medium">{attempt.score}/{attempt.totalPoints} pts</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {attempt.status === 1 && (
                    <Badge variant={attempt.percentage >= 80 ? 'success' : attempt.percentage >= 60 ? 'warning' : 'danger'} size="md">
                      {Math.round(attempt.percentage)}%
                    </Badge>
                  )}
                  <Link to={`/results/${attempt.id}`}>
                    <Button variant="secondary" size="sm" className="gap-2">
                      <EyeIcon className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard