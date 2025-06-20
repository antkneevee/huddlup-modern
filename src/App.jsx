
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlayEditor from './PlayEditor';
import Home from './Home';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<PlayEditor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
