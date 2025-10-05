// astronomy.js
function lunarPhase(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const synodicMonth = 29.530588853;
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const diff = (date.getTime() - knownNewMoon) / 1000 / 86400;
  const phase = ((diff % synodicMonth) + synodicMonth) % synodicMonth / synodicMonth;
  let name = 'Creciente';
  if (phase < 0.03 || phase > 0.97) name = 'Luna nueva';
  else if (phase < 0.22) name = 'Creciente';
  else if (phase < 0.28) name = 'Cuarto creciente';
  else if (phase < 0.47) name = 'Gibosa creciente';
  else if (phase < 0.53) name = 'Luna llena';
  else if (phase < 0.72) name = 'Gibosa menguante';
  else if (phase < 0.78) name = 'Cuarto menguante';
  else name = 'Menguante';
  return { phase: Number(phase.toFixed(3)), name };
}

function saharaDustLikelihood(lat, lon, dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const month = date.getUTCMonth() + 1;
  const inSeason = month >= 5 && month <= 9;
  const inRD = lat >= 17 && lat <= 20 && lon >= -72 && lon <= -68;
  const baseProb = inSeason && inRD ? 0.65 : inSeason ? 0.4 : 0.08;
  const noise = (Math.sin(lat + lon + date.getUTCDate()) + 1) / 10;
  const prob = Math.min(1, Math.max(0, baseProb + noise));
  const level = prob > 0.6 ? 'Alto' : prob > 0.3 ? 'Moderado' : 'Bajo';
  return { probability: Number(prob.toFixed(2)), level };
}

module.exports = { lunarPhase, saharaDustLikelihood };