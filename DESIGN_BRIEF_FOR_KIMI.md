# EchoElders – UI design brief for Kimi 2.5

Use this document as the main input for Kimi 2.5. Ask Kimi to produce a **clear UI design system and screen-level specs** (and optionally mockups) that a developer can implement in the existing codebase. When Kimi’s output is ready, share it back so it can be integrated.

---

## 1. Product summary

**EchoElders** is a caregiver dashboard web app. Caregivers:

- See a **list of elders** they care for (name, age, phone).
- **Start an AI voice call** (in-browser or outbound to a phone number).
- **Add a new elder** via a multi-step **registration flow** (caregiver info → elder info → consent → done).
- Open a **per-elder dashboard** with stats, health schedule, alerts, “Story of the Week,” recent calls, topics, and family members.

**Tone:** Warm, trustworthy, calm. It’s for people caring for aging loved ones. Avoid cold or clinical; avoid playful or childish. Think “gentle, clear, human.”

---

## 2. Tech stack (must be implementable with this)

- **Framework:** Next.js 16 (App Router), React 19.
- **Styling:** Tailwind CSS v4. Use **Tailwind utility classes** for layout, spacing, typography, colors, borders, radius, shadows. Prefer design tokens that map to Tailwind (or CSS variables we can wire to Tailwind).
- **Components:** shadcn/ui (Radix-based): Button, Input, Dialog, Card, Label, Select, Checkbox, Tabs, Badge, etc. Design should use or extend these patterns (no custom component library).
- **Icons:** Lucide React.
- **Fonts:** Currently unspecified; suggest a pairing (e.g. one for headings, one for body) that fits the tone and works with Next.js font loading.

---

## 3. Screens and flows to design

### 3.1 Elders list (home)

- **Path in app:** First screen when opening the app (after any future auth).
- **Content:**
  - **Header:** Logo/brand (EchoElders), short tagline, two actions: **“Call a number”** (outbound phone call) and **“Add elder”** (opens registration).
  - **Error banner:** Shown when there’s an error (e.g. VAPI or outbound call failure). Dismissible or auto-clear.
  - **Section “Your elders”:** List of elder cards. Each card: avatar (initials), name, age, phone; actions: **“Start call”** (in-browser AI call), optionally **“View”** (go to dashboard). Empty state: illustration/icon, “No elders yet”, short copy, **“Add elder”** CTA.
  - **When on an in-browser call:** Floating **“End call”** button (e.g. bottom center).
- **Layout:** Single column, max width ~672px, centered; comfortable padding.

### 3.2 Registration flow (multi-step)

- **Path:** Opened from “Add elder” on the elders list; can have a “Back” to return to list on step 1.
- **Steps:** (1) Your account, (2) Add elder, (3) Confirm link, (4) Done.
- **Needs:** Clear step indicator (1–4), back/next navigation, form fields grouped by step. Final step confirms success and leads to the per-elder dashboard (or back to list).
- **Design:** Same warm, calm tone; forms should feel simple and low-friction (labels, spacing, optional helper text). No need to redesign every form field in detail; define style for “form block,” “primary CTA,” “secondary/outline button.”

### 3.3 Per-elder dashboard

- **Path:** After registration for that elder, or (if we add it) from “View” on an elder card.
- **Content:**
  - **Header:** Back (to elders list), avatar, elder name, age, location, “Active” badge, **“Start call”** (in-browser), **“Settings.”** When on call: floating **“End call.”**
  - **Error banner** for call errors.
  - **Stats row:** 4 stat cards (e.g. “Calls this month,” “Stories captured,” “Happy mood days,” “Health on track”).
  - **Health schedule:** Card with list of medications/reminders (name, time, days, “On track”).
  - **Alert card:** One prominent alert (e.g. mood dip), with date/time and short message.
  - **Story of the week:** Card with title, short quote, “Captured over N calls,” actions “Share with family” / “Export PDF.”
  - **Two-column area:** Left: **Recent calls** (list of call rows: date, time, duration, mood icon, summary). Right: **Topics this month** (horizontal bars), **Family members** (list + “Add family member”).
  - **Footer:** Small branding (e.g. Everly/EchoElders), links (Help, Privacy, Contact).
- **Layout:** Max width ~1024px, centered; grid where needed (e.g. stats 4-col, then main + sidebar).

### 3.4 Outbound-call dialog

- **Trigger:** “Call a number” on elders list.
- **Content:** Modal/dialog: title “Outbound call,” short description (VAPI calls this number; use E.164). Fields: **Phone number** (required), **Name** (optional), **Use context from elder** (optional dropdown). Actions: **Cancel**, **Call number** (primary).
- **Design:** Match form style (labels, inputs, primary/secondary buttons); clear hierarchy.

