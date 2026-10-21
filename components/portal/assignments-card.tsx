'use client'

import { useState } from 'react'
import { Check, ClipboardList, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionCard } from './section-card'

type Assignment = {
  id: string
  title: string
  course: string
  due: string
  priority: 'high' | 'medium' | 'low'
  attachments: number
  done: boolean
}

const initialAssignments: Assignment[] = [
  { id: 'a1', title: 'Raft consensus implementation', course: 'CS 341', due: 'Tomorrow, 11:59 PM', priority: 'high', attachments: 3, done: false },
  { id: 'a2', title: 'Gradient descent lab report', course: 'CS 320', due: 'Fri, Oct 23', priority: 'medium', attachments: 1, done: false },
  { id: 'a3', title: 'Eigenvalues problem set 6', course: 'MA 260', due: 'Mon, Oct 26', priority: 'medium', attachments: 0, done: false },
  { id: 'a4', title: 'AI ethics position essay', course: 'HU 210', due: 'Wed, Oct 28', priority: 'low', attachments: 2, done: false },
  { id: 'a5', title: 'Neural nets quiz prep', course: 'CS 320', due: 'Submitted Oct 19', priority: 'low', attachments: 0, done: true },
]

const filters = ['All', 'Pending', 'Done'] as const
type Filter = (typeof filters)[number]

const priorityStyles: Record<Assignment['priority'], string> = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/15 text-warning-foreground',
  low: 'bg-secondary text-secondary-foreground',
}

export function AssignmentsCard() {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [filter, setFilter] = useState<Filter>('Pending')

  const pendingCount = assignments.filter((a) => !a.done).length
  const visible = assignments.filter((a) =>
    filter === 'All' ? true : filter === 'Pending' ? !a.done : a.done,
  )

  function toggle(id: string) {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)))
  }

  return (
    <SectionCard
      id="assignments"
      title="Assignments"
      description={`${pendingCount} pending across 4 courses`}
      icon={ClipboardList}
    >
      <div role="tablist" aria-label="Filter assignments" className="inline-flex rounded-lg bg-muted p-1">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              filter === f
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-4 divide-y divide-border">
        {visible.map((a) => (
          <li key={a.id} className="flex items-start gap-3 py-3.5 first:pt-1">
            <button
              type="button"
              onClick={() => toggle(a.id)}
              aria-pressed={a.done}
              aria-label={a.done ? `Mark "${a.title}" as pending` : `Mark "${a.title}" as done`}
              className={cn(
                'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                a.done
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary',
              )}
            >
              {a.done && <Check className="size-3.5" aria-hidden="true" />}
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  a.done && 'text-muted-foreground line-through',
                )}
              >
                {a.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="font-mono">{a.course}</span>
                <span>{a.due}</span>
                {a.attachments > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Paperclip className="size-3" aria-hidden="true" />
                    {a.attachments}
                  </span>
                )}
              </div>
            </div>
            {!a.done && (
              <span
                className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
                  priorityStyles[a.priority],
                )}
              >
                {a.priority}
              </span>
            )}
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-10 text-center text-sm text-muted-foreground">
            {filter === 'Pending' ? 'All caught up. Nice work!' : 'Nothing here yet.'}
          </li>
        )}
      </ul>
    </SectionCard>
  )
}
