/**
 * Calculates metrics based on processed survey summary.
 */

export function calculateMetrics(processedData) {
  const { brands, summary, totalRespondents, totalCategoryAssociations } = processedData;
  const metrics = [];

  brands.forEach(brand => {
    const bData = summary[brand];

    // Mental Penetration (MPen): Count respondents with ≥ 1 association for Brand X / Total Respondents.
    const mPen = totalRespondents > 0 ? (bData.respondentsWithAtLeastOne / totalRespondents) : 0;

    // Network Size (NS): Total associations for Brand X / Count of respondents who have ≥ 1 association for Brand X.
    const networkSize = bData.respondentsWithAtLeastOne > 0 ? (bData.totalAssociations / bData.respondentsWithAtLeastOne) : 0;

    // Mental Market Share (MMS): (Brand X Total Associations) / (Category Total Associations)
    const mms = totalCategoryAssociations > 0 ? (bData.totalAssociations / totalCategoryAssociations) : 0;

    metrics.push({
      brand,
      mPen: mPen * 100, // percentage string later
      networkSize,
      mms: mms * 100, // percentage string later
      raw: bData
    });
  });

  return metrics;
}
