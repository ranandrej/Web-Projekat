import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuiz } from '@/hooks/useQuiz'
import { QuizListResponse, CategoryResponse, QuizFilters } from '@/types'
import { MagnifyingGlassIcon, PlayIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Quizzes</h1>
        <p className="text-gray-600">Challenge yourself with curated quizzes.</p>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search quizzes..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button type="button" onClick={() => setShowFilters(!showFilters)} className="gap-2">
          Filters {hasActiveFilters && <span className="ml-1 px-2 py-0.5 bg-gray-200 rounded text-xs">{[filters.search, filters.categoryId, filters.difficulty].filter(Boolean).length}</span>}
        </Button>
        <Button onClick={clearFilters} variant="ghost" className="gap-2">
          <XMarkIcon className="h-5 w-5" /> Clear
        </Button>
      </div>

      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <select value={filters.categoryId} onChange={(e) => updateFilters({ categoryId: e.target.value })} className="p-3 rounded border">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filters.difficulty || ''} onChange={(e) => updateFilters({ difficulty: e.target.value as any })} className="p-3 rounded border">
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={filters.sortBy} onChange={(e) => updateFilters({ sortBy: e.target.value as any })} className="p-3 rounded border">
            <option value="createdAt">Latest</option>
            <option value="title">Title</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
      )}

      {/* Quiz Grid */}
      {loading ? (
        <div className="flex flex-col items-center py-20"><Spinner size="lg" /><p className="text-gray-600 mt-4">Loading quizzes...</p></div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(q => (
            <div key={q.id} className="p-4 bg-white rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">{q.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{q.description}</p>
                <div className="flex gap-2 items-center mb-2">
                  <Badge variant={getDifficultyBadgeVariant(q.difficulty)}>{getDifficultyLabel(q.difficulty)}</Badge>
                  <span className="text-sm text-gray-500">{q.questionsCount} Qs</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Link to={`/quizzes/${q.id}`} className="flex-1"><Button variant="secondary" size="sm" className="w-full gap-2"><EyeIcon className="h-4 w-4" />View</Button></Link>
                <Link to={`/quizzes/${q.id}/take`} className="flex-1"><Button variant="primary" size="sm" className="w-full gap-2"><PlayIcon className="h-4 w-4" />Start</Button></Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="font-bold text-xl text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-600">{hasActiveFilters ? 'Adjust your filters to find quizzes.' : 'No quizzes available currently.'}</p>
        </div>
      )}
    </div>
  )
}

export default QuizList
