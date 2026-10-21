'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const suggestions = [
  'Make a study plan for my exams',
  'Explain recursion simply',
  'Help me outline my essay',
]

export function StudyAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isBusy = status === 'submitted' || status === 'streaming'

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

  function submit(text: string) {
    const value = text.trim()
    if (!value || isBusy) return
    sendMessage({ text: value })
    setInput('')
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

          {messages.map((message) => (
            <Bubble key={message.id} role={message.role === 'user' ? 'user' : 'assistant'}>
              {message.parts.map((part, i) => (part.type === 'text' ? <span key={i}>{part.text}</span> : null))}
            </Bubble>
          ))}

          {status === 'submitted' && (
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

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Something went wrong. Please try again.
            </p>
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
        role === 'user'
          ? 'ml-auto rounded-br-md bg-primary text-primary-foreground'
          : 'rounded-bl-md bg-card text-foreground',
      )}
    >
      {children}
    </div>
  )
}
