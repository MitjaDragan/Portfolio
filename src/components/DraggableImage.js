import React, { useState, useEffect, useRef } from 'react';

const DraggableImage = ({ src, alt, initialPosition, onPositionChange, externalPosition, size }) => {
  const [position, setPosition] = useState(initialPosition);
  const positionRef = useRef(initialPosition);
  const [scaledSize, setScaledSize] = useState(size);
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const BASE_SCREEN_WIDTH = 1920;

  useEffect(() => {
    if (externalPosition && (externalPosition.x !== position.x || externalPosition.y !== position.y)) {
      setPosition(externalPosition);
      positionRef.current = externalPosition;
    }
  }, [externalPosition]);

  useEffect(() => {
    const setImageSize = () => {
      if (imgRef.current) {
        const originalWidth = imgRef.current.naturalWidth;
        const originalHeight = imgRef.current.naturalHeight;

        const currentScreenWidth = window.innerWidth;
        const scaleFactor = currentScreenWidth / BASE_SCREEN_WIDTH;

        const scaledWidth = originalWidth * scaleFactor;
        const scaledHeight = originalHeight * scaleFactor;

        setScaledSize({ width: scaledWidth, height: scaledHeight });
      }
    };

    if (imgRef.current && imgRef.current.complete) {
      setImageSize();
    } else if (imgRef.current) {
      imgRef.current.onload = setImageSize;
    }

    window.addEventListener('resize', setImageSize);

    return () => {
      window.removeEventListener('resize', setImageSize);
    };
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();

    const rect = imgRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    draggingRef.current = true;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 1) return; // Ensure only one touch is used
    e.preventDefault();

    const touch = e.touches[0];
    const rect = imgRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: touch.pageX - rect.left, // Use pageX for accurate positioning
      y: touch.pageY - rect.top,  // Use pageY for accurate positioning
    };

    draggingRef.current = true;

    document.addEventListener('touchmove', handleTouchMove, { passive: false }); // Disable passive to prevent default
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    positionRef.current = { x: newX, y: newY };

    requestAnimationFrame(() => {
      imgRef.current.style.left = `${newX}px`;
      imgRef.current.style.top = `${newY}px`;
    });
  };

  const handleTouchMove = (e) => {
    if (!draggingRef.current || e.touches.length > 1) return; // Ensure only one touch is used
    e.preventDefault(); // Prevent scrolling

    const touch = e.touches[0];
    const newX = touch.pageX - dragOffset.current.x;
    const newY = touch.pageY - dragOffset.current.y;

    positionRef.current = { x: newX, y: newY };

    requestAnimationFrame(() => {
      imgRef.current.style.left = `${newX}px`;
      imgRef.current.style.top = `${newY}px`;
    });
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (onPositionChange) {
      onPositionChange(positionRef.current);
    }

    setPosition(positionRef.current);
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);

    if (onPositionChange) {
      onPositionChange(positionRef.current);
    }

    setPosition(positionRef.current);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${scaledSize.width}px`,
        height: 'auto',
        cursor: draggingRef.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    />
  );
};

export default DraggableImage;
