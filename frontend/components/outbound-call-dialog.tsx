"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Phone } from "lucide-react"
import type { Elder } from "@/app/types"

interface OutboundCallDialogProps {
  elders: Elder[]
  onSuccess?: () => void
  onError?: (message: string) => void
  triggerLabel?: string
}

export function OutboundCallDialog({
  elders,
  onSuccess,
  onError,
  triggerLabel = "Call a number",
}: OutboundCallDialogProps) {
  const [open, setOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("+1 937 598 3675")
  const [name, setName] = useState("")
  const [elderId, setElderId] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = phoneNumber.trim().replace(/\s/g, "")
    if (!normalized) {
      onError?.("Enter a phone number (e.g. +15551234567)")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/call/outbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: normalized,
          name: name.trim() || undefined,
          elderId: elderId || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        onError?.(data?.error ?? "Failed to start call")
        return
      }
      setOpen(false)
      setPhoneNumber("")
      setName("")
      setElderId("")
      onSuccess?.()
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border">
          <Phone className="w-4 h-4 mr-1.5" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Outbound call</DialogTitle>
          <DialogDescription>
            VAPI will call this number from your configured phone number. Use E.164 format (e.g. +15551234567).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="outbound-phone">Phone number *</Label>
            <Input
              id="outbound-phone"
              type="tel"
              placeholder="+1 937 598 3675"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="outbound-name">Name (optional)</Label>
            <Input
              id="outbound-name"
              type="text"
              placeholder="e.g. Dorothy"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {elders.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="outbound-elder">Use context from elder (optional)</Label>
              <select
                id="outbound-elder"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={elderId}
                onChange={(e) => setElderId(e.target.value)}
              >
                <option value="">None</option>
                {elders.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Calling…" : "Call number"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
