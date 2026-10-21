'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, ClipboardList, House, SearchCheck, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
  { id: 'assignments', label: 'Tasks', icon: ClipboardList },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'lost-found', label: 'Lost & Found', icon: SearchCheck },
]

export function BottomNav() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-4 sm:px-0 sm:pb-0"
    >
      <ul className="mx-auto flex max-w-lg items-center justify-between gap-1 rounded-2xl border border-border bg-card/90 p-1.5 shadow-[0_8px_30px_rgba(16,24,40,0.12)] backdrop-blur-xl">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                onClick={() => setActive(id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
