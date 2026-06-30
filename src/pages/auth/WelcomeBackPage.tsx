import { Navigate } from 'react-router-dom'

export function WelcomeBackPage() {
  return <Navigate to="/auth/sign-in" replace />
}
