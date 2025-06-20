import React, { useRef, useEffect, useState } from 'react';
import useDefensePositions from '../hooks/useDefensePositions';
import {
  Stage,
  Layer,
  Path,
  Circle,
  Rect,
  Ellipse,
  Star,
  Line,
  Arrow,
  Text,
  Group,
  Label,
  Tag,
  RegularPolygon
} from 'react-konva';
import { line as d3Line, curveBasis, curveLinear } from 'd3-shape';
import huddlupWatermark from '../assets/huddlup_logo_black_w_trans.png';

function pointsToXY(points) {
  const arr = [];
  for (let i = 0; i < points.length - 1; i += 2) {
    arr.push({ x: points[i], y: points[i + 1] });
  }
  return arr;
}

// Adjust arrow head size for better scaling
function getArrowHeadPoints(points, length = 15, width = 15) {
  const [x1, y1, x2, y2] = points.slice(-4);
  const angle = Math.atan2(y2 - y1, x2 - x1);

  const left = {
    x: x2 - length * Math.cos(angle) + width * Math.sin(angle),
    y: y2 - length * Math.sin(angle) - width * Math.cos(angle)
  };
  const right = {
    x: x2 - length * Math.cos(angle) - width * Math.sin(angle),
    y: y2 - length * Math.sin(angle) + width * Math.cos(angle)
  };
  return [x2, y2, left.x, left.y, right.x, right.y];

}

function getTMarkerPoints(points, length = 10) {
  const [x1, y1, x2, y2] = points.slice(-4);
  const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
  const half = length / 2;
  const dx = Math.cos(angle) * half;
  const dy = Math.sin(angle) * half;
  return [x2 - dx, y2 - dy, x2 + dx, y2 + dy];
}

function getZigZagPoints(points, amplitude = 6, segmentLength = 15) {
  const result = [];
  for (let i = 0; i < points.length - 3; i += 2) {
    const x1 = points[i];
    const y1 = points[i + 1];
    const x2 = points[i + 2];
    const y2 = points[i + 3];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const offsetX = Math.sin(angle);
    const offsetY = -Math.cos(angle);
    const steps = Math.max(1, Math.round(dist / segmentLength));
    const step = dist / steps;

    if (result.length === 0) result.push(x1, y1);

    for (let j = 0; j < steps; j++) {
      const startLen = j * step;
      const midLen = startLen + step / 2;
      const endLen = startLen + step;
      const mx =
        x1 + (dx * midLen) / dist + amplitude * offsetX * (j % 2 === 0 ? 1 : -1);
      const my =
        y1 + (dy * midLen) / dist + amplitude * offsetY * (j % 2 === 0 ? 1 : -1);
      const ex = x1 + (dx * endLen) / dist;
      const ey = y1 + (dy * endLen) / dist;
      result.push(mx, my, ex, ey);
    }
  }
  return result;
}


