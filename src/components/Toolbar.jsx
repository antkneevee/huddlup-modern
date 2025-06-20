import React from 'react';

const Toolbar = () => {
  return (
    <div className="flex justify-center bg-white border-b shadow py-3 px-4">
      <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded mx-2 hover:bg-orange-600">
        Save
      </button>
      <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded mx-2 hover:bg-orange-600">
        New Play
      </button>
      <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded mx-2 hover:bg-orange-600">
        Undo
      </button>
    </div>
  );
};

export default Toolbar;