import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuiz } from '@/hooks/useQuiz'
import { QuizListResponse, CategoryResponse, QuizFilters } from '@/types'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayIcon,
  EyeIcon,
  ClockIcon,
  AcademicCapIcon,
  XMarkIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { getDifficultyLabel, getDifficultyBadgeVariant } from '@/utils/difficulty'

const QuizList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { getQuizzes, getCategories, loading } = useQuiz()
  const [quizzes, setQuizzes] = useState<QuizListResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [filters, setFilters] = useState<QuizFilters>({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') as any || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    pageSize: 12
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadQuizzes()
    loadCategories()
  }, [filters])

  const loadQuizzes = async () => {
    const result = await getQuizzes(filters)
    if (result) setQuizzes(result.data)
  }

  const loadCategories = async () => {
    const result = await getCategories()
    if (result) setCategories(result)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: filters.search })
  }

  const updateFilters = (newFilters: Partial<QuizFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    const params = new URLSearchParams()
    if (updatedFilters.search) params.set('search', updatedFilters.search)
    if (updatedFilters.categoryId) params.set('category', updatedFilters.categoryId)
    if (updatedFilters.difficulty) params.set('difficulty', String(updatedFilters.difficulty))
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      difficulty: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      pageSize: 12
    })
    setSearchParams({})
  }

  const hasActiveFilters = filters.search || filters.categoryId || filters.difficulty

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Header */}
      <div className="card-premium p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-200/30 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Discover <span className="gradient-text">Amazing Quizzes</span> 🚀
          </h1>
          <p className="text-gray-600 text-lg">
            Challenge yourself with our curated collection of interactive quizzes
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for quizzes..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-14"
            />
          </div>
          <Button type="submit" className="btn-primary gap-2">
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search
          </Button>
          <Button
            type="button"
            variant={showFilters ? 'accent' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-violet-600 text-white text-xs font-bold">
                {[filters.search, filters.categoryId, filters.difficulty].filter(Boolean).length}
              </span>
            )}
          </Button>
        </form>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t-2 border-gray-200 pt-6 mt-4 animate-fade-in-down">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Category</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => updateFilters({ categoryId: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500 font-medium"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Difficulty</label>
                <select
                  value={filters.difficulty || ''}
                  onChange={(e) => updateFilters({ difficulty: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500 font-medium"
                >
                  <option value="">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-500 font-medium"
                >
                  <option value="createdAt">Latest</option>
                  <option value="title">Title</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="questionsCount">Questions</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button onClick={clearFilters} variant="ghost" className="w-full gap-2">
                  <XMarkIcon className="h-5 w-5" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-gray-600">Active filters:</span>
          {filters.search && (
            <Badge variant="primary" className="gap-2">
              Search: {filters.search}
              <button onClick={() => updateFilters({ search: '' })}>
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.categoryId && (
            <Badge variant="secondary" className="gap-2">
              {categories.find(c => c.id === filters.categoryId)?.name || 'Category'}
              <button onClick={() => updateFilters({ categoryId: '' })}>
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.difficulty && (
            <Badge variant="warning" className="gap-2">
              {filters.difficulty}
              <button onClick={() => updateFilters({ difficulty: undefined })}>
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Quiz Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 text-lg">Loading quizzes...</p>
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className="card-interactive p-6 border-2 border-gray-100 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{quiz.category.icon}</div>
                    <Badge variant="secondary" size="sm" className="font-bold">
                      {quiz.category.name}
                    </Badge>
                  </div>
                  <Badge variant={getDifficultyBadgeVariant(quiz.difficulty)} size="sm">
                    {getDifficultyLabel(quiz.difficulty)}
                  </Badge>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2">
                  {quiz.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {quiz.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b-2 border-gray-100">
                  <div className="flex items-center gap-1 font-bold">
                    <AcademicCapIcon className="h-4 w-4" />
                    <span>{quiz.questionsCount}</span>
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex items-center gap-1 font-bold">
                      <ClockIcon className="h-4 w-4" />
                      <span>{quiz.timeLimit} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <FireIcon className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Link to={`/quizzes/${quiz.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full gap-2">
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Link to={`/quizzes/${quiz.id}/take`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full gap-2">
                    <PlayIcon className="h-4 w-4" />
                    Start
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card">
          <div className="inline-flex p-6 rounded-full bg-violet-100 mb-6">
            {hasActiveFilters ? (
              <FunnelIcon className="h-16 w-16 text-violet-600" />
            ) : (
              <SparklesIcon className="h-16 w-16 text-violet-600" />
            )}
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your filters to find more quizzes.'
              : 'No quizzes are available at the moment.'}
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="primary" className="gap-2">
              <XMarkIcon className="h-5 w-5" />
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default QuizList