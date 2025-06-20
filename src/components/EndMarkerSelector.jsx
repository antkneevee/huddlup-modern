import React from 'react';

const icons = {
  arrow: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="2">
      <line x1="4" y1="12" x2="16" y2="12" />
      <polyline points="12 8 16 12 12 16" />
    </svg>
  ),
  dot: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  T: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="2">
      <line x1="6" y1="6" x2="18" y2="6" />
      <line x1="12" y1="6" x2="12" y2="18" />
    </svg>
  )
};

const options = ['arrow', 'dot', 'T'];

const EndMarkerSelector = ({ value, onChange }) => (
  <div className="flex gap-2">
    {options.map((marker) => (
      <button
        key={marker}
        type="button"
        className={`w-8 h-8 flex items-center justify-center rounded border border-white text-white ${
          value === marker ? 'bg-gray-600' : 'bg-gray-700'
        }`}
        onClick={() => onChange(marker)}
        aria-label={marker}
      >
        {icons[marker]}
      </button>
    ))}
  </div>
);

export default EndMarkerSelector;
