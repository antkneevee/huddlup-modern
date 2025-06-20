import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

const PlayEditor = () => {
  const [lines, setLines] = useState([]);
  const [tempSegment, setTempSegment] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getPointerPos = (e) => e.target.getStage().getPointerPosition();

  const handleDrawStart = (e) => {
    const pos = getPointerPos(e);
    if (!pos) return;
    setTempSegment({ points: [pos.x, pos.y, pos.x, pos.y] });
    setIsDrawing(true);
  };

  const handleDrawMove = (e) => {
    if (!isDrawing || !tempSegment) return;
    const pos = getPointerPos(e);
    if (!pos) return;
    setTempSegment((prev) => ({
      ...prev,
      points: [prev.points[0], prev.points[1], pos.x, pos.y],
    }));
  };

  const handleDrawEnd = () => {
    if (tempSegment) {
      setLines((prev) => [...prev, { points: tempSegment.points }]);
    }
    setTempSegment(null);
    setIsDrawing(false);
  };

  return (
    <div className="w-full h-full bg-gray-100">
      <Toolbar />
      <div className="flex justify-center items-center px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg p-2 w-full max-w-5xl h-[500px]">
          <Canvas
            lines={lines}
            tempSegment={tempSegment}
            onPointerDown={handleDrawStart}
            onPointerMove={handleDrawMove}
            onPointerUp={handleDrawEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayEditor;