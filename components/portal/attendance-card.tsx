'use client'

import { AlertTriangle, ChevronRight, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  coursePercent,
  courses,
  MIN_ATTENDANCE,
  overallAttendance,
  totalAttended,
  totalClasses,
} from '@/lib/portal-data'
import { SectionCard } from './section-card'
import { useAttendanceDialog } from './attendance-dialog'

function ProgressRing({ value }: { value: number }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="9" className="stroke-muted" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight">{value}%</span>
        <span className="text-[11px] text-muted-foreground">overall</span>
      </div>
    </div>
  )
}

export function AttendanceCard() {
  const { openAttendance } = useAttendanceDialog()
  const atRisk = courses.filter((c) => coursePercent(c) < MIN_ATTENDANCE)

  return (
    <SectionCard
      id="attendance"
      title="Attendance"
      description="Live sync with smart-card check-ins"
      icon={UserCheck}
      action={
        <button
          type="button"
          onClick={() => openAttendance()}
          className="inline-flex items-center gap-0.5 text-sm font-medium text-primary hover:underline"
        >
          Details
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      }
    >
      <button
        type="button"
        onClick={() => openAttendance()}
        aria-label={`Open attendance details, ${overallAttendance}% overall`}
        className="flex w-full items-center gap-5 rounded-2xl bg-muted/60 p-4 text-left transition-colors hover:bg-accent"
      >
        <ProgressRing value={overallAttendance} />
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalAttended}</span> of {totalClasses} sessions
            attended
          </p>
          <p className="text-sm text-muted-foreground">
            Minimum required: <span className="font-medium text-foreground">{MIN_ATTENDANCE}%</span>
          </p>
          {atRisk.length > 0 && (
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-warning-foreground">
              <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
              {atRisk.length} course needs attention
            </p>
          )}
        </div>
      </button>

      <ul className="mt-3 space-y-1">
        {courses.map((course) => {
          const pct = coursePercent(course)
          const low = pct < MIN_ATTENDANCE
          return (
            <li key={course.code}>
              <button
                type="button"
                onClick={() => openAttendance(course.code)}
                className="group w-full rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted/60"
              >
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-xs text-muted-foreground">{course.code}</span>{' '}
                    <span className="font-medium group-hover:text-primary">{course.name}</span>
                  </span>
                  <span className={cn('shrink-0 font-semibold tabular-nums', low && 'text-destructive')}>
                    {pct}%
                  </span>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${course.name} attendance`}
                >
                  <div
                    className={cn('h-full rounded-full', low ? 'bg-destructive' : 'bg-primary')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
