import React, { useState, useEffect, useRef } from 'react';

let zIndexCounter = 1;

const DraggableImage = ({ src, alt, initialPosition, onPositionChange, externalPosition, size }) => {
  const [position, setPosition] = useState(initialPosition);
  const [zIndex, setZIndex] = useState(1);
  const [scaledSize, setScaledSize] = useState(size);
  const positionRef = useRef(initialPosition);
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const BASE_SCREEN_WIDTH = 11520;

  // Adjust position when externalPosition changes
  useEffect(() => {
    if (externalPosition && (externalPosition.x !== position.x || externalPosition.y !== position.y)) {
      setPosition(externalPosition);
      positionRef.current = externalPosition;
    }
  }, [externalPosition]);

  // Adjust image size based on screen width
  useEffect(() => {
    const updateScaledSize = () => {
      if (imgRef.current) {
        const { naturalWidth, naturalHeight } = imgRef.current;
        const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;
        setScaledSize({
          width: naturalWidth * scaleFactor,
          height: naturalHeight * scaleFactor,
        });
      }
    };

    if (imgRef.current && imgRef.current.complete) {
      updateScaledSize();
    } else if (imgRef.current) {
      imgRef.current.onload = updateScaledSize;
    }

    window.addEventListener('resize', updateScaledSize);
    return () => window.removeEventListener('resize', updateScaledSize);
  }, []);

  const handleDragStart = (clientX, clientY) => {
    const rect = imgRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    draggingRef.current = true;

    zIndexCounter += 1;
    setZIndex(zIndexCounter);
  };

  const handleDragMove = (clientX, clientY) => {
    if (!draggingRef.current) return;

    const newX = Math.max(0, Math.min(window.innerWidth - scaledSize.width, clientX - dragOffset.current.x));
    const newY = Math.max(0, Math.min(window.innerHeight - scaledSize.height, clientY - dragOffset.current.y));

    const newPosition = { x: newX, y: newY };
    positionRef.current = newPosition;

    setPosition(newPosition);
    if (onPositionChange) onPositionChange(newPosition);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => handleDragMove(e.clientX, e.clientY);

  const handleMouseUp = () => {
    draggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
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
        zIndex: zIndex,
      }}
    />
  );
};

export default DraggableImage;
