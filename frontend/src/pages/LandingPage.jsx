import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1>BloomWatch RD</h1>
        <p className="hero-description">
          Monitoreo satelital inteligente para el análisis de floraciones algales en República Dominicana
        </p>
        <Link to="/dashboard" className="cta-button">
          Ir al Dashboard
        </Link>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🛰️</div>
          <h3>Datos Satelitales</h3>
          <p>Monitoreo en tiempo real con imágenes de satélite NASA</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Análisis NDVI</h3>
          <p>Índices de vegetación para detección temprana</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌊</div>
          <h3>Predicción</h3>
          <p>Alertas tempranas de floraciones algales</p>
        </div>
      </div>

      <div className="info-section">
        <h2>¿Cómo funciona?</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <p>Selecciona una ubicación en el mapa</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <p>Visualiza datos satelitales y métricas</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Recibe alertas y análisis detallados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
