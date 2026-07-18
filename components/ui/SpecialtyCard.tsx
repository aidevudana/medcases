import Link from 'next/link';
import { Specialty } from '@/types';
import { ChevronRight } from 'lucide-react';

interface Props {
  specialty: Specialty;
  topicCount: number;
  hasData: boolean;
}

export default function SpecialtyCard({ specialty, topicCount, hasData }: Props) {
  return (
    <Link href={`/specialty/${specialty.slug}`}
      className="group block rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        background: '#FFFCF7',
        border: `1px solid #DDD8CC`,
        borderTop: `3px solid ${specialty.color}`,
      }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl" role="img" aria-label={specialty.name}>{specialty.icon}</span>
        {hasData ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: '#E1F0EE', color: '#085252', fontFamily: 'IBM Plex Mono' }}>
            {topicCount} topics
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: '#F3F0E8', color: '#9AA0AA', fontFamily: 'IBM Plex Mono' }}>
            coming soon
          </span>
        )}
      </div>
      <h3 className="font-semibold text-base mb-0.5 group-hover:text-teal-700 transition-colors"
        style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
        {specialty.name}
      </h3>
      <p className="text-xs mb-3" style={{ color: '#7A8494', fontFamily: 'IBM Plex Mono' }}>
        {specialty.phase} · RUSL
      </p>
      <div className="flex items-center text-xs font-medium"
        style={{ color: specialty.color, fontFamily: 'Space Grotesk' }}>
        {hasData ? 'View appointments' : 'Uploading soon'}
        <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
