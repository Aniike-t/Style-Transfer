import React, { useEffect, useState } from 'react';
import dragDropLogo from '../component/dragdropicon.png';
import { Link } from 'react-router-dom';
import '../component/ImageDropZone.css';
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

  const handleDownload = (imageData) => {
    if (imageData) {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${imageData}`;
      link.download = 'image.jpg'; // Specify the filename with the appropriate extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No image to download.');
    }
  };
  

  const handleHorizontalImageClick = (imageUrl, filename) => {
    const styleNumber = parseInt(filename.replace('.jpg', ''), 10);
    setSelectedImage(imageUrl);
    setIsImageLoaded2(true);
    setStyleSelected(styleNumber);
  };


  const [selectedFile, setSelectedFile] = useState(null);
  const [stylizedImage, setStylizedImage] = useState(null);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Array of image filenames
  const imageFilenames = [
    '001.jpg',
    '002.jpg',
    '003.jpg',
    '004.jpg',
    '005.jpg',
    '006.jpg',
    '007.jpg',
    '008.jpg',
    '009.jpg',
    '010.jpg',
    '011.jpg',
    '012.jpg',
    '013.jpg',
    '014.jpg',
    '015.jpg'
  ];

  // Function to shuffle and select 5 random filenames
  function getRandomImageFilenames(array, count) {
    const shuffledArray = array.sort(() => 0.5 - Math.random());
    return shuffledArray.slice(0, count);
  }
  
  useEffect(() => {
    // Get 5 random image filenames when component mounts
    const randomImageFilenames = getRandomImageFilenames(imageFilenames, 5);
    setShuffledImages(randomImageFilenames);
  }, []); 

  const renderedImages = shuffledImages.map((filename, index) => (
    <div className="section" onClick={() => handleHorizontalImageClick(require(`../assets/${filename}`), filename)} key={index}>
      <img src={require(`../assets/${filename}`)} alt="" className={`sample-image ${selectedImage === require(`../assets/${filename}`) ? 'glow' : ''}`} />
      <div className="section-label">Style {parseInt(filename.replace('.jpg', ''), 10)}</div>
    </div>
  ));



  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('styleNumber', styleSelected); // Append the style number to the FormData
    if(selectedFile  && styleSelected){
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

  const removeImage = (setImage, setIsImageLoaded) => {
    setImage(null);
    setIsImageLoaded(false);
    setStylizedImage(null);
    setIsImageLoaded2(false);
  };

  return (
    <div className={`content-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className='icon-bar1'></div>
        <Link to='/' onClick={toggleSidebar} className='link-style'>
          <p >Image Style Transfer</p>
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
        <h1>Image Style Transfer</h1>
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
        <button className='downloadbtn'onClick={() => handleDownload(stylizedImage)}>Download</button>
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
              <img src={`data:image/jpeg;base64,${stylizedImage}`} alt="" style={{ width: '50%', height: 'auto'}}/>
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
        {renderedImages}
      </div>
    </div>
  );
};

export default ImageDropZone;
