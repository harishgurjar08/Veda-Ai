# VedaAI – AI Assessment & Examination Creator

VedaAI is a production-grade full-stack web application designed for educators to draft, configure, customize, structure, and format academically rigorous assessment papers with AI assistance.

## 🛠️ Technology Stack & Architecture

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Zustand state store + Socket.io-client.
- **Backend API**: Express + TypeScript + Socket.io (WebSocket channels) + Multer.
- **Async Processing**: BullMQ + Redis + Standalone Background Worker.
- **Database**: MongoDB with Mongoose schemas.
- **AI Core**: Google Gemini API (`gemini-2.5-flash` / `gemini-3.1-flash`).
- **PDF Export Engine**: Puppeteer.

---

## ⚡ Robust Fallback Design System (Production-Ready Resilience)

To ensure the application remains highly resilient and operational in all environments:
1. **Database Fallback**: The database service (`backend/src/services/db.ts`) automatically falls back to an in-memory datastore if MongoDB is temporarily unreachable, preventing server crashes.
2. **Job Queue Fallback**: The job service (`backend/src/services/jobs.ts`) falls back to an in-process async background processing pipeline if the Redis server is offline, while still delivering real-time progress updates to the socket server.
3. **AI Fallback**: The AI generation engine (`backend/src/services/ai.ts`) falls back to a template-based question-paper generator if the Gemini API Key is missing or invalid.
4. **PDF Fallback**: The PDF export engine (`backend/src/services/pdf.ts`) falls back to a clean text-based file stream to guarantee document downloads remain available.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** 20+
- **npm** (included with Node)

### 2. Quick Local Start (Zero-Configuration Mode)

To run the whole project simultaneously in zero-configuration mode:

1. In the root directory, install all linked workspaces:
   ```bash
   npm install
   ```
2. Start all three components simultaneously in a single terminal (frontend, backend, and background worker):
   ```bash
   npm run dev
   ```
3. Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**

---

## 📐 Project Structure

```
vedaai-monorepo/
├── apps/
│   ├── web/          # Next.js 14 frontend (App Router)
│   └── worker/       # Standalone BullMQ queue worker
├── backend/          # Express API server (routes, Socket.io, fallback drivers)
├── packages/
│   └── shared/       # Shared TypeScript interfaces (Question, Assignment, Section)
├── docker-compose.yml# Container definitions for MongoDB + Redis
└── package.json      # Monorepo workspaces coordinator
```

---

## 🎨 Implemented Features & Screens
- **Dashboard Empty State**: Premium visual design representing clean empty boards with active dashboard triggers.
- **Dashboard Filled State**: Multi-column cards grid displaying assigned dates, due dates, action dropdowns (View, Delete), banner indicators, search engines, and filter elements.
- **Form Creation Layout**: Dynamic row items for question forms with customized quantity counters, file-drag uploading selectors, due date datepickers, and bottom navigation.
- **My Groups**: Manage class student registers, progression bars, grading averages, and target standards.
- **AI Teacher's Toolkit**: Custom syllabus creators, quick test drafters, academic remark builders, and grade prediction statistics.
- **My Library**: Star, favorite, preview, catalog, download, and delete saved exam templates.
- **Realistic A4 Print Out**: Beautifully designed exam sheets displaying header metadata, school branding titles, fillable underlines for name/roll-number, difficulty badges, options lists, and solutions keys.
