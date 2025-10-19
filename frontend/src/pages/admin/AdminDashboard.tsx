import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/stores/authStore'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  BookOpenIcon,
  PlusIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface AdminStats {
  totalUsers: number
  totalQuizzes: number
  totalQuestions: number
  totalCategories: number
  totalQuizAttempts: number
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  emailConfirmed: boolean
  isDisabled: boolean
  lockoutEnd?: string
  createdAt: string
  roles: string[]
}

interface UserPaginationResponse {
  data: User[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

const AdminDashboard = () => {
  const { user, token } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [userLoading, setUserLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const pageSize = 10

  // Check if user is admin
  if (!user?.roles?.includes('Admin')) {
    return <Navigate to="/dashboard" replace />
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm])

  const fetchAdminData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const statsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setUserLoading(true)
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        search: searchTerm
      })

      const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?${params}`, { headers })
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.data || [])
        setTotalPages(usersData.totalPages || 1)
        setTotalUsers(usersData.totalCount || 0)
      } else {
        setUsers([])
        setTotalPages(1)
        setTotalUsers(0)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
      setTotalPages(1)
      setTotalUsers(0)
    } finally {
      setUserLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY DELETE ${userName}? This action cannot be undone and will remove all their quiz data.`)) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        fetchUsers()
        fetchAdminData()
        alert('User permanently deleted successfully')
      } else {
        const errorData = await response.json()
        alert(`Failed to delete user: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  const handleToggleUserStatus = async (userId: string, userName: string, isCurrentlyDisabled: boolean) => {
    const action = isCurrentlyDisabled ? 'enable' : 'disable'
    const actionDescription = isCurrentlyDisabled ?
      'This will allow them to login and use the platform again.' :
      'This will prevent them from logging in but preserve their account and data.'

    if (!confirm(`Are you sure you want to ${action.toUpperCase()} ${userName}? ${actionDescription}`)) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        fetchUsers()
        alert(`User ${action}d successfully`)
      } else {
        const errorData = await response.json()
        alert(`Failed to ${action} user: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert(`Error ${action}ing user`)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-secondary-600 text-lg">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Futuristic Header */}
      <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 rotate-3 hover:rotate-0 transition-transform duration-500">
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-lg text-purple-200 mt-2">
              Welcome back, <span className="text-white font-semibold">{user?.firstName}</span>! Command center activated.
            </p>
          </div>
        </div>
      </div>
  
      {/* Stats Grid - Glassmorphism Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Users */}
          <div className="group relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/10 group-hover:to-cyan-400/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-blue-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <UserGroupIcon className="h-7 w-7 text-blue-200" />
                </div>
                <div className="text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">USERS</div>
              </div>
              <div className="text-4xl font-black text-white mb-1">{stats.totalUsers}</div>
              <div className="text-sm text-blue-200">Total Users</div>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 w-full rounded-full"></div>
              </div>
            </div>
          </div>
  
          {/* Total Quizzes */}
          <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-purple-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <AcademicCapIcon className="h-7 w-7 text-purple-200" />
                </div>
                <div className="text-xs font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">QUIZZES</div>
              </div>
              <div className="text-4xl font-black text-white mb-1">{stats.totalQuizzes}</div>
              <div className="text-sm text-purple-200">Total Quizzes</div>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 w-full rounded-full"></div>
              </div>
            </div>
          </div>
  
          {/* Quiz Attempts */}
          <div className="group relative bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-yellow-400/0 group-hover:from-orange-400/10 group-hover:to-yellow-400/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-orange-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <ChartBarIcon className="h-7 w-7 text-orange-200" />
                </div>
                <div className="text-xs font-bold text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full">ATTEMPTS</div>
              </div>
              <div className="text-4xl font-black text-white mb-1">{stats.totalQuizAttempts}</div>
              <div className="text-sm text-orange-200">Quiz Attempts</div>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 w-full rounded-full"></div>
              </div>
            </div>
          </div>
  
          {/* Total Questions */}
          <div className="group relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-teal-400/0 group-hover:from-emerald-400/10 group-hover:to-teal-400/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-emerald-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <BookOpenIcon className="h-7 w-7 text-emerald-200" />
                </div>
                <div className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full">QUESTIONS</div>
              </div>
              <div className="text-4xl font-black text-white mb-1">{stats.totalQuestions}</div>
              <div className="text-sm text-emerald-200">Total Questions</div>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 w-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Quick Actions - Horizontal Scroll na mobile */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <ClockIcon className="h-7 w-7 text-purple-300" />
          <h2 className="text-3xl font-black text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/admin/quizzes')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 h-32 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            <div className="relative flex flex-col items-center gap-3">
              <BookOpenIcon className="h-10 w-10" />
              <span className="text-lg font-bold">Manage Quizzes</span>
            </div>
          </Button>
          
          <Button
            variant="accent"
            size="lg"
            onClick={() => navigate('/quizzes/create')}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0 h-32 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            <div className="relative flex flex-col items-center gap-3">
              <PlusIcon className="h-10 w-10" />
              <span className="text-lg font-bold">Create New Quiz</span>
            </div>
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/admin/results')}
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-0 h-32 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50 text-white"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            <div className="relative flex flex-col items-center gap-3">
              <ChartBarIcon className="h-10 w-10" />
              <span className="text-lg font-bold">View All Results</span>
            </div>
          </Button>
        </div>
      </div>
  
      {/* Info Alert - Neon Style */}
      <div className="relative bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-cyan-400/50 rounded-2xl p-6 shadow-lg shadow-cyan-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-2xl"></div>
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <InformationCircleIcon className="h-6 w-6 text-cyan-200" />
          </div>
          <div>
            <h3 className="font-black text-white text-lg mb-3">User Management Actions</h3>
            <div className="space-y-2 text-sm text-cyan-100">
              <p><span className="font-bold text-white">Disable:</span> Temporarily prevents user login while preserving their account and quiz data. Can be reversed.</p>
              <p><span className="font-bold text-white">Delete:</span> Permanently removes the user and all their data. This action cannot be undone.</p>
            </div>
          </div>
        </div>
      </div>
  
      {/* User Management - Modern Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/20 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <UserGroupIcon className="h-7 w-7 text-purple-300" />
                <h2 className="text-3xl font-black text-white">User Management</h2>
              </div>
              <p className="text-purple-200">{totalUsers} total users in system</p>
            </div>
  
            {/* Search Bar - Neon Style */}
            <div className="relative w-full md:w-96">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
  
        {/* Users Table */}
        <div className="p-6">
          {userLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size="lg" />
              <p className="mt-4 text-purple-200">Loading users...</p>
            </div>
          ) : users && users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left py-4 px-4 text-xs font-black text-purple-300 uppercase tracking-wider">User</th>
                      <th className="text-left py-4 px-4 text-xs font-black text-purple-300 uppercase tracking-wider">Role</th>
                      <th className="text-left py-4 px-4 text-xs font-black text-purple-300 uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-4 text-xs font-black text-purple-300 uppercase tracking-wider">Joined</th>
                      <th className="text-right py-4 px-4 text-xs font-black text-purple-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((u, index) => (
                      <tr
                        key={u.id}
                        className="hover:bg-white/5 transition-all duration-200"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-500/30">
                              {u.firstName[0]}{u.lastName[0]}
                            </div>
                            <div>
                              <div className="font-bold text-white">
                                {u.firstName} {u.lastName}
                              </div>
                              <div className="text-sm text-purple-300">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-2">
                            {u.roles.map(role => (
                              <Badge
                                key={role}
                                variant={role === 'Admin' ? 'danger' : 'primary'}
                                size="sm"
                                className={`${
                                  role === 'Admin' 
                                    ? 'bg-red-500/30 text-red-200 border border-red-400/50' 
                                    : 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                                } font-bold`}
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={u.isDisabled ? 'secondary' : 'success'}
                            size="sm"
                            className={`${
                              u.isDisabled 
                                ? 'bg-gray-500/30 text-gray-200 border border-gray-400/50' 
                                : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                            } font-bold`}
                          >
                            {u.isDisabled ? 'Disabled' : 'Active'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-purple-200">
                          {new Date(u.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-4">
                          {!u.roles.includes('Admin') ? (
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant={u.isDisabled ? 'accent' : 'secondary'}
                                onClick={() => handleToggleUserStatus(u.id, `${u.firstName} ${u.lastName}`, u.isDisabled)}
                                className={`${
                                  u.isDisabled 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 border-0 text-white' 
                                    : 'bg-orange-600 hover:bg-orange-500 border-0 text-white'
                                } transition-all duration-200`}
                              >
                                {u.isDisabled ? (
                                  <>
                                    <LockOpenIcon className="h-3 w-3" />
                                    Enable
                                  </>
                                ) : (
                                  <>
                                    <LockClosedIcon className="h-3 w-3" />
                                    Disable
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                                className="bg-red-600 hover:bg-red-500 border-0 transition-all duration-200"
                              >
                                <TrashIcon className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2 text-xs text-purple-300">
                              <ShieldCheckIcon className="h-4 w-4" />
                              <span className="font-bold">Protected</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
  
              {/* Pagination - Futuristic */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-white/10">
                  <div className="text-sm text-purple-200 font-medium">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      Previous
                    </Button>
  
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                        if (page > totalPages) return null
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 ${
                              currentPage === page
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-110'
                                : 'bg-white/10 border border-white/20 text-purple-200 hover:bg-white/20'
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
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 transition-all"
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex p-6 bg-purple-500/20 rounded-2xl mb-6">
                <UserGroupIcon className="h-16 w-16 text-purple-300" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                {searchTerm ? 'No Users Found' : 'No Users Yet'}
              </h3>
              <p className="text-purple-200 max-w-md mx-auto">
                {searchTerm
                  ? `No users found matching "${searchTerm}". Try adjusting your search.`
                  : 'No users have registered yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default AdminDashboard
