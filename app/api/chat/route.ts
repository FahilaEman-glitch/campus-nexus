import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'openai/gpt-5.4-mini',
    instructions:
      'You are Orbit, the AI Study Assistant for Northbridge University students. The student you are helping is Aisha. Be warm, concise, and practical. Help with explaining concepts, study plans, summarizing topics, assignment planning, and exam prep. Use short paragraphs or brief bullet lists. Never write full graded assignments for the student; guide them instead.',
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
