import React, { useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { drawImageOnCanvas } from './utils';
import { useAppSelector } from "@/lib/hooks";

export default function App() {
  const [imgSrc, setImgSrc] = useState(null);  // Initially null to prevent cropping until an image is selected
  const [crop, setCrop] = useState({});
  const [completedCrop, setCompletedCrop] = useState(null);
  const userState = useAppSelector((state) => state.userReducer.userInfo);

  const userId = userState?._id;

  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCompleteCrop = (crop) => {
    if (crop.width && crop.height && imgRef.current && canvasRef.current) {
      drawImageOnCanvas(imgRef.current, canvasRef.current, crop);
      setCompletedCrop(crop);
    }
  };

  const handleUpload = async () => {
    if (!completedCrop || !canvasRef.current) {
      return;
    }

    canvasRef.current.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'cropped-image.png');

      try {
        const response = await fetch(`http://localhost:3000/api/me/avatar?id=${userId}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Upload successful:', result);
        } else {
          console.error('Upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const canvasStyles = {
    width: Math.round(completedCrop?.width ?? 0),
    height: Math.round(completedCrop?.height ?? 0),
  };

  return (
    <div className='App'>
      <input
        id='file'
        type='file'
        accept='image/*'
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <div className='CropperWrapper'>
        {imgSrc ? (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            aspect={1}
            onComplete={handleCompleteCrop}
          >
            <img ref={imgRef} src={imgSrc} alt='cropper image' />
          </ReactCrop>
        ) : (
          <img src='/card.png' alt='default' onClick={handleImageClick} />
        )}
        {!imgSrc && <p className='InfoText'>Click on the image to select a file to crop</p>}
        <div className='CanvasWrapper'>
          <canvas ref={canvasRef} style={canvasStyles} />
        </div>
      </div>

      <div>
        <button
          type='button'
          disabled={!completedCrop}
          onClick={handleUpload}
        >
          Upload cropped image
        </button>
      </div>
    </div>
  );
}
