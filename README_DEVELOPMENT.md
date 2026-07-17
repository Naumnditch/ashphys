# AshPhys Platform - Development Guide

**Project:** Full-featured IGCSE Physics learning platform for Al-Jazari International School, Istanbul

**Version:** 1.0 (In Active Development)

**Launch Target:** August 24, 2026

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- Git

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Naumnditch/ashphys.git
cd ashphys

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Fill in your Supabase credentials in .env.local
# DATABASE_URL=postgresql://...
# JWT_SECRET=your-secret-key

# Initialize database (create tables)
npm run db:init

# Seed initial data
npm run db:seed

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 📚 Project Structure

```
ashphys/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── courses/             # Course content endpoints
│   │   ├── simulations/         # Simulation data endpoints
│   │   ├── qa/                  # Q&A system endpoints
│   │   └── teacher/             # Teacher dashboard endpoints
│   ├── auth/                     # Auth pages (login, signup)
│   ├── dashboard/               # Student dashboard
│   ├── teacher/                 # Teacher panel
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                   # React components
│   ├── auth/                    # Auth components
│   ├── course/                  # Course delivery components
│   ├── simulations/             # Interactive simulations
│   ├── quiz/                    # Quiz player components
│   ├── qa/                      # Q&A components
│   └── dashboard/               # Dashboard components
├── lib/                         # Shared utilities
│   ├── db/                      # Database client
│   ├── auth/                    # Authentication logic
│   └── utils/                   # Helper functions
├── database/                    # Database schema & migrations
│   └── schema.sql              # PostgreSQL DDL
├── types/                       # TypeScript definitions
├── public/                      # Static assets
├── styles/                      # Global styles
├── middleware.ts               # Next.js middleware
├── .env.example               # Environment template
└── package.json               # Dependencies
```

---

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Create new project (Select Turkey region for latency)
4. Copy **Project URL** and **anon key**

### 2. Initialize Database

```bash
# Get your DATABASE_URL from Supabase project settings
# Format: postgresql://postgres:password@db.supabase.co:5432/postgres

# Create tables
psql $DATABASE_URL < database/schema.sql

# Or use the Supabase SQL editor to run schema.sql
```

### 3. Verify Setup

```bash
# Test connection
npm run db:test
```

---

## 🔐 Authentication Flow

### Registration (Signup)

```
POST /api/auth/signup
{
  "email": "student@example.com",
  "password": "securepass",
  "firstName": "Ahmed",
  "lastName": "Hassan",
  "sectionId": "section-uuid"
}
→ { userId, token, role }
```

### Login

```
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "securepass"
}
→ { userId, token, role }
```

### Token Usage

Include JWT token in all authenticated requests:

```
Authorization: Bearer <token>
```

---

## 📖 Course Content Structure

### Hierarchy

```
Course (e.g., "Cambridge IGCSE Physics 0625")
 └── Chapter 1 (2-week block, e.g., "Physical Quantities & Measurement")
      ├── Topic 1.1 (e.g., "Measurement Techniques")
      │   ├── Lesson: Video
      │   ├── Lesson: Article
      │   └── Lesson: Simulation
      ├── Topic 1.2
      ├── Problems (20+ per chapter)
      ├── Simulation (interactive)
      └── Quiz (checkpoint)
```

### Adding Content

#### 1. Add Video Lesson

```typescript
// In database, or via admin API
INSERT INTO lessons (
  topic_id,
  lesson_type,
  title,
  content_url,
  duration_minutes
) VALUES (
  'topic-uuid',
  'video',
  'Introduction to Measurement',
  'https://www.youtube.com/watch?v=...',
  8
);
```

#### 2. Add Problem

```typescript
INSERT INTO problems (
  chapter_id,
  question_text,
  difficulty_level,
  answer_type,
  answer_correct,
  explanation
) VALUES (
  'chapter-uuid',
  'Calculate the average speed...',
  1,  // difficulty: 1=easy, 2=medium, 3=hard
  'numeric',
  '25',
  'Speed = distance / time = 100m / 4s = 25 m/s'
);
```

#### 3. Create Quiz

```typescript
INSERT INTO quizzes (
  chapter_id,
  title,
  quiz_type,
  passing_score
) VALUES (
  'chapter-uuid',
  'Chapter 1 Checkpoint Quiz',
  'checkpoint',
  70
);
```

---

## 🎮 Simulation Development

### Creating a New Simulation

1. **Create React Component** in `components/simulations/`

```typescript
// components/simulations/DistanceTimeGraphSimulator.tsx
import React, { useState } from 'react';
import Plot from 'react-plotly.js';

export function DistanceTimeGraphSimulator() {
  const [points, setPoints] = useState<[number, number][]>([]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Calculate coordinates, add to points
  };

  return (
    <div>
      <canvas 
        onClick={handleCanvasClick}
        width={600}
        height={400}
      />
      <Plot
        data={[{
          x: points.map(p => p[0]),
          y: points.map(p => p[1]),
          type: 'scatter',
          mode: 'lines+markers'
        }]}
        layout={{ title: 'Distance-Time Graph' }}
      />
    </div>
  );
}
```

