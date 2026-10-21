'use client'

import { useState } from 'react'
import { Bell, CalendarDays, ClipboardList, GraduationCap, LogOut, Orbit, Search, SearchCheck, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Modal, btnPrimary, btnSecondary } from './modal'

const initialNotifications = [
  { id: 'n1', icon: ClipboardList, title: 'Raft implementation due tomorrow', body: 'CS 341 · 11:59 PM', time: '10m', href: '#assignments', unread: true },
  { id: 'n2', icon: SearchCheck, title: 'A grey backpack matching your report was found', body: 'Gym locker room', time: '1h', href: '#lost-found', unread: true },
  { id: 'n3', icon: CalendarDays, title: 'Career Fair starts in 2 days', body: 'Grand Atrium · 10:00 AM', time: '3h', href: '#events', unread: true },
  { id: 'n4', icon: GraduationCap, title: 'MA 260 grades published', body: 'Problem set 5 · 27/30', time: 'Yesterday', href: '#attendance', unread: false },
]

export function TopBar() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const unread = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#home" className="flex items-center gap-2" aria-label="Orbit home">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Orbit className="size-4.5" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Orbit</span>
          <span className="hidden rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline">
            Northbridge
          </span>
        </a>

        <form
          role="search"
          className="ml-auto hidden max-w-sm flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault()
            const q = String(new FormData(e.currentTarget).get('q') ?? '').trim()
            if (q) toast(`Searching for "${q}"`, { description: 'Showing results across courses, events, and items.' })
          }}
        >
          <label htmlFor="global-search" className="sr-only">
            Search courses, events, and items
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="global-search"
              name="q"
              type="search"
              placeholder="Search courses, events, items…"
              className="h-9 w-full rounded-lg border border-border bg-card pr-12 pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Notifications, ${unread} unread`}
          >
            <Bell className="size-4" aria-hidden="true" />
            {unread > 0 && <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2.5 rounded-lg py-1 pr-1 pl-1 text-left transition-colors hover:bg-muted sm:pr-3"
            aria-label="Open profile"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              AK
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-medium">Aisha Khan</span>
              <span className="text-xs text-muted-foreground">CS · Year 3</span>
            </span>
          </button>
        </div>
      </div>

      <Modal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="Notifications"
        description={unread ? `${unread} unread` : 'You’re all caught up'}
        icon={Bell}
        footer={
          <button
            type="button"
            className={btnSecondary}
            disabled={unread === 0}
            onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
          >
            Mark all as read
          </button>
        }
      >
        <ul className="space-y-2">
          {notifications.map(({ id, icon: Icon, title, body, time, href, unread: isUnread }) => (
            <li key={id}>
              <a
                href={href}
                onClick={() => {
                  setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
                  setNotifOpen(false)
                }}
                className={cn(
                  'flex items-start gap-3 rounded-2xl border p-3 transition-colors hover:bg-muted/50',
                  isUnread ? 'border-primary/30 bg-accent/40' : 'border-border',
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-pretty">{title}</span>
                  <span className="block text-xs text-muted-foreground">{body}</span>
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{time}</span>
              </a>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Aisha Khan"
        description="aisha.khan@northbridge.edu"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => toast('Settings coming soon')}>
              <Settings className="size-4" aria-hidden="true" />
              Settings
            </button>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => {
                setProfileOpen(false)
                toast('Signed out (demo)', { description: 'This is a demo portal — no real session was ended.' })
              }}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </>
        }
      >
        <dl className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            { label: 'Student ID', value: 'NB-2023-04817' },
            { label: 'Program', value: 'B.Sc. Computer Science' },
            { label: 'Year', value: '3rd year' },
            { label: 'Cumulative GPA', value: '3.78' },
            { label: 'Credits earned', value: '84 / 120' },
            { label: 'Advisor', value: 'Dr. Elena Marsh' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-muted/60 px-3.5 py-3">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </Modal>
    </header>
  )
}
