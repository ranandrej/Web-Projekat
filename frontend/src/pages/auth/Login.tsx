import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { EyeIcon, EyeSlashIcon, SparklesIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const authData = await login(data)

      // Check if user is admin and redirect accordingly
      const isAdmin = authData.user?.roles?.includes('Admin')
      const redirectPath = isAdmin ? '/admin' : (from !== '/dashboard' ? from : '/dashboard')

      navigate(redirectPath, { replace: true })
    } catch (error) {
      // Error handling is done in useAuth hook
    }
  }

  const features = [
    {
      icon: SparklesIcon,
      title: 'Smart Learning',
      description: 'Personalized quiz recommendations'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Your data is always protected'
    },
    {
      icon: BoltIcon,
      title: 'Instant Results',
      description: 'Get feedback immediately'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-indigo-700 text-sm font-medium rounded-full border border-white/30 mb-6">
              <SparklesIcon className="h-4 w-4" />
              Welcome Back
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Continue Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learning Journey</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Sign in to access your personalized dashboard, track your progress, and compete with learners worldwide.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">10k+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-600">Quizzes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">4.9★</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Enter your credentials to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <Label htmlFor="email" required>Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  placeholder="you@example.com"
                  className="mt-1"
                />
                {errors.email && (
                  <p className="input-error">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" required>Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    error={!!errors.password}
                    placeholder="Enter your password"
                    className="pr-12"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="input-error">{errors.password.message}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to KvizHub?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Create an account and start learning today
              </p>
              <Link to="/register">
                <Button className="w-full h-12 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Test Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 font-medium mb-2">Test Credentials:</p>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>Admin:</strong> admin@kvizhub.com / Admin123!</p>
              <p><strong>User:</strong> john.doe@example.com / Test123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login