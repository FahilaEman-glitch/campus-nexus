'use client'

import { useState } from 'react'
import {
  Backpack,
  Headphones,
  KeyRound,
  Laptop,
  type LucideIcon,
  MapPin,
  Plus,
  Search,
  SearchCheck,
  Umbrella,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionCard } from './section-card'

type Item = {
  id: string
  name: string
  location: string
  time: string
  icon: LucideIcon
  type: 'lost' | 'found'
}

const items: Item[] = [
  { id: 'l1', name: 'AirPods Pro case (white)', location: 'Library, 3rd floor', time: '2h ago', icon: Headphones, type: 'lost' },
  { id: 'l2', name: 'Brown leather wallet', location: 'Cafeteria North', time: 'Yesterday', icon: Wallet, type: 'lost' },
  { id: 'l3', name: 'MacBook charger, USB-C', location: 'Hall B, Room 204', time: '2 days ago', icon: Laptop, type: 'lost' },
  { id: 'f1', name: 'Set of keys with blue tag', location: 'Parking Lot C', time: '1h ago', icon: KeyRound, type: 'found' },
  { id: 'f2', name: 'Black compact umbrella', location: 'Science Block entrance', time: '5h ago', icon: Umbrella, type: 'found' },
  { id: 'f3', name: 'Grey Herschel backpack', location: 'Gym locker room', time: 'Yesterday', icon: Backpack, type: 'found' },
]

const tabs = [
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
] as const

export function LostFoundCard() {
  const [tab, setTab] = useState<Item['type']>('found')
  const [query, setQuery] = useState('')

  const normalized = query.trim().toLowerCase()
  const visible = items.filter(
    (item) =>
      item.type === tab &&
      (normalized === '' ||
        item.name.toLowerCase().includes(normalized) ||
        item.location.toLowerCase().includes(normalized)),
  )

  return (
    <SectionCard
      id="lost-found"
      title="Lost & Found"
      description="Reunite with your belongings"
      icon={SearchCheck}
      action={
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Report</span>
          <span className="sr-only sm:hidden">Report an item</span>
        </button>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div role="tablist" aria-label="Lost or found items" className="inline-flex rounded-lg bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                tab === t.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <label htmlFor="lost-found-search" className="sr-only">
            Search lost and found items
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="lost-found-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items or places"
            className="h-9 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
          />
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {visible.map(({ id, name, location, time, icon: Icon, type }) => (
          <li
            key={id}
            className="flex items-center gap-3 rounded-2xl border border-border p-3 transition-colors hover:bg-muted/50"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{location}</span>
                <span aria-hidden="true">·</span>
                <span className="shrink-0">{time}</span>
              </p>
            </div>
            <button
              type="button"
              className="h-8 shrink-0 rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {type === 'found' ? "It's mine" : 'I found it'}
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-10 text-center text-sm text-muted-foreground">
            No matching items. Try a different search.
          </li>
        )}
      </ul>
    </SectionCard>
  )
}
