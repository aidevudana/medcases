# Medicine Kuppiya — Short Appointments Dashboard

> Final MBBS clerkship study notes · RUSL 13th Batch  
> **© 2024–2025 Udana Anjana** — All rights reserved

A Next.js 16 webapp that redesigns every clerkship appointment PDF from Google Drive into rich, AI-enriched study dashboards. No PDF links — actual structured content.

## Stack
- **Next.js 16** (App Router, TypeScript)
- **React 19** + **Tailwind CSS 4**
- **Claude AI** (Anthropic) for note enrichment
- **Google Drive MCP** for PDF content extraction
- Static JSON data files — no database

## Getting started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Generate enriched data (run once, or when new PDFs are added)
ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-data.mjs

# Start dev server
npm run dev
```

## Generating data for new specialties

1. Use Google Drive MCP to list PDFs in the specialty folder
2. Add file list (with snippets) to `scripts/generate-data.mjs`
3. Call `generateSpecialtyData('slug', 'Name', files)`
4. The script creates `/data/[slug].json`
5. Rebuild: `npm run build`

## Project structure

See **CLAUDE.md** for full architecture docs, design system, data model, and all Drive folder IDs.

## Routes
- `/` — Home hub, all 18 specialties
- `/specialty/[slug]` — All appointment topics for a specialty
- `/specialty/[slug]/[topic]` — Individual enriched study note
- `/about` — About page, creator info, roadmap
- `/api/enrich` — POST endpoint for on-demand AI enrichment

## Deployment (Vercel)
1. Push to GitHub
2. Import in Vercel
3. Add `ANTHROPIC_API_KEY` as environment variable
4. Deploy — all pages are statically pre-rendered
