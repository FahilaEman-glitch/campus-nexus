import { AssignmentsCard } from '@/components/portal/assignments-card'
import { AttendanceCard } from '@/components/portal/attendance-card'
import { BottomNav } from '@/components/portal/bottom-nav'
import { EventsCard } from '@/components/portal/events-card'
import { Hero } from '@/components/portal/hero'
import { LostFoundCard } from '@/components/portal/lost-found-card'
import { TopBar } from '@/components/portal/top-bar'

export default function Page() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">
        <Hero />

        <div className="mt-10 mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-primary uppercase">Dashboard</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Your week at a glance</h2>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">Synced 2 min ago</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <AttendanceCard />
          <AssignmentsCard />
          <EventsCard />
          <LostFoundCard />
        </div>

        <footer className="mt-12 flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
          <p>Orbit Smart Campus · Northbridge University</p>
          <p>Need help? support@northbridge.edu</p>
        </footer>
      </main>
      <BottomNav />
    </>
  )
}
