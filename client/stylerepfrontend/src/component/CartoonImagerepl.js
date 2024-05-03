import React, { useState } from 'react';
import '../component/CartoonImagerepl.css';
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

  const handleDownload = () => {
    if (stylizedImage) {
      // Create a link element
      const link = document.createElement('a');
      // Set the href attribute to the stylized image data
      link.href = `data:image/jpeg;base64,${stylizedImage}`;
      // Set the download attribute with the desired file name
      link.download = 'stylized_image.jpg';
      // Append the link to the body
      document.body.appendChild(link);
      // Simulate a click on the link
      link.click();
      // Remove the link from the body
      document.body.removeChild(link);
    } else {
      alert('No image to download.');
    }
  };
  
  const removeImage = (setImage, setIsImageLoaded) => {
    setImage(null);
    setIsImageLoaded(false);
  };
  const handleHorizontalImageClick = (imageUrl, styleNumber) => {
    setSelectedImage(imageUrl);
    //setImage2(imageUrl);
    setIsImageLoaded2(true);
    setStyleSelected(styleNumber);
  };


  const [selectedFile, setSelectedFile] = useState(null);
  const [stylizedImage, setStylizedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile); // Append the style number to the FormData
    if(selectedFile){
    try {
      setIsUploading(true);
      // Upload the image to the Flask backend
      const uploadResponse = await axios.post('http://127.0.0.1:5000/upload', formData, {
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
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error
    }}else{
      alert('Image or Style not found')
    }
  };
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className={`content-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className='icon-bar1'></div>
        <Link to='/' onClick={toggleSidebar} className='link-style'>
          <p>Image Style Transfer</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/v' onClick={toggleSidebar} className='link-style'>
          <p >Video Style Transfer</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/s' onClick={toggleSidebar} className='link-style'>
          <p >Sky Style Transfer</p>
        </Link>
        <div className='icon-bar1'></div>
        <Link to='/c' onClick={toggleSidebar} className='link-style'>
          <p >Cartoon Style Transfer</p>
        </Link>
        <div className='icon-bar1'></div>
      </div>
      <div className="menu-bar-icon" onClick={toggleSidebar}>
        <Hamburger toggled={sidebarOpen} toggle={setSidebarOpen} size={35} rounded />
      </div>
      <header onClick={refreshPage}>
        <h1>Cartoon Style Transfer</h1>
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
        {isUploading ? (
        <h4 className='uploading'>Uploading...</h4>
        ) : (
          <button
            className={`uploadbtn ${isUploading ? 'uploadbtn--disabled' : ''}`}
            disabled={isUploading}
            onClick={handleUpload}
          >
            Upload
          </button>
        )}
        <button className='removebtn' onClick={() => removeImage(setImage1, setIsImageLoaded1)}>Remove</button>
        <button className='downloadbtn' onClick={handleDownload}>Download</button>
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
              <img className='cartoonoutput'src={`data:image/jpeg;base64,${stylizedImage}`} alt="" />
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
     
    </div>
  );
};

export default ImageDropZone;
