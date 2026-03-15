# 🧚‍♀️ Everly

**A Living Memoir. A Safer Home.**

AI companion for seniors that captures life stories and keeps families connected through regular voice calls, mood insights, and beautiful weekly story excerpts.

---

## The problem

1 in 4 seniors experience chronic loneliness. 70% of family histories are never recorded.
Most families live too far away to call every day — and even when they do, the conversations
stay in their heads and disappear.

Everly fixes both.

---

## Which number does VAPI call?

- **In-browser (current demo):** When you click **Start call** on the dashboard or elders list, the call runs **in your browser** (mic + speakers). **No phone number is called.** You're talking to the AI directly on your device. The elder's `phone` in the database is **not** used. If you see a call in the VAPI dashboard with ~30 seconds, that is this **web call** (browser session), not an outbound call to any number.
- **Outbound phone calls (optional):** The backend has an API route `POST /api/call` that uses VAPI's **phone** product. Only if you trigger that (e.g. `curl -X POST .../api/call -d '{"elderId":"..."}'` or a "Call their phone" button), then:
  - **VAPI calls the elder's phone number** (`elder.phone` from Supabase).
  - The call is placed **from** the VAPI phone number linked to `VAPI_PHONE_NUMBER_ID` **to** the elder's number.
  So for real phone calls, the number that gets called is the **elder's** number stored in the database. In the VAPI dashboard, an outbound phone call will show a destination number; a web call will not.

---

## Debugging: "Call starts but nothing happens"

If you click **Start call** and the VAPI dashboard shows time passing but you hear/see nothing in the browser:

1. **No number is called** — This is a web call. The 30 seconds in VAPI is the browser session, not an outbound call to a phone number.
2. **Open the browser console** (F12 → Console). You should see `[VAPI] call-start` when the call actually starts. If you never see it, the SDK may still be connecting.
3. **Check audio:**
   - Allow microphone when the browser prompts.
   - Ensure the tab is not muted (no mute icon on the tab).
   - Try headphones or a different speaker in case output is going to another device.
4. **Check the assistant in VAPI Dashboard:**
   - Assistant has a **first message** (e.g. "Hello {{elder_name}}! How are you today?") so the AI speaks first.
   - **Voice** is set (e.g. ElevenLabs) and the voice ID is valid.
5. **VAPI Dashboard → Calls:** Open the call that shows ~30s. Check if it's **Web** or **Phone**. For Web, there is no "number called"; for Phone, the destination number is the elder's `phone` from your database.

---

## Quick start

### Prerequisites

