import { Bell, Orbit, Search } from 'lucide-react'

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#home" className="flex items-center gap-2" aria-label="Orbit home">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Orbit className="size-4.5" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Orbit</span>
          <span className="hidden rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline">
            Northbridge
          </span>
        </a>

        <div className="ml-auto hidden max-w-sm flex-1 md:block">
          <label htmlFor="global-search" className="sr-only">
            Search courses, events, and items
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="global-search"
              type="search"
              placeholder="Search courses, events, items…"
              className="h-9 w-full rounded-lg border border-border bg-card pr-12 pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Notifications, 3 unread"
          >
            <Bell className="size-4" aria-hidden="true" />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2.5 rounded-lg py-1 pr-1 pl-1 sm:pr-3">
            <span
              className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground"
              aria-hidden="true"
            >
              AK
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-medium">Aisha Khan</span>
              <span className="text-xs text-muted-foreground">CS · Year 3</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
