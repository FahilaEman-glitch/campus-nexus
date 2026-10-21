'use client'

import { useState } from 'react'
import { CalendarClock, Check, ClipboardList, FileText, Paperclip, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { SectionCard } from './section-card'
import { Modal, btnPrimary, btnSecondary } from './modal'

type Assignment = {
  id: string
  title: string
  course: string
  due: string
  priority: 'high' | 'medium' | 'low'
  files: string[]
  points: number
  brief: string
  done: boolean
}

const initialAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Raft consensus implementation',
    course: 'CS 341',
    due: 'Tomorrow, 11:59 PM',
    priority: 'high',
    files: ['raft-starter.zip', 'spec.pdf', 'test-harness.go'],
    points: 100,
    brief: 'Implement leader election and log replication for a 5-node Raft cluster. All provided tests must pass, and include a short write-up on failure scenarios.',
    done: false,
  },
  {
    id: 'a2',
    title: 'Gradient descent lab report',
    course: 'CS 320',
    due: 'Fri, Oct 23',
    priority: 'medium',
    files: ['lab4-dataset.csv'],
    points: 40,
    brief: 'Compare SGD, momentum, and Adam on the provided dataset. Plot loss curves and discuss convergence behavior in under 4 pages.',
    done: false,
  },
  {
    id: 'a3',
    title: 'Eigenvalues problem set 6',
    course: 'MA 260',
    due: 'Mon, Oct 26',
    priority: 'medium',
    files: [],
    points: 30,
    brief: 'Problems 6.1 – 6.14 from the textbook. Show full working for diagonalization questions.',
    done: false,
  },
  {
    id: 'a4',
    title: 'AI ethics position essay',
    course: 'HU 210',
    due: 'Wed, Oct 28',
    priority: 'low',
    files: ['essay-rubric.pdf', 'reading-list.pdf'],
    points: 50,
    brief: 'A 1,500-word position essay on accountability for autonomous systems. Cite at least four sources from the reading list.',
    done: false,
  },
  {
    id: 'a5',
    title: 'Neural nets quiz prep',
    course: 'CS 320',
    due: 'Submitted Oct 19',
    priority: 'low',
    files: [],
    points: 10,
    brief: 'Practice quiz covering perceptrons, activation functions, and backpropagation.',
    done: true,
  },
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
  const [openId, setOpenId] = useState<string | null>(null)

  const pendingCount = assignments.filter((a) => !a.done).length
  const visible = assignments.filter((a) => (filter === 'All' ? true : filter === 'Pending' ? !a.done : a.done))
  const selected = assignments.find((a) => a.id === openId)

  function setDone(id: string, done: boolean) {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, done } : a)))
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
              filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-3 space-y-1">
        {visible.map((a) => (
          <li key={a.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60">
            <button
              type="button"
              onClick={() => {
                setDone(a.id, !a.done)
                toast.success(a.done ? 'Moved back to pending' : 'Marked as done')
              }}
              aria-pressed={a.done}
              aria-label={a.done ? `Mark "${a.title}" as pending` : `Mark "${a.title}" as done`}
              className={cn(
                'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                a.done ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary',
              )}
            >
              {a.done && <Check className="size-3.5" aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => setOpenId(a.id)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
              <span className="min-w-0 flex-1">
                <span className={cn('block text-sm font-medium', a.done && 'text-muted-foreground line-through')}>
                  {a.title}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-mono">{a.course}</span>
                  <span>{a.due}</span>
                  {a.files.length > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Paperclip className="size-3" aria-hidden="true" />
                      {a.files.length}
                    </span>
                  )}
                </span>
              </span>
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
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-10 text-center text-sm text-muted-foreground">
            {filter === 'Pending' ? 'All caught up. Nice work!' : 'Nothing here yet.'}
          </li>
        )}
      </ul>

      <Modal
        open={!!selected}
        onClose={() => setOpenId(null)}
        title={selected?.title ?? ''}
        description={selected ? `${selected.course} · ${selected.points} points` : undefined}
        icon={ClipboardList}
        footer={
          selected && (
            <>
              <button type="button" className={btnSecondary} onClick={() => setOpenId(null)}>
                Close
              </button>
              {selected.done ? (
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => {
                    setDone(selected.id, false)
                    toast('Submission withdrawn')
                  }}
                >
                  Withdraw submission
                </button>
              ) : (
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() => {
                    setDone(selected.id, true)
                    setOpenId(null)
                    toast.success('Assignment submitted', { description: selected.title })
                  }}
                >
                  <Upload className="size-4" aria-hidden="true" />
                  Submit work
                </button>
              )}
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                <CalendarClock className="size-3.5 text-primary" aria-hidden="true" />
                {selected.due}
              </span>
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                  selected.done ? 'bg-success/10 text-success' : priorityStyles[selected.priority],
                )}
              >
                {selected.done ? 'Submitted' : `${selected.priority} priority`}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Brief</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.brief}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Attachments</h3>
              {selected.files.length === 0 ? (
                <p className="mt-1 text-sm text-muted-foreground">No attachments for this assignment.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {selected.files.map((file) => (
                    <li key={file}>
                      <button
                        type="button"
                        onClick={() => toast(`Downloading ${file}`)}
                        className="flex w-full items-center gap-3 rounded-xl border border-border px-3.5 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-muted/50"
                      >
                        <FileText className="size-4 text-primary" aria-hidden="true" />
                        <span className="truncate font-mono text-xs">{file}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>
    </SectionCard>
  )
}