- Node.js 20+
- Accounts: [Supabase](https://supabase.com), [VAPI](https://dashboard.vapi.ai), [Anthropic](https://console.anthropic.com), [ElevenLabs](https://elevenlabs.io) (for voice)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd genesis-genai/frontend
npm install
```

### 2. Environment variables

Copy the example env and fill in your values:

```bash
cp .env.example .env.local
```

Required for the app:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | VAPI **public** key (for in-browser calls) |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | VAPI assistant ID (same as in dashboard) |

Optional (for outbound phone calls via `/api/call`):

- `VAPI_API_KEY` — VAPI API key (server)
- `VAPI_PHONE_NUMBER_ID` — VAPI phone number to call from

### 3. Database (Supabase)

In the Supabase SQL Editor, run the schema that creates `elders`, `call_logs`, and `memories` (see hackathon checklist or `docs/` if you have it). Then add at least one elder (or use "Add elder" in the app).

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll see the elders list; use **Start call** for an in-browser demo call (grant mic when prompted).

---

## VAPI Webhook Setup (CRITICAL - Required for call data!)

**The Problem:** VAPI sends call data (transcripts, summaries, memories) via webhooks to your server. But during local development, your `localhost` isn't accessible from the internet, so VAPI can't deliver the webhook.

**The Solution:** Use ngrok to create a public URL that tunnels to your local server.

### Step-by-step ngrok setup:

1. **Install ngrok:**
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Create a free ngrok account** at [ngrok.com](https://ngrok.com) and get your authtoken

3. **Configure ngrok:**
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```

4. **Start your Next.js dev server:**
   ```bash
   npm run dev
   # Should run on port 3001
   ```

5. **In a new terminal, start ngrok:**
   ```bash
   ngrok http 3001
   ```

6. **Copy the forwarding URL** (looks like `https://abc123.ngrok.io`)

7. **Set up VAPI Dashboard:**
   - Go to [VAPI Dashboard](https://dashboard.vapi.ai)
   - Click on your **Organization name** (top left, next to the VAPI logo)
   - Select **Settings** from the dropdown
   - Under **Webhook URL**, enter: `https://YOUR_NGROK_URL/api/webhook/vapi`
   - Save changes
   
   > **Note:** The webhook is configured at the **organization level**, not per assistant. This means all calls from any assistant in your organization will send webhooks to this URL.

8. **Test it:**
   - Make a call from your dashboard
   - Check your terminal running the Next.js server - you should see `[VAPI Webhook]` logs
   - The call data will now be saved to Supabase!

### Alternative: Deploy to Vercel for testing

If ngrok feels cumbersome, you can deploy to Vercel and test there:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Then set your production URL (e.g., `https://your-app.vercel.app/api/webhook/vapi`) in the VAPI Dashboard webhook settings.

---

## Project structure

```
genesis-genai/
├── frontend/                 # Next.js app
│   ├── app/
│   │   ├── api/              # API routes (call, webhook, elders)
│   │   ├── lib/              # Supabase & VAPI helpers
│   │   ├── types/
│   │   └── page.tsx
│   ├── components/
│   │   ├── vapi-call-provider.tsx  # VAPI Web SDK (in-browser calls)
│   │   ├── elders-list.tsx
│   │   ├── dashboard.tsx
│   │   └── registration-flow.tsx
│   └── .env.example
└── README.md
```

- **Elders list** — Loads elders from Supabase via `GET /api/elders`; **Start call** uses the VAPI Web SDK (no phone number).
- **Dashboard** — Single-elder view with **Start call** (same in-browser flow) and **Back to list**.
- **Registration** — "Add elder" flow; saves to Supabase via `POST /api/elders`.

---

## VAPI setup (summary)

1. Create an assistant in [VAPI Dashboard](https://dashboard.vapi.ai) with system prompt using variables like `{{elder_name}}`, `{{elder_age}}`, `{{biography}}`, `{{medications}}`.
2. For **in-browser demo**: add your **public** key and **assistant ID** to `NEXT_PUBLIC_VAPI_*` in `.env.local`.
3. For **phone calls**: add a phone number in VAPI, set `VAPI_PHONE_NUMBER_ID`, and call `POST /api/call` with `{ elderId }`; VAPI will call the **elder's** phone number.

### Assistant Configuration Tips

To get the most out of Everly, configure your VAPI assistant with these settings:

**System Prompt Template:**
```
You are Everly, a warm and patient AI companion calling {{elder_name}}. 
They are {{elder_age}} years old. Here's what you should know about them:
{{biography}}

Their hobbies include: {{hobbies}}
Family members: {{family_members}}
Medications to check on: {{medications}}
Personality notes: {{personality_notes}}

Be gentle, speak slowly, and ask about their day. Check if they've taken their 
medications naturally in conversation. Encourage them to share a memory or story.
Always be respectful and warm.
```

**Structured Output (for memory capture):**
Configure structured outputs in VAPI Dashboard to capture:
- `mood` (string: happy, content, sad, lonely, anxious, tired, nostalgic)
- `mood_notes` (string: brief explanation)
- `meds_taken` (boolean)
- `has_story` (boolean: did they share a memory?)
- `chapter_title` (string: title of the story)
- `chapter_content` (string: the full story they shared)

---

## Troubleshooting

### "I'm not getting any data back from VAPI"

1. **Check webhook URL is set** in VAPI Dashboard
2. **Check ngrok is running** and URL hasn't changed (ngrok free URLs change each session)
3. **Check server logs** for `[VAPI Webhook]` entries
4. **Verify call is being registered** - when you start a call, check if `POST /api/call/register` is called
5. **Check Supabase** - look at the `call_logs` table to see if entries are being created/updated

### "Webhook is being received but no data is saved"

1. Check structured outputs are configured in VAPI Dashboard
2. Check the assistant is actually having conversations (not just hanging up immediately)
3. Look at the full payload in logs to see what's being sent
4. Verify your Supabase keys have write permissions

---

## Deploy to Vercel (Share with Friends!)

Your friends can't access `localhost:3001` on your computer. To share Everly with others, you need to deploy it to the internet.

### Option 1: Deploy to Vercel (Recommended - 5 minutes)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from the frontend folder:**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Link to existing project? **No** (first time)
   - What's your project name? **everly** (or any name)

5. **Add environment variables in Vercel Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Find your project → Settings → Environment Variables
   - Add all variables from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
     - `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
     - `VAPI_API_KEY`
     - `VAPI_PHONE_NUMBER_ID`
     - `VAPI_ASSISTANT_ID`

6. **Redeploy:**
   ```bash
   vercel --prod
   ```

7. **Update VAPI Webhook URL:**
   - In VAPI Dashboard → Organization Settings
   - Change webhook URL to: `https://your-app.vercel.app/api/webhook/vapi`

8. **Share the URL!** Your friends can now visit `https://your-app.vercel.app`

### Option 2: Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd frontend
   netlify deploy --prod
   ```

3. **Add environment variables** in Netlify Dashboard

### Troubleshooting Deployment

**"Build failed" errors:**
- Make sure all environment variables are set in Vercel/Netlify dashboard
- Check that your Supabase tables are created

**"Webhook not working" after deploy:**
- Update the webhook URL in VAPI Dashboard to your production URL
- Don't use ngrok anymore - use your actual domain

**Images not loading:**
- Images from Unsplash should work automatically
- If using other image sources, add them to `next.config.mjs` in the `images.remotePatterns` array

---

## 🎯 30-Second Pitch

> *"Everly helps families care for aging loved ones through AI phone conversations. Caregivers set up a profile with medications, routines, and life stories. Our AI calls the elder at scheduled times — reminding about medications, providing companionship, and capturing memories. After each call, caregivers get a summary: mood, medication adherence, and any concerns. Over time we build a living memory archive. We're not just reducing loneliness; we're preserving a person before time erases the details."*

---

## 🏅 Awards & Recognition

*Add any hackathon awards or recognition here*

---

---

## License

MIT.
