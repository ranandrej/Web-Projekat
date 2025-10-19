import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/stores/authStore'
import { Navigate, useNavigate } from 'react-router-dom'
import { QuizListResponse, CategoryResponse } from '@/types'
import quizService from '../../services/quizService'
import { toast } from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  PencilIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { getDifficultyLabel, getDifficultyBadgeVariant } from '@/utils/difficulty'

const QuizManagement = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<QuizListResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalQuizzes, setTotalQuizzes] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const pageSize = 12

  // Check if user is admin
  if (!user?.roles?.includes('Admin')) {
    return <Navigate to="/dashboard" replace />
  }

  useEffect(() => {
    fetchQuizzes()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchQuizzes()
  }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder])

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const response = await quizService.getQuizzes({
        search: searchTerm,
        categoryId: selectedCategory || undefined,
        pageNumber: currentPage,
        pageSize: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder
      })

      setQuizzes(response.data)
      setTotalPages(response.totalPages)
      setTotalQuizzes(response.totalCount)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      toast.error('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await quizService.getCategories()
      setCategories(response)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY DELETE the quiz "${quizTitle}"? This action cannot be undone and will remove all associated data including attempts and results.`)) {
      return
    }

    try {
      await quizService.deleteQuiz(quizId)
      toast.success(`Quiz "${quizTitle}" deleted successfully`)
      fetchQuizzes()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete quiz'
      toast.error(message)
    }
  }

  const handleViewQuiz = (quizId: string) => {
    navigate(`/quizzes/${quizId}`)
  }

  const handleEditQuiz = (quizId: string) => {
    navigate(`/quizzes/${quizId}/edit`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSortBy('createdAt')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const hasActiveFilters = selectedCategory || sortBy !== 'createdAt' || sortOrder !== 'desc'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading && quizzes.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-secondary-600 text-lg">Loading quizzes...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/admin')}
          className="mb-6 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Admin Dashboard
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center">
            <BookOpenIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Quiz Management</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {totalQuizzes} total quizzes in the system
            </p>
          </div>
        </div>
      </div>
  
      {/* Search and Filters */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by title, description, or creator..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            />
          </div>
  
          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between">
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm"
            >
              <FunnelIcon className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {hasActiveFilters && (
                <Badge variant="accent" size="sm" className="ml-2 bg-neutral-900 text-white text-xs px-1.5 py-0.5 rounded">
                  {[selectedCategory, sortBy !== 'createdAt', sortOrder !== 'desc'].filter(Boolean).length}
                </Badge>
              )}
            </Button>
  
            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-neutral-600"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
  
          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
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
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="title">Title</option>
                  <option value="category">Category</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="questionsCount">Questions Count</option>
                </select>
              </div>
  
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Quiz Grid */}
      {quizzes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz, index) => (
              <div
                key={quiz.id}
                className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-300 transition-colors"
              >
                {/* Quiz Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-2xl">{quiz.category.icon}</div>
                  <Badge variant={getDifficultyBadgeVariant(quiz.difficulty)} size="sm" className="text-xs px-2 py-0.5 rounded border">
                    {getDifficultyLabel(quiz.difficulty)}
                  </Badge>
                </div>
  
                {/* Quiz Title & Description */}
                <h3 className="text-base font-semibold text-neutral-900 mb-1.5 line-clamp-2">
                  {quiz.title}
                </h3>
                <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                  {quiz.description}
                </p>
  
                {/* Quiz Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <BookOpenIcon className="h-4 w-4 text-neutral-400" />
                    <span>{quiz.questionsCount} questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <UserIcon className="h-4 w-4 text-neutral-400" />
                    <span>{quiz.createdBy.firstName} {quiz.createdBy.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <CalendarIcon className="h-4 w-4 text-neutral-400" />
                    <span>{formatDate(quiz.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {quiz.isPublic ? (
                      <GlobeAltIcon className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <LockClosedIcon className="h-4 w-4 text-neutral-400" />
                    )}
                    <Badge variant={quiz.isPublic ? 'success' : 'secondary'} size="sm" className="text-xs px-2 py-0.5 rounded border">
                      {quiz.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                </div>
  
                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleViewQuiz(quiz.id)}
                    className="flex-1 text-sm bg-neutral-900 hover:bg-neutral-800 text-white"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditQuiz(quiz.id)}
                    className="px-3 border border-neutral-200 hover:bg-neutral-50"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                    className="px-3 border border-red-200 text-white hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
  
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white border border-neutral-200 rounded-lg p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-neutral-500">
                  Page {currentPage} of {totalPages} • {totalQuizzes} total quizzes
                </div>
  
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                  </Button>
  
                  <div className="flex gap-1.5">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      if (page > totalPages) return null
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-neutral-900 text-white'
                              : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg p-16 text-center">
          <div className="inline-flex p-4 rounded-lg bg-neutral-100 mb-4">
            <BookOpenIcon className="h-12 w-12 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            {searchTerm ? 'No Quizzes Found' : 'No Quizzes Available'}
          </h3>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            {searchTerm
              ? `No quizzes match your search "${searchTerm}". Try adjusting your filters.`
              : 'There are no quizzes in the system yet.'
            }
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/quizzes/create')}
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3"
            >
              <BookOpenIcon className="h-5 w-5" />
              Create First Quiz
            </Button>
          )}
        </div>
      )}
    </div>
  </div>
  )
}

export default QuizManagement
