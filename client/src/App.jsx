import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Resume from './resume/Resume';
import Interview from './Interview/Interview';
import Results from './Results/Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Resume />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
