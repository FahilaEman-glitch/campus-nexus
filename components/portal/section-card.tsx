import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type SectionCardProps = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function SectionCard({
  id,
  title,
  description,
  icon: Icon,
  action,
  className,
  children,
}: SectionCardProps) {
  const headingId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        'flex flex-col rounded-3xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id={headingId} className="font-semibold tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="mt-5 flex-1">{children}</div>
    </section>
  )
}
