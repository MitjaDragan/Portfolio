import React, { useState, useEffect, useRef } from 'react';

const DraggableImage = ({ src, alt, initialPosition, onPositionChange, externalPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const [scaledSize, setScaledSize] = useState({ width: 100, height: 100 });  // Placeholder initial size
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const BASE_SCREEN_WIDTH = 1920;  // Base screen width for a 27" monitor

  useEffect(() => {
    if (externalPosition) {
      setPosition(externalPosition); // Update the position when externalPosition changes
    }
  }, [externalPosition]);

  // Set the scaled size based on the natural size of the image and scaling factor relative to screen size
  useEffect(() => {
    const setImageSize = () => {
      if (imgRef.current) {
        const originalWidth = imgRef.current.naturalWidth;  // Get the original width of the image
        const originalHeight = imgRef.current.naturalHeight;  // Get the original height of the image

        const currentScreenWidth = window.innerWidth;  // Get the current screen width
        const scaleFactor = currentScreenWidth / BASE_SCREEN_WIDTH;  // Calculate the scaling factor

        // Calculate scaled width and height based on the scaling factor
        const scaledWidth = originalWidth * scaleFactor;
        const scaledHeight = originalHeight * scaleFactor;

        setScaledSize({ width: scaledWidth, height: scaledHeight });  // Set scaled size
        console.log(`Image ${alt} - Original Size: ${originalWidth}x${originalHeight}, Scaled Size: ${scaledWidth.toFixed(2)}x${scaledHeight.toFixed(2)}`);
      }
    };

    if (imgRef.current && imgRef.current.complete) {
      // If the image is already loaded
      setImageSize();
    } else {
      // If the image is not loaded yet
      imgRef.current.onload = setImageSize;
    }

    window.addEventListener('resize', setImageSize);  // Recalculate on window resize

    return () => {
      window.removeEventListener('resize', setImageSize);
    };
  }, []);  // Empty dependency array because this effect does not depend on props or state

  const handleMouseDown = (e) => {
    e.preventDefault();

    const rect = imgRef.current.getBoundingClientRect();  // Get the img's position
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    draggingRef.current = true;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];

    const rect = imgRef.current.getBoundingClientRect();  // Get the img's position
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };

    draggingRef.current = true;

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;

    const parentRect = imgRef.current.closest('div').getBoundingClientRect();

    let newX = e.clientX - parentRect.left - dragOffset.current.x;
    let newY = e.clientY - parentRect.top - dragOffset.current.y;

    newX = Math.max(0, Math.min(newX, parentRect.width - imgRef.current.clientWidth));
    newY = Math.max(0, Math.min(newY, parentRect.height - imgRef.current.clientHeight));

    setPosition({ x: newX, y: newY });

    requestAnimationFrame(() => {
      imgRef.current.style.left = `${newX}px`;
      imgRef.current.style.top = `${newY}px`;
    });
  };

  const handleTouchMove = (e) => {
    if (!draggingRef.current) return;

    const touch = e.touches[0];
    const parentRect = imgRef.current.closest('div').getBoundingClientRect();

    let newX = touch.clientX - parentRect.left - dragOffset.current.x;
    let newY = touch.clientY - parentRect.top - dragOffset.current.y;

    newX = Math.max(0, Math.min(newX, parentRect.width - imgRef.current.clientWidth));
    newY = Math.max(0, Math.min(newY, parentRect.height - imgRef.current.clientHeight));

    setPosition({ x: newX, y: newY });

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
      onPositionChange(position);  // Notify parent of the new position
    }
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);

    if (onPositionChange) {
      onPositionChange(position);  // Notify parent of the new position
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup event listeners on component unmount
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <img
      ref={imgRef}  // Reference for positioning
      src={src}
      alt={alt}
      onMouseDown={handleMouseDown}  // Attach event handlers to the img element
      onTouchStart={handleTouchStart}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${scaledSize.width}px`,  // Set scaled width
        height: 'auto',  // Maintain aspect ratio relative to width
        cursor: draggingRef.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    />
  );
};

export default DraggableImage;
