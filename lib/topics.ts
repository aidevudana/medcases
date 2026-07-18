import { EnrichedTopic } from '@/types';
import fs from 'fs';
import path from 'path';

export async function getTopicsForSpecialty(specialtySlug: string): Promise<EnrichedTopic[]> {
  const dataPath = path.join(process.cwd(), 'data', `${specialtySlug}.json`);
  if (!fs.existsSync(dataPath)) return [];
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw) as EnrichedTopic[];
}

export async function getTopic(specialtySlug: string, topicSlug: string): Promise<EnrichedTopic | null> {
  const topics = await getTopicsForSpecialty(specialtySlug);
  return topics.find(t => t.slug === topicSlug) ?? null;
}

export async function getAllTopicSlugs(): Promise<{ specialty: string; topic: string }[]> {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) return [];
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  const slugs: { specialty: string; topic: string }[] = [];
  for (const file of files) {
    const specialty = file.replace('.json', '');
    const topics = await getTopicsForSpecialty(specialty);
    for (const t of topics) {
      slugs.push({ specialty, topic: t.slug });
    }
  }
  return slugs;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function cleanFileName(title: string): string {
  return title
    .replace(/\.(pdf|mp3|mp4|docx?)$/i, '')
    .replace(/_\d{6}_\d{6}(_\d{6}_\d{6})?$/i, '')
    .replace(/^\(\d+\)\s*/, '')
    .replace(/_/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function groupByTopic(files: { title: string; id: string; viewUrl: string; snippet?: string }[]) {
  const groups: Record<string, typeof files> = {};
  for (const f of files) {
    const clean = cleanFileName(f.title).toLowerCase();
    // Find existing group within edit distance
    const existing = Object.keys(groups).find(k => similarity(k, clean) > 0.68);
    if (existing) {
      groups[existing].push(f);
    } else {
      groups[clean] = [f];
    }
  }
  return groups;
}

function similarity(a: string, b: string): number {
  const setA = new Set(a.split(/\s+/));
  const setB = new Set(b.split(/\s+/));
  const intersection = new Set([...setA].filter(w => setB.has(w)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}
