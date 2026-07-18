/**
 * Data generation script
 * Run: node scripts/generate-data.mjs
 * Reads snippets from Drive search results and generates enriched JSON per specialty
 */
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function cleanFileName(title) {
  return title
    .replace(/\.(pdf|mp3|mp4|docx?)$/i, '')
    .replace(/_\d{6}_\d{6}(_\d{6}_\d{6})?$/i, '')
    .replace(/^\(\d+\)\s*/, '')
    .replace(/_/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function similarity(a, b) {
  const sa = new Set(a.toLowerCase().split(/\s+/));
  const sb = new Set(b.toLowerCase().split(/\s+/));
  const inter = [...sa].filter(w => sb.has(w)).length;
  const union = new Set([...sa, ...sb]).size;
  return union === 0 ? 0 : inter / union;
}

function groupFiles(files) {
  const groups = [];
  for (const f of files) {
    const clean = cleanFileName(f.title);
    const found = groups.find(g => similarity(g.name, clean) > 0.6);
    if (found) {
      found.files.push(f);
    } else {
      groups.push({ name: clean, files: [f] });
    }
  }
  return groups;
}

const SYSTEM = `You are a medical education expert creating study notes for Final MBBS students at Rajarata University of Sri Lanka (RUSL), 13th Batch.

Given a topic name, specialty, and raw class note snippets (OCR from handwritten/typed PDFs), produce enriched notes.

Return ONLY a valid JSON object:
{
  "sections": [
    { 
      "heading": "string",
      "content": "markdown text, use **bold** for key terms, use - for bullet points",
      "type": "definition|pathophysiology|clinical|investigations|management|complications|highyield|examination|generic"
    }
  ],
  "keyPoints": ["string (5-8 high-yield facts)"],
  "examTips": ["string (3-5 viva/MCQ tips, start with 'In the viva...' or 'MCQ favourite:' etc)"],
  "tags": ["relevant topic tags, max 5"]
}

Rules:
- Use raw snippet content plus your knowledge to create complete, exam-ready notes
- Be concise, clinical, exam-focused
- Use standard abbreviations (Hx, Ix, Mx, DDx, UMN/LMN etc)
- Return ONLY JSON, no markdown fences or explanation`;

async function enrichTopic(topicName, specialty, snippets) {
  const snippetText = snippets
    .filter(Boolean)
    .slice(0, 4)
    .map((s, i) => `=== Note ${i+1} ===\n${s.substring(0, 800)}`)
    .join('\n\n');

  const prompt = `Topic: ${topicName}
Specialty: ${specialty}
Institution: RUSL, Sri Lanka

Raw class note snippets (OCR):
${snippetText || '(Generate from standard textbook knowledge)'}

Create the enriched study note JSON.`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response for ' + topicName);
  return JSON.parse(match[0]);
}

// ===== ORTHOPEDICS DATA =====
const orthoFiles = [
  { id:'1JVzs_YCLPgP80SImiSr_LZro3qxSiA89', title:'POP short case_230909_211025.pdf', viewUrl:'https://drive.google.com/file/d/1JVzs_YCLPgP80SImiSr_LZro3qxSiA89/view', snippet:'Short case Upper limb examination 12 yrs old girl met with an RTA is on PDP cast & sling Left upper limb. comment on the cast 1st' },
  { id:'1zxyjrsRv-HKbmTQOkibYAsFkz6cxKb6R', title:'(19) osteosarcoma_230909_185318.pdf', viewUrl:'https://drive.google.com/file/d/1zxyjrsRv-HKbmTQOkibYAsFkz6cxKb6R/view', snippet:'Pathology. A malignant tumor commonly seen in 10-25 age group. If occur in later life, often as a secondary tumor. Most common site: distal femur, proximal tibia, proximal humerus. X-ray: Codmans triangle, sunburst pattern. Mx: neoadjuvant chemo + surgery (limb salvage preferred).' },
  { id:'1C4XxuJpQqXz9ALnIROF-W54bXgXZ7BTU', title:'Bed sores complications.pdf', viewUrl:'https://drive.google.com/file/d/1C4XxuJpQqXz9ALnIROF-W54bXgXZ7BTU/view', snippet:'An 81 years old male patient Presented with swelling in Left groin. Hip fractures. Pressure ulcers / bedsores - graded 1-4. Grade 1: non-blanching erythema. Grade 4: full thickness tissue loss with exposed bone.' },
  { id:'1V7MrYoTfQXPQd64S24_VDpxlYFD-4GRN', title:'fractures of the growth plate.pdf', viewUrl:'https://drive.google.com/file/d/1V7MrYoTfQXPQd64S24_VDpxlYFD-4GRN/view', snippet:'Salter-Harris classification. Type I: through physis only. Type II: physis + metaphysis (most common). Type III: physis + epiphysis. Type IV: through all three. Type V: crush injury of physis.' },
  { id:'1PzGDmTuQo8fJJkE2wo92JSKsGE2RhA4v', title:'Examination of hip_230907_210725.pdf', viewUrl:'https://drive.google.com/file/d/1PzGDmTuQo8fJJkE2wo92JSKsGE2RhA4v/view', snippet:'Trendelenburg sign. Standing normally on affected leg causes pelvis to drop on opposite side = positive Trendelenburg. Thomas test for fixed flexion deformity. FABER test. Hip ROM: flexion 120, extension 30, abduction 45, adduction 30, internal rotation 45, external rotation 45.' },
  { id:'1a1YiRY7xnnXjxLBW3RIm5KF4g8odKJ0f', title:'DDH.pdf', viewUrl:'https://drive.google.com/file/d/1a1YiRY7xnnXjxLBW3RIm5KF4g8odKJ0f/view', snippet:'Developmental Dysplasia of Hip. Spectrum: acetabular dysplasia, subluxation, frank dislocation. Risk factors: female, breech, family Hx, firstborn. Neonatal: Ortolani, Barlow tests. Later: Galeazzi sign, limb length discrepancy. Ix: USS <6 months, X-ray >6 months.' },
  { id:'1b3kpLoL0s2UkNpJb2vs8gDrdYu3yVE6T', title:'Wrist examination.pdf', viewUrl:'https://drive.google.com/file/d/1b3kpLoL0s2UkNpJb2vs8gDrdYu3yVE6T/view', snippet:'Wrist examination. Look-Feel-Move. LOAF muscles (median nerve): Lumbricals 1&2, Opponens pollicis, Abductor pollicis brevis, Flexor pollicis brevis. Tinel at carpal tunnel. Phalen test.' },
  { id:'1_pkzwocgV7aJVonsNAGdcgE0EqW3pEwT', title:'Back pain.pdf', viewUrl:'https://drive.google.com/file/d/1_pkzwocgV7aJVonsNAGdcgE0EqW3pEwT/view', snippet:'Back pain causes. Mechanical: most common. Red flags: age >50, weight loss, night pain, neurological symptoms, trauma, steroids. Ix: X-ray, MRI gold standard. Lumbar disc prolapse: L4/L5 and L5/S1 most common.' },
  { id:'1mAXyhNoKdaz46A4iDlvInoDr1eGziGyF', title:'Ankle joint examination.pdf', viewUrl:'https://drive.google.com/file/d/1mAXyhNoKdaz46A4iDlvInoDr1eGziGyF/view', snippet:'Ankle joint examination. Ask about pain, crooked toe, twisted foot. Inspection: swelling, deformity, scars. Palpation: lateral ligaments (ATFL, CFL, PTFL), medial deltoid. Simmons/Thompson test for Achilles rupture. Ottawa rules for X-ray.' },
  { id:'1YrbyTsCsJnrp4vWs-jb_ZvThlK3cNM09', title:'Ortho examination elbow.pdf', viewUrl:'https://drive.google.com/file/d/1YrbyTsCsJnrp4vWs-jb_ZvThlK3cNM09/view', snippet:'Elbow examination. Inspection of the standing patient. Front: asymmetry, carrying angle (cubitus valgus/varus), deformity. Lateral: flexion deformity. Posterior: olecranon bursitis.' },
  { id:'1p3jB6CY-rJolq1w5ay9-yYTzXI3fhxBU', title:'Ortho examination Shoulder.pdf', viewUrl:'https://drive.google.com/file/d/1p3jB6CY-rJolq1w5ay9-yYTzXI3fhxBU/view', snippet:'Shoulder examination. Inspection: asymmetry, muscle wasting, deltoid atrophy. Painful arc: 60-120 degrees = supraspinatus. Neer, Hawkins impingement tests. Apprehension test for instability. Empty can test (supraspinatus).' },
  { id:'1OPY0RG9eq1cIYLv7m3E74fB3lCHmI_WS', title:'Spinal stenosis.pdf', viewUrl:'https://drive.google.com/file/d/1OPY0RG9eq1cIYLv7m3E74fB3lCHmI_WS/view', snippet:'Spinal stenosis (Claudication of the cauda equina). Pathology: mainly in lumbar region. Neurogenic claudication: bilateral leg pain worsened by walking/standing, relieved by sitting/bending forward (shopping trolley sign). MRI best Ix.' },
  { id:'1G7DLW8l2mpWEBROJK0Ksn7G26k7dhXqJ', title:'Cervical spondylosis.pdf', viewUrl:'https://drive.google.com/file/d/1G7DLW8l2mpWEBROJK0Ksn7G26k7dhXqJ/view', snippet:'Cervical spondylosis. Chronic degenerative condition. Affects vertebral bodies, discs, facet joints. Symptoms: neck pain, radiculopathy, myelopathy. MRI: disc protrusion, cord compression. Mx: conservative (analgesia, physio), surgical if myelopathy.' },
  { id:'1bMVu8GR_cDlmhqPr--x6u0_-n5BoTCsN', title:'Neurogenic claudication.pdf', viewUrl:'https://drive.google.com/file/d/1bMVu8GR_cDlmhqPr--x6u0_-n5BoTCsN/view', snippet:'Neurogenic claudication. Back pain radiates to lower limb, worsens when walking. Severe pain in buttocks up to calf. Relief with sitting, squatting, bending forward. Distinguish from vascular claudication: vascular pain starts distal, no posture relief.' },
  { id:'1aB8Cbi0P36rrGFwz_k4YL4pa24M6_IQE', title:'Humerus shaft fracture.pdf', viewUrl:'https://drive.google.com/file/d/1aB8Cbi0P36rrGFwz_k4YL4pa24M6_IQE/view', snippet:'Humerus shaft fracture. Generally affects adults. Fracture line usually transverse. Radial nerve (in radial groove) at risk - check wrist drop. Holstein-Lewis fracture: distal 1/3, high radial nerve injury risk. Mx: conservative (functional brace) or surgical.' },
  { id:'1FdlIADSDSFOH-TizZi1EpS8aQaTmHj53', title:'bone Infection(2).pdf', viewUrl:'https://drive.google.com/file/d/1FdlIADSDSFOH-TizZi1EpS8aQaTmHj53/view', snippet:'Bone Infection. Osteomyelitis and septic arthritis. Haematogenous osteomyelitis most common in children. Organisms: Staph aureus (most common), Salmonella (sickle cell), Pseudomonas (IVDU). Ix: FBC, ESR, CRP, blood cultures, X-ray (late), MRI (early gold standard).' },
  { id:'1tVsaef1GRjLA-LlsTWMCiHWGMZ9nXlDs', title:'Antiseptics.pdf', viewUrl:'https://drive.google.com/file/d/1tVsaef1GRjLA-LlsTWMCiHWGMZ9nXlDs/view', snippet:'Antiseptics: Chlorhexidine, Povidone iodine, Surgical spirit (70% isopropyl alcohol). Chlorhexidine: bactericidal, residual activity. Povidone iodine: broad spectrum. Used for skin preparation, wound care.' },
  { id:'1THlKBa7eAj_sxtiaGwLqrn4NrYiCCP4-', title:'CTEV Orthopedic.pdf', viewUrl:'https://drive.google.com/file/d/1THlKBa7eAj_sxtiaGwLqrn4NrYiCCP4-/view', snippet:'CTEV - Congenital Talipes Equinovarus (Clubfoot). CAVE deformity: Cavus, Adductus, Varus, Equinus. Incidence: 1-2/1000. M:F = 2:1. Mx: Ponseti method (serial casting from birth), final cast + tenotomy, Denis Browne boots.' },
  { id:'1kMNq0qnqDNBDJKkNCX0YxGaxjPnXaucu', title:'surgical site infections prevention.pdf', viewUrl:'https://drive.google.com/file/d/1kMNq0qnqDNBDJKkNCX0YxGaxjPnXaucu/view', snippet:'Surgical site infection prevention. Pre-op: optimize nutrition, control DM, stop smoking. Peri-op: antibiotic prophylaxis, aseptic technique, normothermia, normoglycaemia. Post-op: wound care, surveillance.' },
  { id:'16NuuGfnzmjk-Ry0rLqxbVlzK1qmugP18', title:'SLIPPED CAPITAL FEMORAL EPIPHYSIS.pdf', viewUrl:'https://drive.google.com/file/d/16NuuGfnzmjk-Ry0rLqxbVlzK1qmugP18/view', snippet:'SCFE - Slipped Capital Femoral Epiphysis. Displacement of upper femoral epiphysis from neck. Age 10-16, obese boys. Bilateral 20-40%. Symptoms: hip/knee/groin pain, limp, loss of IR. Ice-cream falling off cone appearance on X-ray. Mx: urgent surgical pinning.' },
  { id:'16S2QU0SmIH0Dn965hSwBJ01W9RdZCKpl', title:'Septic Arthritis.pdf', viewUrl:'https://drive.google.com/file/d/16S2QU0SmIH0Dn965hSwBJ01W9RdZCKpl/view', snippet:'Septic Arthritis. Any joint can be involved. Pathophysiology: Infection through haematogenous spread, direct inoculation, spread from adjacent osteomyelitis. Organisms: Staph aureus most common, Gonococci in sexually active young adults. EMERGENCY - joint destruction within hours. Mx: joint aspiration (Ix+Tx), IV antibiotics, washout.' },
  { id:'1RyjOcMggpc0utmd1SJHLo4LII98y0D-d', title:'Evidence based medicine.pdf', viewUrl:'https://drive.google.com/file/d/1RyjOcMggpc0utmd1SJHLo4LII98y0D-d/view', snippet:'Evidence Based Medicine. Practice guidelines and standards. EBM is an approach to medical practice that uses results of patient-centred clinical research. Levels of evidence: 1a systematic review, 1b RCT, 2a systematic review cohort, 3 case-control, 4 case series, 5 expert opinion.' },
];

// Neurology files
const neuroFiles = [
  { id:'127fk5jhpI7YBeta1JvLkh6IF5sb_VlLL', title:'Stroke.pdf', viewUrl:'https://drive.google.com/file/d/127fk5jhpI7YBeta1JvLkh6IF5sb_VlLL/view', snippet:'Stroke: sudden onset neurological deficit due to infarction or haemorrhage. Ischaemic 70%, haemorrhagic 30%. TIA: resolves within 24h, no tissue infarction. Investigations: NCCT scan (acute bleed), MRI (ischaemia). Management: thrombolysis (rtPA) within 4.5h, thrombectomy. Secondary prevention: antiplatelet, statin, BP control.' },
  { id:'127BuYBorRIi38vX_HDGXkX_5q7IuGW1D', title:'LL examination.pdf', viewUrl:'https://drive.google.com/file/d/127BuYBorRIi38vX_HDGXkX_5q7IuGW1D/view', snippet:'Lower limb neurological examination. Inspection: wasting (proximal/distal), deformity, scars, fasciculations. Tone: rolling method. Power: hip flexion L1L2, knee extension L3L4, ankle dorsiflexion L4, plantarflexion S1. Reflexes: knee L3L4, ankle S1. Babinski sign. Clonus.' },
  { id:'128FvZebmOn_AGk5FNaU70mPxGe7z4XgA', title:'Upper Limb examination.pdf', viewUrl:'https://drive.google.com/file/d/128FvZebmOn_AGk5FNaU70mPxGe7z4XgA/view', snippet:'Upper limb neurological examination. Power grading 0-5 (MRC scale). UL power: shoulder abduction deltoid C5, elbow flexion C5C6, extension C7, wrist extension C6, finger extension C7, finger abduction T1. DTR: biceps C5C6, triceps C7, brachioradialis C5C6. Pronator drift for corticospinal lesion.' },
  { id:'11z0eQVhsn-zY_bc9921YxSJzx2zJkD6p', title:'Upper limb examination by Charana sir.pdf', viewUrl:'https://drive.google.com/file/d/11z0eQVhsn-zY_bc9921YxSJzx2zJkD6p/view', snippet:'UL examination. Appearance: symmetry, wasting (proximal/distal), gutters in wasted hand, deformity. Ulnar nerve palsy: claw hand. Median nerve palsy: ape hand. Carpal tunnel decompression scar. Ulnar nerve scar at medial epicondyle. Tone, Power, Reflexes, Coordination (finger-nose test), Sensory (dermatomal).' },
];

async function generateSpecialtyData(slug, name, files) {
  console.log(`\n=== Processing ${name} (${files.length} files) ===`);
  const groups = groupFiles(files);
  console.log(`Grouped into ${groups.length} topics`);
  
  const topics = [];
  for (const [i, group] of groups.entries()) {
    console.log(`  [${i+1}/${groups.length}] Enriching: ${group.name}`);
    try {
      const snippets = group.files.map(f => f.snippet).filter(Boolean);
      const enriched = await enrichTopic(group.name, name, snippets);
      topics.push({
        id: slugify(group.name),
        slug: slugify(group.name),
        name: group.name,
        specialty: name,
        specialtySlug: slug,
        sourceFiles: group.files.map(f => ({
          id: f.id,
          title: f.title,
          viewUrl: f.viewUrl,
          type: f.title.match(/\.(mp3|mp4|m4a|wav)$/i) ? 'audio' : 'pdf',
          snippet: f.snippet,
        })),
        fileCount: group.files.length,
        sections: enriched.sections || [],
        keyPoints: enriched.keyPoints || [],
        examTips: enriched.examTips || [],
        tags: enriched.tags || [],
        generatedAt: new Date().toISOString(),
      });
      // Respect API rate limits
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ERROR on ${group.name}:`, err.message);
    }
  }
  
  const outPath = path.join(DATA_DIR, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(topics, null, 2));
  console.log(`  ✓ Saved ${topics.length} topics to ${outPath}`);
  return topics;
}

// Run generation
(async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Set ANTHROPIC_API_KEY environment variable');
    process.exit(1);
  }
  await generateSpecialtyData('orthopedics', 'Orthopedics', orthoFiles);
  await generateSpecialtyData('neurology', 'Neurology', neuroFiles);
  console.log('\n✅ Data generation complete!');
})();
