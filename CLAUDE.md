# Medicine Kuppiya — Claude Code Instructions

## Project Overview
**Medicine Kuppiya** is a Next.js 16 webapp — a Final MBBS clerkship study dashboard for **RUSL 13th Batch**.

Every appointment PDF from Google Drive (across 20 specialties, multiple CG groups) is redesigned into a rich, AI-enriched study note dashboard. No Drive links — actual content, restructured.

**Copyright © Udana Anjana** — always include this in footers and About page.

---

## Tech Stack
- **Next.js 16** (App Router, TypeScript) — read `node_modules/next/dist/docs/` before any Next-specific code
- **React 19** + **Tailwind CSS 4** (`@tailwindcss/postcss`)
- **Lucide React** for icons
- **Zustand** for client state
- **@anthropic-ai/sdk** for AI enrichment
- **No database** — data lives in `/data/*.json` static files, read at build time

---

## Design System (strict — do not deviate)

### Colour palette
```
--ink:      #0E2440   (primary dark navy)
--ink2:     #183453
--teal:     #0B6E6E   (primary accent)
--teal-d:   #085252
--teal-l:   #E1F0EE
--amber:    #B87A0A
--amber-l:  #FBF0D9
--coral:    #C0402A
--coral-l:  #FBE6E1
--paper:    #F8F4EE   (page background)
--paper2:   #FFFCF7   (card background)
--mute:     #5B6473
--line:     #DDD8CC   (borders)
--navy-l:   #E7ECF3
```

### Typography
- Display / headings: `Space Grotesk` — import from Google Fonts
- Body: `Inter`
- Mono / labels / tags: `IBM Plex Mono`

### Section type colours (for NoteView sections)
| Type | Background | Border/accent |
|------|-----------|---------------|
| definition | #E7ECF3 | #185FA5 |
| pathophysiology | #EDE9FB | #534AB7 |
| clinical | #FBE6E1 | #C0402A |
| investigations | #E1F0EE | #0B6E6E |
| management | #FBF0D9 | #B87A0A |
| complications | #FBE6E1 | #C0402A |
| highyield | #FBF0D9 | #E39B2E |
| examination | #E1F0EE | #085252 |
| generic | #F8F4EE | #9AA0AA |

### Navbar
- Background: `#0E2440`, bottom border: `3px solid #E39B2E`
- Brand mark: amber `M` on dark navy square

---

## Directory Structure
```
medicine-kuppiya/
├── app/
│   ├── page.tsx                    # Home — specialty hub
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── globals.css                 # Global styles + CSS vars
│   ├── about/page.tsx              # About page
│   ├── specialty/
│   │   └── [slug]/
│   │       ├── page.tsx            # Specialty listing (all topics)
│   │       └── [topic]/
│   │           └── page.tsx        # Individual topic/note page
│   └── api/
│       └── enrich/route.ts         # POST — AI enrichment endpoint
├── components/
│   ├── layout/Navbar.tsx
│   └── ui/
│       ├── SpecialtyCard.tsx       # Card on home grid
│       ├── TopicCard.tsx           # Card on specialty listing
│       └── NoteView.tsx            # Renders enriched note content
├── lib/
│   ├── specialties.ts              # SPECIALTIES array + helpers
│   └── topics.ts                   # getTopicsForSpecialty, getTopic, etc.
├── types/index.ts                  # TypeScript types
├── data/
│   ├── orthopedics.json            # Enriched topics (Phase 1 — seed)
│   ├── neurology.json              # (to generate)
│   └── [specialty].json            # One file per specialty
└── scripts/
    └── generate-data.mjs           # Data generation script
```

---

## Data Model

### `EnrichedTopic` (in `/data/[specialty].json`)
```ts
{
  id: string,            // same as slug
  slug: string,          // kebab-case topic name
  name: string,          // display name
  specialty: string,     // e.g. "Orthopedics"
  specialtySlug: string, // e.g. "orthopedics"
  sourceFiles: [{
    id: string,
    title: string,
    viewUrl: string,
    type: 'pdf' | 'audio',
    snippet?: string      // OCR text from Drive
  }],
  fileCount: number,      // total files merged (across CGs)
  sections: [{
    heading: string,
    content: string,      // markdown-ish: **bold**, - bullets
    type: SectionType
  }],
  keyPoints: string[],    // 5-8 high-yield facts
  examTips: string[],     // 3-5 viva/MCQ tips
  tags: string[],
  generatedAt?: string
}
```

---

## All 20 Specialties (with Drive folder IDs)

