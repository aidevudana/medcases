import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import TopicCard from '@/components/ui/TopicCard';
import { getSpecialtyBySlug } from '@/lib/specialties';
import { getTopicsForSpecialty } from '@/lib/topics';
import { SPECIALTIES } from '@/lib/specialties';
import { ChevronRight, Search, Sparkles, Clock } from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return SPECIALTIES.map(s => ({ slug: s.slug }));
}

export default async function SpecialtyPage({ params }: Props) {
  const { slug } = await params;
  const specialty = getSpecialtyBySlug(slug);
  if (!specialty) notFound();

  const topics = await getTopicsForSpecialty(slug);

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ fontFamily: 'IBM Plex Mono', color: '#8A94A4' }}>
          <Link href="/" className="hover:underline" style={{ color: '#0B6E6E' }}>Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0E2440' }}>{specialty.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <div className="text-4xl mb-2" role="img" aria-label={specialty.name}>{specialty.icon}</div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
              {specialty.name}
            </h1>
            <p className="text-sm" style={{ color: '#5B6473' }}>
              {specialty.phase} · RUSL 13th Batch ·{' '}
              <span style={{ color: specialty.color, fontWeight: 600 }}>{topics.length} appointment topics</span>
              {' '}merged across all CGs
            </p>
          </div>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: '#FFFCF7', border: '1px solid #DDD8CC' }}>
            <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: '#DDD8CC' }} />
            <p className="font-semibold mb-1" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
              Topics coming soon
            </p>
            <p className="text-sm" style={{ color: '#8A94A4' }}>
              We're processing the PDF notes for {specialty.name}. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4" style={{ color: specialty.color }} />
              <span className="text-sm font-medium" style={{ color: '#0E2440', fontFamily: 'Space Grotesk' }}>
                All Appointment Topics
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topics.map(t => (
                <TopicCard key={t.id} topic={t} color={specialty.color} />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: '#DDD8CC' }}>
          <p className="text-xs" style={{ color: '#8A94A4', fontFamily: 'IBM Plex Mono' }}>
            © 2024–2025 Udana Anjana · Medicine Kuppiya
          </p>
        </div>
      </main>
    </div>
  );
}
