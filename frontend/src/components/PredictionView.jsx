import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Componente para mostrar las predicciones y análisis
export default function PredictionView({ predictions = {
  ndvi: [],
  weather: [],
  plantHealth: {
    status: 'normal',
    label: 'Saludable',
    description: 'Las condiciones actuales son favorables.',
    recommendations: []
  }
} }) {
  return (
    <div className="prediction-container">
      <div className="prediction-header">
        <h2>Predicciones y Tendencias</h2>
        <p className="prediction-description">
          Análisis predictivo basado en Machine Learning para los próximos 30 días
        </p>
      </div>

      <div className="prediction-grid">
        <div className="prediction-card">
          <h3>Índice NDVI Proyectado</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={predictions.ndvi}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#4facfe" 
                  name="Predicción"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#00f2fe" 
                  name="Actual"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="prediction-card">
          <h3>Condiciones Climáticas</h3>
          <div className="weather-predictions">
            {predictions.weather.map((day, index) => (
              <div key={index} className="weather-day">
                <div className="weather-date">{day.date}</div>
                <div className="weather-icon">{day.icon}</div>
                <div className="weather-temp">{day.temp}°C</div>
                <div className="weather-desc">{day.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="prediction-card">
          <h3>Estado de Plantaciones</h3>
          <div className="plant-health-indicator">
            <div className={`health-level ${predictions.plantHealth.status}`}>
              {predictions.plantHealth.label}
            </div>
            <p className="health-description">
              {predictions.plantHealth.description}
            </p>
          </div>
          <div className="recommendations">
            <h4>Acciones Recomendadas:</h4>
            <ul>
              {predictions.plantHealth.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="action-guide">
        <h3>Guía de Acciones por Color</h3>
        <div className="color-guide">
          <div className="color-item red">
            <div className="color-box"></div>
            <div className="color-info">
              <h4>Rojo - Acción Inmediata</h4>
              <p>Indica alto riesgo. Requiere intervención inmediata y notificación a autoridades.</p>
            </div>
          </div>
          <div className="color-item yellow">
            <div className="color-box"></div>
            <div className="color-info">
              <h4>Amarillo - Precaución</h4>
              <p>Riesgo moderado. Aumentar monitoreo y preparar medidas preventivas.</p>
            </div>
          </div>
          <div className="color-item green">
            <div className="color-box"></div>
            <div className="color-info">
              <h4>Verde - Normal</h4>
              <p>Condiciones favorables. Mantener monitoreo regular.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}