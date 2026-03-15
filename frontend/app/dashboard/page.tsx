"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { ElderDashboardView } from "@/components/elder-dashboard-view"
import type { Elder, CallLog, Memory } from "@/app/types"
import { Loader2, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

function loadDashboard(
  setElder: (e: Elder | null) => void,
  setCalls: (c: CallLog[]) => void,
  setMemories: (m: Memory[]) => void,
  setLoading: (l: boolean) => void
) {
  setLoading(true)
  fetch("/api/elders")
    .then((r) => r.json())
    .then((data) => {
      const list = Array.isArray(data.elders) ? data.elders : []
      const singleElder = list.length > 0 ? list[0] : null
      if (!singleElder) {
        setElder(null)
        setCalls([])
        setMemories([])
        return
      }
      return Promise.all([
        fetch(`/api/elders/${singleElder.id}/calls`).then((r) => r.json()),
        fetch(`/api/elders/${singleElder.id}/memories`).then((r) => r.json()),
      ]).then(([callsRes, memoriesRes]) => {
        setElder(singleElder)
        setCalls(callsRes.calls ?? [])
        setMemories(memoriesRes.memories ?? [])
      })
    })
    .catch(console.error)
    .finally(() => setLoading(false))
}

function DashboardContent() {
  const [elder, setElder] = useState<Elder | null>(null)
  const [calls, setCalls] = useState<CallLog[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard(setElder, setCalls, setMemories, setLoading)
  }, [])

  const onRefresh = () => {
    if (elder) {
      Promise.all([
        fetch(`/api/elders/${elder.id}/calls`).then((r) => r.json()),
        fetch(`/api/elders/${elder.id}/memories`).then((r) => r.json()),
      ]).then(([callsRes, memoriesRes]) => {
        setCalls(callsRes.calls ?? [])
        setMemories(memoriesRes.memories ?? [])
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!elder) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="paper-card p-8 max-w-md w-full text-center">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-lg font-semibold text-foreground font-heading mb-1">No elderly linked yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add the person you care for to see their dashboard here.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/create-elder">
              <Plus className="w-4 h-4 mr-2" />
              Add elderly
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ElderDashboardView
      elder={elder}
      calls={calls}
      memories={memories}
      onRefresh={onRefresh}
    />
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
