'use client'

import { useState } from 'react'
import { CalendarDays, CalendarPlus, Check, Clock, MapPin, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { SectionCard } from './section-card'
import { Modal, btnPrimary, btnSecondary } from './modal'

type CampusEvent = {
  id: string
  month: string
  day: string
  title: string
  category: string
  time: string
  location: string
  going: number
  host: string
  about: string
}

const events: CampusEvent[] = [
  { id: 'e1', month: 'Oct', day: '23', title: 'HackNorth 2026 Kickoff', category: 'Tech', time: '6:00 PM', location: 'Innovation Hub', going: 214, host: 'Northbridge Dev Society', about: 'The opening night of our 36-hour hackathon. Meet sponsors, form teams, and grab free dinner before hacking begins at 8 PM.' },
  { id: 'e2', month: 'Oct', day: '25', title: 'Career Fair: Product & Design', category: 'Career', time: '10:00 AM', location: 'Grand Atrium', going: 482, host: 'Career Services', about: '40+ companies hiring for product, design, and engineering roles. Bring printed resumes and drop by the portfolio review booth.' },
  { id: 'e3', month: 'Oct', day: '28', title: 'Open Mic & Acoustic Night', category: 'Culture', time: '7:30 PM', location: 'Student Union Café', going: 96, host: 'Arts Collective', about: 'An evening of poetry, music, and comedy. Sign-up sheet opens at 7 PM — five-minute slots, all skill levels welcome.' },
  { id: 'e4', month: 'Nov', day: '02', title: 'Intramural Futsal Finals', category: 'Sports', time: '4:00 PM', location: 'East Arena', going: 158, host: 'Campus Recreation', about: 'Engineering vs. Business in the season final. Free entry, face paint, and halftime penalty shootout for spectators.' },
]

const moreEvents: CampusEvent[] = [
  { id: 'e5', month: 'Nov', day: '05', title: 'Research Showcase: AI Lab', category: 'Academic', time: '2:00 PM', location: 'Science Block Atrium', going: 73, host: 'Dept. of Computer Science', about: 'Graduate students present posters on current AI research. Great for finding undergraduate research positions.' },
  { id: 'e6', month: 'Nov', day: '08', title: 'Mindfulness Morning', category: 'Wellness', time: '8:00 AM', location: 'Wellness Center', going: 41, host: 'Student Wellbeing', about: 'A guided 45-minute session to reset before midterms. Mats and tea provided.' },
  { id: 'e7', month: 'Nov', day: '12', title: 'Startup Pitch Night', category: 'Career', time: '6:30 PM', location: 'Innovation Hub', going: 129, host: 'Entrepreneurship Club', about: 'Student founders pitch to a panel of local investors. $5,000 in prizes for the top three teams.' },
]

export function EventsCard() {
  const [rsvps, setRsvps] = useState<Set<string>>(() => new Set(['e2']))
  const [openId, setOpenId] = useState<string | null>(null)
  const [allOpen, setAllOpen] = useState(false)

  const allEvents = [...events, ...moreEvents]
  const selected = allEvents.find((e) => e.id === openId)

  function toggleRsvp(event: CampusEvent) {
    const wasGoing = rsvps.has(event.id)
    setRsvps((prev) => {
      const next = new Set(prev)
      if (wasGoing) next.delete(event.id)
      else next.add(event.id)
      return next
    })
    if (wasGoing) toast('RSVP cancelled', { description: event.title })
    else toast.success("You're going!", { description: `${event.title} · ${event.month} ${event.day}` })
  }

  function openEvent(id: string) {
    setAllOpen(false)
    setOpenId(id)
  }

  return (
    <SectionCard
      id="events"
      title="Events"
      description="What's happening on campus"
      icon={CalendarDays}
      action={
        <button type="button" onClick={() => setAllOpen(true)} className="text-sm font-medium text-primary hover:underline">
          See all
        </button>
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {events.map((event) => {
          const going = rsvps.has(event.id)
          return (
            <li
              key={event.id}
              className="flex flex-col rounded-2xl border border-border p-4 transition-all hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(16,24,40,0.06)]"
            >
              <button type="button" onClick={() => setOpenId(event.id)} className="flex-1 text-left">
                <span className="flex items-start gap-3">
                  <DateBadge month={event.month} day={event.day} />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium tracking-wide text-primary uppercase">
                      {event.category}
                    </span>
                    <span className="block text-sm leading-snug font-medium text-pretty">{event.title}</span>
                  </span>
                </span>
                <span className="mt-3 block space-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {event.location} · {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden="true" />
                    {event.going + (going ? 1 : 0)} going
                  </span>
                </span>
              </button>
              <RsvpButton going={going} onClick={() => toggleRsvp(event)} className="mt-4 h-9" />
            </li>
          )
        })}
      </ul>

      <Modal
        open={allOpen}
        onClose={() => setAllOpen(false)}
        title="Upcoming events"
        description={`${allEvents.length} events in the next 3 weeks`}
        icon={CalendarDays}
      >
        <ul className="space-y-2">
          {allEvents.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => openEvent(event.id)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
              >
                <DateBadge month={event.month} day={event.day} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{event.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {event.location} · {event.time}
                  </span>
                </span>
                {rsvps.has(event.id) && (
                  <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                    Going
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal
        open={!!selected}
        onClose={() => setOpenId(null)}
        title={selected?.title ?? ''}
        description={selected ? `Hosted by ${selected.host}` : undefined}
        icon={CalendarDays}
        footer={
          selected && (
            <>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => toast.success('Added to your calendar', { description: selected.title })}
              >
                <CalendarPlus className="size-4" aria-hidden="true" />
                Add to calendar
              </button>
              <RsvpButton going={rsvps.has(selected.id)} onClick={() => toggleRsvp(selected)} className="h-10 px-4" />
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {selected.category}
            </span>
            <dl className="grid gap-2 sm:grid-cols-3">
              {[
                { icon: CalendarDays, label: 'Date', value: `${selected.month} ${selected.day}` },
                { icon: Clock, label: 'Time', value: selected.time },
                { icon: Users, label: 'Going', value: String(selected.going + (rsvps.has(selected.id) ? 1 : 0)) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-3 py-2.5">
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-[11px] text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-medium">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {selected.location}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.about}</p>
          </div>
        )}
      </Modal>
    </SectionCard>
  )
}

function DateBadge({ month, day }: { month: string; day: string }) {
  return (
    <span className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-accent py-1.5 text-accent-foreground">
      <span className="text-[10px] font-semibold tracking-wider uppercase">{month}</span>
      <span className="text-lg leading-none font-semibold">{day}</span>
    </span>
  )
}

function RsvpButton({ going, onClick, className }: { going: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={going}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors',
        going ? 'bg-accent text-accent-foreground hover:bg-accent/80' : 'bg-primary text-primary-foreground hover:bg-primary/90',
        className,
      )}
    >
      {going && <Check className="size-4" aria-hidden="true" />}
      {going ? "You're going" : 'RSVP'}
    </button>
  )
}
