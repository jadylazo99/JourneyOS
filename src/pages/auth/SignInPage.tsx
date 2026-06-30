import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout, AuthField, AuthButton, AuthError } from '@/components/auth/AuthLayout'
import { AuthDivider, GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { AuthServiceError, signInWithEmail } from '@/services/authService'

export function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const goHome = () => navigate('/', { replace: true })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmail(email, password)
      goHome()
    } catch (err) {
      setError(err instanceof AuthServiceError ? err.message : 'Could not sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back to JourneyOS."
      footer={
        <span>
          New here?{' '}
          <Link
            to="/auth/sign-up"
            className="font-semibold text-white underline-offset-2 hover:underline"
          >
            Create account
          </Link>
        </span>
      }
    >
      <div className="space-y-4">
        <GoogleSignInButton onSuccess={goHome} disabled={loading} />
        <AuthDivider />
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <AuthError message={error} /> : null}
          <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <AuthField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Your password"
            autoComplete="current-password"
          />
          <div className="text-right">
            <Link
              to="/auth/forgot-password"
              className="text-xs font-medium text-blue hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <AuthButton type="submit" disabled={loading || !email || !password}>
            {loading ? 'Signing in…' : 'Sign in'}
          </AuthButton>
        </form>
      </div>
    </AuthLayout>
  )
}
