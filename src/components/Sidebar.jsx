import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Edit3 } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-16 lg:w-48 bg-white shadow-lg flex flex-col items-center lg:items-start px-2 py-4">
      <Link
        to="/"
        className={\`flex items-center mb-6 text-gray-700 hover:text-orange-500 \${isActive('/') ? 'font-bold text-orange-600' : ''}\`}
      >
        <Home className="w-6 h-6 mr-0 lg:mr-2" />
        <span className="hidden lg:inline">Home</span>
      </Link>
      <Link
        to="/editor"
        className={\`flex items-center mb-6 text-gray-700 hover:text-orange-500 \${isActive('/editor') ? 'font-bold text-orange-600' : ''}\`}
      >
        <Edit3 className="w-6 h-6 mr-0 lg:mr-2" />
        <span className="hidden lg:inline">Editor</span>
      </Link>
    </aside>
  );
};

export default Sidebar;