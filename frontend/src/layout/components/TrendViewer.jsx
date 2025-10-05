import React from 'react';
import { Link } from 'react-router-dom';

export default function TrendViewer({ ndviSeries, activeArea }) {
  return (
    <div className="trend-viewer">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium mb-2">
          Tendencia NDVI - {activeArea || 'Área Actual'}
        </h3>
        <div className="h-28 mt-2 bg-gray-50 rounded flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            {ndviSeries.length 
              ? `Último NDVI: ${ndviSeries[ndviSeries.length - 1]?.value || 'N/A'}`
              : 'No hay datos disponibles'}
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <Link 
          to="/dashboard" 
          className="block px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 text-center"
        >
          Ver análisis completo →
        </Link>
      </div>
    </div>
  );
}
}