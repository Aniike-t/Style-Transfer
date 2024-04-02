import React, { useState, useEffect } from 'react';
import ImageDropZone from './ImageDropZone';
import '../App';

const StyleRepPage = () => {
  const [setData] = useState([]);
  const [setImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, );

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data');
      const jsonData = await response.json();
      setData(jsonData.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleImageDrop = (droppedImage) => {
    setImage(droppedImage);
  };

  return (
    <div className="app-container">

      <div className="columns">
        <div className="column">
          <ImageDropZone onImageDrop={handleImageDrop} />
        </div>
      </div>
    </div>
  );
};

export default StyleRepPage;
