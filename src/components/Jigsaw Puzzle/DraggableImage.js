import React, { useState, useEffect, useRef } from 'react';

let zIndexCounter = 1;

const DraggableImage = ({ src, alt, initialPosition, onPositionChange, externalPosition, size }) => {
  const [position, setPosition] = useState(initialPosition);
  const [zIndex, setZIndex] = useState(1);
  const positionRef = useRef(initialPosition);
  const [scaledSize, setScaledSize] = useState(size);
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const BASE_SCREEN_WIDTH = 11520;

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

    zIndexCounter += 1;
    setZIndex(zIndexCounter);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 1) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = imgRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: touch.pageX - rect.left,
      y: touch.pageY - rect.top,
    };

    draggingRef.current = true;

    zIndexCounter += 1;
    setZIndex(zIndexCounter);

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;
  
    const newX = Math.max(0, Math.min(window.innerWidth - scaledSize.width, e.clientX - dragOffset.current.x));
    const newY = Math.max(0, Math.min(window.innerHeight - scaledSize.height, e.clientY - dragOffset.current.y));
  
    positionRef.current = { x: newX, y: newY };
  
    requestAnimationFrame(() => {
      imgRef.current.style.left = `${newX}px`;
      imgRef.current.style.top = `${newY}px`;
    });
  };
  
  const handleTouchMove = (e) => {
    if (!draggingRef.current || e.touches.length > 1) return;
    e.preventDefault();
  
    const touch = e.touches[0];
    const newX = Math.max(0, Math.min(window.innerWidth - scaledSize.width, touch.pageX - dragOffset.current.x));
    const newY = Math.max(0, Math.min(window.innerHeight - scaledSize.height, touch.pageY - dragOffset.current.y));
  
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