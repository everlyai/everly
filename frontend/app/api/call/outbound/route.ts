import { NextRequest, NextResponse } from "next/server"
import { getElderById, createCallLog } from "@/app/lib/supabase"
import { initiateOutboundCall } from "@/app/lib/vapi"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phoneNumber, name, elderId } = body as {
      phoneNumber?: string
      name?: string
      elderId?: string
    }

    const normalized = (phoneNumber ?? "").trim().replace(/\s/g, "")
    if (!normalized) {
      return NextResponse.json(
        { error: "phoneNumber is required (e.g. +15551234567)" },
        { status: 400 }
      )
    }

    let variableValues: Record<string, string> | undefined
    let logElderId: string | undefined

    if (elderId) {
      const elder = await getElderById(elderId)
      if (elder) {
        logElderId = elderId
        variableValues = {
          elder_name: elder.name,
          elder_age: String(elder.age ?? ""),
          biography: elder.biography ?? "",
          hobbies: Array.isArray(elder.hobbies) ? elder.hobbies.join(", ") : "",
          family_members: typeof elder.family_members === "object" ? JSON.stringify(elder.family_members) : "{}",
          medications: Array.isArray(elder.medications) ? JSON.stringify(elder.medications) : "[]",
          personality_notes: elder.personality_notes ?? "",
        }
      }
    }

    const { callId } = await initiateOutboundCall(normalized, {
      name: name?.trim() || undefined,
      variableValues,
    })

    if (logElderId) {
      await createCallLog({
        elder_id: logElderId,
        vapi_call_id: callId,
        started_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      callId,
      message: `Outbound call initiated to ${normalized}`,
    })
  } catch (error: unknown) {
    console.error("Outbound call failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to initiate outbound call" },
      { status: 500 }
    )
  }
}
