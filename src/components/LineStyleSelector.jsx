import React from 'react';

const icons = {
  solid: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="2">
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  dashed: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="2" strokeDasharray="4 4">
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  zigzag: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="2">
      <polyline points="4,12 8,6 12,18 16,6 20,12" />
    </svg>
  )
};

const options = ['solid', 'dashed', 'zigzag'];

const LineStyleSelector = ({ value, onChange }) => {
  return (
    <div className="flex gap-2">
      {options.map((style) => (
        <button
          key={style}
          type="button"
          className={`w-8 h-8 flex items-center justify-center rounded border border-white text-white ${
            value === style ? 'bg-gray-600' : 'bg-gray-700'
          }`}
          onClick={() => onChange(style)}
          aria-label={style}
        >
          {icons[style]}
        </button>
      ))}
    </div>
  );
};

export default LineStyleSelector;
