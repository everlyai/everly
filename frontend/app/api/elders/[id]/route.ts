import { NextRequest, NextResponse } from "next/server"
import { getElderById } from "@/app/lib/supabase"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "Elder ID required" }, { status: 400 })
    }
    const elder = await getElderById(id)
    if (!elder) {
      return NextResponse.json({ error: "Elder not found" }, { status: 404 })
    }
    return NextResponse.json({ elder })
  } catch (error: unknown) {
    console.error("Fetch elder failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch elder" },
      { status: 500 }
    )
  }
}
