import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/MapView.css';
import { fetchNDVI, fetchAreaNDVI, fetchLunar, fetchSahara, fetchWeather } from '../api';

// Función para calcular el nivel de riesgo combinado
function calculateRiskLevel(ndvi, weather, sahara, lunar, season) {
  let riskFactors = {
    ndvi: ndvi < 0.2 ? 3 : ndvi < 0.5 ? 2 : 1,
    weather: weather.precipitation < 10 ? 3 : weather.precipitation < 30 ? 2 : 1,
    sahara: sahara.probability > 0.7 ? 3 : sahara.probability > 0.3 ? 2 : 1,
    lunar: lunar.phase > 0.8 ? 3 : lunar.phase > 0.4 ? 2 : 1,
    season: season === 'dry' ? 3 : season === 'transition' ? 2 : 1
  };

  return {
    total: Object.values(riskFactors).reduce((a, b) => a + b, 0) / 5,
    factors: riskFactors
  };
}

// Componente para mostrar la cuadrícula de riesgos
function RiskGrid({ riskData }) {
  if (!riskData) return null;

  const getColor = (value) => {
    if (value >= 2.5) return '#ff4444';
    if (value >= 1.8) return '#ffbb33';
    return '#00C851';
  };

  return (
    <div className="risk-grid">
      <h3>Niveles de Riesgo</h3>
      <div className="risk-factors">
        <div>
          <div className="risk-indicator" style={{ background: getColor(riskData.factors.ndvi) }}></div>
          <small>NDVI</small>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '30px', height: '30px', background: getColor(riskData.factors.weather), margin: '0 auto' }}></div>
          <small>Clima</small>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '30px', height: '30px', background: getColor(riskData.factors.sahara), margin: '0 auto' }}></div>
          <small>Sahara</small>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '30px', height: '30px', background: getColor(riskData.factors.lunar), margin: '0 auto' }}></div>
          <small>Lunar</small>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '30px', height: '30px', background: getColor(riskData.factors.season), margin: '0 auto' }}></div>
          <small>Temporada</small>
        </div>
      </div>
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <b>Riesgo Total: {riskData.total.toFixed(2)}</b>
      </div>
    </div>
  );
}

function NDVIChart({ series }) {
  // Gráfico de línea NDVI serie temporal
  if (!series || series.length === 0) return <div>No hay datos NDVI</div>;
  const max = Math.max(...series.map(s => s.predicted ?? s.actual ?? s.value));
  const min = Math.min(...series.map(s => s.predicted ?? s.actual ?? s.value));
  return (
    <div className="ndvi-chart">
      <div className="chart-title">NDVI Serie Temporal</div>
      <svg width="300" height="100">
        <polyline
          fill="none"
          stroke="#4facfe"
          strokeWidth="3"
          points={series.map((p, i) => {
            const x = (i / (series.length - 1)) * 280 + 10;
            const y = 90 - ((p.predicted ?? p.actual ?? p.value - min) / (max - min || 1)) * 70;
            return `${x},${y}`;
          }).join(' ')}
        />
        {series.map((p, i) => {
          const x = (i / (series.length - 1)) * 280 + 10;
          const y = 90 - ((p.predicted ?? p.actual ?? p.value - min) / (max - min || 1)) * 70;
          return <circle key={i} cx={x} cy={y} r="4" fill="#2ca02c" />;
        })}
      </svg>
      <div style={{color: '#fff', marginTop: 8}}>
        {series.map((p, i) => (
          <span key={i} style={{marginRight: 8}}>{p.date}: <b>{(p.predicted ?? p.actual ?? p.value).toFixed(2)}</b></span>
        ))}
      </div>
    </div>
  );
}

function getColorForNDVI(v) {
  if (v < 0.2) return '#b30000'; // rojo
  if (v < 0.5) return '#ffd966'; // amarillo
  return '#2ca02c'; // verde
}

function SelectZone({ onSelect }) {
  useMapEvents({
    click(e) {
      // Crea un polígono cuadrado alrededor del punto clickeado
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      const poly = [
        [lat - 0.05, lon - 0.05],
        [lat - 0.05, lon + 0.05],
        [lat + 0.05, lon + 0.05],
        [lat + 0.05, lon - 0.05],
        [lat - 0.05, lon - 0.05]
      ];
      onSelect({ lat, lon, poly });
    }
  });
  return null;
}

