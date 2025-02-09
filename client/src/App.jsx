import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Resume from './resume/Resume';
function App() {
  return(
    <Router>
    <Routes>
        <Route path="/" element={<Resume />} />
      </Routes>
      </Router>
  )
}

export default App
