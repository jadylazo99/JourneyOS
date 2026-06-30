import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout, AuthField, AuthButton, AuthError } from '@/components/auth/AuthLayout'
import { AuthServiceError, sendPasswordReset } from '@/services/authService'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      await sendPasswordReset(email)
      setMessage('If an account exists for that email, a password reset link has been sent.')
    } catch (err) {
      setError(err instanceof AuthServiceError ? err.message : 'Could not send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we will send you a link to reset your password."
      footer={
        <Link
          to="/auth/sign-in"
          className="font-semibold text-white underline-offset-2 hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <AuthError message={error} /> : null}
        {message ? (
          <div className="rounded-2xl border border-blue/20 bg-blue/5 px-4 py-3 text-sm text-blue">
            {message}
          </div>
        ) : null}
        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <AuthButton type="submit" disabled={loading || !email}>
          {loading ? 'Sending…' : 'Send reset link'}
        </AuthButton>
      </form>
    </AuthLayout>
  )
}
