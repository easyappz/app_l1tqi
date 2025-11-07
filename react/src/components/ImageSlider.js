import React, { useState, useEffect, useCallback } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, isModalOpen]);

  if (!images || images.length === 0) {
    return (
      <div className="image-slider-placeholder" data-easytag="id100-react/src/components/ImageSlider.js">
        <div className="placeholder-content" data-easytag="id101-react/src/components/ImageSlider.js">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" data-easytag="id102-react/src/components/ImageSlider.js">
            <rect width="120" height="120" fill="#f0f0f0" />
            <path d="M40 50L50 60L70 40L80 50V70H40V50Z" fill="#ccc" />
            <circle cx="50" cy="45" r="5" fill="#ccc" />
          </svg>
          <p data-easytag="id103-react/src/components/ImageSlider.js">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="image-slider"
        data-easytag="id104-react/src/components/ImageSlider.js"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 1 && (
          <button
            className="slider-button slider-button-left"
            onClick={goToPrevious}
            aria-label="Previous image"
            data-easytag="id105-react/src/components/ImageSlider.js"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" data-easytag="id106-react/src/components/ImageSlider.js">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div className="slider-image-container" data-easytag="id107-react/src/components/ImageSlider.js">
          <img
            src={images[currentIndex].image}
            alt={`Slide ${currentIndex + 1}`}
            className="slider-image"
            onClick={openModal}
            data-easytag="id108-react/src/components/ImageSlider.js"
          />
        </div>

        {images.length > 1 && (
          <button
            className="slider-button slider-button-right"
            onClick={goToNext}
            aria-label="Next image"
            data-easytag="id109-react/src/components/ImageSlider.js"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" data-easytag="id110-react/src/components/ImageSlider.js">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {images.length > 1 && (
          <div className="slider-dots" data-easytag="id111-react/src/components/ImageSlider.js">
            {images.map((_, slideIndex) => (
              <button
                key={slideIndex}
                className={`slider-dot ${slideIndex === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(slideIndex)}
                aria-label={`Go to slide ${slideIndex + 1}`}
                data-easytag="id112-react/src/components/ImageSlider.js"
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="image-modal" onClick={closeModal} data-easytag="id113-react/src/components/ImageSlider.js">
          <div className="image-modal-content" data-easytag="id114-react/src/components/ImageSlider.js">
            <button
              className="modal-close-button"
              onClick={closeModal}
              aria-label="Close modal"
              data-easytag="id115-react/src/components/ImageSlider.js"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" data-easytag="id116-react/src/components/ImageSlider.js">
                <path d="M24 8L8 24M8 8L24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <img
              src={images[currentIndex].image}
              alt={`Full size ${currentIndex + 1}`}
              className="modal-image"
              onClick={(e) => e.stopPropagation()}
              data-easytag="id117-react/src/components/ImageSlider.js"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageSlider;
