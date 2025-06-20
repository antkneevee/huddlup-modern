import React from 'react';
import { shapeOptions } from '../constants';

const icons = {
  circle: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <circle cx="12" cy="12" r="8" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  ),
  oval: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <ellipse cx="12" cy="12" rx="8" ry="6" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.54 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
};

const PlayerShapeSelector = ({ value, onChange }) => (
  <div className="flex gap-2">
    {shapeOptions.map((shape) => (
      <button
        key={shape}
        type="button"
        className={`w-8 h-8 flex items-center justify-center rounded border border-white text-white ${
          value === shape ? 'bg-gray-600' : 'bg-gray-700'
        }`}
        onClick={() => onChange(shape)}
        aria-label={shape}
      >
        {icons[shape]}
      </button>
    ))}
  </div>
);

export default PlayerShapeSelector;
