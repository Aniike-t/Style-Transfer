import React, { useState, useRef } from 'react';
import './VideoDropZone.css';
import dragDropLogo from '../component/dragdropicon.png';
import { Link } from 'react-router-dom';
import Hamburger from 'hamburger-react';

const validVideoFormats = ['video/mp4', 'video/MOV'];

const VideoDropZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [cursorStyle1, setCursorStyle1] = useState('pointer');
  const [cursorStyle2, setCursorStyle2] = useState('pointer');
  const [isVideoLoaded1, setIsVideoLoaded1] = useState(false);
  const [isVideoLoaded2, setIsVideoLoaded2] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [video1, setVideo1] = useState(null);
  const [video2, setVideo2] = useState(null);
  const [selectedSampleVideo, setSelectedSampleVideo] = useState(null);
  const [videoLoadingProgress, setVideoLoadingProgress] = useState(0);

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDrop = (event, setVideo, setCursorStyle, setIsVideoLoaded) => {
    event.preventDefault();
    setIsDragging(false);
    setCursorStyle('default');

    if (event.dataTransfer.files.length > 0) {
      const droppedVideo = event.dataTransfer.files[0];

      if (validVideoFormats.includes(droppedVideo.type)) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setVideo(e.target.result);
          setIsVideoLoaded(true);
        };

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setVideoLoadingProgress(progress);
          }
        };

        reader.readAsDataURL(droppedVideo);
      } else {
        alert('Invalid video format. Please choose an MP4 or MOV video.');
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event, setCursorStyle, videoRef) => {
    event.preventDefault();
    setIsDragging(true);
    setCursorStyle('pointer');
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleDragLeave = (event, setCursorStyle, videoRef) => {
    event.preventDefault();
    setIsDragging(false);
    setCursorStyle('pointer');
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleFileInput = (event, setVideo, setCursorStyle, setIsVideoLoaded) => {
    const droppedVideo = event.target.files[0];

    if (droppedVideo) {
      if (validVideoFormats.includes(droppedVideo.type)) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setVideo(e.target.result);
          setIsVideoLoaded(true);
        };

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setVideoLoadingProgress(progress);
          }
        };

        reader.readAsDataURL(droppedVideo);
        setCursorStyle('default');
      } else {
        alert('Invalid video format. Please choose an MP4 or MOV video.');
      }
    }
  };

  const handleDownload = () => {
    if (video2) {
      const link = document.createElement('a');
      link.href = video2;
      link.download = 'video';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No video to download.');
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleSampleVideoClick = (videoUrl) => {
    setVideo2(videoUrl);
    setIsVideoLoaded2(true);
    setSelectedSampleVideo(videoUrl);
  };

  return (
    <div className={`content-container1 ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <button className='button1' onClick={handleDownload}>Download</button>
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
          <p>Image Quality Enhancer</p>
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
      <header className='header1' onClick={refreshPage}>
        <h1>Video Style Replication</h1>
      </header>
      <div className="column1">
        {/* First VideoDropZone */}
        <div
          className={`video-drop-zone ${isDragging ? 'drag-over' : ''}`}
          onDrop={(event) => handleDrop(event, setVideo1, setCursorStyle1, setIsVideoLoaded1)}
          onDragOver={handleDragOver}
          onDragEnter={(event) => handleDragEnter(event, setCursorStyle1, videoRef1)}
          onDragLeave={(event) => handleDragLeave(event, setCursorStyle1, videoRef1)}
          style={{
            cursor: cursorStyle1,
            position: 'relative',
            overflow: 'hidden',
            width: '320px',
            height: '150px',
          }}
        >
          {!isVideoLoaded1 && (
            <>
              <label htmlFor="videoInput1" className="file-input-label1">
                <img src={dragDropLogo} alt="" className="drag-drop-logo" />
                <span className='file-input-video1'>INPUT VIDEO</span>
                <span className="file-input-video">
                  Drag & drop a video here or click to open file (Please choose an MP4 or MOV video.)
                </span>
              </label>
              <input
                id="videoInput1"
                type="file"
                accept="video/*, .MOV, .mp4"
                onChange={(event) => handleFileInput(event, setVideo1, setCursorStyle1, setIsVideoLoaded1)}
                style={{ display: 'none' }}
              />
            </>
          )}
          {isVideoLoaded1 && (
            <video
              ref={videoRef1}
              src={video1}
              autoPlay
              controls={false}
              className="dropped-video"
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
          className={`video-drop-zone ${isDragging ? 'drag-over' : ''}`}
          onDrop={(event) => handleDrop(event, setVideo2, setCursorStyle2, setIsVideoLoaded2)}
          onDragOver={handleDragOver}
          onDragEnter={(event) => handleDragEnter(event, setCursorStyle2, videoRef2)}
          onDragLeave={(event) => handleDragLeave(event, setCursorStyle2, videoRef2)}
          style={{
            cursor: cursorStyle2,
            position: 'relative',
            overflow: 'hidden',
            width: '320px',
            height: '150px',
          }}
        >
          {!isVideoLoaded2 && (
            <>
              <span className='file-input-video2'>OUTPUT VIDEO</span>
              <input
                id="fileInput2"
                type="file"
                accept="video/*, .mp4, .MOV"
                onChange={(event) => handleFileInput(event, setVideo2, setCursorStyle2, setIsVideoLoaded2)}
                style={{ display: 'none' }}
              />
              {/* Progress Bar */}
              <div className="progress-bar" style={{ width: `${videoLoadingProgress}%`, backgroundColor: 'rgba(255, 236, 236, 0.762)' }}></div>
            </>
          )}
          {isVideoLoaded2 && (
            <video
              ref={videoRef2}
              src={video2}
              autoPlay
              controls={false}
              className={`dropped-video ${selectedSampleVideo === video2 ? 'selected' : ''}`}
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

      <div className="horizontal-box1">
        <h1 className='recommendedheader1'>Recommended Styles:</h1>
        <div className="section1" onClick={() => handleSampleVideoClick(require('../assets/video1.mp4'))}>
          <video src={require('../assets/video1.mp4')} alt="" className={`sample-video ${selectedSampleVideo === require('../assets/video1.mp4') ? 'selected' : ''}`} autoPlay controls={false} />
          <div className="section-label1">Style 1</div>
        </div>
        <div className="section1" onClick={() => handleSampleVideoClick(require('../assets/video2.mp4'))}>
          <video src={require('../assets/video2.mp4')} alt="" className={`sample-video ${selectedSampleVideo === require('../assets/video2.mp4') ? 'selected' : ''}`} autoPlay controls={false} />
          <div className="section-label1">Style 2</div>
        </div>
        <div className="section1" onClick={() => handleSampleVideoClick(require('../assets/video3.mp4'))}>
          <video src={require('../assets/video3.mp4')} alt="" className={`sample-video ${selectedSampleVideo === require('../assets/video3.mp4') ? 'selected' : ''}`} autoPlay controls={false} />
          <div className="section-label1">Style 3</div>
        </div>
        <div className="section1" onClick={() => handleSampleVideoClick(require('../assets/video4.mp4'))}>
          <video src={require('../assets/video4.mp4')} alt="" className={`sample-video ${selectedSampleVideo === require('../assets/video4.mp4') ? 'selected' : ''}`} autoPlay controls={false} />
          <div className="section-label1">Style 4</div>
        </div>
        <div className="section1" onClick={() => handleSampleVideoClick(require('../assets/video5.mp4'))}>
          <video src={require('../assets/video5.mp4')} alt="" className={`sample-video ${selectedSampleVideo === require('../assets/video5.mp4') ? 'selected' : ''}`} autoPlay controls={false} />
          <div className="section-label1">Style 5</div>
        </div>
      </div>
    </div>
  );
};

export default VideoDropZone;
