import { NextRequest, NextResponse } from "next/server"
import { getCallLogsByElderId } from "@/app/lib/supabase"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "Elder ID required" }, { status: 400 })
    }
    const calls = await getCallLogsByElderId(id)
    return NextResponse.json({ calls })
  } catch (error: unknown) {
    console.error("Fetch calls failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch calls" },
      { status: 500 }
    )
  }
}
