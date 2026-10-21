'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = { id: string; role: 'user' | 'assistant'; text: string }

const suggestions = [
  'Make a study plan for my exams',
  'Explain recursion simply',
  'Help me outline my essay',
]

const replies: { keywords: string[]; text: string }[] = [
  {
    keywords: ['plan', 'schedule', 'exam', 'midterm', 'final'],
    text: "Here's a 7-day plan before your midterms:\n\n• Mon – Distributed Systems: review Raft + Paxos notes (90 min)\n• Tue – Machine Learning: redo gradient descent lab problems\n• Wed – Linear Algebra: practice eigenvalue questions 6.1–6.8\n• Thu – Ethics: skim readings and draft 3 key arguments\n• Fri – Mixed practice quiz across all four courses\n• Sat – Light review + rest\n• Sun – Past papers under timed conditions\n\nTip: study in 50-minute blocks with 10-minute breaks.",
  },
  {
    keywords: ['recursion', 'recursive'],
    text: 'Recursion is when a function solves a problem by calling itself on a smaller version of the same problem.\n\nThink of Russian nesting dolls: to count them, open one, then count the dolls inside it the same way — until you reach the smallest doll (the base case).\n\nEvery recursive function needs:\n1. A base case that stops the recursion\n2. A recursive step that moves toward the base case',
  },
  {
    keywords: ['essay', 'outline', 'write', 'writing'],
    text: "Here's a simple outline for your AI ethics position essay:\n\n1. Introduction – hook, context, and your clear thesis\n2. Argument 1 – who is accountable when autonomous systems fail?\n3. Argument 2 – transparency and explainability\n4. Counterargument – address the strongest opposing view\n5. Conclusion – restate thesis and propose a policy\n\nAim for ~300 words per section to hit 1,500 total.",
  },
  {
    keywords: ['attendance', 'absent', 'miss'],
    text: "Your overall attendance is 87% — nicely above the 75% minimum.\n\nOne heads-up: HU 210 (Ethics in Technology) is at 73%. Attending the next 2 classes in a row will bring it back above 75%.",
  },
  {
    keywords: ['assignment', 'due', 'deadline', 'homework', 'raft'],
    text: 'You have 4 pending assignments. The most urgent is the Raft consensus implementation for CS 341, due tomorrow at 11:59 PM.\n\nSuggested order: Raft (today) → Gradient descent lab (Thu) → Eigenvalues set (weekend) → Ethics essay (early next week).',
  },
  {
    keywords: ['eigen', 'matrix', 'linear algebra'],
    text: 'An eigenvector of a matrix A is a non-zero vector v that only gets stretched (not rotated) when multiplied by A: Av = λv.\n\nThe stretch factor λ is the eigenvalue. To find them, solve det(A − λI) = 0, then plug each λ back in to find its eigenvectors.',
  },
  {
    keywords: ['hi', 'hello', 'hey', 'thanks', 'thank you'],
    text: "Happy to help, Aisha! Ask me about your courses, deadlines, attendance, or any concept you're stuck on.",
  },
]

const fallback =
  "Great question! Here's how I'd approach it:\n\n1. Break the topic into 2–3 core ideas\n2. Find one worked example for each\n3. Explain it out loud in your own words\n\nWant me to make flashcards or a quick practice quiz on this?"

function getReply(input: string) {
  const text = input.toLowerCase()
  return replies.find((r) => r.keywords.some((k) => text.includes(k)))?.text ?? fallback
}

export function StudyAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<'idle' | 'thinking' | 'typing'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const isBusy = status !== 'idle'

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, status])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function streamReply(full: string) {
    const id = `a-${Date.now()}`
    const words = full.split(/(\s+)/)
    setStatus('typing')
    setMessages((prev) => [...prev, { id, role: 'assistant', text: '' }])
    words.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          const text = words.slice(0, i + 1).join('')
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)))
          if (i === words.length - 1) setStatus('idle')
        }, i * 18),
      )
    })
  }

  function submit(text: string) {
    const value = text.trim()
    if (!value || isBusy) return
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: value }])
    setInput('')
    setStatus('thinking')
    timers.current.push(setTimeout(() => streamReply(getReply(value)), 700))
  }

  return (
    <>
      <section
        id="study-assistant"
        role="dialog"
        aria-modal="false"
        aria-labelledby="assistant-title"
        hidden={!open}
        className="fixed right-4 bottom-44 z-[60] flex h-[min(540px,calc(100dvh-13rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(16,24,40,0.18)] sm:right-6 sm:bottom-24 sm:h-[min(560px,calc(100dvh-8rem))]"
      >
        <header className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="assistant-title" className="text-sm font-semibold">
              AI Study Assistant
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
              <span className="size-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
              Online · Powered by Orbit AI
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-primary-foreground/15"
            aria-label="Close study assistant"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/40 px-4 py-4" aria-live="polite">
          <Bubble role="assistant">Hi Aisha! How can I help with your studies?</Bubble>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((m) => (
            <Bubble key={m.id} role={m.role}>
              {m.text}
            </Bubble>
          ))}

          {status === 'thinking' && (
            <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-sm">
              <span className="sr-only">Assistant is typing</span>
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${d}ms` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="flex items-center gap-2 border-t border-border bg-card p-3"
        >
          <label htmlFor="assistant-input" className="sr-only">
            Ask the study assistant
          </label>
          <input
            ref={inputRef}
            id="assistant-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
            }}
            placeholder="Ask anything about your courses..."
            autoComplete="off"
            className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            aria-label="Send message"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="study-assistant"
        aria-label={open ? 'Close AI Study Assistant' : 'Open AI Study Assistant'}
        className="fixed right-4 bottom-24 z-[60] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(37,99,235,0.45)] ring-4 ring-primary/15 transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <Sparkles className="size-6" aria-hidden="true" />}
      </button>
    </>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm',
        role === 'user' ? 'ml-auto rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-card text-foreground',
      )}
    >
      {children}
    </div>
  )
}
