import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import {
  SparklesIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UsersIcon,
  ClockIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

const Home = () => {
  const { isAuthenticated, user } = useAuthStore()

  const features = [
    {
      name: 'Interactive Quizzes',
      description: 'Engage with dynamic quizzes featuring multiple question types and instant feedback.',
      icon: AcademicCapIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      name: 'Global Leaderboards',
      description: 'Compete globally and track your ranking against thousands of quiz takers.',
      icon: TrophyIcon,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      name: 'Advanced Analytics',
      description: 'Gain deep insights into your performance with comprehensive statistics.',
      icon: ChartBarIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      name: 'Real-time Progress',
      description: 'Monitor your improvement with live progress tracking and personalized recommendations.',
      icon: ClockIcon,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ]

  const benefits = [
    {
      icon: RocketLaunchIcon,
      title: 'Instant Start',
      description: 'Jump right in and start taking quizzes within seconds of signing up.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verified Content',
      description: 'All quizzes are carefully curated to ensure accuracy and quality.',
    },
    {
      icon: UsersIcon,
      title: 'Active Community',
      description: 'Join a thriving community of learners and knowledge enthusiasts.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  {/* Hero Section */}
  <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="absolute inset-0 bg-dots"></div>


    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
      <div className="max-w-4xl">
        {/* Small Label */}
        <div className="inline-block mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium uppercase tracking-wider rounded-full border border-white/20">
            <SparklesIcon className="h-4 w-4" />
            <span>Quiz Platform</span>
          </div>
        </div>

        {/* Large Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[0.95] tracking-tight">
          Learn Through
          <br />
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Testing
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl font-light leading-relaxed">
          Challenge yourself with interactive quizzes, compete on global leaderboards, and track your learning journey.
        </p>

        {/* CTA Section */}
        <div className="flex flex-wrap gap-4 items-center">
          {isAuthenticated ? (
            <>
              {user?.roles?.includes('Admin') ? (
                <>
                  <Link to="/admin/quizzes">
                    <Button className="h-14 px-8 bg-white text-indigo-600 hover:bg-blue-50 font-semibold rounded-full transition-all hover:scale-105 shadow-lg">
                      Manage Quizzes
                    </Button>
                  </Link>
                  <Link to="/admin">
                    <Button className="h-14 px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold rounded-full transition-all">
                      Admin Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/quizzes">
                    <Button className="h-14 px-8 bg-white text-indigo-600 hover:bg-blue-50 font-semibold rounded-full transition-all hover:scale-105 shadow-lg">
                      Browse Quizzes
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button className="h-14 px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold rounded-full transition-all">
                      My Dashboard
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/register">
                <Button className="h-14 px-8 bg-white text-indigo-600 hover:bg-blue-50 font-semibold rounded-full transition-all hover:scale-105 shadow-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button className="h-14 px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold rounded-full transition-all">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Stats Row */}
        <div className="mt-16 flex flex-wrap gap-x-12 gap-y-4 text-sm">
          <div>
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-blue-200">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-blue-200">Quizzes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100K+</div>
            <div className="text-blue-200">Completions</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Features Grid */}
  <div className="py-24 md:py-32 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          Built for learners
        </h2>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Everything you need to succeed in one powerful platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
              <feature.icon className={`h-8 w-8 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.name}</h3>
            <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Benefits Section */}
  <div className="py-24 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Why choose our platform?
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Join thousands of learners who trust our platform for their educational journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">{benefit.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Social Proof */}
  <div className="py-24 md:py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-[40px] p-12 md:p-20 text-white overflow-hidden relative border border-white/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the community</h2>
          <p className="text-xl text-white/80 mb-16 max-w-2xl mx-auto">
            Thousands of learners are already improving their skills every day
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="text-6xl md:text-7xl font-bold mb-3 text-white group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-lg text-white/70">Active Learners</div>
            </div>
            <div className="group">
              <div className="text-6xl md:text-7xl font-bold mb-3 text-white group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-lg text-white/70">Expert Quizzes</div>
            </div>
            <div className="group">
              <div className="text-6xl md:text-7xl font-bold mb-3 text-white group-hover:scale-110 transition-transform duration-300">
                100K+
              </div>
              <div className="text-lg text-white/70">Questions Solved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Final CTA */}
  {!isAuthenticated && (
    <div className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots"></div>


      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to start your learning journey?
        </h2>
        <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
          Create your free account and take your first quiz in under a minute
        </p>
        <Link to="/register">
          <Button className="h-16 px-12 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 text-lg font-semibold rounded-full transition-all hover:scale-105 shadow-2xl hover:shadow-yellow-500/25">
            Create Free Account
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Button>
        </Link>
        <p className="text-purple-200 mt-8">No credit card required • Free forever</p>
      </div>
    </div>
  )}
</div>

  )
}

export default Home