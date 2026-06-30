import {
  SunIcon,
  ChartBarIcon,
  MapIcon,
  BookOpenIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import {
  SunIcon as SunIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  MapIcon as MapIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/24/solid'
import type { NavItem } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Today', path: '/', icon: 'today' },
  { label: 'Progress', path: '/progress', icon: 'progress' },
  { label: 'Journey', path: '/journey', icon: 'journey' },
  { label: 'Resources', path: '/resources', icon: 'resources' },
  { label: 'Profile', path: '/profile', icon: 'profile' },
]

const iconMap = {
  today: { outline: SunIcon, solid: SunIconSolid },
  progress: { outline: ChartBarIcon, solid: ChartBarIconSolid },
  journey: { outline: MapIcon, solid: MapIconSolid },
  resources: { outline: BookOpenIcon, solid: BookOpenIconSolid },
  profile: { outline: UserCircleIcon, solid: UserCircleIconSolid },
}

export function getNavIcon(icon: NavItem['icon'], active: boolean) {
  const icons = iconMap[icon]
  return active ? icons.solid : icons.outline
}
