export interface FileRef {
  id: string;
  title: string;
  viewUrl: string;
  type: 'pdf' | 'audio' | 'other';
  snippet?: string;
}

export interface NoteSection {
  heading: string;
  content: string;
  type: 'definition' | 'pathophysiology' | 'clinical' | 'investigations' | 'management' | 'complications' | 'highyield' | 'examination' | 'generic';
}

export interface EnrichedTopic {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  specialtySlug: string;
  sourceFiles: FileRef[];
  fileCount: number;
  sections: NoteSection[];
  keyPoints: string[];
  examTips: string[];
  tags: string[];
  generatedAt?: string;
}

export interface Specialty {
  id: string;
  slug: string;
  name: string;
  icon: string;
  phase: string;
  color: string;
  topicCount?: number;
}

export interface TopicIndex {
  specialty: Specialty;
  topics: EnrichedTopic[];
}
