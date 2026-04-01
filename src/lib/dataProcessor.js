/**
 * Parses the "Wide Text" survey structure where headers are long occasion phrases 
 * and cells contain verbatim brand names natively chosen by the respondent.
 */

export function parseSurveyData(dataArray) {
  if (!dataArray || dataArray.length < 2) return { brands: [], ceps: [], summary: {}, totalRespondents: 0 };

  const rawHeaders = dataArray[0];
  const cepsMapping = []; // index -> cleaned CEP string
  const cepsSet = new Set();
  const brandsSet = new Set();       // canonical (first-seen) brand names
  const brandKeyMap = new Map();     // lowercase key -> canonical name
  
  // Clean headers (skip index 0 'Respondent ID')
  for (let i = 1; i < rawHeaders.length; i++) {
    const rawH = rawHeaders[i];
    if (!rawH) {
      cepsMapping.push(null);
      continue;
    }
    
    const cleanH = rawH.trim();

    cepsMapping.push(cleanH);
    cepsSet.add(cleanH);
  }

  const ceps = Array.from(cepsSet);
  const totalRespondents = dataArray.length - 1; // excluding header row

  // First pass to discover all brands
  for (let r = 1; r < dataArray.length; r++) {
    const row = dataArray[r];
    for (let c = 1; c < row.length; c++) {
      const cellVal = row[c];
      if (cellVal && cellVal.trim() !== '') {
        // Split by comma in case standard platforms bundled them
        const brandsInCell = cellVal.split(',').map(s => s.trim()).filter(Boolean);
        brandsInCell.forEach(b => {
          const key = b.toLowerCase();
          if (!brandKeyMap.has(key)) {
            brandKeyMap.set(key, b);
            brandsSet.add(b);
          }
        });
      }
    }
  }

  const brands = Array.from(brandsSet);

  // Initialize summary matrix
  const summary = {};
  brands.forEach(b => {
    summary[b] = {
      respondentsWithAtLeastOne: 0,
      totalAssociations: 0,
      cepCounts: {}
    };
    ceps.forEach(c => {
        // Safe check to avoid undefined keys
        if(c) {
           summary[b].cepCounts[c] = 0;
        }
    });
  });

  let totalCategoryAssociations = 0;

  // Second pass: map actual frequencies
  for (let r = 1; r < dataArray.length; r++) {
    const row = dataArray[r];
    const respondentBrands = new Set();

    for (let c = 1; c < row.length; c++) {
      const cellVal = row[c];
      const cep = cepsMapping[c - 1]; // Because c=1 corresponds to mapping index 0
      
      if (cellVal && cellVal.trim() !== '' && cep) {
        const brandsInCell = cellVal.split(',').map(s => s.trim()).filter(Boolean);
        
        brandsInCell.forEach(raw => {
            const bName = brandKeyMap.get(raw.toLowerCase()) || raw;
            summary[bName].cepCounts[cep]++;
            summary[bName].totalAssociations++;
            totalCategoryAssociations++;
            respondentBrands.add(bName);
        });
      }
    }
    
    // Evaluate if respondent has at least 1 association for the brand globally
    respondentBrands.forEach(bName => {
       summary[bName].respondentsWithAtLeastOne++;
    });
  }

  return { brands, ceps, summary, totalRespondents, totalCategoryAssociations };
}
