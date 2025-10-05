import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardOverview from '../components/DashboardOverview';
import GlobalMap from '../components/GlobalMap';
import PredictionView from '../components/PredictionView';
import LeftPanel from '../layout/LeftPanel';
import MapView from '../layout/MapView';
import RightPanel from '../layout/RightPanel';
import TimeBar from '../layout/TimeBar';
import { fetchAreaNDVI, fetchWeather } from '../api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [coords, setCoords] = useState({ lat: 18.5, lon: -69.9 });
  const [selectedArea, setSelectedArea] = useState(null);
  const [activeDate, setActiveDate] = useState('');
  const [activeLayer, setActiveLayer] = useState('imagery');
  const [imageryData, setImageryData] = useState(null);
  const [ndviGrid, setNdviGrid] = useState(null);
  const [ndviSeries, setNdviSeries] = useState([]);
  const [activeView, setActiveView] = useState('overview');
  const [markedNDVI, setMarkedNDVI] = useState(null);
  const [predictions, setPredictions] = useState({
    ndvi: [],
    weather: [],
    plantHealth: {
      status: 'normal',
      label: 'Saludable',
      description: 'Las condiciones actuales son favorables para el crecimiento.',
      recommendations: [
        'Mantener monitoreo regular',
        'Documentar cambios observados',
        'Actualizar registros semanalmente'
      ]
    }
  });

  const [hotspots] = useState([
    {
      lat: 18.5,
      lon: -69.9,
      name: 'Santo Domingo',
      riskLevel: 'moderado',
      ndvi: 0.45
    },
    {
      lat: 19.2,
      lon: -70.5,
      name: 'Santiago',
      riskLevel: 'bajo',
      ndvi: 0.65
    },
    {
      lat: 18.45,
      lon: -69.3,
      name: 'San Pedro',
      riskLevel: 'alto',
      ndvi: 0.25
    }
  ]);

  useEffect(() => {
    if (selectedArea) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      // Fetch predictions data
      fetchAreaNDVI(selectedArea, startDate.toISOString(), endDate.toISOString())
        .then(data => {
          setPredictions(prev => ({
            ...prev,
            ndvi: data.map(d => ({
              date: new Date(d.date).toLocaleDateString(),
              actual: d.value,
              predicted: d.value * (1 + Math.random() * 0.2 - 0.1)
            }))
          }));
        });

      fetchWeather(coords.lat, coords.lon, startDate.toISOString(), endDate.toISOString())
        .then(data => {
          setPredictions(prev => ({
            ...prev,
            weather: data.daily.map(d => ({
              date: new Date(d.date).toLocaleDateString(),
              temp: d.temperature,
              icon: '☀️',
              description: 'Soleado'
            }))
          }));
        });
    }
  }, [selectedArea]);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <Link to="/" className="nav-logo">BloomWatch RD</Link>
        <div className="nav-controls">
          <div className="view-selector">
            <button 
              className={`view-button ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              Vista General
            </button>
            <button 
              className={`view-button ${activeView === 'satellite' ? 'active' : ''}`}
              onClick={() => setActiveView('satellite')}
            >
              Datos Satelitales
            </button>
            <button 
              className={`view-button ${activeView === 'predictions' ? 'active' : ''}`}
              onClick={() => setActiveView('predictions')}
            >
              Predicciones
            </button>
          </div>
          <button className="help-button">
            <span className="icon">?</span>
            Ayuda
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {activeView === 'overview' && (
          <DashboardOverview 
            ndviData={ndviSeries} 
            weatherData={predictions.weather}
          />
        )}

        {activeView === 'satellite' && (
          <div className="satellite-grid">
            <div className="left-panel-container">
              <LeftPanel 
                coords={coords} 
                setCoords={setCoords} 
                ndviSeries={ndviSeries} 
                setMarkedNDVI={setMarkedNDVI} 
              />
            </div>
            <div className="map-view-container">
              <MapView 
                coords={coords}
                onNDVIChange={() => {}}
                onNDVISeriesChange={setNdviSeries}
                markedNDVI={markedNDVI}
              />
            </div>
            <div className="right-panel-container">
              <RightPanel ndviSeries={ndviSeries} />
            </div>
          </div>
        )}

        {activeView === 'predictions' && (
          <PredictionView predictions={predictions} />
        )}

        <div className="timeline-panel">
          <TimeBar 
            activeDate={activeDate} 
            setActiveDate={setActiveDate} 
            selectedArea={selectedArea} 
            setNdviSeries={setNdviSeries} 
          />
        </div>
      </div>
    </div>
  );
}
