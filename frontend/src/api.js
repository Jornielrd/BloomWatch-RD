import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function ping() { return (await axios.get(`${BASE}/api/ping`)).data; }
export async function fetchImagery(lat, lon, date) { return (await axios.get(`${BASE}/api/earth/imagery`, { params: { lat, lon, date } })).data; }
export async function fetchNDVI(lat, lon, date) { return (await axios.get(`${BASE}/api/ndvi-proxy`, { params: { lat, lon, date } })).data; }
export async function fetchNDVIGrid(lat, lon, date, size) { return (await axios.get(`${BASE}/api/ndvi-grid`, { params: { lat, lon, date, size } })).data; }
export async function fetchAreaNDVI(geojson, startDate, endDate) { return (await axios.post(`${BASE}/api/area/ndvi`, { geojson, startDate, endDate })).data; }
export async function fetchLunar(date) { return (await axios.get(`${BASE}/api/astronomy/lunar`, { params: { date } })).data; }
export async function fetchSahara(lat, lon, date) { return (await axios.get(`${BASE}/api/astronomy/sahara`, { params: { lat, lon, date } })).data; }
export async function fetchWeather(lat, lon, start, end) { return (await axios.get(`${BASE}/api/weather`, { params: { lat, lon, start, end } })).data; }