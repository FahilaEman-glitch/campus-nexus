'use client'

import { useState } from 'react'
import {
  Backpack,
  Clock,
  Headphones,
  KeyRound,
  Laptop,
  type LucideIcon,
  MapPin,
  Package,
  Plus,
  Search,
  SearchCheck,
  Umbrella,
  Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { SectionCard } from './section-card'
import { Modal, btnPrimary, btnSecondary, inputClass } from './modal'

type Item = {
  id: string
  name: string
  location: string
  time: string
  icon: LucideIcon
  type: 'lost' | 'found'
  details: string
  reporter: string
}

const initialItems: Item[] = [
  { id: 'l1', name: 'AirPods Pro case (white)', location: 'Library, 3rd floor', time: '2h ago', icon: Headphones, type: 'lost', details: 'Small scratch on the lid, name sticker inside. Last seen near the quiet study pods.', reporter: 'Jamal R.' },
  { id: 'l2', name: 'Brown leather wallet', location: 'Cafeteria North', time: 'Yesterday', icon: Wallet, type: 'lost', details: 'Contains student ID and a transit card. Reward offered.', reporter: 'Sofia M.' },
  { id: 'l3', name: 'MacBook charger, USB-C', location: 'Hall B, Room 204', time: '2 days ago', icon: Laptop, type: 'lost', details: '96W Apple charger with a blue tape mark on the cable.', reporter: 'Leo T.' },
  { id: 'f1', name: 'Set of keys with blue tag', location: 'Parking Lot C', time: '1h ago', icon: KeyRound, type: 'found', details: 'Three keys and a blue Northbridge Rowing keychain. Held at Security Desk.', reporter: 'Campus Security' },
  { id: 'f2', name: 'Black compact umbrella', location: 'Science Block entrance', time: '5h ago', icon: Umbrella, type: 'found', details: 'Auto-open umbrella left in the stand. Held at Science Block reception.', reporter: 'Hannah W.' },
  { id: 'f3', name: 'Grey Herschel backpack', location: 'Gym locker room', time: 'Yesterday', icon: Backpack, type: 'found', details: 'Contains a water bottle and notebooks. Describe one notebook to claim.', reporter: 'Gym Staff' },
]

const tabs = [
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
] as const

export function LostFoundCard() {
  const [items, setItems] = useState(initialItems)
  const [tab, setTab] = useState<Item['type']>('found')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)

  const normalized = query.trim().toLowerCase()
  const visible = items.filter(
    (item) =>
      item.type === tab &&
      (normalized === '' ||
        item.name.toLowerCase().includes(normalized) ||
        item.location.toLowerCase().includes(normalized)),
  )
  const selected = items.find((i) => i.id === openId)

  function handleReport(formData: FormData) {
    const type = formData.get('type') === 'lost' ? 'lost' : 'found'
    const name = String(formData.get('name') ?? '').trim()
    const location = String(formData.get('location') ?? '').trim()
    if (!name || !location) return
    setItems((prev) => [
      {
        id: `u${Date.now()}`,
        name,
        location,
        time: 'Just now',
        icon: Package,
        type,
        details: String(formData.get('details') ?? '').trim() || 'No additional details provided.',
        reporter: 'You',
      },
      ...prev,
    ])
    setTab(type)
    setReportOpen(false)
    toast.success(type === 'lost' ? 'Lost item reported' : 'Found item posted', { description: name })
  }

  function handleClaim(formData: FormData) {
    if (!selected) return
    const message = String(formData.get('message') ?? '').trim()
    if (!message) return
    setOpenId(null)
    toast.success(selected.type === 'found' ? 'Claim request sent' : 'Thanks! The owner has been notified', {
      description: `${selected.reporter} will reply in your inbox.`,
    })
  }

  return (
    <SectionCard
      id="lost-found"
      title="Lost & Found"
      description="Reunite with your belongings"
      icon={SearchCheck}
      action={
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Report</span>
          <span className="sr-only sm:hidden">Report an item</span>
        </button>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div role="tablist" aria-label="Lost or found items" className="inline-flex self-start rounded-lg bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                tab === t.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
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
            className="flex items-center gap-3 rounded-2xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
          >
            <button type="button" onClick={() => setOpenId(id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{name}</span>
                <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="shrink-0">{time}</span>
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOpenId(id)}
              className="h-8 shrink-0 rounded-lg border border-border bg-card px-3 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {type === 'found' ? "It's mine" : 'I found it'}
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-10 text-center text-sm text-muted-foreground">No matching items. Try a different search.</li>
        )}
      </ul>

      <Modal
        open={!!selected}
        onClose={() => setOpenId(null)}
        title={selected?.name ?? ''}
        description={selected ? (selected.type === 'found' ? `Found by ${selected.reporter}` : `Lost by ${selected.reporter}`) : undefined}
        icon={selected?.icon}
      >
        {selected && (
          <form action={handleClaim} className="space-y-5">
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 font-medium capitalize',
                  selected.type === 'found' ? 'bg-success/10 text-success' : 'bg-warning/15 text-warning-foreground',
                )}
              >
                {selected.type}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium">
                <MapPin className="size-3 text-primary" aria-hidden="true" />
                {selected.location}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium">
                <Clock className="size-3 text-primary" aria-hidden="true" />
                {selected.time}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.details}</p>
            <div>
              <label htmlFor="claim-message" className="text-sm font-medium">
                {selected.type === 'found' ? 'Prove it’s yours' : 'Where did you find it?'}
              </label>
              <textarea
                id="claim-message"
                name="message"
                required
                rows={3}
                placeholder={
                  selected.type === 'found'
                    ? 'Describe a unique detail, e.g. a sticker, contents, or serial number'
                    : 'Tell the owner where and when you found it'
                }
                className={cn(inputClass, 'mt-1.5 h-auto py-2.5')}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className={btnSecondary} onClick={() => setOpenId(null)}>
                Cancel
              </button>
              <button type="submit" className={btnPrimary}>
                {selected.type === 'found' ? 'Send claim' : 'Notify owner'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report an item"
        description="Posts are visible to all Northbridge students"
        icon={Plus}
      >
        <form action={handleReport} className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium">I have</legend>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {[
                { value: 'lost', label: 'Lost something' },
                { value: 'found', label: 'Found something' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center justify-center rounded-lg border border-border px-3 py-2.5 text-sm font-medium transition-colors has-checked:border-primary has-checked:bg-accent has-checked:text-accent-foreground"
                >
                  <input type="radio" name="type" value={opt.value} defaultChecked={opt.value === 'lost'} className="sr-only" />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="report-name" className="text-sm font-medium">
              Item
            </label>
            <input id="report-name" name="name" required placeholder="e.g. Blue Hydro Flask" className={cn(inputClass, 'mt-1.5')} />
          </div>
          <div>
            <label htmlFor="report-location" className="text-sm font-medium">
              Location
            </label>
            <input id="report-location" name="location" required placeholder="e.g. Library, 2nd floor" className={cn(inputClass, 'mt-1.5')} />
          </div>
          <div>
            <label htmlFor="report-details" className="text-sm font-medium">
              Details <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea id="report-details" name="details" rows={3} placeholder="Color, brand, distinguishing marks…" className={cn(inputClass, 'mt-1.5 h-auto py-2.5')} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className={btnSecondary} onClick={() => setReportOpen(false)}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary}>
              Post report
            </button>
          </div>
        </form>
      </Modal>
    </SectionCard>
  )
}
