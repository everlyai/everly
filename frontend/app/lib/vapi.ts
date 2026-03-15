import type { Elder } from "@/app/types"

const VAPI_API_KEY = process.env.VAPI_API_KEY!
const VAPI_BASE_URL = "https://api.vapi.ai"

/** Normalize to E.164 for VAPI (e.g. US 10-digit → +1xxxxxxxxxx). */
export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  if (phone.startsWith("+")) return phone
  return `+${digits}`
}

export async function initiateCall(elder: Elder): Promise<{ callId: string }> {
  const number = toE164(elder.phone)
  const response = await fetch(`${VAPI_BASE_URL}/call`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId: process.env.VAPI_ASSISTANT_ID,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: {
        number,
        name: elder.name,
      },
      assistantOverrides: {
        variableValues: {
          elder_name: elder.name,
          elder_age: elder.age,
          biography: elder.biography,
          hobbies: elder.hobbies?.join(", "),
          family_members: JSON.stringify(elder.family_members),
          medications: JSON.stringify(elder.medications),
          personality_notes: elder.personality_notes,
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`VAPI call failed: ${error}`)
  }

  const data = await response.json()
  return { callId: data.id }
}

/** Initiate an outbound phone call to a number you provide. Requires VAPI_PHONE_NUMBER_ID. */
export async function initiateOutboundCall(
  phoneNumber: string,
  options?: { name?: string; variableValues?: Record<string, string> }
): Promise<{ callId: string }> {
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID
  if (!phoneNumberId) {
    throw new Error("VAPI_PHONE_NUMBER_ID is required for outbound phone calls. Set it in .env.local.")
  }
  const name = options?.name?.trim() || "Guest"
  const variableValues = options?.variableValues ?? {}
  const number = toE164(phoneNumber.trim())
  const response = await fetch(`${VAPI_BASE_URL}/call`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId: process.env.VAPI_ASSISTANT_ID,
      phoneNumberId,
      customer: {
        number,
        name,
      },
      assistantOverrides: {
        variableValues: {
          elder_name: name,
          elder_age: variableValues.elder_age ?? "",
          biography: variableValues.biography ?? "",
          hobbies: variableValues.hobbies ?? "",
          family_members: variableValues.family_members ?? "{}",
          medications: variableValues.medications ?? "[]",
          personality_notes: variableValues.personality_notes ?? "",
          ...variableValues,
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`VAPI outbound call failed: ${error}`)
  }

  const data = await response.json()
  return { callId: data.id }
}

export async function getCallDetails(callId: string) {
  const response = await fetch(`${VAPI_BASE_URL}/call/${callId}`, {
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch call details")
  }

  return response.json()
}

