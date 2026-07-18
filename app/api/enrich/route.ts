import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are a medical education expert creating study notes for Final MBBS students at Rajarata University of Sri Lanka (RUSL), 13th Batch. 

Given a medical topic name and raw class note snippets, produce a rich, structured study note in the following JSON format:

{
  "sections": [
    { "heading": "string", "content": "string (markdown-safe, use **bold** for key terms)", "type": "definition|pathophysiology|clinical|investigations|management|complications|highyield|examination|generic" }
  ],
  "keyPoints": ["string", "string", ...],  // 5-8 high-yield exam points
  "examTips": ["string", "string", ...],   // 3-5 viva/MCQ tips
  "tags": ["string", ...]                  // topic tags e.g. ["fracture", "orthopedics", "trauma"]
}

Rules:
- Be concise and exam-focused
- Include Sri Lankan clinical context where relevant (SLCOG, local drug availability)
- Merge content from multiple snippets about the same topic
- Use clinical shorthand appropriately (Hx, Ix, Mx, DDx)
- Do not make up facts — if unsure, stick to standard textbook content
- Return ONLY valid JSON, no markdown fences`;

export async function POST(req: NextRequest) {
  try {
    const { topicName, specialty, snippets } = await req.json();

    if (!topicName || !specialty) {
      return NextResponse.json({ error: 'Missing topicName or specialty' }, { status: 400 });
    }

    const snippetText = (snippets as string[])
      .filter(Boolean)
      .slice(0, 5)
      .map((s, i) => `--- Note ${i + 1} ---\n${s}`)
      .join('\n\n');

    const prompt = `Topic: ${topicName}
Specialty: ${specialty}
13th Batch, RUSL clerkship notes

Raw class note snippets:
${snippetText || '(No snippets available — use standard textbook knowledge)'}

Generate the enriched study note JSON.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content.filter(b => b.type === 'text').map(b => b.text).join('');

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data: parsed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
