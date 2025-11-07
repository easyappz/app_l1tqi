import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ images, setImages, maxImages = 5 }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    const remainingSlots = maxImages - images.length;
    if (validFiles.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s). Maximum is ${maxImages} images.`);
      validFiles.splice(remainingSlots);
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload" data-easytag="id1-react/src/components/ImageUpload.js">
      <div className="image-upload-header" data-easytag="id2-react/src/components/ImageUpload.js">
        <label data-easytag="id3-react/src/components/ImageUpload.js">Images ({images.length}/{maxImages})</label>
      </div>

      {images.length > 0 && (
        <div className="image-preview-grid" data-easytag="id4-react/src/components/ImageUpload.js">
          {images.map((file, index) => {
            const isFile = file instanceof File;
            const imageUrl = isFile ? URL.createObjectURL(file) : (file.image || file);
            
            return (
              <div key={index} className="image-preview-item" data-easytag="id5-react/src/components/ImageUpload.js">
                <img 
                  src={imageUrl} 
                  alt={`Preview ${index + 1}`} 
                  data-easytag="id6-react/src/components/ImageUpload.js"
                />
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={() => handleRemove(index)}
                  data-easytag="id7-react/src/components/ImageUpload.js"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {images.length < maxImages && (
        <div
          className={`image-upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          data-easytag="id8-react/src/components/ImageUpload.js"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
            data-easytag="id9-react/src/components/ImageUpload.js"
          />
          <div className="upload-zone-content" data-easytag="id10-react/src/components/ImageUpload.js">
            <p data-easytag="id11-react/src/components/ImageUpload.js">Drag and drop images here</p>
            <p className="upload-zone-or" data-easytag="id12-react/src/components/ImageUpload.js">or</p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="upload-button"
              data-easytag="id13-react/src/components/ImageUpload.js"
            >
              Choose Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
