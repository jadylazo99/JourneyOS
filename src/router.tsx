import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { OnboardingGuard } from '@/components/onboarding/OnboardingGuard'
import { TodayPage } from '@/pages/TodayPage'
import { ProgressPage } from '@/pages/ProgressPage'
import { JourneyPage } from '@/pages/JourneyPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { FoodIdeasPage } from '@/pages/FoodIdeasPage'
import { WorkoutPage } from '@/pages/WorkoutPage'
import { PetsPage } from '@/pages/PetsPage'
import { OnboardingPage } from '@/pages/OnboardingPage'

export const router = createBrowserRouter([
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/',
    element: (
      <OnboardingGuard>
        <AppLayout />
      </OnboardingGuard>
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
])
