
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const Canvas = () => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempSegment, setTempSegment] = useState(null);
  const stageRef = useRef(null);

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight * (window.innerWidth < 768 ? 0.85 : 0.75),
    scale: window.devicePixelRatio || 1,
  });

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight * (window.innerWidth < 768 ? 0.85 : 0.75),
        scale: window.devicePixelRatio || 1,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPointerPos = (e) => {
    const stage = e.target.getStage();
    return stage.getPointerPosition();
  };

  const handleStart = (e) => {
    if (e.evt?.preventDefault) e.evt.preventDefault();
    const pos = getPointerPos(e);
    if (!pos) return;
    setTempSegment({ points: [pos.x, pos.y, pos.x, pos.y] });
    setIsDrawing(true);
  };

  const handleMove = (e) => {
    if (!isDrawing || !tempSegment) return;
    if (e.evt?.preventDefault) e.evt.preventDefault();
    const pos = getPointerPos(e);
    if (!pos) return;
    setTempSegment((prev) => ({
      ...prev,
      points: [prev.points[0], prev.points[1], pos.x, pos.y],
    }));
  };

  const handleEnd = (e) => {
    if (e?.evt?.preventDefault) e.evt.preventDefault();
    if (tempSegment) {
      setLines((prev) => [...prev, { points: tempSegment.points }]);
    }
    setTempSegment(null);
    setIsDrawing(false);
  };

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      scaleX={stageSize.scale}
      scaleY={stageSize.scale}
      pixelRatio={stageSize.scale}
      ref={stageRef}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{
        background: '#ffffff',
        border: '1px solid #ccc',
        touchAction: 'none',
        width: stageSize.width,
        height: stageSize.height,
      }}
    >
      <Layer>
        {tempSegment && (
          <Line
            points={tempSegment.points}
            stroke="#000000"
            strokeWidth={2}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            dash={[10, 10]}
          />
        )}
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#000000"
            strokeWidth={2}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
