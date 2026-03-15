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
import type { Elder } from "@/app/types"

/** Minimal elder-like shape for variable overrides (e.g. from Dashboard ElderData) */
export type ElderLike = Pick<Elder, "name" | "age"> & Partial<Pick<Elder, "biography" | "hobbies" | "family_members" | "medications" | "personality_notes">>

type VapiContextValue = {
  isActive: boolean
  isConnecting: boolean
  error: string | null
  startCall: (elder: Elder | ElderLike) => Promise<void>
  endCall: () => Promise<void>
}

const VapiContext = createContext<VapiContextValue | null>(null)

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? ""
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? ""

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

export function VapiCallProvider({ children }: { children: ReactNode }) {
  const vapiRef = useRef<Vapi | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) return
    vapiRef.current = new Vapi(VAPI_PUBLIC_KEY)

    const vapi = vapiRef.current
    const onStart = () => {
      console.log("[VAPI] call-start — you should hear the assistant. Check speaker volume and browser tab is not muted.")
      setIsConnecting(false)
      setIsActive(true)
      setError(null)
    }
    const onEnd = () => {
      console.log("[VAPI] call-end")
      setIsActive(false)
      setIsConnecting(false)
    }
    const onError = (e: unknown) => {
      console.error("[VAPI] error", e)
      setIsConnecting(false)
      setIsActive(false)
      setError(e instanceof Error ? e.message : "Call failed")
    }
    vapi.on("message", (msg: unknown) => {
      // Optional: log transcript chunks for debugging
      if (typeof msg === "object" && msg !== null && "type" in msg && (msg as { type?: string }).type === "transcript")
        console.log("[VAPI] transcript", msg)
    })

    vapi.on("call-start", onStart)
    vapi.on("call-end", onEnd)
    vapi.on("call-start-failed", (e: { error?: string }) => {
      console.error("[VAPI] call-start-failed", e)
      setError(e?.error ?? "Failed to start call")
      setIsConnecting(false)
    })
    vapi.on("error", onError)

    return () => {
      vapi.removeListener("call-start", onStart)
      vapi.removeListener("call-end", onEnd)
      vapi.removeListener("error", onError)
    }
  }, [])

  const startCall = useCallback(async (elder: Elder | ElderLike) => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      setError("Missing VAPI config. Add NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID to .env.local")
      return
    }
    const vapi = vapiRef.current
    if (!vapi) {
      setError("VAPI not initialized")
      return
    }
    setError(null)
    setIsConnecting(true)
    try {
      await vapi.start(VAPI_ASSISTANT_ID, {
        variableValues: buildVariableValues(elder),
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start call")
      setIsConnecting(false)
    }
  }, [])

  const endCall = useCallback(async () => {
    const vapi = vapiRef.current
    if (vapi) await vapi.stop()
    setIsActive(false)
    setIsConnecting(false)
  }, [])

  const value: VapiContextValue = {
    isActive,
    isConnecting,
    error,
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
