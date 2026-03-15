"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, ArrowRight, Calendar, Heart, Smile, BookOpen } from "lucide-react"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr,280px] md:items-center">
          <div className="paper-card p-8 md:p-10">
            <span className="sage-pill text-xs font-mono mb-4 inline-block">
              AI VOICE COMPANION FOR SENIORS
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading md:text-4xl lg:text-5xl">
              A gentle voice companion.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Daily calls that check in, lift spirits, and keep families connected.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">
                  <Phone className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-[28px] border-border" >
                <Link href="/#how-it-works">
                  See how it works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-mono">Calls from your dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="font-mono">Health on track</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Smile className="h-4 w-4" />
                <span className="font-mono">Mood &amp; companionship</span>
              </div>
            </div>
          </div>
          <div className="paper-card overflow-hidden p-0 aspect-[3/4] max-h-[420px] md:max-h-none bg-secondary flex items-center justify-center">
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <span className="text-6xl">🧚</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-foreground font-heading md:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Add an elder, add yourself as caregiver, then start voice calls from the dashboard.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="paper-card p-6">
              <span className="sage-pill font-mono text-xs">1</span>
              <h3 className="mt-3 font-semibold text-foreground font-heading">Create Elder</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your loved one&apos;s name, phone, medications, and a bit about them.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4 rounded-[28px]">
                <Link href="/create-elder">Create Elder</Link>
              </Button>
            </div>
            <div className="paper-card p-6">
              <span className="sage-pill font-mono text-xs">2</span>
              <h3 className="mt-3 font-semibold text-foreground font-heading">Create Caregiver</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your contact info so we can send alerts and summaries.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4 rounded-[28px]">
                <Link href="/create-caregiver">Create Caregiver</Link>
              </Button>
            </div>
            <div className="paper-card p-6">
              <span className="sage-pill font-mono text-xs">3</span>
              <h3 className="mt-3 font-semibold text-foreground font-heading">Dashboard</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start in-browser or outbound calls, see recent calls and wellness at a glance.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4 rounded-[28px]">
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-foreground font-heading md:text-3xl">
            Features
          </h2>
          <p className="mt-2 text-muted-foreground">
            One calm view for schedules, alerts, and stories.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-4 rounded-[28px] border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground font-heading">Voice calls</h3>
                <p className="text-sm text-muted-foreground">
                  In-browser or outbound calls with a warm AI companion.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-[28px] border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground font-heading">Wellness check</h3>
                <p className="text-sm text-muted-foreground">
                  Mood and health notes after each call; alerts when something needs attention.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-[28px] border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground font-heading">Stories archive</h3>
                <p className="text-sm text-muted-foreground">
                  Memories and stories captured from conversations over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="border-t border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground font-heading md:text-3xl">
            Ready to get started?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Add an elder and open the dashboard to begin.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/create-elder">Create Elder</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-[28px]">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
