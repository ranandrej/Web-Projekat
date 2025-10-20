import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  SparklesIcon,
  RocketLaunchIcon,
  TrophyIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

const Home = () => {
  const { isAuthenticated, user } = useAuthStore()

  const features = [
    {
      name: 'Smart Learning System',
      description: 'AI-powered quiz recommendations tailored to your learning pace and style.',
      icon: SparklesIcon,
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      name: 'Real-Time Competition',
      description: 'Compete with learners worldwide and climb the global leaderboards.',
      icon: TrophyIcon,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Advanced Analytics',
      description: 'Track your progress with detailed insights and performance metrics.',
      icon: ChartBarIcon,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      name: 'Lightning Fast',
      description: 'Instant results and real-time scoring for immediate feedback.',
      icon: BoltIcon,
      gradient: 'from-yellow-500 to-red-500',
    },
  ]

  const stats = [
    { label: 'Active Learners', value: '50K+', icon: UserGroupIcon },
    { label: 'Expert Quizzes', value: '1,200+', icon: AcademicCapIcon },
    { label: 'Questions Solved', value: '2M+', icon: SparklesIcon },
    { label: 'Success Rate', value: '94%', icon: ShieldCheckIcon },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative container-custom py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-8 animate-fade-in-up">
              <SparklesIcon className="h-5 w-5" />
              The Future of Learning
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Master Any Subject<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Through Challenges
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join thousands of learners taking interactive quizzes, competing globally, and achieving their learning goals faster than ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {isAuthenticated ? (
                <>
                  {user?.roles?.includes('Admin') ? (
                    <>
                      <Link to="/admin">
                        <Button className="btn-lg bg-white text-violet-600 hover:bg-gray-50 hover:text-violet-700 shadow-2xl border-0">
                          <RocketLaunchIcon className="h-6 w-6" />
                          Admin Dashboard
                        </Button>
                      </Link>
                      <Link to="/admin/quizzes">
                        <Button className="btn-lg bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-sm">
                          Manage Content
                          <ArrowRightIcon className="h-5 w-5" />
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/quizzes">
                        <Button className="btn-lg bg-white text-violet-600 hover:bg-gray-50 hover:text-violet-700 shadow-2xl border-0">
                          <RocketLaunchIcon className="h-6 w-6" />
                          Explore Quizzes
                        </Button>
                      </Link>
                      <Link to="/dashboard">
                        <Button className="btn-lg bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-sm">
                          My Dashboard
                          <ArrowRightIcon className="h-5 w-5" />
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button className="btn-lg bg-white text-violet-600 hover:bg-gray-50 hover:text-violet-700 shadow-2xl border-0">
                      <RocketLaunchIcon className="h-6 w-6" />
                      Start Free Today
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="btn-lg bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-sm">
                      Sign In
                      <ArrowRightIcon className="h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats Row */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-purple-200 text-sm font-medium">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 md:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why Choose <span className="gradient-text">QuizMaster Pro</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey in one powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-[28px] p-8 border-2 border-gray-100 hover:border-violet-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="py-24 md:py-32 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="relative container-custom text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
              Join our community and unlock your full learning potential today
            </p>
            <Link to="/register">
              <Button className="btn-lg bg-white text-violet-600 hover:bg-gray-50 shadow-2xl border-0">
                <RocketLaunchIcon className="h-6 w-6" />
                Create Free Account
              </Button>
            </Link>
            <p className="text-purple-200 mt-6">No credit card required • Free forever</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home