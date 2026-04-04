// In dev: Vite proxy forwards /api/ai to Groq with the key from .env
// In production: Netlify function at /api/ai adds the key server-side
const isDev = import.meta.env.DEV;
const GROQ_DEV_KEY = isDev ? import.meta.env.VITE_GROQ_API_KEY : '';

export async function generateAIAnalysis(processedData, onChunk) {
  const { brands, ceps, summary, totalRespondents, totalCategoryAssociations } = processedData;

  const brandData = brands.map(brand => {
    const b = summary[brand];
    const pen = b.respondentsWithAtLeastOne ?? b.repondentsWithAtLeastOne ?? 0;
    return `- ${brand}: MPen ${((pen / totalRespondents) * 100).toFixed(1)}%, NS ${pen > 0 ? (b.totalAssociations / pen).toFixed(2) : '0'}, MMS ${((b.totalAssociations / totalCategoryAssociations) * 100).toFixed(1)}%`;
  }).join('\n');

  const prompt = `You are a senior brand strategist specializing in Mental Availability (Ehrenberg-Bass methodology).

Analyze this survey data:
- ${totalRespondents} respondents, ${totalCategoryAssociations} total associations, ${ceps.filter(Boolean).length} Category Entry Points

Brand Metrics (MPen = Mental Penetration, NS = Network Size, MMS = Mental Market Share):
${brandData}

Write a strategic analysis with these exact sections:

## Executive Intelligence Brief
A 2-3 sentence summary of the category's mental availability landscape.

## Key Findings
3-4 numbered insights with statistical evidence. Identify anomalies (e.g., high penetration but low network size), competitive gaps, and concentration risks.

## Brand-by-Brand Assessment
For each brand, provide a one-paragraph assessment covering strengths, weaknesses, and competitive position.

## Strategic Recommendations
Actionable recommendations for the top 3 brands. Each recommendation should have a clear objective, rationale, and suggested tactics.

## White Space Opportunities
Identify uncontested or under-contested CEP territories that brands could claim.

Use professional language. Be specific with numbers. Format in clean Markdown with **bold** for emphasis.`;

  const headers = { 'Content-Type': 'application/json' };
  // In dev mode, add auth header directly; in prod, the server function adds it
  if (isDev && GROQ_DEV_KEY) {
    headers['Authorization'] = `Bearer ${GROQ_DEV_KEY}`;
  }

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      stream: true,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 401) throw new Error('Invalid API key.');
    if (response.status === 429) throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    throw new Error(`AI error: ${response.status} — ${errText.slice(0, 200)}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') break;
      try {
        const parsed = JSON.parse(json);
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) {
          full += text;
          onChunk(full);
        }
      } catch { /* skip partial */ }
    }
  }

  return full;
}
