import React from 'react';

const icons = {
  5: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="5">
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  7: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="7">
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  9: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="9">
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
};

const labels = { 5: 'Thin', 7: 'Default', 9: 'Thick' };

const options = [5, 7, 9];

const LineThicknessSelector = ({ value, onChange }) => (
  <div className="flex gap-2">
    {options.map((thickness) => (
      <button
        key={thickness}
        type="button"
        className={`w-8 h-8 flex items-center justify-center rounded border border-white text-white ${
          value === thickness ? 'bg-gray-600' : 'bg-gray-700'
        }`}
        onClick={() => onChange(thickness)}
        aria-label={labels[thickness]}
      >
        {icons[thickness]}
      </button>
    ))}
  </div>
);

export default LineThicknessSelector;
