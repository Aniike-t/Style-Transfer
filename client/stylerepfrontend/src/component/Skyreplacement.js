import React, { useState } from 'react';
import '../component/Skyreplacement.css';
import dragDropLogo from '../component/dragdropicon.png';
import { Link } from 'react-router-dom';
import Hamburger from 'hamburger-react';
const validImageFormats = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];

const Skyreplacement = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [cursorStyle1, setCursorStyle1] = useState('pointer');
  const [cursorStyle2, setCursorStyle2] = useState('pointer');
  const [isImageLoaded1, setIsImageLoaded1] = useState(false);
  const [isImageLoaded2, setIsImageLoaded2] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDrop = (event, setImage, setCursorStyle, setIsImageLoaded) => {
    event.preventDefault();
    setIsDragging(false);
    setCursorStyle('default');

    if (event.dataTransfer.files.length > 0) {
      const droppedImage = event.dataTransfer.files[0];

      if (validImageFormats.includes(droppedImage.type)) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setImage(e.target.result);
          setIsImageLoaded(true);
        };

        reader.readAsDataURL(droppedImage);
      } else {
        alert('Invalid image format. Please choose a JPEG, PNG, HEIC, or WEBP image.');
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event, setCursorStyle) => {
    event.preventDefault();
    setIsDragging(true);
    setCursorStyle('pointer');
  };

  const handleDragLeave = (event, setCursorStyle) => {
    event.preventDefault();
    setIsDragging(false);
    setCursorStyle('pointer');
  };

  const handleFileInput = (event, setImage, setCursorStyle, setIsImageLoaded) => {
    const droppedImage = event.target.files[0];

    if (droppedImage) {
      if (validImageFormats.includes(droppedImage.type)) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setImage(e.target.result);
          setIsImageLoaded(true);
        };

        reader.readAsDataURL(droppedImage);
        setCursorStyle('default');
      } else {
        alert('Invalid image format. Please choose a JPEG, PNG, HEIC, or WEBP image.');
      }
    }
  };

  const handleDownload = (image) => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No image to download.');
    }
  };

  const handleHorizontalImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImage2(imageUrl);
    setIsImageLoaded2(true);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className={`content-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <button onClick={() => handleDownload(image2)}>Download</button>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className='icon-bar1'></div>
        <Link to='/' onClick={toggleSidebar} className='link-style'>
          <p>Image Style Replication</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/v' onClick={toggleSidebar} className='link-style'>
          <p>Video Style Replication</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/s' onClick={toggleSidebar} className='link-style'>
          <p>Sky Replacement</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/i' onClick={toggleSidebar} className='link-style'>
          <p>Image Upscaling</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/c' onClick={toggleSidebar} className='link-style'>
          <p>Cartoon Image Replication</p>
        </Link>
        <div className='icon-bar1'></div>
      </div>
      <div className="menu-bar-icon" onClick={toggleSidebar}>
        <Hamburger toggled={sidebarOpen} toggle={setSidebarOpen} size={35} rounded />
      </div>
      <header onClick={refreshPage}>
        <h1>Sky Replacement</h1>
      </header>
      <div className="column">
        {/* First ImageDropZone */}
        <div
          className={`image-drop-zone ${isDragging ? 'drag-over' : ''}`}
          onDrop={(event) => handleDrop(event, setImage1, setCursorStyle1, setIsImageLoaded1)}
          onDragOver={handleDragOver}
          onDragEnter={(event) => handleDragEnter(event, setCursorStyle1)}
          onDragLeave={(event) => handleDragLeave(event, setCursorStyle1)}
          style={{
            cursor: cursorStyle1,
            position: 'relative',
            overflow: 'hidden',
            width: '320px',
            height: '150px',
          }}
        >
          {!isImageLoaded1 && (
            <>
              <label htmlFor="fileInput1" className="file-input-label">
                <img src={dragDropLogo} alt="" className="drag-drop-logo" />
                <span className='file-input-text1'>INPUT IMAGE</span>
                <span className="file-input-text">
                  Drag & drop an image here or click to open file (Please choose a JPEG, PNG, HEIC, or WEBP image.)
                </span>
              </label>
              <input
                id="fileInput1"
                type="file"
                accept="image/*, .png, .jpeg, .heic, .webp"
                onChange={(event) => handleFileInput(event, setImage1, setCursorStyle1, setIsImageLoaded1)}
                style={{ display: 'none' }}
              />
            </>
          )}
          {isImageLoaded1 && (
            <img
              src={image1}
              alt=""
              className="dropped-image"
              style={{
                width: 'auto',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
            />
          )}
        </div>

        {/* Second ImageDropZone */}
        <div
          className={`image-drop-zone ${isDragging ? 'drag-over' : ''}`}
          onDrop={(event) => handleDrop(event, setImage2, setCursorStyle2, setIsImageLoaded2)}
          onDragOver={handleDragOver}
          onDragEnter={(event) => handleDragEnter(event, setCursorStyle2)}
          onDragLeave={(event) => handleDragLeave(event, setCursorStyle2)}
          style={{
            cursor: cursorStyle2,
            position: 'relative',
            overflow: 'hidden',
            width: '320px',
            height: '150px',
          }}
        >
          {!isImageLoaded2 && (
            <>
              <span className='file-input-text2'>OUTPUT IMAGE</span>
              <input
                id="fileInput2"
                type="file"
                accept="image/*, .png, .jpeg, .heic, .webp"
                onChange={(event) => handleFileInput(event, setImage2, setCursorStyle2, setIsImageLoaded2)}
                style={{ display: 'none' }}
              />
            </>
          )}
          {isImageLoaded2 && (
            <img
              src={image2}
              alt=""
              className={`dropped-image ${selectedImage === image2 ? 'glow' : ''}`}
              style={{
                width: 'auto',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
            />
          )}
        </div>
      </div>
      <div className="horizontal-box">
        <h1 className='recommendedheader'>Recommended Styles:</h1>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/0001.jpg'))}>
          <img src={require('../assets/0001.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/0001.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 1</div>
        </div>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/0006.jpg'))}>
          <img src={require('../assets/0006.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/0006.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 2</div>
        </div>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/0003.jpg'))}>
          <img src={require('../assets/0003.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/0003.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 3</div>
        </div>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/0004.jpg'))}>
          <img src={require('../assets/0004.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/0004.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 4</div>
        </div>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/0002.jpg'))}>
          <img src={require('../assets/0002.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/0002.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 5</div>
        </div>
      </div>
    </div>
  );
};

export default Skyreplacement;
