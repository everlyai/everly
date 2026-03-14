"use client"

import { useState } from "react"
import { RegistrationFlow } from "@/components/registration-flow"
import { Dashboard } from "@/components/dashboard"

export type MedicationReminder = {
  id: string
  name: string
  time: string
  days: string[]
}

export type ElderData = {
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  location: string
  relationship: string
  thingsTheyLove: string
  medicationSchedule: MedicationReminder[]
}

export type CaregiverData = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [elderData, setElderData] = useState<ElderData | null>(null)
  const [caregiverData, setCaregiverData] = useState<CaregiverData | null>(null)

  const handleRegistrationComplete = (elder: ElderData, caregiver: CaregiverData) => {
    setElderData(elder)
    setCaregiverData(caregiver)
    setShowDashboard(true)
  }

  if (showDashboard && elderData && caregiverData) {
    return <Dashboard elder={elderData} caregiver={caregiverData} />
  }

  return <RegistrationFlow onComplete={handleRegistrationComplete} />
}
