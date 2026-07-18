import { Specialty } from '@/types';

export const SPECIALTIES: Specialty[] = [
  { id: '13TD4gjsPCj7Q9QuUc6yYfqqoP_wryr54', slug: 'orthopedics',        name: 'Orthopedics',        icon: '🦴', phase: 'Phase 3', color: '#0B6E6E' },
  { id: '13JTU6WkxftCURIneNQWTLQrn2VDPvSqS', slug: 'neurology',          name: 'Neurology',          icon: '🧠', phase: 'Phase 3', color: '#534AB7' },
  { id: '13fcF593BTrcsdJd-V1nPoe91h53YLgDh', slug: 'cardiology',          name: 'Cardiology',         icon: '❤️', phase: 'Phase 3', color: '#C0402A' },
  { id: '13DzTBck4gPY_d2bTrZtDfcd1SFc510pS', slug: 'respiratory',        name: 'Respiratory',        icon: '🫁', phase: 'Phase 3', color: '#185FA5' },
  { id: '13Tkgsv1fiZrtb_WGDab8A-M-vkd9gXb4', slug: 'nephrology',         name: 'Nephrology',         icon: '💧', phase: 'Phase 3', color: '#0B6E6E' },
  { id: '13VaLujx-sgIJzpgTbvdye2-NzylBcwKv', slug: 'dermatology',        name: 'Dermatology',        icon: '🩹', phase: 'Phase 3', color: '#B87A0A' },
  { id: '13dqU2BGYY4I42MBxydpgFQMmBdvxQCYs', slug: 'ent',               name: 'ENT',                icon: '👂', phase: 'Phase 3', color: '#3B6D11' },
  { id: '1-chLQcgaxCPSo0poSumcq5FSaJYvd_84', slug: 'ophthalmology',      name: 'Ophthalmology',      icon: '👁️', phase: 'Phase 3', color: '#993556' },
  { id: '13O7zk8q_jKak3mCYfOl4ytJ_FZRR8fdy', slug: 'urology',           name: 'Urology',            icon: '🔵', phase: 'Phase 3', color: '#185FA5' },
  { id: '1-mbdXMhEeaJRCZPaIgW9-AOvM_ACWb95', slug: 'oncology',           name: 'Oncology',           icon: '🔬', phase: 'Phase 3', color: '#534AB7' },
  { id: '1-Y1dSLiL_5SmzgQw3s140lnPqJYA5Iov', slug: 'std',               name: 'STD',                icon: '🛡️', phase: 'Phase 3', color: '#C0402A' },
  { id: '1-A6N1tdZXx1R9fVC6dHrBd7DuxqLQazx', slug: 'anaesthesia',       name: 'Anaesthesia',        icon: '💉', phase: 'Phase 3', color: '#0B6E6E' },
  { id: '1-KOaIhbwkD5MmaXRU2bZgFWP-3QYF8Di', slug: 'radiology',         name: 'Radiology',          icon: '📡', phase: 'Phase 3', color: '#185FA5' },
  { id: '1RD7W1Jsf7c_5GP3YHZ6yguY-1PO1Wd1J', slug: 'clinical-pathology', name: 'Clinical Pathology', icon: '🧪', phase: 'Phase 3', color: '#B87A0A' },
  { id: '10nCBqv6Q2m3--JhlQ7JGAgZLLqL3Apb5', slug: 'neurosurgery',      name: 'Neurosurgery',       icon: '⚕️', phase: 'Phase 3', color: '#534AB7' },
  { id: '1REkspoMm_LUXiIOuibpTm_gmksXYEuOM', slug: 'family-medicine',    name: 'Family Medicine',    icon: '👨‍👩‍👧', phase: 'Phase 3', color: '#3B6D11' },
  { id: '1LTpYJ_BDRndSTXxcFU6CsZsAiH0gJTA3', slug: 'forensic-medicine',  name: 'Forensic Medicine',  icon: '⚖️', phase: 'Phase 3', color: '#5C6473' },
  { id: '1-Nyw_7bk4Rxb1VHnLex2zpo19cUUeLtn', slug: 'rheumatology',       name: 'Rheumatology',       icon: '🦾', phase: 'Phase 3', color: '#0B6E6E' },
];

export function getSpecialtyBySlug(slug: string): Specialty | undefined {
  return SPECIALTIES.find(s => s.slug === slug);
}
