# 🧚‍♀️ Everly – Hackathon Submission

> **A Living Memoir. A Safer Home.**
> 
> AI companion for seniors that captures life stories and keeps families connected through regular voice calls, mood insights, and beautiful weekly story excerpts.

---

## 📖 Project Inspiration

### The Problem

Millions of seniors live alone, experiencing isolation that impacts both mental and physical health. Meanwhile, families struggle to stay connected across distances, and the rich life stories of older generations are lost every day. Traditional solutions fall short:

- **Check-in calls are sporadic** and don't capture the full picture of wellbeing
- **Life stories fade away** without being documented
- **Early warning signs** of declining health or mood often go unnoticed
- **Family members feel disconnected** from their loved ones' daily lives

### Our "Why"

Everly was born from a simple belief: *every senior deserves to feel heard, and every family deserves to stay connected.* We imagined an AI companion that doesn't replace human connection—but enhances it. One that:

- Calls Grandma every morning to ask how she slept
- Remembers that story about her childhood home
- Alerts the family when she seems down
- Turns casual conversations into a treasured family memoir

### Why Generative AI Matters Here

Generative AI is uniquely suited for this challenge because it enables:
- **Natural voice conversations** that feel warm and human
- **Intelligent memory extraction** from unstructured conversations
- **Sentiment analysis** to detect mood changes over time
- **Automated story generation** that captures life narratives

---

## 🛠️ Technology Stack

### Languages
| Language | Purpose |
|----------|---------|
| **TypeScript** | Primary language for type-safe, maintainable code |
| **JavaScript** | Configuration and utility scripts |
| **SQL** | Database schema and queries (PostgreSQL) |
| **CSS** | Styling with Tailwind CSS |

### Frameworks & Libraries

#### Frontend
| Technology | Role |
|------------|------|
| **Next.js 16** | React framework with App Router for SSR/SSG |
| **React 19** | UI component library |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Beautiful, accessible UI components |
| **Framer Motion** | Smooth animations and transitions |
| **Lucide React** | Icon library |

#### Backend & API
| Technology | Role |
|------------|------|
| **Next.js API Routes** | Server-side endpoints |
| **VAPI Web SDK** | Voice AI integration for browser calls |
| **VAPI REST API** | Server-side call management |

#### Database
| Technology | Role |
|------------|------|
| **Supabase** | PostgreSQL database with real-time subscriptions |
| **@supabase/supabase-js** | Client-side database client |

### Platforms & Cloud Services

| Platform | Usage |
|----------|-------|
| **Vercel** | Hosting & deployment with edge network |
| **VAPI** | Voice AI platform for conversational AI |
| **Supabase** | Managed PostgreSQL database |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **npm** | Package management |
| **ESLint** | Code linting |
| **TypeScript Compiler** | Type checking |

---

## ✨ Product Summary

### What Everly Does

Everly is an AI-powered companion system for seniors and their families. It combines **voice AI technology** with **intelligent memory capture** to create meaningful connections and preserve life stories.

### Core Features

#### 🤖 AI Voice Calls
- **Scheduled or on-demand calls** to check in with seniors
- **Natural conversations** powered by GPT-4o voice models
- **Medication reminders** and health check-ins
- **Mood detection** through conversational analysis

#### 📝 Memory Capture
- **Automatic story extraction** from conversations
- **Categorized memories** (Family, Life Events, Wisdom, etc.)
- **Sentiment tracking** over time
- **Exportable memoirs** for family keepsakes

#### 📊 Family Dashboard
- **Real-time wellbeing metrics** (mood trends, medication adherence)
- **Recent conversation summaries**
- **Alert system** for concerning changes
- **Topic insights** (what Grandma talks about most)

#### 📱 Beautiful Storybook
- **Curated life stories** from captured memories
- **Shareable excerpts** for family members
- **PDF export** for printing physical memoirs

### User Experience

