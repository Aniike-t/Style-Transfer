import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ImageDropZone from './component/ImageDropZone.js';
import VideoStyleReplication from './component/VideoDropZone.js';
import SkyReplacment from './component/Skyreplacement.js';
import CartoonImagerepl from './component/CartoonImagerepl.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageDropZone/>} />
        <Route path="/v" element={<VideoStyleReplication/>} />
        <Route path='/s' element={<SkyReplacment/>} />
        <Route path='/c' element={<CartoonImagerepl/>}/>
      </Routes>
    </Router>
  );
};



export default App;
