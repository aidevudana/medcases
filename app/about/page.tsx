import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { ExternalLink, Link2, X, Globe, Code, Camera, Stethoscope, Rocket, AlertCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Hero */}
        <div className="rounded-2xl p-8 mb-6 text-white"
          style={{ background: '#0E2440', borderBottom: '4px solid #E39B2E' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#132C55', border: '1px solid #1E4278' }}>
            <span className="text-3xl font-bold" style={{ color: '#E39B2E', fontFamily: 'Space Grotesk' }}>M</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            Medicine Kuppiya
          </h1>
          <p className="text-base mb-4" style={{ color: '#9AB0CC' }}>
            Short Appointments Dashboard · RUSL 13th Batch
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#C5D3E4' }}>
            A shared study platform for Final MBBS clerkship appointments. All PDF notes from every CG group
            across 20 specialties are redesigned, AI-enriched, and presented as structured study dashboards —
            so you can focus on learning, not file hunting.
          </p>
        </div>

        {/* Creator */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: '#FFFCF7', border: '1px solid #DDD8CC' }}>
          <h2 className="font-bold text-xl mb-4" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
            Creator
          </h2>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl font-bold"
              style={{ background: '#0E2440', color: '#E39B2E', fontFamily: 'Space Grotesk' }}>
              UA
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
                Udana Anjana
              </h3>
              <p className="text-sm mb-1" style={{ color: '#5B6473' }}>
                Final year MBBS · Faculty of Medicine & Allied Sciences, Rajarata University of Sri Lanka
              </p>
              <p className="text-sm" style={{ color: '#5B6473' }}>
                Lead Photographer · Studio Dark Arts · Developer & Designer
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { icon: Stethoscope, label: 'RUSL FMAS', note: 'Final MBBS' },
              { icon: Camera, label: 'Studio Dark Arts', note: 'Lead Photographer' },
              { icon: Code, label: 'Developer', note: 'Apps, Web, AI' },
            ].map(({ icon: Icon, label, note }) => (
              <div key={label} className="rounded-lg p-3 flex items-center gap-2"
                style={{ background: '#F3F0E8', border: '1px solid #DDD8CC' }}>
                <Icon className="w-4 h-4 shrink-0" style={{ color: '#0B6E6E' }} />
                <div>
                  <div className="text-xs font-semibold" style={{ color: '#0E2440' }}>{label}</div>
                  <div className="text-xs" style={{ color: '#8A94A4' }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: 'https://aidevudana.github.io/udanaanjana', label: 'Portfolio', icon: Globe },
              { href: 'https://twitter.com/UdanaAnjana', label: '@UdanaAnjana', icon: X },
              { href: 'https://linkedin.com/in/udanaanjana', label: 'LinkedIn', icon: Link2 },
            ].map(({ href, label, icon: Icon }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{ background: '#E1F0EE', color: '#085252', border: '1px solid #0B6E6E33', fontFamily: 'IBM Plex Mono' }}>
                <Icon className="w-3 h-3" /> {label} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: '#FFFCF7', border: '1px solid #DDD8CC' }}>
          <h2 className="font-bold text-xl mb-4" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
            How it works
          </h2>
          <div className="space-y-3">
            {[
              { step: '01', title: 'Collect', desc: 'All PDF notes uploaded to Google Drive by batch members across CG groups are gathered for each specialty.' },
              { step: '02', title: 'Merge', desc: 'Similar notes on the same topic across CG 4, 5, 6, 7 are identified and merged into one unified appointment.' },
              { step: '03', title: 'Enrich', desc: 'Each topic is passed to Claude AI with the raw note content. It produces structured sections, key points, and exam tips.' },
              { step: '04', title: 'Publish', desc: 'The enriched notes are baked into the Next.js webapp as static pages — fast, offline-capable, and no login needed.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: '#0E2440', color: '#E39B2E', fontFamily: 'IBM Plex Mono' }}>
                  {step}
                </div>
                <div>
                  <div className="font-semibold text-sm mb-0.5" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>{title}</div>
                  <div className="text-sm" style={{ color: '#5B6473' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: '#FFFCF7', border: '1px solid #DDD8CC' }}>
          <h2 className="font-bold text-xl mb-4" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
            Roadmap
          </h2>
          {[
            { phase: 'Phase 1', label: 'Live now', items: ['Home hub with all 20 specialties', 'Orthopedics & Neurology enriched', 'Next/Prev navigation', 'About page'], done: true },
            { phase: 'Phase 2', label: 'Next', items: ['All 20 specialties enriched', 'Full-text search across topics', 'Progress tracker (mark as done)', 'MCQ generator per topic'], done: false },
            { phase: 'Phase 3', label: 'Planned', items: ['Mobile app (React Native)', 'Offline mode with service workers', 'Collaborative note editing', 'Audio player for recordings'], done: false },
          ].map(({ phase, label, items, done }) => (
            <div key={phase} className="mb-4 last:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: done ? '#E1F0EE' : '#F3F0E8', color: done ? '#085252' : '#8A94A4', fontFamily: 'IBM Plex Mono' }}>
                  <Rocket className="w-2.5 h-2.5" /> {phase} · {label}
                </div>
              </div>
              <ul className="space-y-1">
                {items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#5B6473' }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: done ? '#0B6E6E' : '#DDD8CC' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl p-5 mb-6 flex gap-3"
          style={{ background: '#FBF0D9', border: '1px solid #E39B2E55' }}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#B87A0A' }} />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#7A500A' }}>Academic use only</p>
            <p className="text-sm" style={{ color: '#7A500A' }}>
              AI-enriched notes are for revision only. Always verify against official textbooks, departmental guidelines,
              and your clinical supervisors before any patient care decision.
              Note PDFs are shared by batch members and © their respective authors.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t" style={{ borderColor: '#DDD8CC' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#8A94A4', fontFamily: 'IBM Plex Mono' }}>
            © 2024–2025 Udana Anjana. All rights reserved.<br />
            Medicine Kuppiya · Dashboard design & AI enrichment · RUSL 13th Batch<br />
            Built with Next.js · Claude AI · Studio Dark Arts
          </p>
        </div>
      </main>
    </div>
  );
}
