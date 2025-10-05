import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DashboardOverview({ ndviData, weatherData }) {
  const stats = {
    ndviAverage: ndviData?.reduce((acc, val) => acc + val.value, 0) / ndviData?.length || 0,
    lastUpdate: new Date().toLocaleDateString(),
    alertLevel: 'Moderado',
    recommendations: [
      'Monitorear cambios de coloración en el agua',
      'Verificar niveles de nutrientes',
      'Mantener registro de temperatura'
    ]
  };

  return (
    <div className="overview-container">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Índice NDVI Promedio</h3>
          <div className="stat-value">{stats.ndviAverage.toFixed(2)}</div>
          <div className="stat-description">
            Valor promedio de vegetación en la zona seleccionada
          </div>
        </div>
        <div className="stat-card">
          <h3>Nivel de Alerta</h3>
          <div className={`stat-value alert-${stats.alertLevel.toLowerCase()}`}>
            {stats.alertLevel}
          </div>
          <div className="stat-description">
            Basado en análisis de datos históricos
          </div>
        </div>
        <div className="stat-card">
          <h3>Última Actualización</h3>
          <div className="stat-value">{stats.lastUpdate}</div>
          <div className="stat-description">
            Datos actualizados automáticamente
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Tendencia NDVI últimos 30 días</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ndviData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4facfe" 
                fill="url(#ndviGradient)" 
              />
              <defs>
                <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recommendations-section">
        <h3>Recomendaciones Actuales</h3>
        <ul className="recommendations-list">
          {stats.recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              <span className="recommendation-icon">✓</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}