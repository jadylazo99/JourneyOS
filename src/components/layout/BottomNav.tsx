import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, getNavIcon } from './navConfig'
import { cn } from '@/utils/cn'

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden safe-bottom">
      <div className="mx-3 mb-3 rounded-2xl bg-white/90 backdrop-blur-xl shadow-nav border border-slate-100/80">
        <ul className="flex items-stretch justify-around px-1 py-1.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.path} className="flex-1">
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-0.5 rounded-xl py-2 px-1 transition-colors duration-200',
                    isActive
                      ? 'text-blue'
                      : 'text-slate-400 hover:text-slate-600',
                  )
                }
              >
                {({ isActive }) => {
                  const Icon = getNavIcon(item.icon, isActive)
                  return (
                    <>
                      <Icon className="h-6 w-6" strokeWidth={isActive ? 2 : 1.5} />
                      <span className="text-[10px] font-medium tracking-tight">
                        {item.label}
                      </span>
                    </>
                  )
                }}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
