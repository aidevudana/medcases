import Link from 'next/link';
import { EnrichedTopic } from '@/types';
import { FileText, Mic, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  topic: EnrichedTopic;
  color: string;
}

export default function TopicCard({ topic, color }: Props) {
  const pdfs = topic.sourceFiles.filter(f => f.type === 'pdf');
  const audio = topic.sourceFiles.filter(f => f.type === 'audio');

  return (
    <Link href={`/specialty/${topic.specialtySlug}/${topic.slug}`}
      className="group block rounded-xl p-4 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
      style={{ background: '#FFFCF7', border: '1px solid #DDD8CC' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 shrink-0" style={{ color }} />
            <span className="text-xs font-medium uppercase tracking-wide"
              style={{ color, fontFamily: 'IBM Plex Mono' }}>
              {topic.tags[0] ?? 'appointment'}
            </span>
          </div>
          <h3 className="font-semibold text-sm leading-snug truncate mb-2"
            style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
            {topic.name}
          </h3>
          {/* Key point preview */}
          {topic.keyPoints[0] && (
            <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: '#5B6473' }}>
              {topic.keyPoints[0]}
            </p>
          )}
          <div className="flex items-center gap-3">
            {pdfs.length > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: '#8A94A4' }}>
                <FileText className="w-3 h-3" />
                {pdfs.length} PDF{pdfs.length > 1 ? 's' : ''}
              </span>
            )}
            {audio.length > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: '#8A94A4' }}>
                <Mic className="w-3 h-3" />
                {audio.length} recording{audio.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform"
          style={{ color: '#CCC8BE' }} />
      </div>
    </Link>
  );
}
