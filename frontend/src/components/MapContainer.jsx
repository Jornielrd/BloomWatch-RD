import React, { useEffect, useState } from 'react';
import LeftPanel from '../layout/LeftPanel';
import MapView from '../layout/MapView';
import RightPanel from '../layout/RightPanel';
import TimeBar from '../layout/TimeBar';
import { ping } from '../api';

export default function MapContainer() {
  const [coords, setCoords] = useState({ lat: 18.5, lon: -69.9 });
  const [selectedArea, setSelectedArea] = useState(null);
  const [activeDate, setActiveDate] = useState('');
  const [activeLayer, setActiveLayer] = useState('imagery');
  const [imageryData, setImageryData] = useState(null);
  const [ndviGrid, setNdviGrid] = useState(null);
  const [ndviSeries, setNdviSeries] = useState([]);
  const [status, setStatus] = useState('inicializando');

  useEffect(() => {
    ping().then(() => setStatus('backend ok')).catch(() => setStatus('backend no disponible'));
  }, []);

  return (
    <div className="flex h-screen">
      <LeftPanel
        coords={coords}
        selectedArea={selectedArea}
        activeDate={activeDate}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        ndviGrid={ndviGrid}
        ndviSeries={ndviSeries}
      />
      <div className="flex-grow flex flex-col">
        <MapView
          coords={coords}
          setCoords={setCoords}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          imageryData={imageryData}
          setImageryData={setImageryData}
          ndviGrid={ndviGrid}
          setNdviGrid={setNdviGrid}
          ndviSeries={ndviSeries}
          setNdviSeries={setNdviSeries}
          activeLayer={activeLayer}
          activeDate={activeDate}
        />
        <TimeBar
          activeDate={activeDate}
          setActiveDate={setActiveDate}
          selectedArea={selectedArea}
          ndviSeries={ndviSeries}
        />
      </div>
      <RightPanel selectedArea={selectedArea} ndviSeries={ndviSeries} />
    </div>
  );
}