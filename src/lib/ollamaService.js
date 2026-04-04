/**
 * Service to communicate with a local Ollama instance via Vite proxy.
 */

const OLLAMA_BASE_URL = '';

export async function checkOllamaStatus() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Streams AI insights from Ollama, calling onChunk for each piece of text.
 */
export async function generateAIInsights(processedData, model = 'llama3', onChunk) {
  const { brands, summary, totalRespondents, totalCategoryAssociations } = processedData;

  const context = brands.slice(0, 10).map(brand => {
    const b = summary[brand];
    const pen = b.respondentsWithAtLeastOne ?? b.repondentsWithAtLeastOne ?? 0;
    return {
      name: brand,
      mPen: ((pen / totalRespondents) * 100).toFixed(1) + '%',
      ns: pen > 0 ? (b.totalAssociations / pen).toFixed(2) : '0',
      mms: ((b.totalAssociations / totalCategoryAssociations) * 100).toFixed(1) + '%'
    };
  });

  const prompt = `You are a Strategic Brand Consultant. Analyze this Mental Availability data:

Category: ${totalRespondents} respondents, ${totalCategoryAssociations} total associations.

Brand Metrics (MPen = Mental Penetration, NS = Network Size, MMS = Mental Market Share):
${context.map(b => `- ${b.name}: MPen ${b.mPen}, NS ${b.ns}, MMS ${b.mms}`).join('\n')}

Provide a concise analysis with these sections:
## Key Findings
2-3 statistical anomalies or notable patterns.

## Brand Rankings
Rank all brands by mental availability strength with a one-line verdict each.

## Strategic Recommendations
Actionable marketing strategies for the top 2 brands to grow Mental Availability.

Use professional Markdown. Be concise and strategic.`;

  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: true }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // Ollama streams newline-delimited JSON objects
    for (const line of chunk.split('\n').filter(Boolean)) {
      try {
        const json = JSON.parse(line);
        if (json.response) {
          full += json.response;
          onChunk(full);
        }
      } catch { /* skip partial lines */ }
    }
  }

  return full;
}
