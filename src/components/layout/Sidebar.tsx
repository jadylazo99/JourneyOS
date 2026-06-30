import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, getNavIcon } from './navConfig'
import { cn } from '@/utils/cn'

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 shrink-0 border-r border-slate-100 bg-white/60 backdrop-blur-sm">
      <div className="px-6 py-8">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold tracking-tight">J</span>
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-primary">JourneyOS</p>
            <p className="text-xs text-slate-400">Life Operating System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
                  )
                }
              >
                {({ isActive }) => {
                  const Icon = getNavIcon(item.icon, isActive)
                  return (
                    <>
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </>
                  )
                }}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 py-6 border-t border-slate-100">
        <p className="text-xs text-slate-400">Version 0.8</p>
      </div>
    </aside>
  )
}
