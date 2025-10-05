// backend/server.js
// Servidor minimal con endpoints de astronomía, NDVI demo y utilidades.
// Asegúrate de tener .env (si usas claves) y de instalar dependencias: express, cors, dotenv, body-parser

const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Importar utilidades de astronomy temprano para evitar TDZ o dependencias circulares
const { lunarPhase, saharaDustLikelihood } = require('./astronomy');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Manejo básico de errores sincronizados y no sincronizados
process.on('uncaughtException', err => {
  console.error('uncaughtException', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', err => {
  console.error('unhandledRejection', err && err.stack ? err.stack : err);
});

// Ping simple
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// Endpoint: fase lunar
app.get('/api/astronomy/lunar', (req, res) => {
  try {
    const date = req.query.date || null;
    const result = lunarPhase(date);
    res.json(result);
  } catch (err) {
    console.error('lunar endpoint error', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'failed to compute lunar phase' });
  }
});

// Endpoint: probabilidad heurística de polvo Sahara
app.get('/api/astronomy/sahara', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const date = req.query.date || null;

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ error: 'lat and lon query params required and must be numbers' });
    }

    const result = saharaDustLikelihood(lat, lon, date);
    res.json(result);
  } catch (err) {
    console.error('sahara endpoint error', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'failed to compute sahara likelihood' });
  }
});

// Endpoint: NDVI proxy demo (por punto)
app.get('/api/ndvi-proxy', (req, res) => {
  try {
    const lat = Number(req.query.lat || 0);
    const lon = Number(req.query.lon || 0);
    // Respuesta demo para evitar errores en frontend durante integraciones iniciales
    res.json({ lat, lon, ndvi: 0.34, date: new Date().toISOString().slice(0,10) });
  } catch (err) {
    console.error('ndvi-proxy error', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'failed ndvi proxy' });
  }
});

// Nuevo: Endpoint NDVI grid demo (centro lat/lon, tamaño n x n)
app.get('/api/ndvi-grid', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat || '0');
    const lon = parseFloat(req.query.lon || '0');
    const size = Math.max(1, Math.min(25, parseInt(req.query.size || '7', 10)));
    const cellSize = 0.02; // grados aprox por celda

    // generar grid centrado en lat/lon
    const half = Math.floor(size / 2);
    const grid = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const r = i - half;
        const c = j - half;
        const cellLat = lat + r * cellSize;
        const cellLon = lon + c * cellSize;
        // NDVI demo: función suave que depende de lat/lon
        const ndvi = Math.max(-0.2, Math.min(0.8, 0.2 + 0.15 * Math.sin(cellLat * Math.PI) + 0.15 * Math.cos(cellLon * Math.PI)));
        row.push({ lat: Number(cellLat.toFixed(6)), lon: Number(cellLon.toFixed(6)), ndvi: Number(ndvi.toFixed(3)) });
      }
      grid.push(row);
    }

    res.json({ lat, lon, size, grid });
  } catch (err) {
    console.error('ndvi-grid error', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'failed to compute ndvi grid' });
  }
});

// Nuevo: Endpoint demo para NDVI por área (serie temporal simple)
// Acepta ?lat & ?lon para respuestas rápidas; puede extenderse para recibir GeoJSON en body
app.get('/api/area/ndvi', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat || '0');
    const lon = parseFloat(req.query.lon || '0');
    // Generar serie demo (últimos 10 días)
    const series = Array.from({ length: 10 }, (_, k) => {
      const date = new Date();
      date.setDate(date.getDate() - (9 - k));
      const value = Number((0.25 + 0.12 * Math.sin((lat + lon + k) * 0.5)).toFixed(3));
      return { date: date.toISOString().slice(0,10), value };
    });
    res.json({ lat, lon, series });
  } catch (err) {
    console.error('area ndvi error', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'failed to compute area ndvi' });
  }
});

// Endpoint: weather demo
app.get('/api/weather', (req, res) => {
  try {
    // Respuesta demo para pruebas UX; sustituir por integración real a Open-Meteo u otro
    const sample = {
      daily: {
        precipitation_sum: [0, 0.2, 0, 1.5, 0, 0, 0],
        time: ['2025-09-25','2025-09-26','2025-09-27','2025-09-28','2025-09-29','2025-09-30','2025-10-01']
      }
    };
    res.json({ data: sample });
  } catch (err) {
    console.error('weather error', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'failed to fetch weather' });
  }
});

// Handler 404
app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

// Error handler final
app.use((err, req, res, next) => {
  console.error('express error handler', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'server error' });
});

// Arrancar servidor
app.listen(PORT, HOST, () => {
  console.log(`Backend listening on ${HOST}:${PORT}`);
});
