import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StyleRepPage from './component/stylereppage.js';
import VideoStylerep from './component/VideoStylerep.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StyleRepPage/>} />
        <Route path='/v' element={<VideoStylerep/>}/>
      </Routes>
    </Router>
  );
};

export default App;
