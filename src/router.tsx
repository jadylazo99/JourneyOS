import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { OnboardingGuard } from '@/components/onboarding/OnboardingGuard'
import { AuthGuard, GuestGuard } from '@/components/auth/AuthGuard'
import { TodayPage } from '@/pages/TodayPage'
import { ProgressPage } from '@/pages/ProgressPage'
import { JourneyPage } from '@/pages/JourneyPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { FoodIdeasPage } from '@/pages/FoodIdeasPage'
import { WorkoutPage } from '@/pages/WorkoutPage'
import { PetsPage } from '@/pages/PetsPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { WelcomeBackPage } from '@/pages/auth/WelcomeBackPage'
import { SignInPage } from '@/pages/auth/SignInPage'
import { CreateAccountPage } from '@/pages/auth/CreateAccountPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'

export const router = createBrowserRouter([
  {
    path: '/auth/welcome',
    element: (
      <GuestGuard>
        <WelcomeBackPage />
      </GuestGuard>
    ),
  },
  {
    path: '/auth/login',
    element: (
      <GuestGuard>
        <SignInPage />
      </GuestGuard>
    ),
  },
  {
    path: '/auth/sign-in',
    element: (
      <GuestGuard>
        <SignInPage />
      </GuestGuard>
    ),
  },
  {
    path: '/auth/sign-up',
    element: (
      <GuestGuard>
        <CreateAccountPage />
      </GuestGuard>
    ),
  },
  {
    path: '/auth/forgot-password',
    element: (
      <GuestGuard>
        <ForgotPasswordPage />
      </GuestGuard>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <AuthGuard>
        <OnboardingPage />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <OnboardingGuard>
          <AppLayout />
        </OnboardingGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <TodayPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'journey', element: <JourneyPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'food', element: <FoodIdeasPage /> },
      { path: 'workout', element: <WorkoutPage /> },
      { path: 'pets', element: <PetsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
