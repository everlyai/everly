# 🏗️ Everly – High-Level Architecture

> **One-minute overview for engineers, investors, or teammates.**

---

## The 60-Second Version

Everly is a **Next.js full-stack application** that sits at the intersection of three cloud services: **Supabase**, **VAPI**, and **Vercel**.

Here's how the pieces fit together:

1. **Frontend (Next.js + React)**
   Caregivers manage elder profiles and trigger calls from a single-page dashboard. All UI state for an active voice call is held in a global `VapiCallProvider` React context so any component can start or stop a call without prop-drilling.

2. **Voice Layer (VAPI)**
   When a caregiver clicks *Start Call*, the VAPI Web SDK opens an in-browser audio session. The AI assistant is pre-configured with the elder's biography, medications, and hobbies so every conversation feels personal. For real phone calls, a Next.js API route hits the VAPI REST API to dial the elder's number directly.

3. **Data Layer (Supabase / PostgreSQL)**
   Three tables capture everything: `elders` (profiles), `call_logs` (every conversation), and `memories` (stories extracted from calls). All sensitive Supabase operations run through Next.js server-side API routes using the service-role key—the browser only ever touches the public anon key.

4. **Webhook Pipeline**
   When a call ends, VAPI fires a `call-ended` webhook to `POST /api/webhook/vapi`. That handler extracts the transcript, mood score, medication confirmation, and any captured story, then writes them back to Supabase. A client-side retry loop (up to 5 attempts, 3 s apart) acts as a safety net in case the webhook is slow or the caregiver closes the tab early.

5. **Deployment**
   The whole stack ships to **Vercel** as a single monorepo. No separate backend service is needed—Next.js API routes handle every server-side concern.

---

## Architecture Diagram

```
 Browser (Caregiver)
 ┌─────────────────────────────┐
 │  React UI + VapiCallProvider│
 │  (Context, hooks, Tailwind) │
 └────────────┬────────────────┘
              │ fetch / VAPI Web SDK
              ▼
 Next.js (Vercel Edge / Node)
 ┌───────────────────────────────────────┐
 │  /api/elders        ─► Supabase CRUD  │
 │  /api/call          ─► VAPI REST API  │
 │  /api/calls/recent  ─► Supabase Query │
 │  /api/webhook/vapi  ◄─ VAPI Webhooks  │
 └───────────────────────────────────────┘
              │                   ▲
      Supabase SDK          VAPI Webhooks
              │                   │
              ▼                   │
 ┌─────────────────┐    ┌─────────────────────┐
 │ Supabase (Postgres) │    │ VAPI (Voice AI)     │
 │  - elders           │    │  - Web SDK (browser)│
 │  - call_logs        │    │  - REST API (server)│
 │  - memories         │    │  - Webhooks (events)│
 └─────────────────────┘    └─────────────────────┘
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Single Next.js app** (no separate backend) | Reduces operational complexity; API routes co-locate with UI |
| **Service-role key server-side only** | Prevents privilege escalation from the browser |
| **VapiCallProvider context** | Centralises call lifecycle; avoids prop drilling across deep component trees |
| **Dual data-save paths** (webhook + client retry) | Guarantees call data is persisted even if the browser disconnects mid-call |
| **Graceful fallbacks** | Dashboard never looks empty—realistic sample data fills gaps until real calls accumulate |
| **Elder-first UI** | Large buttons, high contrast, minimal interactions—optimised for 80+ year-old users |
