import { NextRequest, NextResponse } from "next/server"
import { getElderById, createCallLog } from "@/app/lib/supabase"
import { initiateCall } from "@/app/lib/vapi"

export async function POST(req: NextRequest) {
  try {
    const { elderId } = await req.json()

    if (!elderId) {
      return NextResponse.json({ error: "Elder ID is required" }, { status: 400 })
    }

    const elder = await getElderById(elderId)
    if (!elder) {
      return NextResponse.json({ error: "Elder not found" }, { status: 404 })
    }

    const { callId } = await initiateCall(elder)

    await createCallLog({
      elder_id: elderId,
      vapi_call_id: callId,
      started_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      callId,
      message: `Call initiated to ${elder.name}`,
    })
  } catch (error: any) {
    console.error("Call initiation failed:", error)
    return NextResponse.json(
      { error: error?.message ?? "Failed to initiate call" },
      { status: 500 },
    )
  }
}

