import React, { useState } from 'react';
import '../component/ImageDropZone.css';
import dragDropLogo from '../component/dragdropicon.png';
import { Link } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import axios from 'axios';
const validImageFormats = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];


const ImageDropZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [cursorStyle1, setCursorStyle1] = useState('pointer');
  const [cursorStyle2, setCursorStyle2] = useState('pointer');
  const [isImageLoaded1, setIsImageLoaded1] = useState(false);
  const [isImageLoaded2, setIsImageLoaded2] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [styleSelected, setStyleSelected] = useState(null);



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
    setSelectedFile(event.target.files[0]);
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

  const handleHorizontalImageClick = (imageUrl, styleNumber) => {
    setSelectedImage(imageUrl);
    //setImage2(imageUrl);
    setIsImageLoaded2(true);
    setStyleSelected(styleNumber);
  };


  const [selectedFile, setSelectedFile] = useState(null);
  const [stylizedImage, setStylizedImage] = useState(null);


  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('styleNumber', styleSelected); // Append the style number to the FormData
  
    try {
      // Upload the image to the Flask backend
      const uploadResponse = await axios.post('http://127.0.0.1:5000/uploadvideoforstylerep', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(uploadResponse.data); // Log the response from the upload endpoint
  
      // If the upload was successful, set the stylized image
      if (uploadResponse.status === 200) {
        // Decode the base64 encoded image data
        const imageData = uploadResponse.data;
        setStylizedImage(imageData);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error
    }
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
          <p >Image Style Replication</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/v' onClick={toggleSidebar} className='link-style'>
          <p >Video Style Replication</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/s' onClick={toggleSidebar} className='link-style'>
          <p >Sky Replacement</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/i' onClick={toggleSidebar} className='link-style'>
          <p >Image Upscaling</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/c' onClick={toggleSidebar} className='link-style'>
          <p >Cartoon Image Replication</p>
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
                  Drag & drop an video here or click to open file
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
        <button  className='uploadbtn' onClick={handleUpload}>Upload</button>
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
              <img src={`data:image/jpeg;base64,${stylizedImage}`} alt="Stylized Image" style={{ width: '50%', height: 'auto' }}/>
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
              src={`data:image/jpeg;base64,${stylizedImage}`}
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
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/001.jpg'), 1)}>
          <img src={require('../assets/001.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/001.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 1</div>
        </div>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/002.jpg'), 2)}>
          <img src={require('../assets/002.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/002.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 2</div>
        </div>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/003.jpg'), 3)}>
          <img src={require('../assets/003.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/003.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 3</div>
        </div>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/004.jpg'), 4)}>
          <img src={require('../assets/004.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/004.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 4</div>
        </div>
        <div className="section" onClick={() => handleHorizontalImageClick(require('../assets/005.jpg'), 5)}>
          <img src={require('../assets/005.jpg')} alt="" className={`sample-image ${selectedImage === require('../assets/005.jpg') ? 'glow' : ''}`} />
          <div className="section-label">Style 5</div>
        </div>
      </div>
    </div>
  );
};

export default ImageDropZone;