const FootballField = ({
  players,
  setPlayers,
  setSelectedPlayerIndex,
  routes,
  setRoutes,
  selectedPlayerIndex,
  setUndoStack,
  notes,
  setNotes,
  selectedRouteIndex,
  setSelectedRouteIndex,
  setSelectedNoteIndex,
  handlePointDrag,
  stageRef,
  defenseFormation
}) => {
  const width = 800;
  const height = 600;
  const [scale, setScale] = useState(1);
  const lineOfScrimmageY = height - 250;
  const yardLineSpacing = 55;

  const defaultDefensePositions = useDefensePositions(defenseFormation);
  const [defensePlayers, setDefensePlayers] = useState(defaultDefensePositions);

  useEffect(() => {
    setDefensePlayers(defaultDefensePositions);
  }, [defaultDefensePositions]);

  const localStageRef = useRef(null);
  const containerRef = useRef(null);
  const layerRef = useRef(null);
  const indicatorRef = useRef(null);
  const playerRefs = useRef({});
  const [crosshair, setCrosshair] = useState(null);
  const [tempSegment, setTempSegment] = useState(null);
  const pinchRef = useRef({ distance: null, scale: 1 });

  const showCrosshair = (x, y) => {
    setCrosshair({ x, y });
  };

  const hideCrosshair = () => {
    setCrosshair(null);
  };

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.offsetWidth;
      const newScale = Math.min(1, availableWidth / width);
      setScale(newScale);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const stageWidth = width * scale;
    const scrollLeft = Math.max(0, (stageWidth - container.clientWidth) / 2);
    container.scrollLeft = scrollLeft;
  }, [scale]);



  useEffect(() => {
    if (localStageRef.current && stageRef) {
      stageRef.current = localStageRef.current;
    }
  }, [stageRef]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  }, [players, routes, notes]);


  const lines = [];
  lines.push({
    points: [0, lineOfScrimmageY, width, lineOfScrimmageY],
    stroke: 'black',
    strokeWidth: 3
  });

  for (let y = lineOfScrimmageY - yardLineSpacing * 2; y >= 0; y -= yardLineSpacing * 2) {
    lines.push({
      points: [0, y, width, y],
      stroke: '#ccc',
      strokeWidth: 1
    });
  }

  for (let y = lineOfScrimmageY + yardLineSpacing * 2; y <= height; y += yardLineSpacing * 2) {
    lines.push({
      points: [0, y, width, y],
      stroke: '#ccc',
      strokeWidth: 1
    });
  }

  const PLAYER_RADIUS = 30;
  const DEFENSE_RADIUS = 35;
  const getDragBoundFunc = (radius) => (pos) => {
    const newX = Math.max(radius, Math.min(width - radius, pos.x));
    const newY = Math.max(radius, Math.min(height - radius, pos.y));
    return { x: newX, y: newY };
  };

  const dragBoundFunc = getDragBoundFunc(PLAYER_RADIUS);
  const dragBoundDefense = getDragBoundFunc(DEFENSE_RADIUS);


  const handleDragEnd = (e, index) => {
    const updatedPlayers = [...players];
    const prevX = updatedPlayers[index].x;
    const prevY = updatedPlayers[index].y;

    const newX = e.target.x();
    const newY = e.target.y();

    updatedPlayers[index].x = newX;
    updatedPlayers[index].y = newY;
    setPlayers(updatedPlayers);

    const dx = newX - prevX;
    const dy = newY - prevY;

    // Keep routes in sync with player start positions
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) => {
        if (route.playerId !== updatedPlayers[index].id) return route;
        if (!route.points || route.points.length < 2) return route;

        const newPoints = [...route.points];
        for (let i = 0; i < newPoints.length; i += 2) {
          newPoints[i] += dx;
          if (i + 1 < newPoints.length) {
            newPoints[i + 1] += dy;
          }
        }
        return { ...route, points: newPoints };
      })
    );
  };

  const handleClick = (index) => {
    setSelectedPlayerIndex(index);
    if (setSelectedNoteIndex) setSelectedNoteIndex(null);

    // When a player is selected, automatically select their active route
    if (routes && setSelectedRouteIndex) {
      const playerId = players[index].id;
      const routeIdx = routes.findIndex((r) => r.playerId === playerId && !r.finished);
      if (routeIdx !== -1) {
        setSelectedRouteIndex(routeIdx);
      } else {
        const lastRouteIdx = [...routes].reverse().findIndex((r) => r.playerId === playerId);
        setSelectedRouteIndex(lastRouteIdx === -1 ? null : routes.length - 1 - lastRouteIdx);
      }
    }
  };

  const startTempSegment = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (setSelectedNoteIndex) setSelectedNoteIndex(null);
    if (clickedOnEmpty && selectedPlayerIndex !== null) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

      const { x, y } = pointerPosition;
      const scaledX = x / scale;
      const scaledY = y / scale;
      const selectedPlayer = players[selectedPlayerIndex];

      let startX = selectedPlayer.x;
      let startY = selectedPlayer.y;

      let targetRoute = null;
      for (let i = routes.length - 1; i >= 0; i--) {
        const route = routes[i];
        if (route.playerId === selectedPlayer.id && !route.finished) {
          targetRoute = route;
          break;
        }
      }

      if (targetRoute) {
        startX = targetRoute.points[targetRoute.points.length - 2];
        startY = targetRoute.points[targetRoute.points.length - 1];
      }

      setTempSegment({
        playerId: selectedPlayer.id,
        color: selectedPlayer.fill,
        points: [startX, startY, scaledX, scaledY],
      });
      showCrosshair(scaledX, scaledY);
    }
  };

  const updateTempSegment = (e) => {
    if (!tempSegment) return;
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const { x, y } = pointerPosition;
    const scaledX = x / scale;
    const scaledY = y / scale;

    setTempSegment((prev) => ({
      ...prev,
      points: [prev.points[0], prev.points[1], scaledX, scaledY],
    }));
    showCrosshair(scaledX, scaledY);
  };

  const commitTempSegment = () => {
    if (!tempSegment) return;

    setUndoStack((prev) => [
      ...prev,
      {
        players: structuredClone(players),
        routes: structuredClone(routes),
        notes: structuredClone(notes),
      },
    ]);

    const { playerId, color, points } = tempSegment;
    let newRoutes = [...routes];

    let targetRoute = null;
    for (let i = newRoutes.length - 1; i >= 0; i--) {
      const route = newRoutes[i];
      if (route.playerId === playerId && !route.finished) {
        targetRoute = route;
        break;
      }
    }

    let targetIndex = -1;
    if (targetRoute) {
      targetRoute.points.push(points[2], points[3]);
      targetIndex = newRoutes.indexOf(targetRoute);
    } else {
      newRoutes.push({
        playerId,
        points,
        color,
        style: 'solid',
        smooth: false,
        endMarker: 'arrow',
        showLastSegment: true,
        finished: false,
        thickness: 7,
      });
      targetIndex = newRoutes.length - 1;
    }

    setRoutes(newRoutes);
    if (setSelectedRouteIndex && targetIndex !== -1) {
      setSelectedRouteIndex(targetIndex);
    }
    setTempSegment(null);
    hideCrosshair();
  };

  const handleRouteClick = (e, index) => {
    e.cancelBubble = true;
    setSelectedRouteIndex(index);
    if (setSelectedPlayerIndex && players) {
      const playerId = routes[index].playerId;
      const pIndex = players.findIndex((p) => p.id === playerId);
      if (pIndex !== -1) setSelectedPlayerIndex(pIndex);
    }
  };


  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto no-scrollbar relative"
      style={{ touchAction: 'none' }}
    >
      <img
        src={huddlupWatermark}
        alt="huddlup watermark"
        className="absolute inset-0 m-auto opacity-10 pointer-events-none select-none z-20"
        style={{ width: width * scale * 0.8 }}
      />
    <Stage
      ref={localStageRef}
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      style={{ width: width * scale, height: height * scale, margin: '0 auto' }}
      className="bg-white border border-gray-300 relative z-10"
      onPointerDown={(e) => {
        startTempSegment(e);
      }}
      onPointerMove={(e) => {
        updateTempSegment(e);
      }}
      onPointerUp={() => {
        commitTempSegment();
      }}
      onTouchStart={(e) => {
        e.evt?.preventDefault();
        if (e.evt.touches && e.evt.touches.length === 2) {
          const [t1, t2] = e.evt.touches;
          pinchRef.current = {
            distance: Math.hypot(
              t1.clientX - t2.clientX,
              t1.clientY - t2.clientY
            ),
            scale,
          };
        } else {
          startTempSegment(e);
        }
      }}
      onTouchMove={(e) => {
        if (e.evt.touches && e.evt.touches.length === 2 && pinchRef.current.distance) {
          const [t1, t2] = e.evt.touches;
          const newDistance = Math.hypot(
            t1.clientX - t2.clientX,
            t1.clientY - t2.clientY
          );
          const newScale =
            (newDistance / pinchRef.current.distance) * pinchRef.current.scale;
          setScale(Math.max(0.5, Math.min(2, newScale)));
        } else {
          updateTempSegment(e);
        }
      }}
      onTouchEnd={() => {
        pinchRef.current.distance = null;
        commitTempSegment();
      }}
    >
      <Layer ref={layerRef}>
        {/* Field Lines */}
        {lines.map((line, index) => (
          <Path
            key={index}
            data={`M${line.points[0]},${line.points[1]} L${line.points[2]},${line.points[3]}`}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
          />
        ))}

        {/* Routes */}
        {tempSegment && (
          <Line
            points={tempSegment.points}
            stroke={tempSegment.color}
            strokeWidth={7}
            dash={[10, 10]}
            opacity={0.5}
            listening={false}
          />
        )}
        {routes.map((route, index) => {
          const isSelected = selectedRouteIndex === index;
          const { points, color, style, endMarker, smooth, thickness } = route;

          let d3Path = '';
          let zigzagPoints = [];
          if (points.length >= 4) {
            const pointsArray = pointsToXY([...points]);
            if (smooth) {
              const lastPoint = pointsArray[pointsArray.length - 1];
              // Duplicate the last point twice to help smooth the end segment
              pointsArray.push({ x: lastPoint.x, y: lastPoint.y });
              pointsArray.push({ x: lastPoint.x, y: lastPoint.y });
            }

            const lineGenerator = d3Line()
              .x((d) => d.x)
              .y((d) => d.y)
              .curve(smooth ? curveBasis : curveLinear);

            d3Path = lineGenerator(pointsArray);

            if (style === 'zigzag') {
              zigzagPoints = getZigZagPoints(points);
            }
          }

          return (
            <React.Fragment key={index}>
              {style === 'zigzag'
                ? zigzagPoints.length > 0 && (
                    <Line
                      points={zigzagPoints}
                      stroke={color}
                      strokeWidth={thickness || 7}
                      hitStrokeWidth={20}
                      onClick={(e) => handleRouteClick(e, index)}
                    />
                  )
                : d3Path && (
                    <Path
                      data={d3Path}
                      stroke={color}
                      strokeWidth={thickness || 7}
                      dash={style === 'dashed' ? [10, 10] : []}
                      hitStrokeWidth={20}
                      onClick={(e) => handleRouteClick(e, index)}
                    />
                  )}
              {endMarker === 'arrow' && points.length >= 4 && (
                smooth || style === 'zigzag' ? (
                  <Line
                    points={getArrowHeadPoints(points)}
                    closed
                    fill={color}
                    stroke={color}
                    strokeWidth={1}
                    hitStrokeWidth={20}
                    onClick={(e) => handleRouteClick(e, index)}
                  />
                ) : (
                  <Arrow
                    points={points.slice(-4)}
                    stroke={color}
                    fill={color}
                    pointerLength={15}
                    pointerWidth={15}
                    strokeWidth={thickness || 7}
                    dash={style === 'dashed' ? [10, 10] : []}
                    hitStrokeWidth={20}
                    onClick={(e) => handleRouteClick(e, index)}
                  />
                )
              )}
              {endMarker === 'dot' && points.length >= 2 && (
                <Circle
                  x={points[points.length - 2]}
                  y={points[points.length - 1]}
                  radius={(thickness ? thickness / 2 : 3) * 3}
                  fill={color}
                  stroke={color}
                  hitStrokeWidth={20}
                  onClick={(e) => handleRouteClick(e, index)}
                />
              )}
              {endMarker === 'T' && points.length >= 4 && (
                <Line
                  points={getTMarkerPoints(points, (thickness || 10) * 3)}
                  stroke={color}
                  strokeWidth={thickness || 7}
                  hitStrokeWidth={20}
                  onClick={(e) => handleRouteClick(e, index)}
                />
              )}
              {isSelected &&
                points.map((_, i) => {
                  if (i % 2 !== 0) return null;
                  const x = points[i];
                  const y = points[i + 1];
                  return (
                    <Circle
                      key={`${index}-pt-${i}`}
                      x={x}
                      y={y}
                      radius={6}
                      fill="#FFD700"
                      stroke="#000"
                      strokeWidth={1}
                      draggable
                      onDragStart={(e) => showCrosshair(e.target.x(), e.target.y())}
                      onDragMove={(e) => {
                        showCrosshair(e.target.x(), e.target.y());
                        handlePointDrag(index, i / 2, e.target.x(), e.target.y());
                      }}
                      onDragEnd={() => hideCrosshair()}
                    />
                  );
                })}
            </React.Fragment>
          );
        })}

        {/* Notes */}
        {notes.map((note, index) => (
          <Label
            key={index}
            x={note.x}
            y={note.y}
            draggable
            onClick={(e) => {
              e.cancelBubble = true;
              if (setSelectedNoteIndex) setSelectedNoteIndex(index);
              if (setSelectedPlayerIndex) setSelectedPlayerIndex(null);
              if (setSelectedRouteIndex) setSelectedRouteIndex(null);
            }}
            onDragStart={(e) => showCrosshair(e.target.x(), e.target.y())}
            onDragMove={(e) => showCrosshair(e.target.x(), e.target.y())}
            onDragEnd={(e) => {
              hideCrosshair();
              const updatedNotes = [...notes];
              updatedNotes[index].x = e.target.x();
              updatedNotes[index].y = e.target.y();
              setNotes(updatedNotes);
            }}
          >
            <Tag
              fill={note.backgroundColor}
              stroke={note.border ? '#000' : undefined}
              strokeWidth={note.border ? 1 : 0}
              cornerRadius={4}
            />
            <Text
              text={note.text}
              fontSize={note.fontSize}
              fill={note.fontColor}
              fontStyle={`${note.bold ? 'bold' : ''}${note.italic ? ' italic' : ''}`.trim() || 'normal'}
              textDecoration={note.underline ? 'underline' : undefined}
              padding={4}
            />
          </Label>
        ))}

        {/* Players */}
        {players.map((player, index) => (
          <Group
            key={index}
            x={player.x}
            y={player.y}
            ref={(node) => {
              if (node) playerRefs.current[player.id] = node;
            }}
            draggable
            dragBoundFunc={dragBoundFunc}
            onDragStart={(e) => showCrosshair(e.target.x(), e.target.y())}
            onDragMove={(e) => showCrosshair(e.target.x(), e.target.y())}
            onDragEnd={(e) => {
              hideCrosshair();
              handleDragEnd(e, index);
            }}
            onClick={() => handleClick(index)}
            onTap={() => handleClick(index)}
          >
            {selectedPlayerIndex === index && (
              <Circle
                ref={indicatorRef}
                x={0}
                y={0}
                radius={40}
                stroke="#FFA500"
                strokeWidth={3}
                dash={[10, 5]}
                listening={false}
              />
            )}
            {player.shape === 'circle' && (
              <Circle
                x={0}
                y={0}
                radius={30}
                fill={player.fill}
                stroke={player.border ? '#000' : null}
                strokeWidth={player.border ? 2 : 0}
              />
            )}
            {player.shape === 'square' && (
              <Rect
                x={-30}
                y={-30}
                width={60}
                height={60}
                fill={player.fill}
                stroke={player.border ? '#000' : null}
                strokeWidth={player.border ? 2 : 0}
              />
            )}
            {player.shape === 'oval' && (
              <Ellipse
                x={0}
                y={0}
                radiusX={30}
                radiusY={20}
                fill={player.fill}
                stroke={player.border ? '#000' : null}
                strokeWidth={player.border ? 2 : 0}
              />
            )}
            {player.shape === 'star' && (
              <Star
                x={0}
                y={0}
                numPoints={5}
                innerRadius={15}
                outerRadius={30}
                fill={player.fill}
                stroke={player.border ? '#000' : null}
                strokeWidth={player.border ? 2 : 0}
              />
            )}
            <Text
              text={player.id}
              fontSize={24}
              fill={player.textColor}
              fontStyle="bold"
              align="center"
              offsetX={12}
              offsetY={12}
              x={3}
              y={4}
            />
          </Group>
        ))}

        {/* Defensive Players */}
        {defensePlayers.map((pos, idx) => (
          <Group
            key={`def-${idx}`}
            x={pos.x}
            y={pos.y}
            draggable
            dragBoundFunc={dragBoundDefense}
            onDragStart={(e) => showCrosshair(e.target.x(), e.target.y())}
            onDragMove={(e) => showCrosshair(e.target.x(), e.target.y())}
            onDragEnd={(e) => {
              hideCrosshair();
              const updated = [...defensePlayers];
              updated[idx].x = e.target.x();
              updated[idx].y = e.target.y();
              setDefensePlayers(updated);
            }}
          >
            <RegularPolygon
              x={0}
              y={0}
              sides={3}
              radius={35}
              fill="#6B7280"
              rotation={180}
              cornerRadius={5}
            />
            <Text
              text="D"
              fontSize={24}
              fill="white"
              fontStyle="bold"
              align="center"
              offsetX={12}
              offsetY={12}
              x={3}
              y={4}
            />
          </Group>
        ))}

        {crosshair && (
          <>
            <Line
              points={[crosshair.x, 0, crosshair.x, height]}
              stroke="#d1d5db"
              strokeWidth={1}
              listening={false}
            />
            <Line
              points={[0, crosshair.y, width, crosshair.y]}
              stroke="#d1d5db"
              strokeWidth={1}
              listening={false}
            />
          </>
        )}
      </Layer>
    </Stage>
    </div>
  );
};

export default FootballField;