```
┌─────────────────────────────────────────────────────────────┐
│  Morning: Everly calls Grandma                              │
│  "Good morning, Dorothy! How did you sleep?"               │
├─────────────────────────────────────────────────────────────┤
│  Conversation flows naturally...                            │
│  Dorothy mentions her garden, her sister, a childhood story │
├─────────────────────────────────────────────────────────────┤
│  AI extracts:                                               │
│  • Mood: Happy ☀️                                           │
│  • Topic: Gardening, Family memories                        │
│  • Story captured: "The Tulip Garden"                       │
│  • Meds: Taken ✅                                           │
├─────────────────────────────────────────────────────────────┤
│  Family sees on Dashboard:                                  │
│  "Mom had a great morning—shared a story about her garden"  │
└─────────────────────────────────────────────────────────────┘
```

### Innovative Aspects

1. **Dual-Mode Calling**: Both browser-based test calls (for demos) and real phone calls (for production)
2. **Structured Output Extraction**: VAPI assistant configured to return JSON with mood, medication status, and story content
3. **Graceful Degradation**: Realistic fallback data ensures dashboard never looks empty
4. **Client-Side Data Persistence**: Intelligent polling to capture call data without complex webhook setup
5. **Elder-First Design**: Large buttons, high contrast, simple language—designed for 80+ year old users

### How AI Enables Our Goals

| Goal | AI Technology |
|------|---------------|
| Natural conversations | GPT-4o voice model via VAPI |
| Mood detection | Sentiment analysis on transcripts |
| Memory extraction | Structured output generation |
| Story categorization | LLM-based content classification |
| Health insights | Pattern recognition across calls |

---

## 🤖 AI Use Disclosure

**Question**: Was more than 70% of the code generated by AI?

**Answer**: Approximately **60-70%** of the code was AI-assisted. Here's the breakdown:

| Component | AI Usage | Human Contribution |
|-----------|----------|-------------------|
| Project scaffolding | High | Architecture decisions |
| UI Components | High | Design system, customization |
| Voice integration | Medium | API logic, error handling |
| Database schema | Medium | Schema design, relationships |
| Business logic | Low | Core features, data flow |
| Styling/polish | High | Fine-tuning, animations |

AI tools used: GitHub Copilot, ChatGPT, Claude (for this write-up too!)

---

## 💻 Code Repository

### GitHub Link
**https://github.com/[your-username]/everly**

*(Replace with your actual repository URL)*

### Repository Structure

```
frontend/
├── app/
│   ├── api/               # API routes (calls, webhooks, elders)
│   ├── dashboard/         # Main dashboard page
│   ├── storybook/         # Memory storybook pages
│   ├── lib/               # Utilities (Supabase, VAPI clients)
│   └── types/             # TypeScript definitions
├── components/
│   ├── navigation.tsx     # Site navigation
│   ├── elder-dashboard-view.tsx  # Dashboard UI
│   ├── vapi-call-provider.tsx    # Voice call context
│   └── ui/                # shadcn/ui components
├── public/                # Static assets
└── .env.local.example     # Environment variables template
```

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/[your-username]/everly.git
cd everly/frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

### Environment Variables Required

```env
# VAPI (Voice AI)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id
VAPI_PHONE_NUMBER_ID=your_phone_number_id

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🏆 What Makes This Special

1. **Real Impact**: Addresses genuine social isolation and memory preservation needs
2. **Technical Depth**: Combines voice AI, structured extraction, and real-time web tech
3. **Beautiful UX**: Designed with seniors in mind—not despite them
4. **Hackathon-Ready**: Fully functional demo with both test and production calling

---

## 📸 Screenshots

*(Add screenshots of your dashboard, storybook, and call interface here)*

---

## 👥 Team

- **[Your Name]** – Developer & Designer
- *(Add team members as needed)*

---

## 🙏 Acknowledgments

- Thanks to [Hackathon Name] for the opportunity
- VAPI for incredible voice AI technology
- Supabase for the generous free tier
- The open-source community for Next.js and shadcn/ui

---

**Everly** – Because every story matters. 💚
