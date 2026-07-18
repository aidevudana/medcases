import Navbar from '@/components/layout/Navbar';
import SpecialtyCard from '@/components/ui/SpecialtyCard';
import { SPECIALTIES } from '@/lib/specialties';
import { getTopicsForSpecialty } from '@/lib/topics';
import { Rocket, BookOpen, Users, Sparkles } from 'lucide-react';
import fs from 'fs';
import path from 'path';

async function getSpecialtyStats() {
  const stats: Record<string, number> = {};
  for (const s of SPECIALTIES) {
    const topics = await getTopicsForSpecialty(s.slug);
    stats[s.slug] = topics.length;
  }
  return stats;
}

function hasData(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'data', `${slug}.json`));
}

export default async function Home() {
  const stats = await getSpecialtyStats();
  const totalTopics = Object.values(stats).reduce((a, b) => a + b, 0);
  const loadedSpecialties = Object.values(stats).filter(n => n > 0).length;

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
            style={{ background: '#E1F0EE', color: '#085252', border: '1px solid #0B6E6E33', fontFamily: 'IBM Plex Mono' }}>
            <Rocket className="w-3 h-3" /> Phase 1 · Clerkship Hub
          </div>
          <h1 className="text-4xl font-bold mb-3 leading-tight"
            style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
            Short Appointments<br />
            <span style={{ color: '#0B6E6E' }}>Dashboard</span>
          </h1>
          <p className="text-base max-w-xl" style={{ color: '#5B6473' }}>
            All Final MBBS clerkship appointment notes — redesigned, AI-enriched, and organised by topic across all CGs.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {([
            { icon: BookOpen, value: SPECIALTIES.length, label: 'Specialties' },
            { icon: Sparkles, value: totalTopics, label: 'Topics enriched' },
            { icon: Users, value: loadedSpecialties, label: 'Loaded' },
            { icon: Rocket, value: '13th', label: 'Batch · RUSL' },
          ] as const).map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: '#FFFCF7', border: '1px solid #DDD8CC' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: '#E1F0EE' }}>
                <Icon className="w-4 h-4" style={{ color: '#0B6E6E' }} />
              </div>
              <div>
                <div className="text-xl font-bold leading-none" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#7A8494' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>All Specialties</h2>
          <span className="text-xs" style={{ color: '#8A94A4', fontFamily: 'IBM Plex Mono' }}>Click to view appointments</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {SPECIALTIES.map(s => (
            <SpecialtyCard key={s.id} specialty={s} topicCount={stats[s.slug] ?? 0} hasData={hasData(s.slug)} />
          ))}
        </div>
        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: '#DDD8CC' }}>
          <p className="text-xs" style={{ color: '#8A94A4', fontFamily: 'IBM Plex Mono' }}>
            © 2024–2025 Udana Anjana · Medicine Kuppiya · RUSL 13th Batch · All rights reserved
          </p>
        </div>
      </main>
    </div>
  );
}
