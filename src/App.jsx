// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayEditor from '@/PlayEditor';
import About from '@/pages/About';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayEditor />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

