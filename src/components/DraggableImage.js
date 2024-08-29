import React, { useState, useEffect, useRef } from 'react';

const DraggableImage = ({ src, alt, initialPosition, onPositionChange, externalPosition, size }) => {
  const [position, setPosition] = useState(initialPosition); // State to trigger re-renders
  const positionRef = useRef(initialPosition); // Ref to hold the latest position without causing re-renders
  const [scaledSize, setScaledSize] = useState(size); // Use the provided size for scaling
  const draggingRef = useRef(false); // Track dragging state
  const dragOffset = useRef({ x: 0, y: 0 }); // Track mouse offset from image
  const imgRef = useRef(null); // Reference to the image DOM element

  const BASE_SCREEN_WIDTH = 1920; // Base screen width for scaling reference

  // Update position if externalPosition changes
  useEffect(() => {
    if (externalPosition && (externalPosition.x !== position.x || externalPosition.y !== position.y)) {
      setPosition(externalPosition);
      positionRef.current = externalPosition; // Update the ref as well
    }
  }, [externalPosition]);

  // Scale the image size based on screen width
  useEffect(() => {
    const setImageSize = () => {
      if (imgRef.current) {
        const originalWidth = imgRef.current.naturalWidth; // Get the original width of the image
        const originalHeight = imgRef.current.naturalHeight; // Get the original height of the image

        const currentScreenWidth = window.innerWidth; // Get the current screen width
        const scaleFactor = currentScreenWidth / BASE_SCREEN_WIDTH; // Calculate the scaling factor

        // Calculate scaled width and height based on the scaling factor
        const scaledWidth = originalWidth * scaleFactor;
        const scaledHeight = originalHeight * scaleFactor;

        setScaledSize({ width: scaledWidth, height: scaledHeight }); // Set scaled size
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
  }, []); // Empty dependency array because this effect does not depend on props or state

  const handleMouseDown = (e) => {
    e.preventDefault();

    const rect = imgRef.current.getBoundingClientRect(); // Get the img's position
    dragOffset.current = {
      x: e.clientX - rect.left, // Calculate the offset between the cursor and the image's left edge
      y: e.clientY - rect.top, // Calculate the offset between the cursor and the image's top edge
    };

    draggingRef.current = true;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];

    const rect = imgRef.current.getBoundingClientRect(); // Get the img's position
    dragOffset.current = {
      x: touch.clientX - rect.left, // Calculate the offset between the touch and the image's left edge
      y: touch.clientY - rect.top, // Calculate the offset between the touch and the image's top edge
    };

    draggingRef.current = true;

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;

    const newX = e.clientX - dragOffset.current.x; // Calculate new X position relative to the initial click point
    const newY = e.clientY - dragOffset.current.y; // Calculate new Y position relative to the initial click point

    positionRef.current = { x: newX, y: newY }; // Update the ref immediately

    // Apply position changes directly to the DOM for smoother dragging experience
    requestAnimationFrame(() => {
      imgRef.current.style.left = `${newX}px`;
      imgRef.current.style.top = `${newY}px`;
    });
  };

  const handleTouchMove = (e) => {
    if (!draggingRef.current) return;

    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.current.x; // Calculate new X position relative to the initial touch point
    const newY = touch.clientY - dragOffset.current.y; // Calculate new Y position relative to the initial touch point

    positionRef.current = { x: newX, y: newY }; // Update the ref immediately

    // Apply position changes directly to the DOM for smoother dragging experience
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
      onPositionChange(positionRef.current); // Send updated position from ref
    }

    // Update state with the latest position from ref
    setPosition(positionRef.current);
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);

    if (onPositionChange) {
      onPositionChange(positionRef.current); // Send updated position from ref
    }

    // Update state with the latest position from ref
    setPosition(positionRef.current);
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
      ref={imgRef} // Reference for positioning
      src={src}
      alt={alt}
      onMouseDown={handleMouseDown} // Attach event handlers to the img element
      onTouchStart={handleTouchStart}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${scaledSize.width}px`, // Set scaled width
        height: 'auto', // Maintain aspect ratio relative to width
        cursor: draggingRef.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    />
  );
};

export default DraggableImage;