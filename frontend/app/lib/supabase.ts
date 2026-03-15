import { createClient } from "@supabase/supabase-js"
import type { Elder, CallLog, Memory } from "@/app/types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ""
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? ""

if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
  throw new Error(
    "Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Add it to .env.local in the frontend folder, e.g. NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co"
  )
}
if (!supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to .env.local in the frontend folder."
  )
}
if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local in the frontend folder."
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

// Database helpers
export async function getElderById(id: string): Promise<Elder | null> {
    const { data, error } = await supabase.from("elders").select("*").eq("id", id).single()

    if (error) throw error
    return data
}

export async function createCallLog(log: Partial<CallLog>): Promise<CallLog> {
    const { data, error } = await supabaseAdmin.from("call_logs").insert(log).select().single()

    if (error) throw error
    return data
}

export async function updateCallLog(vapiCallId: string, updates: Partial<CallLog>) {
    // CHANGED: update by vapi_call_id, not internal id
    const { error } = await supabaseAdmin
        .from("call_logs")
        .update(updates)
        .eq("vapi_call_id", vapiCallId)

    if (error) throw error
}

export async function createMemory(memory: Partial<Memory>) {
    const { error } = await supabaseAdmin.from("memories").insert(memory)

    if (error) throw error
}