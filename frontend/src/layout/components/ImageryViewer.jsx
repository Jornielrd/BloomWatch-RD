import React from 'react';

export default function ImageryViewer({ imagery }) {
  if (!imagery) return <div>No hay imagen</div>;
  return (
    <div>
      <img src={imagery.image} alt="sat" style={{ width: '100%', borderRadius: 4 }} />
      <div><b>Fecha:</b> {imagery.meta && imagery.meta.date ? imagery.meta.date : 'N/A'}</div>
    </div>
  );
}