'use client'

import { useState } from 'react'
import { CalendarDays, Check, MapPin, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionCard } from './section-card'

const events = [
  { id: 'e1', month: 'Oct', day: '23', title: 'HackNorth 2026 Kickoff', category: 'Tech', time: '6:00 PM', location: 'Innovation Hub', going: 214 },
  { id: 'e2', month: 'Oct', day: '25', title: 'Career Fair: Product & Design', category: 'Career', time: '10:00 AM', location: 'Grand Atrium', going: 482 },
  { id: 'e3', month: 'Oct', day: '28', title: 'Open Mic & Acoustic Night', category: 'Culture', time: '7:30 PM', location: 'Student Union Café', going: 96 },
  { id: 'e4', month: 'Nov', day: '02', title: 'Intramural Futsal Finals', category: 'Sports', time: '4:00 PM', location: 'East Arena', going: 158 },
]

export function EventsCard() {
  const [rsvps, setRsvps] = useState<Set<string>>(() => new Set(['e2']))

  function toggleRsvp(id: string) {
    setRsvps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <SectionCard
      id="events"
      title="Events"
      description="What's happening on campus"
      icon={CalendarDays}
      action={
        <a href="#events" className="text-sm font-medium text-primary hover:underline">
          See all
        </a>
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {events.map((event) => {
          const going = rsvps.has(event.id)
          return (
            <li
              key={event.id}
              className="flex flex-col rounded-2xl border border-border p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-accent py-1.5 text-accent-foreground">
                  <span className="text-[10px] font-semibold tracking-wider uppercase">{event.month}</span>
                  <span className="text-lg leading-none font-semibold">{event.day}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-medium tracking-wide text-primary uppercase">
                    {event.category}
                  </span>
                  <p className="text-sm leading-snug font-medium text-pretty">{event.title}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {event.location} · {event.time}
                </p>
                <p className="flex items-center gap-1.5">
                  <Users className="size-3.5" aria-hidden="true" />
                  {event.going + (going ? 1 : 0)} going
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleRsvp(event.id)}
                aria-pressed={going}
                className={cn(
                  'mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors',
                  going
                    ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              >
                {going && <Check className="size-4" aria-hidden="true" />}
                {going ? "You're going" : 'RSVP'}
              </button>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
