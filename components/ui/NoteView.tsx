'use client';
import { EnrichedTopic, NoteSection } from '@/types';
import { FileText, Mic, ExternalLink, Lightbulb, Star, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const SECTION_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  definition:       { bg: '#E7ECF3', border: '#185FA5', label: 'Definition' },
  pathophysiology:  { bg: '#EDE9FB', border: '#534AB7', label: 'Pathophysiology' },
  clinical:         { bg: '#FBE6E1', border: '#C0402A', label: 'Clinical Features' },
  investigations:   { bg: '#E1F0EE', border: '#0B6E6E', label: 'Investigations' },
  management:       { bg: '#FBF0D9', border: '#B87A0A', label: 'Management' },
  complications:    { bg: '#FBE6E1', border: '#C0402A', label: 'Complications' },
  highyield:        { bg: '#FBF0D9', border: '#E39B2E', label: 'High Yield' },
  examination:      { bg: '#E1F0EE', border: '#085252', label: 'Examination' },
  generic:          { bg: '#F8F4EE', border: '#9AA0AA', label: 'Notes' },
};

function renderContent(text: string) {
  // Simple markdown-ish rendering
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return <li key={i} className="ml-4 mb-1 text-sm leading-relaxed" style={{ color: '#334155' }}
        dangerouslySetInnerHTML={{ __html: bold.replace(/^[-•]\s+/, '') }} />;
    }
    if (!line.trim()) return null;
    return <p key={i} className="text-sm leading-relaxed mb-1.5" style={{ color: '#334155' }}
      dangerouslySetInnerHTML={{ __html: bold }} />;
  }).filter(Boolean);
}

function SectionBlock({ section }: { section: NoteSection }) {
  const [open, setOpen] = useState(true);
  const style = SECTION_COLORS[section.type] ?? SECTION_COLORS.generic;
  return (
    <div className="rounded-xl overflow-hidden mb-3" style={{ border: `1px solid ${style.border}33` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
        style={{ background: style.bg }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: style.border }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: style.border, fontFamily: 'IBM Plex Mono' }}>
            {style.label}
          </span>
          <span className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk', color: '#0E2440' }}>
            {section.heading}
          </span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" style={{ color: style.border }} />
               : <ChevronDown className="w-4 h-4" style={{ color: style.border }} />}
      </button>
      {open && (
        <div className="px-4 py-3" style={{ background: '#FFFCF7' }}>
          <ul className="list-none p-0 m-0">
            {renderContent(section.content)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function NoteView({ topic, color }: { topic: EnrichedTopic; color: string }) {
  const pdfs = topic.sourceFiles.filter(f => f.type === 'pdf');
  const audio = topic.sourceFiles.filter(f => f.type === 'audio');

  return (
    <div>
      {/* Tags */}
      {topic.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {topic.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: '#F3F0E8', color: '#6B7280', border: '1px solid #DDD8CC', fontFamily: 'IBM Plex Mono' }}>
              <Tag className="w-2.5 h-2.5" /> {tag}
            </span>
          ))}
        </div>
      )}

      {/* Sections */}
      {topic.sections.map((s, i) => <SectionBlock key={i} section={s} />)}

      {/* Key points */}
      {topic.keyPoints.length > 0 && (
        <div className="rounded-xl p-4 mb-3" style={{ background: '#FBF0D9', border: '1px solid #E39B2E55' }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4" style={{ color: '#B87A0A' }} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#B87A0A', fontFamily: 'IBM Plex Mono' }}>
              Key Points
            </span>
          </div>
          <ul className="space-y-1">
            {topic.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#334155' }}>
                <span className="text-xs mt-0.5 shrink-0" style={{ color: '#B87A0A' }}>▪</span>
                <span dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exam tips */}
      {topic.examTips.length > 0 && (
        <div className="rounded-xl p-4 mb-4" style={{ background: '#EDE9FB', border: '1px solid #534AB755' }}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4" style={{ color: '#534AB7' }} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#534AB7', fontFamily: 'IBM Plex Mono' }}>
              Exam / Viva Tips
            </span>
          </div>
          <ul className="space-y-1">
            {topic.examTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#334155' }}>
                <span className="shrink-0" style={{ color: '#534AB7' }}>→</span>
                <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source files */}
      {topic.sourceFiles.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: '#F8F4EE', border: '1px solid #DDD8CC' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#8A94A4', fontFamily: 'IBM Plex Mono' }}>
            Source files ({topic.fileCount} across CGs)
          </p>
          <div className="space-y-1.5">
            {pdfs.map(f => (
              <a key={f.id} href={f.viewUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs hover:underline"
                style={{ color: '#185FA5' }}>
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">{f.title.replace(/\.(pdf)$/i, '')}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0 ml-auto" />
              </a>
            ))}
            {audio.map(f => (
              <a key={f.id} href={f.viewUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs hover:underline"
                style={{ color: '#0B6E6E' }}>
                <Mic className="w-3 h-3 shrink-0" />
                <span className="truncate">{f.title.replace(/\.(mp3|mp4|m4a)$/i, '')}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0 ml-auto" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
