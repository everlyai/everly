import { NextRequest, NextResponse } from "next/server"
import { updateCallLog, createMemory } from "@/app/lib/supabase"

// TODO: add real signature verification if you configure a webhook secret
function verifyWebhook(_req: NextRequest): boolean {
  return true
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyWebhook(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await req.json()
    console.log("VAPI Webhook received:", payload)

    const { message } = payload

    switch (message.type) {
      case "call-ended":
        await handleCallEnded(message)
        break
      case "call-started":
        await handleCallStarted(message)
        break
      case "transcript":
        // optional: handle streaming transcripts
        break
      default:
        console.log("Unhandled webhook type:", message.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: error?.message ?? "Webhook error" }, { status: 500 })
  }
}

async function handleCallStarted(message: any) {
  const { call } = message
  console.log("Call started:", call.id)
  // Optionally update initial started_at here if you don't set it on initiate
}

async function handleCallEnded(message: any) {
  const { call } = message

  const updates = {
    ended_at: new Date().toISOString(),
    duration_seconds: call.durationSeconds || 0,
    transcript: call.transcript || "",
    summary: call.summary || "",
    mood_score: extractMoodScore(call),
    medication_confirmed: checkMedicationConfirmed(call),
    concern_flags: extractConcerns(call),
    memories_extracted: extractMemories(call),
  }

  // NOTE: we keyed our call_logs by internal id earlier;
  // here we look up by vapi_call_id (call.id)
  await updateCallLog(call.id, updates)

  const memories = extractMemories(call)
  for (const memory of memories) {
    await createMemory({
      call_id: call.id,
      elder_id: call.customer?.id,
      memory_text: memory.text,
      category: memory.category,
      sentiment: memory.sentiment,
    })
  }

  console.log("Call ended and processed:", call.id)
}

function extractMoodScore(call: any): number {
  return call.analysis?.moodScore ?? 3
}

function checkMedicationConfirmed(call: any): boolean {
  const transcript = (call.transcript ?? "").toLowerCase()
  return transcript.includes("taken") || transcript.includes("yes")
}

function extractConcerns(call: any): string[] {
  const concerns: string[] = []
  const transcript = (call.transcript ?? "").toLowerCase()

  if (transcript.includes("pain")) concerns.push("pain mentioned")
  if (transcript.includes("fall")) concerns.push("fall risk")
  if (transcript.includes("dizzy")) concerns.push("dizziness")
  if (transcript.includes("sad") || transcript.includes("lonely")) concerns.push("mood concern")

  return concerns
}

function extractMemories(call: any): any[] {
  return call.analysis?.memories ?? []
}

