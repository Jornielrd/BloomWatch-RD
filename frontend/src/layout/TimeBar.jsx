import React, { useEffect, useState } from 'react';

export default function TimeBar({ activeDate, setActiveDate, selectedArea, setNdviSeries }) {
  const [dates, setDates] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (selectedArea && selectedArea.series) {
      setDates(selectedArea.series.map(s => s.date));
      setNdviSeries(selectedArea.series);
    }
  }, [selectedArea]);

  useEffect(() => {
    let t;
    if (playing && dates.length > 0) {
      t = setInterval(() => {
        setIndex(i => {
          const nx = (i + 1) % dates.length;
          setActiveDate(dates[nx]);
          return nx;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [playing, dates]);

  useEffect(() => {
    if (dates.length > 0) setActiveDate(dates[index]);
  }, [index, dates]);

  if (!selectedArea) return <div className="timebar">Selecciona un área para activar la barra de tiempo</div>;

  return (
    <div className="timebar">
      <button onClick={() => setPlaying(p => !p)}>{playing ? 'Pausar' : 'Play'}</button>
      <input type="range" min="0" max={Math.max(0, dates.length - 1)} value={index} onChange={e => setIndex(Number(e.target.value))} />
      <div>{dates[index]}</div>
    </div>
  );
}