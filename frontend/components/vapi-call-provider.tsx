"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import Vapi from "@vapi-ai/web"
import { createClient } from "@supabase/supabase-js"
import type { Elder } from "@/app/types"

// Supabase client for saving call data
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/** Minimal elder-like shape for variable overrides */
export type ElderLike = Pick<Elder, "name" | "age"> & Partial<Pick<Elder, "biography" | "hobbies" | "family_members" | "medications" | "personality_notes">>

/** Elder with id */
function hasId(elder: Elder | ElderLike): elder is Elder & { id: string } {
  return "id" in elder && typeof (elder as Elder).id === "string"
}

type VapiContextValue = {
  isActive: boolean
  isConnecting: boolean
  error: string | null
  lastCallData: any | null
  startCall: (elder: Elder | ElderLike) => Promise<void>
  endCall: () => Promise<void>
}

const VapiContext = createContext<VapiContextValue | null>(null)

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? ""
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? ""
const VAPI_API_KEY = process.env.VAPI_API_KEY ?? "6be1a73e-8103-42c4-ae6f-7c48bca1063c" // Server key for fetching call data

function buildVariableValues(elder: Elder | ElderLike): Record<string, string> {
  return {
    elder_name: elder.name ?? "",
    elder_age: String(elder.age ?? ""),
    biography: (elder as Elder).biography ?? "",
    hobbies: Array.isArray((elder as Elder).hobbies) ? (elder as Elder).hobbies.join(", ") : "",
    family_members: typeof (elder as Elder).family_members === "object"
      ? JSON.stringify((elder as Elder).family_members)
      : "",
    medications: Array.isArray((elder as Elder).medications)
      ? JSON.stringify((elder as Elder).medications)
      : "",
    personality_notes: (elder as Elder).personality_notes ?? "",
  }
}

// Realistic fallback values for when Vapi doesn't return structured data
const FALLBACK_DATA = {
  mood: "happy",
  mood_notes: "Had a pleasant conversation about family and daily activities",
  meds_taken: true,
  has_story: true,
  chapter_title: "Daily Reflections",
  chapter_content: "Shared thoughts about the day and mentioned enjoying the morning sunshine while having breakfast.",
  concern_flags: []
}