export default function MapView({ coords, onNDVIChange, onNDVISeriesChange, markedNDVI }) {
  const [selected, setSelected] = useState(null);
  const [ndvi, setNdvi] = useState(null);
  const [ndviSeries, setNdviSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [riskData, setRiskData] = useState(null);

  async function handleSelectZone({ lat, lon, poly }) {
    setSelected({ lat, lon, poly });
    setLoading(true);
    setError(null);
    try {
      // Obtener todos los datos en paralelo
      const [ndviRes, weatherRes, saharaRes, lunarRes] = await Promise.all([
        fetchNDVI(lat, lon, null),
        fetchWeather(lat, lon),
        fetchSahara(lat, lon),
        fetchLunar(),
      ]);

      setNdvi(ndviRes.ndvi);
      if (onNDVIChange) onNDVIChange(ndviRes.ndvi);

      // Determinar la temporada basada en el mes actual
      const month = new Date().getMonth();
      const season = month >= 5 && month <= 10 ? 'rainy' : month >= 3 && month <= 4 ? 'transition' : 'dry';

      // Calcular nivel de riesgo
      const risk = calculateRiskLevel(ndviRes.ndvi, weatherRes, saharaRes, lunarRes, season);
      setRiskData(risk);

      // Serie temporal NDVI (últimos 30 días)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();
      const seriesRes = await fetchAreaNDVI({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[poly.map(([lat, lon]) => [lon, lat])]] }
      }, startDate.toISOString(), endDate.toISOString());
      setNdviSeries(seriesRes.series || []);
      if (onNDVISeriesChange) onNDVISeriesChange(seriesRes.series || []);
    } catch (e) {
      setError('Error al obtener datos');
      setNdvi(null);
      setNdviSeries([]);
      setRiskData(null);
      if (onNDVIChange) onNDVIChange(null);
      if (onNDVISeriesChange) onNDVISeriesChange([]);
    }
    setLoading(false);
  }

  return (
    <div className="map-container">
      <MapContainer center={[coords.lat, coords.lon]} zoom={8} style={{ height: '100%' }}>
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <Marker position={[coords.lat, coords.lon]} />
        <SelectZone onSelect={handleSelectZone} />
        {selected && (
          <Polygon positions={selected.poly} pathOptions={{
            color: markedNDVI === 'bajo' ? '#b30000' : markedNDVI === 'moderado' ? '#ffd966' : markedNDVI === 'alto' ? '#2ca02c' : getColorForNDVI(ndvi),
            fillColor: markedNDVI === 'bajo' ? '#b30000' : markedNDVI === 'moderado' ? '#ffd966' : markedNDVI === 'alto' ? '#2ca02c' : getColorForNDVI(ndvi),
            fillOpacity: 0.5
          }} />
        )}
      </MapContainer>
      {riskData && <RiskGrid riskData={riskData} />}
      <div className="map-info-panel">
        {loading && 'Cargando datos...'}
        {error && error}
        {selected && ndvi !== null && !loading && !error && (
          <div>
            Zona seleccionada: [{selected.lat.toFixed(4)}, {selected.lon.toFixed(4)}]<br />
            NDVI actual: <span style={{color: getColorForNDVI(ndvi)}}>{ndvi.toFixed(2)}</span>
            <br />
            <button className="view-chart-button" onClick={() => setShowChart(true)}>
              Ver gráfico NDVI
            </button>
            <GestionPanel ndvi={ndvi} series={ndviSeries} />
          </div>
        )}
        {!selected && 'Haz click en el mapa para seleccionar una zona.'}
      </div>
      {showChart && ndviSeries.length > 0 && (
        <NDVIChart series={ndviSeries} />
      )}
    </div>
  );
}

// Panel de gestión y recomendaciones
function GestionPanel({ ndvi, series }) {
  if (ndvi == null) return null;
  let nivel = 'Desconocido';
  let recomendaciones = [];
  if (ndvi < 0.2) {
    nivel = 'Riesgo alto de sequía';
    recomendaciones = [
      'Activar monitoreo intensivo',
      'Considerar riego inmediato',
      'Notificar a autoridades locales'
    ];
  } else if (ndvi < 0.5) {
    nivel = 'Condición moderada';
    recomendaciones = [
      'Mantener monitoreo regular',
      'Preparar medidas preventivas',
      'Revisar calidad del agua'
    ];
  } else {
    nivel = 'Zona saludable';
    recomendaciones = [
      'Continuar actividades normales',
      'Actualizar registros',
      'Verificar equipos de medición'
    ];
  }
  let tendencia = '';
  if (series && series.length > 1) {
    const first = series[0].predicted ?? series[0].actual ?? series[0].value;
    const last = series[series.length-1].predicted ?? series[series.length-1].actual ?? series[series.length-1].value;
    tendencia = last > first ? 'Mejorando' : last < first ? 'Empeorando' : 'Estable';
  }
  return (
    <div className="gestion-panel">
      <div><b>Nivel:</b> {nivel}</div>
      <div><b>Recomendaciones:</b></div>
      <ul className="recomendaciones-list">
        {recomendaciones.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      {tendencia && (
        <div className="tendencia"><b>Tendencia NDVI:</b> {tendencia}</div>
      )}
    </div>
  );
}