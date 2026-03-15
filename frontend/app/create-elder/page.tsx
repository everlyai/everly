"use client"

import { useRouter } from "next/navigation"
import { RegistrationFlow } from "@/components/registration-flow"
import type { ElderData, CaregiverData } from "@/app/types"

function calculateAgeFromDOB(dob: string): number {
  if (!dob) return 0
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

export default function CreateElderPage() {
  const router = useRouter()

  const handleComplete = async (elder: ElderData, caregiver: CaregiverData) => {
    try {
      const payload = {
        name: `${elder.firstName} ${elder.lastName}`.trim(),
        age: calculateAgeFromDOB(elder.dateOfBirth),
        phone: elder.phone,
        biography: elder.location
          ? `Lives in ${elder.location}. ${elder.thingsTheyLove || ""}`.trim()
          : elder.thingsTheyLove || "",
        hobbies: elder.thingsTheyLove
          ? elder.thingsTheyLove.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        family_members: {
          caregiver: {
            name: `${caregiver.firstName} ${caregiver.lastName}`.trim(),
            email: caregiver.email,
            phone: caregiver.phone,
            relationship: elder.relationship,
          },
        },
        medications: (elder.medicationSchedule || []).map((med) => ({
          name: med.name,
          time: med.time,
          dosage: "",
        })),
        call_schedule: {
          times: [...new Set((elder.medicationSchedule || []).map((m) => m.time).filter(Boolean))],
          timezone: "America/Toronto",
        },
        personality_notes: elder.thingsTheyLove || "",
        risk_flags: [],
      }
      const response = await fetch("/api/elders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || "Failed to save elder")
      const elderId = result.elder?.id
      if (elderId) {
        router.push(`/dashboard?elder=${elderId}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Registration save failed:", error)
      alert(error instanceof Error ? error.message : "Something went wrong while saving")
    }
  }

  return (
    <RegistrationFlow
      onComplete={handleComplete}
      onBack={() => router.push("/dashboard")}
    />
  )
}
