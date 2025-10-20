import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  TrophyIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  AcademicCapIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import authService from '@/services/authService'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authService.logout()
      logout()
      navigate('/')
      toast.success('Logged out successfully')
    } catch (error) {
      logout()
      navigate('/')
    }
  }

  const isActive = (path: string) => location.pathname === path

  const adminNavItems = [
    { to: '/admin', label: 'Dashboard', icon: CogIcon },
    { to: '/admin/quizzes', label: 'Quizzes', icon: AcademicCapIcon },
    { to: '/admin/results', label: 'Results', icon: ChartBarIcon },
  ]

  const userNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/quizzes', label: 'Quizzes', icon: AcademicCapIcon },
    { to: '/my-results', label: 'My Results', icon: ChartBarIcon },
    { to: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
  ]

  const navItems = user?.roles?.includes('Admin') ? adminNavItems : userNavItems

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-[16px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-black text-gray-900">
                QuizMaster <span className="gradient-text">Pro</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden lg:flex lg:gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.to)
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200',
                        active
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-gray-100 transition-all duration-200">
                    <div className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-black">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-bold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{user?.email}</div>
                    </div>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-3 w-72 origin-top-right bg-white rounded-[24px] shadow-2xl border border-gray-200 focus:outline-none overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-6 py-5 bg-gradient-to-br from-violet-50 to-fuchsia-50 border-b border-gray-200">
                        <div className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</div>
                        <div className="text-sm text-gray-600 mt-1">{user?.email}</div>
                        {user?.roles && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
                              {user.roles[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={cn(
                                'flex items-center gap-3 px-6 py-3 text-sm font-bold transition-colors',
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              )}
                            >
                              <UserIcon className="h-5 w-5" />
                              Profile Settings
                            </Link>
                          )}
                        </Menu.Item>

                        {user?.roles?.includes('Admin') ? (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/admin"
                                className={cn(
                                  'flex items-center gap-3 px-6 py-3 text-sm font-bold transition-colors',
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                )}
                              >
                                <CogIcon className="h-5 w-5" />
                                Admin Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                        ) : (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard"
                                className={cn(
                                  'flex items-center gap-3 px-6 py-3 text-sm font-bold transition-colors',
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                )}
                              >
                                <ChartBarIcon className="h-5 w-5" />
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 py-2">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={cn(
                                'flex items-center gap-3 w-full px-6 py-3 text-sm font-bold transition-colors',
                                active ? 'bg-red-50 text-red-700' : 'text-red-600'
                              )}
                            >
                              <ArrowRightOnRectangleIcon className="h-5 w-5" />
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6 text-gray-900" />
                  ) : (
                    <Bars3Icon className="h-6 w-6 text-gray-900" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button className="btn-secondary font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-primary font-bold">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-gray-200">
            <div className="flex flex-col space-y-2 mt-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200',
                      active
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar