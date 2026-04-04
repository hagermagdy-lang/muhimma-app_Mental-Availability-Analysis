/**
 * Built-in insights engine — generates strategic analysis from data patterns.
 * No external AI service required.
 */
import { calculateMetrics } from './metrics';

export function generateInsights(processedData) {
  const metrics = calculateMetrics(processedData);
  const { brands, ceps, totalRespondents, totalCategoryAssociations, summary } = processedData;

  const sorted = [...metrics].sort((a, b) => b.mms - a.mms);
  const avgPen = metrics.reduce((s, m) => s + m.mPen, 0) / metrics.length;
  const avgNs = metrics.reduce((s, m) => s + m.networkSize, 0) / metrics.length;
  const avgMms = metrics.reduce((s, m) => s + m.mms, 0) / metrics.length;

  const sections = [];

  // --- Section 1: Key Findings ---
  const findings = [];

  // Find high penetration + low network size (broad but shallow)
  const broadShallow = metrics.filter(m => m.mPen > avgPen && m.networkSize < avgNs);
  if (broadShallow.length > 0) {
    const names = broadShallow.map(m => m.brand).join(', ');
    findings.push({
      title: 'Broad but Shallow Awareness',
      text: `${names} ${broadShallow.length > 1 ? 'have' : 'has'} above-average Mental Penetration but below-average Network Size. Many people think of ${broadShallow.length > 1 ? 'these brands' : 'this brand'}, but with fewer CEP associations — indicating recognition without deep mental links. Opportunity: build richer associations through targeted campaigns.`
    });
  }

  // Find low penetration + high network size (niche but deep)
  const nicheDeep = metrics.filter(m => m.mPen < avgPen && m.networkSize > avgNs);
  if (nicheDeep.length > 0) {
    const names = nicheDeep.map(m => m.brand).join(', ');
    findings.push({
      title: 'Niche but Deeply Linked',
      text: `${names} ${nicheDeep.length > 1 ? 'have' : 'has'} below-average penetration but above-average Network Size. Those who know ${nicheDeep.length > 1 ? 'these brands' : 'this brand'} associate ${nicheDeep.length > 1 ? 'them' : 'it'} with many CEPs — a loyal but small base. Opportunity: expand reach without diluting strong associations.`
    });
  }

  // Dominant brand analysis
  const leader = sorted[0];
  const runner = sorted[1];
  if (leader && runner) {
    const gap = leader.mms - runner.mms;
    if (gap > 5) {
      findings.push({
        title: 'Clear Market Leader',
        text: `${leader.brand} dominates with ${leader.mms.toFixed(1)}% Mental Market Share — ${gap.toFixed(1)} points ahead of ${runner.brand}. This strong lead suggests established mental availability that competitors will find difficult to erode quickly.`
      });
    } else {
      findings.push({
        title: 'Competitive Mental Space',
        text: `The top brands are closely matched: ${leader.brand} (${leader.mms.toFixed(1)}%) and ${runner.brand} (${runner.mms.toFixed(1)}%) are only ${gap.toFixed(1)} points apart. The category has no dominant leader — small shifts in marketing could change the ranking.`
      });
    }
  }

  // CEP concentration analysis
  const cepCoverage = {};
  ceps.filter(Boolean).forEach(cep => {
    let total = 0;
    brands.forEach(b => { total += summary[b].cepCounts[cep] || 0; });
    cepCoverage[cep] = total;
  });
  const cepsSorted = Object.entries(cepCoverage).sort((a, b) => b[1] - a[1]);
  const topCep = cepsSorted[0];
  const weakCep = cepsSorted[cepsSorted.length - 1];
  if (topCep && weakCep && cepsSorted.length > 1) {
    findings.push({
      title: 'CEP Strength Distribution',
      text: `"${topCep[0]}" is the most activated entry point with ${topCep[1]} total associations, while "${weakCep[0]}" has only ${weakCep[1]}. ${weakCep[1] === 0 ? 'This CEP is completely unowned — a white space opportunity for any brand willing to invest.' : 'Under-activated CEPs represent growth opportunities for challenger brands.'}`
    });
  }

  sections.push({ heading: 'Key Findings', items: findings });

  // --- Section 2: Brand Rankings ---
  const rankings = sorted.map((m, i) => {
    let verdict;
    if (m.mms >= avgMms * 1.2) verdict = 'Strong position — leads in share of mind';
    else if (m.mms >= avgMms * 0.8) verdict = 'Stable position — competitive but not dominant';
    else verdict = 'Vulnerable position — at risk of being forgotten';

    const penLabel = m.mPen > avgPen ? 'above avg' : 'below avg';
    const nsLabel = m.networkSize > avgNs ? 'rich associations' : 'thin associations';

    return {
      rank: i + 1,
      brand: m.brand,
      mms: m.mms.toFixed(1),
      mPen: m.mPen.toFixed(1),
      ns: m.networkSize.toFixed(2),
      verdict,
      detail: `MPen ${m.mPen.toFixed(1)}% (${penLabel}), NS ${m.networkSize.toFixed(2)} (${nsLabel})`
    };
  });

  sections.push({ heading: 'Brand Rankings', rankings });

  // --- Section 3: Strategic Recommendations ---
  const recs = [];

  // For the leader
  if (leader) {
    const leaderCeps = Object.entries(summary[leader.brand].cepCounts)
      .sort((a, b) => b[1] - a[1]);
    const weakestCeps = leaderCeps.filter(([, c]) => c > 0).slice(-2).map(([n]) => n);

    recs.push({
      brand: leader.brand,
      strategy: leader.networkSize > avgNs
        ? `Defend the lead. ${leader.brand} has strong penetration and rich associations. Focus on maintaining top-of-mind through consistent presence in the strongest CEPs. ${weakestCeps.length > 0 ? `Strengthen weaker links in "${weakestCeps.join('" and "')}" to close gaps before competitors exploit them.` : ''}`
        : `Deepen associations. ${leader.brand} leads in MMS but Network Size is below average — many people recognize it, but with thin associations. Invest in building richer mental structures by linking the brand to more CEPs through emotional and functional messaging.`
    });
  }

  // For the biggest opportunity (highest pen gap vs MMS)
  const opportunity = sorted.find(m => m !== leader && m.mPen > avgPen * 0.8);
  if (opportunity && opportunity !== leader) {
    recs.push({
      brand: opportunity.brand,
      strategy: opportunity.mPen > avgPen
        ? `Convert awareness to dominance. ${opportunity.brand} has solid penetration (${opportunity.mPen.toFixed(1)}%) but MMS of only ${opportunity.mms.toFixed(1)}%. The gap means people know the brand but don't think of it often enough. Increase frequency and distinctiveness of brand cues in high-traffic CEPs.`
        : `Build penetration first. ${opportunity.brand} needs to get on more people's radar before worrying about depth. Focus media spend on reach-oriented campaigns in the most activated CEPs where competitors are already strong — piggybacking on existing category entry points.`
    });
  }

  // Challenger advice
  const challenger = sorted[sorted.length - 1];
  if (challenger && challenger !== leader && challenger !== opportunity) {
    recs.push({
      brand: challenger.brand,
      strategy: `Find a niche. ${challenger.brand} has the smallest mental footprint (${challenger.mms.toFixed(1)}% MMS). Rather than competing head-on, identify the 1-2 least contested CEPs and own them completely. A focused niche strategy can build disproportionate mental availability in specific buying situations.`
    });
  }

  sections.push({ heading: 'Strategic Recommendations', recommendations: recs });

  // --- Section 4: Dataset Summary ---
  sections.push({
    heading: 'Dataset Overview',
    stats: {
      respondents: totalRespondents,
      brands: brands.length,
      ceps: ceps.filter(Boolean).length,
      totalAssociations: totalCategoryAssociations,
      avgPen: avgPen.toFixed(1),
      avgNs: avgNs.toFixed(2),
    }
  });

  return sections;
}
