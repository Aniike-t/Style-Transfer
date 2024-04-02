import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageDropZone from './component/ImageDropZone.js';
import VideoDropZone from './component/VideoDropZone.js';
import Imagequality from './component/Imagequality.js';
import Skyreplacement from './component/Skyreplacement.js';
import CartoonImagerepl from './component/CartoonImagerepl.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageDropZone/>} />
        <Route path="/v" element={<VideoDropZone/>} />
        <Route path='/i' element={<Imagequality/>} />
        <Route path='/s' element={<Skyreplacement/>} />
        <Route path='/c' element={<CartoonImagerepl/>}/>
      </Routes>
    </Router>
  );
};


export default App;
