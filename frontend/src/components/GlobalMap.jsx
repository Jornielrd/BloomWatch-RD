import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function GlobalMap({ hotspots }) {
  const mapCenter = [18.5, -69.9]; // República Dominicana

  const getColorByRisk = (risk) => {
    switch (risk) {
      case 'alto': return '#ff4444';
      case 'moderado': return '#ffbb33';
      case 'bajo': return '#00C851';
      default: return '#33b5e5';
    }
  };

  const getRecommendations = (risk) => {
    switch (risk) {
      case 'alto':
        return [
          'Implementar monitoreo diario',
          'Activar protocolos de emergencia',
          'Notificar a autoridades locales',
          'Reducir actividades en la zona'
        ];
      case 'moderado':
        return [
          'Aumentar frecuencia de monitoreo',
          'Preparar medidas preventivas',
          'Revisar calidad del agua',
          'Documentar cambios observados'
        ];
      case 'bajo':
        return [
          'Mantener monitoreo regular',
          'Actualizar registros',
          'Verificar equipos de medición',
          'Continuar actividades normales'
        ];
      default:
        return ['Mantener vigilancia estándar'];
    }
  };

  return (
    <div className="global-map-container">
      <div className="map-legend">
        <h3>Niveles de Riesgo</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="color-dot alto"></span>
            Alto
          </div>
          <div className="legend-item">
            <span className="color-dot moderado"></span>
            Moderado
          </div>
          <div className="legend-item">
            <span className="color-dot bajo"></span>
            Bajo
          </div>
        </div>
      </div>

      <MapContainer center={mapCenter} zoom={7} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {hotspots.map((spot, index) => (
          <Circle
            key={index}
            center={[spot.lat, spot.lon]}
            radius={5000}
            pathOptions={{
              color: getColorByRisk(spot.riskLevel),
              fillColor: getColorByRisk(spot.riskLevel),
              fillOpacity: 0.5
            }}
          >
            <Popup>
              <div className="hotspot-popup">
                <h4>Zona: {spot.name}</h4>
                <p>Nivel de riesgo: <span className={`risk-${spot.riskLevel}`}>{spot.riskLevel}</span></p>
                <p>NDVI: {spot.ndvi}</p>
                <h5>Recomendaciones:</h5>
                <ul>
                  {getRecommendations(spot.riskLevel).map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}