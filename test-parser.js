import fs from 'fs';
import Papa from 'papaparse';
import { parseSurveyData } from './src/lib/dataProcessor.js';

const csv = fs.readFileSync('./public/sample_survey.csv', 'utf8');
const results = Papa.parse(csv, { header: false, skipEmptyLines: true });
try {
  const processed = parseSurveyData(results.data);
  console.log('Brands:', processed.brands);
  console.log('CEPs:', processed.ceps.length);
  console.log('Metrics length:', Object.keys(processed.summary).length);
  console.log('Total resp:', processed.totalRespondents);
} catch (e) {
  console.error('CRASH:', e);
}