---

## 4. Current design tokens (for reference)

We use CSS variables in `frontend/app/globals.css` and Tailwind. You can propose a new palette; it should be implementable via CSS variables and Tailwind.

- **Background:** `#faf7f2` (cream).
- **Foreground (text):** `#1a1a1a`.
- **Cards/surfaces:** `#ffffff`, border `#e5e0d8`.
- **Primary / accent:** `#d4a574` (amber), light `#e8c9a0`, dark `#b8956a`.
- **Secondary / muted:** `#f5f0e8`, muted text `#6b6b6b`.
- **Sage (success/positive):** `#6b9b5a`, light `#8fb882`.
- **Coral (alerts/attention):** `#e8a87c`, light `#f5d4c0`.
- **Radius:** `0.625rem`. 
- **Border:** `#e5e0d8`.

We’re open to a full refresh (e.g. new palette, stronger typography, more distinctive components) as long as it stays warm and trustworthy and works with Tailwind + shadcn.

---

## 5. What to ask Kimi 2.5 to deliver

Ask Kimi to produce **one or more** of the following in a form you can paste or attach:

1. **Design system**
   - Color palette (hex + usage: background, surface, primary, secondary, success, alert, muted, border).
   - Typography: font families, sizes, weights for H1, H2, H3, body, small/caption.
   - Spacing and radius (e.g. 4/8/12/16/24/32, radius sm/md/lg).
   - Buttons: primary, secondary, outline, ghost; sizes.
   - Cards: background, border, radius, padding, shadow if any.
   - Form inputs: height, border, focus state.

2. **Screen-level specs**
   - For **Elders list**, **Registration (step indicator + one step example)**, **Dashboard**, **Outbound-call dialog**: layout (max width, padding, grid), order of sections, and for each section: component type (card, list, button, etc.), spacing, and any special behavior (e.g. floating “End call”).

3. **Tailwind-oriented output**
   - Where possible, express specs as **Tailwind classes** (e.g. `rounded-xl bg-white border border-border p-6`) or a small list of class names per component/section so a developer can apply them directly in `frontend/components/` and `frontend/app/`.

4. **Optional**
   - If Kimi can output **wireframes or mockups** (e.g. ASCII, Mermaid, or image), that’s useful as long as they’re clearly labeled (screen name, section names).

---

## 6. File paths for implementation

After Kimi’s response, the implementation will touch:

- **Global styles / design tokens:** `frontend/app/globals.css`
- **Elders list:** `frontend/components/elders-list.tsx`
- **Registration flow:** `frontend/components/registration-flow.tsx`
- **Per-elder dashboard:** `frontend/components/dashboard.tsx`
- **Outbound call dialog:** `frontend/components/outbound-call-dialog.tsx`
- **Layout / fonts:** `frontend/app/layout.tsx`
- **Shared UI:** `frontend/components/ui/*` (Button, Input, Dialog, Card, etc.) – extend or restyle, don’t replace.

---

## 7. Exact prompt you can give Kimi 2.5

Copy-paste this:

---

**Task:** You are redesigning the UI for **EchoElders**, a caregiver dashboard web app (list of elders, in-browser and outbound AI voice calls, add-elder registration, per-elder dashboard with stats, health schedule, alerts, stories, calls). The stack is **Next.js, React, Tailwind CSS v4, shadcn/ui, Lucide icons**. Tone: warm, trustworthy, calm; audience is people caring for aging loved ones.

**Please:**

1. **Define a design system:** colors (hex + usage), typography (font pairs, sizes, weights), spacing scale, radius, and component styles for buttons, cards, form inputs. Prefer expressions that map to **Tailwind** or **CSS variables** so a developer can implement them in `frontend/app/globals.css` and components.

2. **Spec the main screens** using the structure in the attached “EchoElders – UI design brief” (elders list, registration flow, per-elder dashboard, outbound-call dialog). For each screen, give: layout (max width, padding, grid), section order, and for each section the type of component and spacing. Where possible, use **Tailwind class names** (e.g. `rounded-xl bg-white p-6`) so the spec is directly implementable.

3. **Optional:** Add simple wireframes (ASCII or description) or a short “before/after” note so the developer sees intent (e.g. “hero section with softer CTA,” “denser stats row”).

**Deliverable:** A single document (or clear sections) that a developer can use to update the existing React/Tailwind codebase without changing app logic—only layout, styling, and tokens. If you need the full brief, it’s in the attached DESIGN_BRIEF_FOR_KIMI.md.

---

Once you have Kimi’s output, share it (paste or attach) and say “integrate this” or “implement Kimi’s design”; the same codebase can then be updated to match.
