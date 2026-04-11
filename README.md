# CourseGen - AI-Powered Course Generator

An intelligent web application that allows users to generate comprehensive, structured courses on any topic using a simple text prompt. The system leverages Large Language Models (LLMs) to construct course syllabuses and write educational content, while autonomously curating relevant YouTube videos to enrich the learning experience.

---

## 📸 Screenshots

<div align="center">
  <img src="public/homepage.png" alt="CourseGen Homepage" width="80%"/>
  <br/>
  <em>Homepage - Describe what you want to learn</em>
</div>
<br/>
<div align="center">
  <img src="public/dashboard.png" alt="CourseGen Dashboard" width="80%"/>
  <br/>
  <em>Dashboard - Manage your generated courses</em>
</div>
<br/>
<div align="center">
  <img src="public/coursepage.png" alt="CourseGen Course Page" width="80%"/>
  <br/>
  <em>Course Page - Rich markdown content and curated YouTube videos</em>
</div>

---

## 🚀 Features

- **Prompt-to-Course Generation:** Simply describe what you want to learn, and the AI builds a structured course skeleton (Units and Chapters).
- **Automated Content Creation:** Background workers automatically write detailed, educational markdown content for each generated chapter.
- **Video Curation:** Autonomously searches and embeds the most relevant YouTube videos for each specific lesson.
- **Modern UI/UX:** Built with Next.js App Router, Tailwind CSS, and Shadcn UI for a fast, responsive, and beautiful user experience.
- **Reliable Background Processing:** Uses Inngest to manage long-running AI content generation and API calling tasks reliably.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Shadcn UI, Embla Carousel
- **Backend:** Next.js Server Actions & API Routes, Node.js
- **Database Architecture:** PostgreSQL, Drizzle ORM
- **Authentication:** Better Auth
- **AI & Processing:** Vercel AI SDK, Groq SDK, Langchain
- **Background Jobs:** Inngest
- **External Apis:** YouTube Data API v3 (`googleapis`)

---

## 🏗️ Architecture

Below is the high-level system architecture of CourseGen:

```mermaid
graph TD
    Client[Client Browser] <-->|Next.js App Router| NextJS[Next.js Server]
    
    subgraph Backend Core
        NextJS <-->|Auth| BetterAuth[Better-Auth]
        NextJS <-->|Database Access| Drizzle[Drizzle ORM]
        NextJS --->|Trigger Jobs| Inngest[Inngest Background Workers]
    end
    
    subgraph Data & Storage
        Drizzle <--> Postgres[(PostgreSQL Database)]
    end
    
    subgraph External Services
        Inngest <-->|Generate Content| AI[Groq / OpenAI]
        Inngest <-->|Search Videos| YouTube[YouTube API]
    end
```

---

## 🔄 Core Workflow (Sequence Diagram)

When a user submits a prompt, the application performs a sequence of real-time and background tasks to assemble the course:

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend (Next.js)
    participant API as API Routes
    participant Inngest as Inngest Worker
    participant AI as AI Model (Groq)
    participant YT as YouTube API
    participant DB as Postgres DB

    User->>Frontend: Enter Prompt & Click "Generate"
    Frontend->>API: POST /api/course/create
    API->>AI: Generate Course Skeleton (Units/Chapters)
    AI-->>API: Course Structure (JSON)
    API->>DB: Save Course, Units, and Chapters (Skeleton)
    API->>Inngest: Queue Job: Generate Chapter Contents
    API-->>Frontend: Return Course ID
    Frontend-->>User: Redirect to Course Dashboard

    loop Triggered for each chapter in background
        Inngest->>AI: Request Chapter Educational Text
        AI-->>Inngest: Markdown Content
        Inngest->>YT: Search for highly relevant video
        YT-->>Inngest: Video ID & Metadata
        Inngest->>DB: Update Chapter details with Content & Video
    end
```

---

## 📁 Directory Structure

```text
coursegen/
├── app/                  # Next.js App router pages, layouts, and API routes
├── components/           # Reusable UI components (Shadcn, custom UI)
├── hooks/                # Custom React hooks for data fetching and state
├── lib/                  # Utility functions, API clients, schema setup
├── public/               # Static assets (images, fonts, etc.)
├── drizzle.config.ts     # Drizzle ORM configuration for DB migrations
├── env.ts                # Environment variable validation
├── next.config.ts        # Next.js configuration settings
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation (You are here!)
```

---

## 💻 Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database (Local, Neon, or Supabase)
- API Keys: Groq, YouTube Data API

### Local Installation

1. **Clone the repository and install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and populate it according to `env.ts` requirements:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/coursegen

   # Better Auth
   BETTER_AUTH_SECRET=your_auth_secret
   BETTER_AUTH_URL=http://localhost:3000

   # Google OAuth (Better Auth)
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=

   # AI integration
   GROQ_API_KEY=your_groq_api_key
   GOOGLE_API_KEY=
   PEXELS_API_KEY

   # Security & App Configuration
   ARCJET_KEY=
   NEXT_PUBLIC_APP_URL=

   # Stripe
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_WEBHOOK_SECRET= 
   
   ```

3. **Initialize the Database**
   Run Drizzle migrations to set up the Postgres schema.
   ```bash
   npx drizzle-kit push
   ```

4. **Start the Development Servers**
   You will need to run both the Next.js development server and the Inngest local development server.
   
   *Terminal 1 (Next.js):*
   ```bash
   npm run dev
   ```

   *Terminal 2 (Inngest Worker):*
   ```bash
   npm run inngest:dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to start generating courses!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
