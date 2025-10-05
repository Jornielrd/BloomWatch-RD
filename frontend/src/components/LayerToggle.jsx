import React from 'react';

export default function LayerToggle({ activeLayer, setActiveLayer }) {
  return (
    <div>
      <h4>Capas</h4>
      <label><input type="radio" checked={activeLayer === 'imagery'} onChange={() => setActiveLayer('imagery')} /> Imagery</label>
      <label><input type="radio" checked={activeLayer === 'ndvi'} onChange={() => setActiveLayer('ndvi')} /> NDVI</label>
    </div>
  );
}