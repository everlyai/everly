"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Plus, User, Loader2 } from "lucide-react"
import { useVapi } from "@/components/vapi-call-provider"
import { OutboundCallDialog } from "@/components/outbound-call-dialog"
import type { Elder } from "@/app/types"

interface EldersListProps {
  onAddElder: () => void
  onSelectElder?: (elder: Elder) => void
}

export function EldersList({ onAddElder, onSelectElder }: EldersListProps) {
  const [elders, setElders] = useState<Elder[]>([])
  const [loading, setLoading] = useState(true)
  const [outboundError, setOutboundError] = useState<string | null>(null)
  const { startCall, endCall, isActive, isConnecting, error } = useVapi()

  useEffect(() => {
    fetch("/api/elders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.elders)) setElders(data.elders)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleStartCall = async (elder: Elder) => {
    await startCall(elder)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--amber)] flex items-center justify-center">
              <span className="text-lg">🧚</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">EchoElders</h1>
              <p className="text-sm text-muted-foreground">Care companion dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <OutboundCallDialog
              elders={elders}
              onError={setOutboundError}
              onSuccess={() => setOutboundError(null)}
              triggerLabel="Call a number"
            />
            <Button onClick={onAddElder} className="bg-[var(--sage)] hover:bg-[var(--sage)]/90">
              <Plus className="w-4 h-4 mr-2" />
              Add elder
            </Button>
          </div>
        </header>

        {(error || outboundError) && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--coral-light)] text-[var(--coral)] text-sm">
            {error ?? outboundError}
          </div>
        )}

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Your elders
          </h2>
          {elders.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-foreground font-medium mb-1">No elders yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add someone you care for to start companion calls.
              </p>
              <Button onClick={onAddElder} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add elder
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {elders.map((elder) => (
                <li
                  key={elder.id}
                  className="bg-white rounded-xl border border-border p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[var(--amber-light)] flex items-center justify-center text-lg font-semibold text-[var(--amber-dark)] shrink-0">
                      {elder.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{elder.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {elder.age} years · {elder.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onSelectElder && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectElder(elder)}
                      >
                        View
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="bg-[var(--sage)] hover:bg-[var(--sage)]/90"
                      onClick={() => handleStartCall(elder)}
                      disabled={isConnecting || isActive}
                    >
                      {isConnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Phone className="w-4 h-4 mr-1.5" />
                          {isActive ? "On call…" : "Start call"}
                        </>
                      )}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {isActive && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Button
              onClick={endCall}
              className="bg-[var(--coral)] hover:bg-[var(--coral)]/90 shadow-lg"
            >
              End call
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
