import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout, AuthField, AuthButton, AuthError } from '@/components/auth/AuthLayout'
import { AuthDivider, GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { AuthServiceError, signUpWithEmail } from '@/services/authService'

export function CreateAccountPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const goHome = () => navigate('/', { replace: true })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await signUpWithEmail(email, password)
      goHome()
    } catch (err) {
      setError(err instanceof AuthServiceError ? err.message : 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Your JourneyOS data stays private and backs up to your account."
      footer={
        <span>
          Already have an account?{' '}
          <Link
            to="/auth/sign-in"
            className="font-semibold text-white underline-offset-2 hover:underline"
          >
            Sign in
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <AuthField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
          <AuthButton type="submit" disabled={loading || !email || !password || !confirmPassword}>
            {loading ? 'Creating account…' : 'Create account'}
          </AuthButton>
        </form>
      </div>
    </AuthLayout>
  )
}
