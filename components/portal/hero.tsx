import Image from 'next/image'
import { ArrowRight, CalendarClock, CheckCircle2, MapPin, Sparkles, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Attendance', value: '87%', hint: '+2.4% this month', icon: TrendingUp },
  { label: 'Due this week', value: '4', hint: '1 due tomorrow', icon: CalendarClock },
  { label: 'Completed', value: '28', hint: 'tasks this term', icon: CheckCircle2 },
]

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="pt-6 sm:pt-10">
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-10 lg:col-span-3">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px]"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Fall Semester 2026 · Week 9
            </span>
            <p className="mt-6 text-sm font-medium text-primary-foreground/75">Good morning, Aisha</p>
            <h1
              id="hero-title"
              className="mt-1 text-balance text-3xl font-semibold tracking-tight sm:text-5xl"
            >
              Northbridge University
            </h1>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
              Your classes, deadlines, events, and campus life — beautifully organized in one smart
              portal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#assignments"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-primary transition-colors hover:bg-white/90"
              >
                View deadlines
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#events"
                className="inline-flex h-10 items-center rounded-lg border border-white/25 px-4 text-sm font-medium transition-colors hover:bg-white/10"
              >
                Explore events
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card lg:col-span-2">
          <div className="relative h-40 sm:h-48 lg:h-auto lg:flex-1">
            <Image
              src="/images/campus.png"
              alt="Northbridge University main engineering building"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-success" aria-hidden="true" />
              Up next · in 25 min
            </span>
          </div>
          <div className="p-5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Next class</p>
            <p className="mt-1 font-semibold">CS 341 · Distributed Systems</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-4" aria-hidden="true" />
                10:30 – 11:45 AM
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden="true" />
                Hall B, Room 204
              </span>
            </div>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-3 sm:p-5">
            <div className="flex items-center justify-between">
              <dt className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</dt>
              <Icon className="hidden size-4 text-primary sm:block" aria-hidden="true" />
            </div>
            <dd className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</dd>
            <dd className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{hint}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