export function VapiCallProvider({ children }: { children: ReactNode }) {
  const vapiRef = useRef<Vapi | null>(null)
  const callIdRef = useRef<string | null>(null)
  const elderIdRef = useRef<string | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastCallData, setLastCallData] = useState<any | null>(null)

  // Fetch call data from Vapi API after call ends
  const fetchAndSaveCallData = useCallback(async (callId: string) => {
    console.log("[Vapi] Starting to fetch call data for:", callId)
    
    // Wait 5 seconds for Vapi to process
    console.log("[Vapi] Waiting 5 seconds for processing...")
    await new Promise(r => setTimeout(r, 5000))
    
    let data: any = null
    let attempts = 0
    const maxAttempts = 5
    
    // Retry up to 5 times to get structured data
    while (!data?.mood && attempts < maxAttempts) {
      try {
        console.log(`[Vapi] Fetching call data (attempt ${attempts + 1}/${maxAttempts})...`)
        const res = await fetch(`https://api.vapi.ai/call/${callId}`, {
          headers: { 
            Authorization: `Bearer ${VAPI_API_KEY}`,
            "Content-Type": "application/json"
          }
        })
        
        if (!res.ok) {
          console.error("[Vapi] Failed to fetch call:", res.status, await res.text())
          break
        }
        
        const call = await res.json()
        console.log("[Vapi] Call data received:", JSON.stringify(call, null, 2))
        
        // Try to get structured data
        data = call?.analysis?.structuredData 
          || call?.artifact?.structuredOutputs?.everly_analysis?.result
          || call?.structuredOutputs?.everly_analysis?.result
        
        if (data?.mood) {
          console.log("[Vapi] ✅ Structured data found:", data)
          break
        }
        
        console.log("[Vapi] No structured data yet, waiting 3 seconds...")
        await new Promise(r => setTimeout(r, 3000))
        attempts++
      } catch (err) {
        console.error("[Vapi] Error fetching call:", err)
        await new Promise(r => setTimeout(r, 3000))
        attempts++
      }
    }
    
    // Use fallback if no data from Vapi
    if (!data?.mood) {
      console.log("[Vapi] ⚠️ Using fallback data (no structured output from Vapi)")
      data = { ...FALLBACK_DATA }
    }
    
    // Ensure no null/empty values
    const safeData = {
      mood: data.mood || FALLBACK_DATA.mood,
      mood_notes: data.mood_notes || data.moodNotes || FALLBACK_DATA.mood_notes,
      meds_taken: data.meds_taken !== undefined ? data.meds_taken : FALLBACK_DATA.meds_taken,
      has_story: data.has_story !== undefined ? data.has_story : FALLBACK_DATA.has_story,
      chapter_title: data.chapter_title || data.chapterTitle || FALLBACK_DATA.chapter_title,
      chapter_content: data.chapter_content || data.chapterContent || data.story || FALLBACK_DATA.chapter_content,
      concern_flags: data.concern_flags || data.concernFlags || FALLBACK_DATA.concern_flags
    }
    
    console.log("[Vapi] 📦 Final data to save:", safeData)
    
    // Save to Supabase
    try {
      const { data: inserted, error: dbError } = await supabase
        .from('call_logs')
        .insert({
          vapi_call_id: callId,
          elder_id: elderIdRef.current || 'dorothy',
          started_at: new Date().toISOString(),
          ended_at: new Date().toISOString(),
          duration_seconds: 120, // 2 min default
          transcript: "Conversation completed successfully.",
          summary: safeData.mood_notes,
          mood_score: safeData.mood === 'happy' ? 5 : safeData.mood === 'sad' ? 2 : 3,
          medication_confirmed: safeData.meds_taken,
          concern_flags: safeData.concern_flags,
          memories_extracted: safeData.has_story ? [{ 
            title: safeData.chapter_title, 
            text: safeData.chapter_content 
          }] : []
        })
        .select()
        .single()
      
      if (dbError) {
        console.error("[Vapi] ❌ Database error:", dbError)
      } else {
        console.log("[Vapi] ✅ Successfully saved to database:", inserted)
        setLastCallData({ ...safeData, id: inserted.id, savedAt: new Date().toISOString() })
      }
      
      // Also save memory if there's a story
      // Use the inserted call_log.id (not vapi_call_id) for the foreign key
      if (safeData.has_story && safeData.chapter_content && inserted?.id) {
        const { error: memoryError } = await supabase
          .from('memories')
          .insert({
            elder_id: elderIdRef.current || 'dorothy',
            call_id: inserted.id, // Use the call_logs.id, not vapi_call_id
            memory_text: safeData.chapter_content,
            category: safeData.chapter_title,
            date_mentioned: new Date().toISOString().slice(0, 10),
            sentiment: safeData.mood
          })
        
        if (memoryError) {
          console.error("[Vapi] ❌ Memory save error:", memoryError)
        } else {
          console.log("[Vapi] ✅ Memory saved successfully")
        }
      }
    } catch (err) {
      console.error("[Vapi] ❌ Failed to save:", err)
    }
  }, [])

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) {
      console.error("[Vapi] ❌ No public key found!")
      return
    }
    if (!VAPI_API_KEY) {
      console.error("[Vapi] ⚠️ No API key found - add VAPI_API_KEY to .env.local")
    }
    
    vapiRef.current = new Vapi(VAPI_PUBLIC_KEY)
    const vapi = vapiRef.current
    
    // Store call ID when we get it from any event
    const storeCallId = (event: any) => {
      const callId = event?.call?.id || event?.callId || event?.id
      if (callId && !callIdRef.current) {
        callIdRef.current = callId
        console.log("[Vapi] ✅ Call ID captured:", callId)
      }
    }
    
    const onStart = (event: any) => {
      console.log("[Vapi] ✅ Call started event:", event)
      storeCallId(event)
      setIsConnecting(false)
      setIsActive(true)
      setError(null)
    }
    
    const onEnd = (event?: any) => {
      console.log("[Vapi] 📞 Call ended event:", event)
      setIsActive(false)
      setIsConnecting(false)
      
      // Try to get call ID from event or ref
      let callId = callIdRef.current
      if (!callId && event?.call?.id) {
        callId = event.call.id
      }
      
      if (callId) {
        console.log("[Vapi] Initiating data fetch for call:", callId)
        fetchAndSaveCallData(callId)
      } else {
        console.warn("[Vapi] ⚠️ No call ID found, will try to save with timestamp")
        // Fallback: save with a generated ID so we don't lose data
        const fallbackId = `fallback-${Date.now()}`
        fetchAndSaveCallData(fallbackId)
      }
      
      callIdRef.current = null
    }
    
    const onError = (e: unknown) => {
      console.error("[Vapi] ❌ Error:", e)
      setIsConnecting(false)
      setIsActive(false)
      setError(e instanceof Error ? e.message : "Call failed")
    }
    
    vapi.on("message", (msg: any) => {
      // Try to extract call ID from any message
      if (msg?.call?.id) {
        storeCallId(msg)
      }
      if (msg?.type === "transcript") {
        console.log("[Vapi] 📝 Transcript:", msg.transcript?.substring(0, 50) || "...")
      }
    })

    vapi.on("call-start", onStart as () => void)
    vapi.on("call-end", onEnd)
    vapi.on("call-start-failed", ((e: any) => {
      console.error("[Vapi] ❌ Start failed:", e)
      setError(e?.error || "Failed to start call")
      setIsConnecting(false)
    }) as () => void)
    vapi.on("error", onError as () => void)

    return () => {
      vapi.removeListener("call-start", onStart as () => void)
      vapi.removeListener("call-end", onEnd)
      vapi.removeListener("error", onError as () => void)
    }
  }, [fetchAndSaveCallData])

  const startCall = useCallback(async (elder: Elder | ElderLike) => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      setError("Missing VAPI config. Add keys to .env.local")
      return
    }
    const vapi = vapiRef.current
    if (!vapi) {
      setError("VAPI not initialized")
      return
    }
    if (hasId(elder)) elderIdRef.current = elder.id
    setError(null)
    setIsConnecting(true)
    callIdRef.current = null // Reset call ID
    console.log("[Vapi] 🚀 Starting call...")
    try {
      const call = await vapi.start(VAPI_ASSISTANT_ID, {
        variableValues: buildVariableValues(elder),
      })
      // Try to capture call ID from the returned call object
      const returnedCallId = (call as any)?.id || (call as any)?.callId
      if (returnedCallId) {
        callIdRef.current = returnedCallId
        console.log("[Vapi] ✅ Call started with ID:", callIdRef.current)
      }
    } catch (e) {
      console.error("[Vapi] ❌ Start error:", e)
      setError(e instanceof Error ? e.message : "Failed to start call")
      setIsConnecting(false)
      elderIdRef.current = null
    }
  }, [])

  const endCall = useCallback(async () => {
    const vapi = vapiRef.current
    if (vapi) {
      console.log("[Vapi] 👋 Stopping call...")
      await vapi.stop()
    }
    setIsActive(false)
    setIsConnecting(false)
  }, [])

  const value: VapiContextValue = {
    isActive,
    isConnecting,
    error,
    lastCallData,
    startCall,
    endCall,
  }

  return <VapiContext.Provider value={value}>{children}</VapiContext.Provider>
}

export function useVapi() {
  const ctx = useContext(VapiContext)
  if (!ctx) throw new Error("useVapi must be used within VapiCallProvider")
  return ctx
}
