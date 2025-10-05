import React, { useState } from 'react';
import { fetchAreaNDVI, fetchLunar, fetchSahara } from '../api';
import LayerToggle from '../components/LayerToggle';
import '../styles/LeftPanel.css';

export default function LeftPanel({ coords, setCoords, setSelectedArea, activeLayer, setActiveLayer }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [latInput, setLatInput] = useState(coords.lat);
  const [lonInput, setLonInput] = useState(coords.lon);
  const [astro, setAstro] = useState(null);
  const [sahara, setSahara] = useState(null);

  function applyCoords() {
    setCoords({ lat: Number(latInput), lon: Number(lonInput) });
  }

  async function handleComputeArea() {
    if (!window.selectedGeoJSON) return alert('Dibuja o carga un área primero');
    const geojson = window.selectedGeoJSON;
    const res = await fetchAreaNDVI(geojson, start, end);
    setSelectedArea({ geojson, series: res.series });
  }

  async function loadAstronomy() {
    const lunar = await fetchLunar();
    setAstro(lunar);
    const sah = await fetchSahara(latInput, lonInput);
    setSahara(sah);
  }

  return (
    <div className="panel left-panel">
      <h3>Controles</h3>

      <div>
        <label>Lat</label>
        <input value={latInput} onChange={e => setLatInput(e.target.value)} />
        <label>Lon</label>
        <input value={lonInput} onChange={e => setLonInput(e.target.value)} />
        <button onClick={applyCoords}>Aplicar coordenadas</button>
      </div>

      <div>
        <h4>Selección de área</h4>
        <p>Use el mapa para dibujar o haga click para seleccionar y luego "Calcular NDVI area".</p>
        <label>Start</label>
        <input placeholder="YYYY-MM-DD" value={start} onChange={e => setStart(e.target.value)} />
        <label>End</label>
        <input placeholder="YYYY-MM-DD" value={end} onChange={e => setEnd(e.target.value)} />
        <button onClick={handleComputeArea}>Calcular NDVI area</button>
      </div>

      <div>
        <LayerToggle activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
      </div>

      <div>
        <h4>Sucesos astronómicos</h4>
        <button onClick={loadAstronomy}>Cargar fase lunar y polvo Sahara</button>
        {astro && <div><b>Fase:</b> {astro.name} ({astro.phase})</div>}
        {sahara && <div><b>Polvo Sahara:</b> {sahara.level} ({sahara.probability})</div>}
      </div>
    </div>
  );
}