import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import authService from '@/services/authService'
import SparklesIcon from '@heroicons/react/24/outline/SparklesIcon'

const Layout = () => {
  const { isAuthenticated, token, setUser, clearAuth } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    const validateToken = async () => {
      if (isAuthenticated && token) {
        try {
          const user = await authService.getCurrentUser()
          setUser(user)
        } catch (error) {
          clearAuth()
        }
      }
    }

    validateToken()
  }, [isAuthenticated, token, setUser, clearAuth])

  // Check if current page is home page
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen">
      {/* Background with gradient */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-50 via-white to-primary-50"></div>

        {/* Decorative blurred circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-pattern-dots opacity-[0.02]"></div>
      </div>

      <Navbar />

      <main className={isHomePage ? '' : 'container-custom py-8'}>
        <Outlet />
      </main>

      {/* Footer */}
      {!isHomePage && (
        <footer className="mt-auto py-10 border-t-2 border-gray-200 bg-white/80 backdrop-blur-xl">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-[16px] flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-black text-gray-900">
                    QuizMaster <span className="gradient-text">Pro</span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    © 2025 All rights reserved
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-8 text-sm font-semibold text-gray-600">
                <a href="#" className="hover:text-violet-600 transition-colors">About</a>
                <a href="#" className="hover:text-violet-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-violet-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-violet-600 transition-colors">Contact</a>
              </div>

             
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default Layout