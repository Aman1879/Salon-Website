import React, { useState } from 'react';

const ImageWithFallback = ({ src, fallbackSrc, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
    }
  };

  // Default fallback images
  const defaultFallbacks = {
    service: '/images/services/facial.jpg',
    gallery: '/images/gallery/default-gallery.jpg',
    avatar: 'https://i.pravatar.cc/150?img=1'
  };

  const getFallback = () => {
    if (fallbackSrc) return fallbackSrc;
    
    // Determine fallback based on path
    if (src.includes('/services/')) return defaultFallbacks.service;
    if (src.includes('/gallery/')) return defaultFallbacks.gallery;
    return defaultFallbacks.avatar;
  };

  return (
    <img
      src={error ? getFallback() : imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;