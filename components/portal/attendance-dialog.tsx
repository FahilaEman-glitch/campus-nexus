'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { AlertTriangle, CalendarClock, CheckCircle2, Clock, MapPin, UserCheck, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  attendanceOutlook,
  coursePercent,
  courses,
  MIN_ATTENDANCE,
  overallAttendance,
  totalAttended,
  totalClasses,
  type SessionStatus,
} from '@/lib/portal-data'
import { Modal, btnPrimary, btnSecondary } from './modal'

type AttendanceDialogContextValue = {
  openAttendance: (courseCode?: string) => void
}

const AttendanceDialogContext = createContext<AttendanceDialogContextValue | null>(null)

export function useAttendanceDialog() {
  const ctx = useContext(AttendanceDialogContext)
  if (!ctx) throw new Error('useAttendanceDialog must be used within AttendanceDialogProvider')
  return ctx
}

const statusMeta: Record<SessionStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  present: { label: 'Present', icon: CheckCircle2, className: 'bg-success/10 text-success' },
  late: { label: 'Late', icon: Clock, className: 'bg-warning/15 text-warning-foreground' },
  absent: { label: 'Absent', icon: XCircle, className: 'bg-destructive/10 text-destructive' },
}

export function AttendanceDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string>('all')

  const openAttendance = useCallback((courseCode?: string) => {
    setSelected(courseCode ?? 'all')
    setOpen(true)
  }, [])

  const course = courses.find((c) => c.code === selected)

  return (
    <AttendanceDialogContext.Provider value={{ openAttendance }}>
      {children}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Attendance details"
        description="Fall Semester 2026 · Updated 2 min ago"
        icon={UserCheck}
        className="max-w-2xl"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setOpen(false)}>
              Close
            </button>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => toast.success('Attendance report sent to aisha.khan@northbridge.edu')}
            >
              Email report
            </button>
          </>
        }
      >
        <div role="tablist" aria-label="Select course" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {[{ code: 'all', label: 'Overview' }, ...courses.map((c) => ({ code: c.code, label: c.code }))].map(
            (tab) => (
              <button
                key={tab.code}
                type="button"
                role="tab"
                aria-selected={selected === tab.code}
                onClick={() => setSelected(tab.code)}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  selected === tab.code
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ),
          )}
        </div>

        {course ? <CourseDetail code={course.code} /> : <Overview onSelect={setSelected} />}
      </Modal>
    </AttendanceDialogContext.Provider>
  )
}

function Overview({ onSelect }: { onSelect: (code: string) => void }) {
  const absences = totalClasses - totalAttended
  return (
    <div className="mt-5 space-y-5">
      <dl className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Overall" value={`${overallAttendance}%`} />
        <Stat label="Attended" value={`${totalAttended}/${totalClasses}`} />
        <Stat label="Absences" value={String(absences)} />
      </dl>

      <div>
        <h3 className="text-sm font-semibold">By course</h3>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border">
          {courses.map((c) => {
            const pct = coursePercent(c)
            const outlook = attendanceOutlook(c)
            return (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => onSelect(c.code)}
                  className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      <span className="font-mono text-xs text-muted-foreground">{c.code}</span> {c.name}
                    </p>
                    <p className={cn('mt-0.5 text-xs', outlook.safe ? 'text-muted-foreground' : 'text-destructive')}>
                      {outlook.safe
                        ? `Can miss ${outlook.count} more ${outlook.count === 1 ? 'class' : 'classes'}`
                        : `Attend next ${outlook.count} classes to reach ${MIN_ATTENDANCE}%`}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums',
                      outlook.safe ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive',
                    )}
                  >
                    {pct}%
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function CourseDetail({ code }: { code: string }) {
  const course = courses.find((c) => c.code === code)!
  const pct = coursePercent(course)
  const outlook = attendanceOutlook(course)

  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-2xl bg-muted/60 p-4">
        <p className="font-semibold">{course.name}</p>
        <p className="text-sm text-muted-foreground">{course.professor}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            {course.schedule}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden="true" />
            {course.room}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Attendance" value={`${pct}%`} danger={!outlook.safe} />
        <Stat label="Attended" value={`${course.attended}/${course.total}`} />
        <Stat label="Missed" value={String(course.total - course.attended)} />
      </dl>

      <div
        className={cn(
          'flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm',
          outlook.safe ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive',
        )}
      >
        {outlook.safe ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        ) : (
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        )}
        <p>
          {outlook.safe
            ? `You're above the ${MIN_ATTENDANCE}% minimum. You can miss ${outlook.count} more ${outlook.count === 1 ? 'class' : 'classes'} and stay eligible.`
            : `You're below the ${MIN_ATTENDANCE}% minimum. Attend the next ${outlook.count} classes in a row to get back on track.`}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Recent sessions</h3>
        <ul className="mt-3 space-y-2">
          {course.sessions.map((s) => {
            const meta = statusMeta[s.status]
            const Icon = meta.icon
            return (
              <li key={s.date} className="flex items-center gap-3 rounded-xl border border-border px-3.5 py-2.5">
                <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{s.date}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{s.topic}</span>
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                    meta.className,
                  )}
                >
                  <Icon className="size-3" aria-hidden="true" />
                  {meta.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-2xl border border-border p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn('mt-1 text-xl font-semibold tracking-tight tabular-nums', danger && 'text-destructive')}>
        {value}
      </dd>
    </div>
  )
}
