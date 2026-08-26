# SkillBridge — AI Skill Gap Detection & Capacity Building Platform

An AI-enabled platform that identifies competency gaps and recommends personalized training through iGOT Karmayogi integration for capacity building in India's Official Statistical System.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Vite 8**, and **Express 5**. UI powered by the **Stitch Emerald Design System** with glassmorphism, Material Symbols icons, and M3-inspired tokens.

---

## Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **API keys** (optional, for AI features): Copy `.env.example` → `.env` and fill in your keys

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/SkillBridge.git
cd SkillBridge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
```

> The app runs without API keys — AI tutor and assessment features will return mock/placeholder responses.

### 4. Start the development server

```bash
npm run dev
```

This runs **both** the backend (Express) and frontend (Vite) concurrently:

| Service | URL |
|---------|-----|
| Frontend (Vite) | `http://localhost:5173` |
| Backend (Express) | `http://localhost:3000` |

### 5. Open in browser

Navigate to `http://localhost:5173`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend + frontend in development mode (with hot reload) |
| `npm run dev:client` | Start only the Vite frontend dev server |
| `npm run dev:server` | Start only the Express backend server (with file watching) |
| `npm run build` | Compile TypeScript and build production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint linter |
| `npm run server` | Run the Express server once (no file watching) |

---

## Project Structure

```
SkillBridge/
├── index.html                  # Entry HTML (Inter + Material Symbols fonts)
├── vite.config.ts              # Vite configuration
├── package.json                # Dependencies and scripts
├── server/                     # Express backend (API routes)
│   └── index.ts                # Server entry point
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Router and route definitions
│   ├── index.css               # Tailwind v4 @theme tokens + glass utilities
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Button, Card, Badge, etc.)
│   │   ├── layout/             # Sidebar layouts (Student, Faculty, Recruiter, Landing)
│   │   ├── charts/             # Recharts components (Radar, Line, Heatmap)
│   │   └── AITutorChatbox.tsx  # AI Tutor floating chat panel
│   ├── pages/
│   │   ├── Landing.tsx         # Public landing page
│   │   ├── auth/               # Login, Signup, ForgotPassword
│   │   ├── onboarding/         # Role selection onboarding
│   │   ├── student/            # Student dashboard, skills, learning, quizzes, etc.
│   │   ├── faculty/            # Faculty dashboard, interventions, reports
│   │   ├── trainer/            # Material studio, question bank, quiz builder
│   │   └── recruiter/          # Recruiter dashboard, candidates, interviews
│   ├── context/                # React Context (AppContext, RecruiterContext)
│   ├── data/                   # Mock data
│   ├── types/                  # TypeScript type definitions
│   └── lib/                    # Utility functions (cn, getStatusColor, etc.)
└── dist/                       # Production build output
```

---

## Design System

The UI uses the **Stitch Emerald** design system:

| Token | Value |
|-------|-------|
| Primary | `#006948` (Emerald) |
| Secondary | `#5b598c` (Indigo) |
| Tertiary | `#00685f` (Teal) |
| Surface | `#f8f9ff` |
| On-Surface | `#0b1c30` |
| Icons | Material Symbols Outlined |
| Font | Inter (400–800) |
| Effects | Glassmorphism (`.glass-card`, `.glass-panel`), gradient buttons/text |

---

## Roles

The platform supports three roles:

1. **Student (Official)** — Take competency assessments, view skill gaps, follow personalized learning paths, earn verified skills
2. **Faculty (Trainer)** — Monitor department competency, create interventions, manage learning materials and assessments
3. **Recruiter** — Post jobs, match candidates by competency, manage shortlists and interviews

---

## Tech Stack

- **Frontend**: React 19, React Router 7, Tailwind CSS 4, Recharts, react-markdown
- **Backend**: Express 5, TypeScript, tsx
- **Build**: Vite 8, TypeScript 6
- **Linting**: Oxlint
- **Styling**: Tailwind CSS v4 (`@theme` directive), Material Symbols, glassmorphism utilities

---

## License

Internal project — Ministry of Statistics & Programme Implementation, Government of India.