| Slug | Name | Drive folder ID |
|------|------|----------------|
| orthopedics | Orthopedics | 13TD4gjsPCj7Q9QuUc6yYfqqoP_wryr54 |
| neurology | Neurology | 13JTU6WkxftCURIneNQWTLQrn2VDPvSqS |
| cardiology | Cardiology | 13fcF593BTrcsdJd-V1nPoe91h53YLgDh |
| respiratory | Respiratory | 13DzTBck4gPY_d2bTrZtDfcd1SFc510pS |
| nephrology | Nephrology | 13Tkgsv1fiZrtb_WGDab8A-M-vkd9gXb4 |
| dermatology | Dermatology | 13VaLujx-sgIJzpgTbvdye2-NzylBcwKv |
| ent | ENT | 13dqU2BGYY4I42MBxydpgFQMmBdvxQCYs |
| ophthalmology | Ophthalmology | 1-chLQcgaxCPSo0poSumcq5FSaJYvd_84 |
| urology | Urology | 13O7zk8q_jKak3mCYfOl4ytJ_FZRR8fdy |
| oncology | Oncology | 1-mbdXMhEeaJRCZPaIgW9-AOvM_ACWb95 |
| std | STD | 1-Y1dSLiL_5SmzgQw3s140lnPqJYA5Iov |
| anaesthesia | Anaesthesia | 1-A6N1tdZXx1R9fVC6dHrBd7DuxqLQazx |
| radiology | Radiology | 1-KOaIhbwkD5MmaXRU2bZgFWP-3QYF8Di |
| clinical-pathology | Clinical Pathology | 1RD7W1Jsf7c_5GP3YHZ6yguY-1PO1Wd1J |
| neurosurgery | Neurosurgery | 10nCBqv6Q2m3--JhlQ7JGAgZLLqL3Apb5 |
| family-medicine | Family Medicine | 1REkspoMm_LUXiIOuibpTm_gmksXYEuOM |
| forensic-medicine | Forensic Medicine | 1LTpYJ_BDRndSTXxcFU6CsZsAiH0gJTA3 |
| rheumatology | Rheumatology | 1-Nyw_7bk4Rxb1VHnLex2zpo19cUUeLtn |

Root Drive folder: `13B_l2XJv0VAqHOuoh7xw15YX1SweBrw_`

---

## Data Generation Workflow

### Step 1 — Fetch Drive file list
Use the Google Drive MCP or API to list ALL PDFs recursively in each specialty folder. The structure is:
```
Specialty folder/
  └── Class notes and recordings/
        └── CG 4/ CG 5/ CG 6/ CG 7/
              └── *.pdf   ← appointment notes
```
Also check direct files in the specialty folder root (e.g. Clinical Pathology has PDFs directly).

### Step 2 — Get content snippets
Drive `search_files` with `excludeContentSnippets: false` returns Drive's OCR text snippets — use these as source content. Files are CamScanner scans; the snippet is the only text we can extract without additional OCR.

### Step 3 — Merge across CGs
Use `similarity()` in `lib/topics.ts` to detect same topic across CG4/5/6/7. A Jaccard similarity > 0.6 on word sets = same topic. Merge their files and snippets.

### Step 4 — Enrich with Claude
POST to `/api/enrich` or use `@anthropic-ai/sdk` directly in the script. The AI generates structured sections, keyPoints, examTips, and tags from the raw snippet content.

### Step 5 — Save to `/data/[specialty].json`
One file per specialty. The Next.js app reads these at build time via `lib/topics.ts`.

### Running the generation script
```bash
ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-data.mjs
```
The script already has Orthopedics and Neurology data hardcoded. For other specialties, add their file lists (with snippets) to the script.

---

## Key Implementation Notes

### `generateStaticParams` is required
Both `app/specialty/[slug]/page.tsx` and `app/specialty/[slug]/[topic]/page.tsx` need `generateStaticParams()` so Next.js can pre-render them. Already implemented.

### Server components read data directly
`lib/topics.ts` uses `fs.readFileSync` — only works in server components / API routes, never in client components.

### `params` is a Promise in Next 16
```ts
// CORRECT
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
```

### Tailwind 4 config
No `tailwind.config.ts` — uses `@tailwindcss/postcss` in `postcss.config.mjs`. Custom utilities go in `globals.css` using CSS variables.

---

## What's Done (Phase 1)
- [x] Next.js 16 app scaffolded
- [x] All routes: `/`, `/about`, `/specialty/[slug]`, `/specialty/[slug]/[topic]`
- [x] Navbar, SpecialtyCard, TopicCard, NoteView components
- [x] All 18 specialties defined in `lib/specialties.ts`
- [x] Data model types in `types/index.ts`
- [x] `lib/topics.ts` — file-based data loading
- [x] `/api/enrich` — AI enrichment endpoint
- [x] `scripts/generate-data.mjs` — batch generation script
- [x] About page with copyright, roadmap, links
- [x] Design system (colours, fonts, section types)

## What's Next (for Claude Code to build)
- [ ] **Run `generate-data.mjs`** to populate `/data/orthopedics.json` (set `ANTHROPIC_API_KEY`)
- [ ] **Fetch remaining specialty PDFs** from Drive using the MCP, add to generate script
- [ ] **Generate all 18 specialty JSON files**
- [ ] **Search** — full-text search across all topics (client-side with Fuse.js or server action)
- [ ] **Progress tracker** — mark topics as read (localStorage via Zustand persist)
- [ ] **MCQ generator** — per-topic, calls `/api/enrich` with MCQ prompt
- [ ] **Deployment** — Vercel, add `ANTHROPIC_API_KEY` env var

---

## Google Drive MCP
The Google Drive MCP is available at `https://drivemcp.googleapis.com/mcp/v1`.
Use `search_files` tool with `excludeContentSnippets: false` to get OCR text.
Query format: `parentId = 'FOLDER_ID'`

To recurse: first get all subfolders, then get files in each.

---

## Copyright & Attribution
- Dashboard design & AI enrichment: **© Udana Anjana**
- Note PDFs: © their respective authors (RUSL 13th Batch members)
- All footers must include: `© 2024–2025 Udana Anjana · Medicine Kuppiya · RUSL 13th Batch`

