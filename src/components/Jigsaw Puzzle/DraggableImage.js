import React, { useState, useEffect, useRef } from 'react';

let zIndexCounter = 1;

const DraggableImage = ({ src, alt, initialPosition, onPositionChange, externalPosition, size }) => {
  const [position, setPosition] = useState(initialPosition);
  const [zIndex, setZIndex] = useState(1);
  const [scaledSize, setScaledSize] = useState(size);
  const positionRef = useRef(initialPosition);
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isRightClickRef = useRef(false); // Track right-click state
  const imgRef = useRef(null);

  const BASE_SCREEN_WIDTH = 11520;

  useEffect(() => {
    if (externalPosition && (externalPosition.x !== position.x || externalPosition.y !== position.y)) {
      setPosition(externalPosition);
      positionRef.current = externalPosition;
    }
  }, [externalPosition]);

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

  const handleDragStart = (clientX, clientY, isRightClick) => {
    const rect = imgRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    draggingRef.current = true;
    isRightClickRef.current = isRightClick; // Store right-click state

    zIndexCounter += 1;
    setZIndex(zIndexCounter);
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;

    const newX = Math.max(0, Math.min(window.innerWidth - scaledSize.width, e.clientX - dragOffset.current.x));
    const newY = Math.max(0, Math.min(window.innerHeight - scaledSize.height, e.clientY - dragOffset.current.y));

    const newPosition = { x: newX, y: newY };
    positionRef.current = newPosition;

    if (onPositionChange) {
      onPositionChange(newPosition, false, isRightClickRef.current); // Pass right-click state
    }
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (onPositionChange) {
      onPositionChange(positionRef.current, true, isRightClickRef.current); // Pass right-click state
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (e.button === 2) {
      // Right-click drag start
      handleDragStart(e.clientX, e.clientY, true);
    } else if (e.button === 0) {
      // Left-click drag start
      handleDragStart(e.clientX, e.clientY, false);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY, false); // No right-click on touch
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

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the context menu from opening
  };

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onContextMenu={handleContextMenu} // Suppress right-click menu
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
