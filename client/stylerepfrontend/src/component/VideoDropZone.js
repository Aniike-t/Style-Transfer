import React, { useState } from 'react';
import '../component/ImageDropZone.css';
import dragDropLogo from '../component/dragdropicon.png';
import { Link } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import axios from 'axios';

const validVideoFormats = ['video/mp4', 'video/webm', 'video/quicktime'];

const VideoStyleReplication = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [video, setVideo] = useState(null);
  const [cursorStyle, setCursorStyle] = useState('pointer');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [outputVideo, setOutputVideo] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setCursorStyle('default');

    if (event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];

      if (validVideoFormats.includes(droppedFile.type)) {
        setVideo(droppedFile);
        setIsVideoLoaded(true);
      } else {
        alert('Invalid video format. Please choose a valid video file.');
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
    setCursorStyle('pointer');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setCursorStyle('pointer');
  };

  const handleFileInput = (event) => {
    const droppedFile = event.target.files[0];
    if (droppedFile) {
      if (validVideoFormats.includes(droppedFile.type)) {
        setVideo(droppedFile);
        setIsVideoLoaded(true);
        setCursorStyle('default');
      } else {
        alert('Invalid video format. Please choose a valid video file.');
      }
    }
  };

  const handleUpload = async () => {
    if (video) {
      const formData = new FormData();
      formData.append('file', video);
      formData.append('styleNumber', 1);
      try {
        const response = await axios.post('http://127.0.0.1:5000/uploadvideoforstylerep', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (response.status === 200) {
          const encodedVideo = response.data.encoded_video;
          setOutputVideo(encodedVideo);
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    } else {
      alert('No video to upload.');
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleStyleSelection = (style) => {
    setSelectedStyle(style);
  };

  return (
    <div className={`content-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
        <h1>Video Style Replication</h1>
      </header>
      <div className="column">
        {/* VideoDropZone */}
        <div
          className={`video-drop-zone ${isDragging ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          style={{
            cursor: cursorStyle,
            position: 'relative',
            overflow: 'hidden',
            width: '320px',
            height: '150px',
          }}
        >
          
          {!isVideoLoaded && (
            <>
              <label htmlFor="fileInput" className="file-input-label">
                <img src={dragDropLogo} alt="" className="drag-drop-logo" />
                <span className='file-input-text'>Drop a video here or click to upload</span>
              </label>
              <input
                id="fileInput"
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </>
          )}

          {isVideoLoaded && (
            <video
              src={URL.createObjectURL(video)} // Use URL.createObjectURL to display video from File object
              controls
              className="dropped-video"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
            />
          )}
          {outputVideo && (
          <div className="output-video-container">
            <video
              controls
              src={`data:video/mp4;base64,${outputVideo}`}
              className="output-video"
            />
          </div>
        )}
        </div>
        <button className='uploadbtn' onClick={handleUpload}>Upload</button>
      </div>
      <div className="horizontal-box" style={{marginTop: '500px'}}>
        <h1 className='recommendedheader'>Recommended Styles:</h1>
        <div className="section" onClick={() => handleStyleSelection(1)}>
          <img src={require('../assets/001.jpg')} alt="" className={`sample-image ${selectedStyle === 1 ? 'glow' : ''}`} />
          <div className="section-label">Style 1</div>
        </div>
        <div className="section" onClick={() => handleStyleSelection(2)}>
          <img src={require('../assets/002.jpg')} alt="" className={`sample-image ${selectedStyle === 2 ? 'glow' : ''}`} />
          <div className="section-label">Style 2</div>
        </div>
        <div className="section" onClick={() => handleStyleSelection(3)}>
          <img src={require('../assets/003.jpg')} alt="" className={`sample-image ${selectedStyle === 3 ? 'glow' : ''}`} />
          <div className="section-label">Style 3</div>
        </div>
        {/* Add more style options here */}
      </div>
    </div>
  );
};

export default VideoStyleReplication;
