import { NextRequest, NextResponse } from "next/server"
import { createCallLog } from "@/app/lib/supabase"

/**
 * Register an in-browser call so the webhook can update the same row when the call ends.
 * Call this from the frontend when a call starts (e.g. from VAPI call-start event) with the
 * VAPI call id and the elder's id.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { vapiCallId, elderId } = body as { vapiCallId?: string; elderId?: string }

    if (!vapiCallId || !elderId) {
      return NextResponse.json(
        { error: "vapiCallId and elderId are required" },
        { status: 400 }
      )
    }

    await createCallLog({
      elder_id: elderId,
      vapi_call_id: vapiCallId,
      started_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Call register failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register call" },
      { status: 500 }
    )
  }
}
