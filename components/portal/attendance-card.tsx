import { AlertTriangle, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionCard } from './section-card'

const MIN_REQUIRED = 75

const courses = [
  { code: 'CS 341', name: 'Distributed Systems', attended: 22, total: 23 },
  { code: 'CS 320', name: 'Machine Learning', attended: 19, total: 21 },
  { code: 'MA 260', name: 'Linear Algebra', attended: 17, total: 20 },
  { code: 'HU 210', name: 'Ethics in Technology', attended: 11, total: 15 },
]

const totalAttended = courses.reduce((sum, c) => sum + c.attended, 0)
const totalClasses = courses.reduce((sum, c) => sum + c.total, 0)
const overall = Math.round((totalAttended / totalClasses) * 100)

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
  const atRisk = courses.filter((c) => Math.round((c.attended / c.total) * 100) < MIN_REQUIRED)

  return (
    <SectionCard
      id="attendance"
      title="Attendance"
      description="Live sync with smart-card check-ins"
      icon={UserCheck}
      action={
        <span className="hidden rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success sm:inline">
          On track
        </span>
      }
    >
      <div className="flex items-center gap-5 rounded-2xl bg-muted/60 p-4">
        <ProgressRing value={overall} />
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalAttended}</span> of {totalClasses}{' '}
            sessions attended
          </p>
          <p className="text-sm text-muted-foreground">
            Minimum required: <span className="font-medium text-foreground">{MIN_REQUIRED}%</span>
          </p>
          {atRisk.length > 0 && (
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-warning-foreground">
              <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
              {atRisk.length} course needs attention
            </p>
          )}
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {courses.map((course) => {
          const pct = Math.round((course.attended / course.total) * 100)
          const low = pct < MIN_REQUIRED
          return (
            <li key={course.code}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">
                  <span className="font-mono text-xs text-muted-foreground">{course.code}</span>{' '}
                  <span className="font-medium">{course.name}</span>
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
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
