
/**
 * Service to communicate with a local Ollama instance.
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Checks if the Ollama server is reachable.
 * @returns {Promise<boolean>}
 */
export async function checkOllamaStatus() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    return response.ok;
  } catch (error) {
    console.error('Ollama connection failed:', error);
    return false;
  }
}

/**
 * Generates an insight summary from survey data using Ollama.
 * @param {Object} processedData - The survey data from dataProcessor.
 * @param {string} model - The model name (e.g., 'llama3').
 * @returns {Promise<string>} - The AI generated markdown text.
 */
export async function generateAIInsights(processedData, model = 'llama3') {
  const { brands, summary, totalRespondents, totalCategoryAssociations } = processedData;

  // Prepare a concise context for the LLM
  const context = {
    totalRespondents,
    totalCategoryAssociations,
    brands: brands.slice(0, 10).map(brand => {
        const b = summary[brand];
        return {
          name: brand,
          mPen: ((b.repondentsWithAtLeastOne / totalRespondents) * 100).toFixed(1) + '%',
          ns: (b.totalAssociations / b.repondentsWithAtLeastOne).toFixed(2),
          mms: ((b.totalAssociations / totalCategoryAssociations) * 100).toFixed(1) + '%'
        };
    })
  };

  const prompt = `
    You are a Strategic Brand Consultant. Analyze this Mental Availability data for a category:
    
    Category Data Summary:
    - Total Respondents: ${context.totalRespondents}
    - Total Associations: ${context.totalCategoryAssociations}
    
    Brand Metrics (MPen = Mental Penetration, NS = Network Size, MMS = Mental Market Share):
    ${context.brands.map(b => `- ${b.name}: MPen ${b.mPen}, NS ${b.ns}, MMS ${b.mms}`).join('\n')}
    
    TASK:
    1. Identify 2-3 **Statistical Anomalies** (e.g., brands with high penetration but small network size, or niche brands with small penetration but high associations).
    2. Provide **Marketing Strategy** recommendations for the top 2 brands to increase their Mental Availability.
    
    Format your response in professional Markdown with clear headings. Be concise and strategic.
  `;

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false, // User requested single block
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Failed to generate insights:', error);
    throw error;
  }
}