2. **Register in Database**

```typescript
INSERT INTO simulations (
  chapter_id,
  title,
  sim_type,
  url_path,
  learning_objectives
) VALUES (
  'chapter-1-uuid',
  'Distance-Time Graph Builder',
  'graph_builder',
  '/simulations/distance-time-graph',
  '["Plot distance-time graphs", "Calculate speed from gradient"]'
);
```

3. **Create Route Handler**

```typescript
// app/simulations/distance-time-graph/page.tsx
import { DistanceTimeGraphSimulator } from '@/components/simulations/DistanceTimeGraphSimulator';

export default function SimulationPage() {
  return <DistanceTimeGraphSimulator />;
}
```

---

## 🎯 API Endpoints (MVP)

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Courses
- `GET /api/courses/igcse-0625/chapters` - List all chapters
- `GET /api/courses/igcse-0625/chapters/[chapterId]` - Get chapter details
- `GET /api/courses/igcse-0625/chapters/[chapterId]/progress` - Get student progress

### Problems & Quizzes
- `GET /api/courses/igcse-0625/chapters/[chapterId]/problems` - Get problem list
- `POST /api/courses/igcse-0625/chapters/[chapterId]/problems/[problemId]/submit` - Submit answer
- `GET /api/courses/igcse-0625/chapters/[chapterId]/quiz/[quizId]` - Get quiz
- `POST /api/courses/igcse-0625/chapters/[chapterId]/quiz/[quizId]/submit` - Submit quiz

### Teacher Dashboard
- `GET /api/teacher/sections/[sectionId]/dashboard` - Class overview
- `GET /api/teacher/sections/[sectionId]/problem-analytics/[problemId]` - Problem stats
- `GET /api/teacher/students/[studentId]/progress` - Student progress details

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Authentication

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📝 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/add-distance-time-simulator
```

### 2. Make Changes

- Write code
- Test locally (`npm run dev`)
- Run linter (`npm run lint`)

### 3. Commit & Push

```bash
git add .
git commit -m "feat: Add distance-time graph simulator"
git push origin feature/add-distance-time-simulator
```

### 4. Create Pull Request

- Go to GitHub
- Create PR from feature branch → develop
- Request review
- Merge after approval

### 5. Deploy to Staging

```bash
git checkout develop
git pull origin develop
# Vercel auto-deploys to preview URL
```

### 6. Deploy to Production

```bash
git checkout main
git merge develop
git push origin main
# Vercel auto-deploys to ashphys.vercel.app
```

---

## 🚀 Deployment

### GitHub Branches

- `main` → Production (ashphys.vercel.app)
- `develop` → Staging (preview deployment)
- `feature/*` → Local development

### Vercel Setup

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Auto-deploys on push to main/develop

### Environment Variables (Vercel)

```
DATABASE_URL=...
JWT_SECRET=...
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
YOUTUBE_API_KEY=...
```

---

## 📊 Monitoring & Debugging

### Logs

```bash
# View Vercel logs
vercel logs --source=lambda

# View local logs
npm run dev  # Check console output
```

### Database Debugging

```bash
# Connect to Supabase via psql
psql $DATABASE_URL

# Run queries
SELECT * FROM chapters LIMIT 10;
SELECT * FROM users WHERE email = 'test@example.com';
```

### Performance

```bash
# Lighthouse audit
npm run audit
```

---

## 🐛 Common Issues & Solutions

### Issue: "DATABASE_URL is not set"

**Solution:** Create `.env.local` and add Supabase connection string

### Issue: "Port 3000 already in use"

**Solution:** `lsof -ti:3000 | xargs kill -9` or change port: `npm run dev -- -p 3001`

### Issue: Database migration fails

**Solution:** Check SQL syntax, ensure Supabase instance is accessible

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org)

---

## ✅ Development Checklist (August 24 Deadline)

- [ ] Auth system (signup/login) working
- [ ] Database schema deployed
- [ ] Chapter 1–2 content scaffolded
- [ ] 2 simulations (distance-time, speed-time) playable
- [ ] Problem bank (30+ problems) grading
- [ ] Quiz system (auto-graded)
- [ ] Student progress tracking
- [ ] Teacher dashboard showing class analytics
- [ ] Q&A system (thread + replies)
- [ ] Full responsive design
- [ ] Performance optimized (< 2s page load)
- [ ] Security review (auth tokens, SQL injection prevention)
- [ ] Beta testing with Section A
- [ ] Production deployment to ashphys.vercel.app

---

## 📞 Support

For issues, questions, or feature requests:
1. Check GitHub Issues
2. Create new issue with detailed description
3. Tag with appropriate label (bug, feature, documentation)

---

**Last Updated:** July 18, 2026  
**Maintained By:** ashphys-automation  
**Status:** 🟡 In Active Development (Sprint 1)
