import { useMemo } from 'react';

const defenseDefaults = {
  '1-3-1': [
    { x: 98, y: 225 },
    { x: 400, y: 265 },
    { x: 690, y: 225 },
    { x: 430, y: 180 },
    { x: 400, y: 80 },
  ],
  '3-2': [
    { x: 98, y: 225 },
    { x: 400, y: 265 },
    { x: 690, y: 225 },
    { x: 230, y: 130 },
    { x: 565, y: 130 },
  ],
  '4-1': [
    { x: 98, y: 225 },
    { x: 290, y: 265 },
    { x: 500, y: 265 },
    { x: 700, y: 225 },
    { x: 400, y: 145 },
  ],
  '2-3': [
    { x: 120, y: 175 },
    { x: 265, y: 260 },
    { x: 530, y: 255 },
    { x: 675, y: 175 },
    { x: 400, y: 135 },
  ],
};

export default function useDefensePositions(formation) {
  return useMemo(() => {
    if (!formation || formation === 'No') return [];
    const defaults = defenseDefaults[formation];
    return defaults ? defaults.map((p) => ({ ...p })) : [];
  }, [formation]);
}
