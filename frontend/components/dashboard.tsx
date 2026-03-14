"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  AlertCircle, 
  Share2, 
  FileText, 
  Plus,
  Phone,
  Heart
} from "lucide-react"
import type { ElderData, CaregiverData } from "@/app/page"

interface DashboardProps {
  elder: ElderData
  caregiver: CaregiverData
}

// Mock data for the demo - pre-loaded with Dorothy's persona
const mockCalls = [
  {
    id: 1,
    date: "Today",
    time: "10:14 AM",
    duration: "22 min",
    mood: "happy" as const,
    summary: "Talked about gardening plans for spring. Mentioned wanting to teach Emma how to grow tomatoes.",
  },
  {
    id: 2,
    date: "Tue Mar 11",
    time: "8:47 AM",
    duration: "31 min",
    mood: "neutral" as const,
    summary: "Mentioned Harold's birthday. Seemed lonely. Recalled their first dance in 1963.",
  },
  {
    id: 3,
    date: "Mon Mar 10",
    time: "3:20 PM",
    duration: "18 min",
    mood: "happy" as const,
    summary: "Continued the rural Ontario teaching story. Remembered student names from 1967.",
  },
  {
    id: 4,
    date: "Fri Mar 7",
    time: "11:05 AM",
    duration: "26 min",
    mood: "happy" as const,
    summary: "Asked about Jake's hockey game. Excited he scored his first goal. Laughed a lot.",
  },
]

const mockTopics = [
  { name: "Family", percentage: 82, color: "bg-[var(--sage)]" },
  { name: "Memories", percentage: 71, color: "bg-[var(--sage-light)]" },
  { name: "Gardening", percentage: 45, color: "bg-[var(--amber)]" },
  { name: "Health", percentage: 28, color: "bg-[var(--coral)]" },
]

const mockFamilyMembers = [
  { name: "Emma", relationship: "Granddaughter", initial: "E", color: "bg-[var(--amber)]" },
  { name: "Jake", relationship: "Grandson", initial: "J", color: "bg-[var(--sage-light)]" },
]

export function Dashboard({ elder }: DashboardProps) {
  const [callFilter, setCallFilter] = useState<"week" | "all">("week")
  
  // Calculate age from DOB
  const calculateAge = (dob: string) => {
    if (!dob) return 81 // Default for demo
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge(elder.dateOfBirth)
  const fullName = `${elder.firstName} ${elder.lastName}`
  const initials = `${elder.firstName[0] || "D"}${elder.lastName[0] || "W"}`

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--amber-light)] flex items-center justify-center text-xl font-semibold text-[var(--amber-dark)]">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{fullName}</h1>
              <p className="text-sm text-muted-foreground">
                {age} · Retired schoolteacher · Toronto, ON
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[var(--sage-light)] text-[var(--sage)] text-sm font-medium">
              Active
            </span>
            <Button variant="outline" className="border-[var(--border)]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard value="14" label="Calls this month" />
          <StatCard value="47" label="Stories captured" />
          <StatCard value="86%" label="Happy mood days" />
          <StatCard value="3" label="Meds on track (days)" />
        </div>

        {/* Alert Banner */}
        <div className="bg-[var(--warning-bg)] border border-[var(--warning-border)] rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--coral)] flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-foreground">
              <span className="font-medium">{elder.firstName}</span> mentioned feeling very alone and referenced Harold several times on Tuesday&apos;s call — it may be worth reaching out today.
            </p>
          </div>
          <Button variant="outline" className="border-[var(--border)] bg-white hover:bg-[var(--cream)]">
            Send SMS
          </Button>
        </div>

        {/* Story of the Week */}
        <div className="bg-[var(--coral-light)]/40 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold tracking-wider text-[var(--coral)] uppercase">
              Story of the Week
            </span>
            <span className="text-xs text-muted-foreground">· March 10, 2026</span>
          </div>
          
          <h2 className="text-xl font-semibold text-foreground mb-4">
            The Summer I Taught in Rural Ontario
          </h2>
          
          <blockquote className="text-foreground italic mb-4 leading-relaxed">
            &ldquo;It was 1967 — I was twenty-two and completely terrified. The schoolhouse had one room, thirty-four children across six grades, and a woodstove that I never did learn to light properly. But that was the proudest year of my life. I think about those children still.&rdquo;
          </blockquote>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Captured over 3 calls this week</span>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[var(--border)] bg-white hover:bg-[var(--cream)]">
                <Share2 className="w-4 h-4 mr-2" />
                Share with family
              </Button>
              <Button variant="outline" className="border-[var(--border)] bg-white hover:bg-[var(--cream)]">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Calls - Takes 2 columns */}
          <div className="col-span-2 bg-white rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Calls
              </h3>
              <div className="flex bg-[var(--cream)] rounded-lg p-1">
                <button
                  onClick={() => setCallFilter("week")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    callFilter === "week"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  This week
                </button>
                <button
                  onClick={() => setCallFilter("all")}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    callFilter === "all"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mockCalls.map((call) => (
                <CallLogItem key={call.id} call={call} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Topics This Month */}
            <div className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Topics This Month
              </h3>
              <div className="space-y-3">
                {mockTopics.map((topic) => (
                  <TopicBar key={topic.name} topic={topic} />
                ))}
              </div>
            </div>

            {/* Family Members */}
            <div className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Family Members
              </h3>
              <div className="space-y-3">
                {mockFamilyMembers.map((member) => (
                  <FamilyMemberItem key={member.name} member={member} />
                ))}
                <button className="w-full py-2 border border-dashed border-[var(--border)] rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-[var(--amber)] transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add family member
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--amber)] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground">Gentle Assistance</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Help</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Sub-components
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-4">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function CallLogItem({ call }: { call: typeof mockCalls[0] }) {
  const moodEmoji = {
    happy: { icon: "😊", bg: "bg-[var(--sage-light)]" },
    neutral: { icon: "😐", bg: "bg-[var(--amber-light)]" },
    sad: { icon: "😟", bg: "bg-[var(--coral-light)]" },
  }

  const mood = moodEmoji[call.mood]

  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full ${mood.bg} flex items-center justify-center text-base`}>
        {mood.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{call.date}</span>
          <span className="text-muted-foreground">{call.time}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{call.duration}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{call.summary}</p>
      </div>
    </div>
  )
}

function TopicBar({ topic }: { topic: typeof mockTopics[0] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground w-20">{topic.name}</span>
      <div className="flex-1 h-2.5 bg-[var(--cream)] rounded-full overflow-hidden">
        <div
          className={`h-full ${topic.color} rounded-full transition-all`}
          style={{ width: `${topic.percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-10 text-right">{topic.percentage}%</span>
    </div>
  )
}

function FamilyMemberItem({ member }: { member: typeof mockFamilyMembers[0] }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${member.color} flex items-center justify-center text-sm font-medium text-white`}>
          {member.initial}
        </div>
        <span className="text-sm font-medium text-foreground">{member.name}</span>
      </div>
      <span className="text-sm text-muted-foreground">{member.relationship}</span>
    </div>
  )
}
