import React from 'react';

const SaveModal = ({ onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    style={{ zIndex: 9999, pointerEvents: 'auto' }}
    onClick={onClose}
  >
    <div
      className="bg-white text-black rounded p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-bold mb-2">Play Saved to Library</h2>
      <p>Your play was saved to your play library.</p>
      <button
        onClick={onClose}
        className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
      >
        OK
      </button>
    </div>
  </div>
);

export default SaveModal;
