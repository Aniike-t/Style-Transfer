import React, { useState, useRef, useEffect } from 'react';
import '../component/VideoDropZone.css';
import dragDropLogo from '../component/dragdropicon.png';
import { Link } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import axios from 'axios';
const validVideoFormats = ['video/mp4', 'video/MOV'];

const VideoStyleReplication = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [cursorStyle1, setCursorStyle1] = useState('pointer');
  const [cursorStyle2, setCursorStyle2] = useState('pointer');

  const [isVideoLoaded1, setIsVideoLoaded1] = useState(false);
  const [isVideoLoaded2, setIsVideoLoaded2] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [video1, setVideo1] = useState(null);
  const [video2, setVideo2] = useState(null);

  const [selectedSampleVideo, setSelectedSampleVideo] = useState(null);
  const [videoLoadingProgress1, setVideoLoadingProgress1] = useState(0);
  const [videoLoadingProgress2, setVideoLoadingProgress2] = useState(0);
  const [sampleVideoLoadingProgress, setSampleVideoLoadingProgress] = useState({});

  const [selectedStyle, setSelectedStyle] = useState(1); //number
  const [outputVideo, setOutputVideo] = useState(null); //files
  const [video, setVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDrop = (event, setVideo, setCursorStyle, setIsVideoLoaded, setVideoLoadingProgress) => {
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

  const handleFileInput = (event, setVideo1, setCursorStyle, setIsVideoLoaded, setVideoLoadingProgress, ) => {
    const droppedVideo = event.target.files[0];

    event.preventDefault();
    const droppedFile = event.target.files[0];
    if (droppedFile) {
      if (validVideoFormats.includes(droppedFile.type)) {
        setVideo(droppedFile);
        setIsVideoLoaded1(true);
        setCursorStyle('default');
      } else {
        alert('Invalid video format. Please choose a valid video file.');
      }
    }


    if (droppedVideo) {
      if (validVideoFormats.includes(droppedVideo.type)) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setVideo1(e.target.result);
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
    if (outputVideo) {
        // Extract base64 encoded data from the data URI
        const base64Data = outputVideo.split(';base64,').pop();
        
        // Convert the base64 encoded string to a Blob
        const blob = base64toBlob(base64Data, 'video/mp4');
        
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
        
        // Create a link element and set its properties
        const link = document.createElement('a');
        link.href = url;
        link.download = 'output_video.mp4'; // Set the desired filename here
        
        // Append the link to the document body and trigger a click event
        document.body.appendChild(link);
        link.click();
        
        // Remove the link from the document body
        document.body.removeChild(link);
        
        // Clean up the object URL after use
        URL.revokeObjectURL(url);
    } else {
        alert('No video to download.');
    }
};

// Function to convert a base64 encoded string to a Blob
function base64toBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

  

  const refreshPage = () => {
    window.location.reload();
  };

  const handleSampleVideoClick = (videoUrl) => {
    setVideo2(videoUrl);
    setIsVideoLoaded2(true);
    setSelectedSampleVideo(videoUrl);
  };

  const handleSampleVideoDrop = (event, videoUrl) => {
    event.preventDefault();
    const sampleVideoLoadingProgressCopy = { ...sampleVideoLoadingProgress };
    sampleVideoLoadingProgressCopy[videoUrl] = 0;
    setSampleVideoLoadingProgress(sampleVideoLoadingProgressCopy);

    const droppedVideo = event.dataTransfer.files[0];

    if (droppedVideo) {
      if (validVideoFormats.includes(droppedVideo.type)) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setVideo2(e.target.result);
          setIsVideoLoaded2(true);
        };

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            const sampleVideoLoadingProgressCopy = { ...sampleVideoLoadingProgress };
            sampleVideoLoadingProgressCopy[videoUrl] = progress;
            setSampleVideoLoadingProgress(sampleVideoLoadingProgressCopy);
          }
        };

        reader.readAsDataURL(droppedVideo);
      } else {
        alert('Invalid video format. Please choose an MP4 or MOV video.');
      }
    }
  };

  useEffect(() => {
    // Autoplay sample videos and output video when the component mounts or when the page is refreshed
    if (videoRef1.current) {
      videoRef1.current.play();
    }
    if (videoRef2.current) {
      videoRef2.current.play();
    }
  }, []);


  const handleUpload = async (event) => {
    event.preventDefault();
    setIsUploading(true); // Set isUploading to true when the upload begins
    
    if (video && selectedStyle) {
      const formData = new FormData();
      formData.append('file', video);
      formData.append('styleNumber', selectedStyle);
      try {
        const response = await axios.post('http://127.0.0.1:5000/uploadvideoforstylerep', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (response.status === 200) {
          const encodedVideo = response.data.encoded_video;
          setOutputVideo(encodedVideo);
          setIsVideoLoaded2(true);
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        // Handle error
      } finally {
        setIsUploading(false); // Set isUploading to false when upload completes or encounters an error
      }
    } else {
      alert('No video or Style to upload.');
      setIsUploading(false); // Set isUploading to false if there's no video or style to upload
    }
  };
  
  
  const handleStyleSelection = (style) => {
    setSelectedStyle(style);
  };
  const removeVideo = (setVideo1, setIsVideoLoaded1) => {
    setVideo1(null);
    setIsVideoLoaded1(false);
  };
  return (
    <div className={`content-container1 ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className='icon-bar1'></div>
        <Link to='/' onClick={toggleSidebar} className='link-style'>
          <p>Image Style Transfer</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/v' onClick={toggleSidebar} className='link-style'>
          <p>Video Style Transfer</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/s' onClick={toggleSidebar} className='link-style'>
          <p>Sky Style Transfer</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/c' onClick={toggleSidebar} className='link-style'>
          <p>Cartoon Style Transfer</p>
        </Link>
        <div className='icon-bar1'></div>
      </div>
      <div className="menu-bar-icon" onClick={toggleSidebar}>
        <Hamburger toggled={sidebarOpen} toggle={setSidebarOpen} size={35} rounded />
      </div>
      <header className='header1' onClick={refreshPage}>
        <h1>Video Style Transfer</h1>
      </header>
      <div className="column1">
        {/* First VideoDropZone */}
        <div
          className={`video-drop-zone ${isDragging ? 'drag-over' : ''}`}
          onDrop={(event) => handleDrop(event, setVideo1, setCursorStyle1, setIsVideoLoaded1, setVideoLoadingProgress1)}
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
                onChange={(event) => handleFileInput(event, setVideo1, setCursorStyle1, setIsVideoLoaded1, setVideoLoadingProgress1)}
                style={{ display: 'none' }}
              />
            </>
          )}
          {isVideoLoaded1 && (
            <video
              src={URL.createObjectURL(video)}
              loop autoPlay
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
          {isVideoLoaded1 && (
            <div className="progress-bar" style={{ width: `${videoLoadingProgress1}%`, backgroundColor: 'rgba(255, 236, 236, 0.762)' }}></div>
          )}
        </div>
        {isUploading ? (
        <h4 className='uploading'>Uploading...</h4>
        ) : (
          <button
            className={`uploadbtn ${isUploading ? 'uploadbtn--disabled' : ''}`}
            disabled={isUploading}
            onClick={handleUpload}
          >Upload</button>
        )}
        {/* Second ImageDropZone */}
        <div
          className={`video-drop-zone ${isDragging ? 'drag-over' : ''}`}
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
                onChange={(event) => handleFileInput(event, setVideo2, setCursorStyle2, setIsVideoLoaded2, setVideoLoadingProgress2)}
                style={{ display: 'none' }}
              />
              {/* Progress Bar */}
            </>
          )}
          {isVideoLoaded2 && (
            <video
              loop autoPlay
              ref={videoRef2}
              src={`data:video/mp4;base64,${outputVideo}`}
              
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
          {outputVideo && (
            <div className="progress-bar" style={{ width: `${outputVideo}%`, backgroundColor: 'rgba(255, 236, 236, 0.762)' }}></div>
          )}
        </div>
        <button className='removebtn' onClick={() => removeVideo(setVideo1, setIsVideoLoaded1)}>Remove</button>
        <button className='downloadbtn' onClick={handleDownload}>Download</button>

      </div>
      <div className="horizontal-box">
        <h1 className='recommendedheader' >Recommended Styles:</h1>
        <div className="section" onClick={() => handleStyleSelection(1)}>
          <img src={require('../assets/001.jpg')} alt="" className={`sample-video ${selectedStyle === 1 ? 'glow' : ''}`} />
          <div className="section-label">Style 1</div>
        </div>
        <div className="section" onClick={() => handleStyleSelection(2)}>
          <img src={require('../assets/002.jpg')} alt="" className={`sample-video ${selectedStyle === 2 ? 'glow' : ''}`} />
          <div className="section-label">Style 2</div>
        </div>
        <div className="section" onClick={() => handleStyleSelection(3)}>
          <img src={require('../assets/003.jpg')} alt="" className={`sample-video ${selectedStyle === 3 ? 'glow' : ''}`} />
          <div className="section-label">Style 3</div>
        </div>
        <div className="section" onClick={() => handleStyleSelection(4)}>
          <img src={require('../assets/004.jpg')} alt="" className={`sample-video ${selectedStyle === 4 ? 'glow' : ''}`} />
          <div className="section-label">Style 4</div>
        </div>
        <div className="section" onClick={() => handleStyleSelection(5)}>
          <img src={require('../assets/005.jpg')} alt="" className={`sample-video ${selectedStyle === 5 ? 'glow' : ''}`} />
          <div className="section-label">Style 5</div>
        </div>
        {/* Add more style options here */}
      </div>
    </div>
  );
};

export default VideoStyleReplication;