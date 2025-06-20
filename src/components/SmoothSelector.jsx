import React from 'react';

const options = [
  {
    label: 'Straight',
    value: false,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="2">
        <line x1="4" y1="12" x2="20" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Curved',
    value: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="2">
        <path d="M4 16 Q12 4 20 16" />
      </svg>
    ),
  },
];

const SmoothSelector = ({ value, onChange }) => (
  <div className="flex gap-2">
    {options.map((opt) => (
      <button
        key={opt.label}
        type="button"
        className={`w-8 h-8 flex items-center justify-center rounded border border-white text-white ${
          value === opt.value ? 'bg-gray-600' : 'bg-gray-700'
        }`}
        onClick={() => onChange(opt.value)}
        aria-label={opt.label}
      >
        {opt.icon}
      </button>
    ))}
  </div>
);

export default SmoothSelector;
