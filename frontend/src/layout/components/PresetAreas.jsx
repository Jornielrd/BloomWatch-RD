import React from 'react';

const PRESET_AREAS = [
  {
    id: 'valle-cibao',
    name: 'Valle del Cibao',
    coords: { lat: 19.4517, lon: -70.6972 },
    description: 'Zona agrícola principal'
  },
  {
    id: 'san-juan',
    name: 'Valle de San Juan',
    coords: { lat: 18.8055, lon: -71.2300 },
    description: 'Región agrícola sur'
  },
  {
    id: 'azua',
    name: 'Llanura de Azua',
    coords: { lat: 18.4500, lon: -70.7333 },
    description: 'Zona semiárida'
  }
];

export default function PresetAreas({ onSelectArea }) {
  return (
    <div className="preset-areas mt-4">
      <h4 className="text-sm font-semibold mb-2">Zonas de Interés</h4>
      <div className="space-y-2">
        {PRESET_AREAS.map(area => (
          <button
            key={area.id}
            onClick={() => onSelectArea(area.coords)}
            className="w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="text-sm font-medium">{area.name}</div>
            <div className="text-xs text-gray-500">{area.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}