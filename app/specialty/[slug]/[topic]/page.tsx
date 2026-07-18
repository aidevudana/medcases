import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import NoteView from '@/components/ui/NoteView';
import { getSpecialtyBySlug } from '@/lib/specialties';
import { getTopicsForSpecialty, getTopic } from '@/lib/topics';
import { SPECIALTIES } from '@/lib/specialties';
import { ChevronRight, FileText, Mic } from 'lucide-react';

interface Props { params: Promise<{ slug: string; topic: string }> }

export async function generateStaticParams() {
  const params: { slug: string; topic: string }[] = [];
  for (const s of SPECIALTIES) {
    const topics = await getTopicsForSpecialty(s.slug);
    for (const t of topics) {
      params.push({ slug: s.slug, topic: t.slug });
    }
  }
  return params;
}

export default async function TopicPage({ params }: Props) {
  const { slug, topic: topicSlug } = await params;
  const specialty = getSpecialtyBySlug(slug);
  if (!specialty) notFound();

  const topic = await getTopic(slug, topicSlug);
  if (!topic) notFound();

  const allTopics = await getTopicsForSpecialty(slug);
  const idx = allTopics.findIndex(t => t.slug === topicSlug);
  const prev = idx > 0 ? allTopics[idx - 1] : null;
  const next = idx < allTopics.length - 1 ? allTopics[idx + 1] : null;

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-6 flex-wrap" style={{ fontFamily: 'IBM Plex Mono', color: '#8A94A4' }}>
          <Link href="/" className="hover:underline" style={{ color: '#0B6E6E' }}>Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/specialty/${slug}`} className="hover:underline" style={{ color: '#0B6E6E' }}>
            {specialty.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0E2440' }}>{topic.name}</span>
        </nav>

        {/* Topic header */}
        <div className="rounded-2xl p-6 mb-6"
          style={{ background: '#0E2440', borderBottom: `4px solid ${specialty.color}` }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{specialty.icon}</span>
            <span className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: specialty.color, fontFamily: 'IBM Plex Mono' }}>
              {specialty.name} · Appointment Note
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: 'Space Grotesk' }}>
            {topic.name}
          </h1>
          <div className="flex flex-wrap gap-3 text-xs" style={{ color: '#7A94B8', fontFamily: 'IBM Plex Mono' }}>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {topic.sourceFiles.filter(f => f.type === 'pdf').length} PDFs
            </span>
            {topic.sourceFiles.filter(f => f.type === 'audio').length > 0 && (
              <span className="flex items-center gap-1">
                <Mic className="w-3 h-3" />
                {topic.sourceFiles.filter(f => f.type === 'audio').length} recordings
              </span>
            )}
            <span>{topic.fileCount} files merged across CGs</span>
            <span>RUSL 13th Batch</span>
          </div>
        </div>

        {/* Note content */}
        <NoteView topic={topic} color={specialty.color} />

        {/* Prev / Next nav */}
        <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-3" style={{ borderColor: '#DDD8CC' }}>
          {prev ? (
            <Link href={`/specialty/${slug}/${prev.slug}`}
              className="rounded-xl p-4 group"
              style={{ background: '#FFFCF7', border: '1px solid #DDD8CC' }}>
              <p className="text-xs mb-1" style={{ color: '#8A94A4', fontFamily: 'IBM Plex Mono' }}>← Previous</p>
              <p className="text-sm font-semibold group-hover:underline" style={{ color: '#0E2440', fontFamily: 'Space Grotesk' }}>{prev.name}</p>
            </Link>
          ) : <div />}
          {next && (
            <Link href={`/specialty/${slug}/${next.slug}`}
              className="rounded-xl p-4 text-right group"
              style={{ background: '#FFFCF7', border: '1px solid #DDD8CC' }}>
              <p className="text-xs mb-1" style={{ color: '#8A94A4', fontFamily: 'IBM Plex Mono' }}>Next →</p>
              <p className="text-sm font-semibold group-hover:underline" style={{ color: '#0E2440', fontFamily: 'Space Grotesk' }}>{next.name}</p>
            </Link>
          )}
        </div>

        <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: '#DDD8CC' }}>
          <p className="text-xs" style={{ color: '#8A94A4', fontFamily: 'IBM Plex Mono' }}>
            © 2024–2025 Udana Anjana · Medicine Kuppiya · RUSL 13th Batch
          </p>
        </div>
      </main>
    </div>
  );
}
