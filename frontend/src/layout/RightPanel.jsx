import React, { useEffect, useState } from 'react';
import ImageryViewer from './components/ImageryViewer';
import { fetchNDVI, fetchWeather } from '../api';

export default function RightPanel({ coords, imageryData, ndviSeries, activeDate }) {
  const [ndviNow, setNdviNow] = useState(null);
  const [weather7d, setWeather7d] = useState(null);
  const [cottonSignal, setCottonSignal] = useState(null);

  useEffect(() => {
    async function loadIndicators() {
      try {
        // 1) obtener NDVI actual para coords y fecha activa
        const ndviRes = await fetchNDVI(coords.lat, coords.lon, activeDate || null);
        setNdviNow(ndviRes.ndvi);
      } catch (e) {
        console.warn('NDVI fetch error', e);
      }

      try {
        // 2) obtener clima últimos 7 días para coords
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        const startStr = start.toISOString().slice(0,10);
        const endStr = end.toISOString().slice(0,10);
        const w = await fetchWeather(coords.lat, coords.lon, startStr, endStr);
        setWeather7d(w.data);
      } catch (e) {
        console.warn('Weather fetch error', e);
      }
    }
    loadIndicators();
  }, [coords, activeDate]);

  useEffect(() => {
    // 3) calcular semáforo de algodón combinando NDVI y precipitación
    if (ndviNow == null || !weather7d) return;
    const precip = (weather7d && weather7d.daily && weather7d.daily.precipitation_sum) ? weather7d.daily.precipitation_sum.reduce((a,b)=>a+b,0) : 0;
    const ndvi = ndviNow;
    let level = 'Desconocido';
    let advice = 'Sin datos suficientes';
    if (ndvi < 0.2 && precip < 5) {
      level = 'Rojo';
      advice = 'Riesgo de sequía para algodón. Considerar riego inmediato y muestreo de campo.';
    } else if (ndvi >= 0.2 && ndvi < 0.35) {
      level = 'Amarillo';
      advice = 'Estrés leve. Monitorizar la tendencia y verificar precipitaciones próximas.';
    } else if (ndvi >= 0.35) {
      level = 'Verde';
      advice = 'Condiciones favorables para algodón.';
    } else {
      level = 'N/A';
    }
    setCottonSignal({ level, advice, ndvi, precip });
  }, [ndviNow, weather7d]);

  return (
    <div className="panel right-panel">
      <h3>Visor</h3>
      <div><b>Coordenadas:</b> {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</div>

      <ImageryViewer imagery={imageryData} />

      <h4>Indicadores</h4>
      <div><b>NDVI actual:</b> {ndviNow !== null ? ndviNow : 'Cargando...'}</div>
      <div><b>Precipitación 7d (mm):</b> {weather7d && weather7d.daily ? weather7d.daily.precipitation_sum.reduce((a,b)=>a+b,0) : 'Cargando...'}</div>

      <h4>Semáforo algodón</h4>
      {cottonSignal ? (
        <div>
          <div><b>Nivel:</b> {cottonSignal.level}</div>
          <div><b>NDVI:</b> {cottonSignal.ndvi}</div>
          <div><b>Precip total 7d:</b> {cottonSignal.precip}</div>
          <div><b>Consejo:</b> {cottonSignal.advice}</div>
        </div>
      ) : <div>Calculando semáforo...</div>}

      <h4>Serie NDVI</h4>
      <MiniChart series={ndviSeries} />
    </div>
  );
}

function MiniChart({ series = [] }) {
  if (!series || series.length === 0) return <div>No hay serie</div>;
  const max = Math.max(...series.map(s => s.value));
  const min = Math.min(...series.map(s => s.value));
  return (
    <svg width="100%" height="120">
      {series.map((p, i) => {
        const x = (i / (series.length - 1)) * 100;
        const y = 100 - ((p.value - min) / (max - min || 1)) * 90;
        return <circle key={i} cx={`${x}%`} cy={y} r="3" fill="#2ca02c" />;
      })}
      <polyline fill="none" stroke="#2ca02c" strokeWidth="2" points={
        series.map((p, i) => {
          const x = (i / (series.length - 1)) * 100;
          const y = 100 - ((p.value - min) / (max - min || 1)) * 90;
          return `${x}% ${y}`;
        }).join(' ')
      } />
    </svg>
  );
}
