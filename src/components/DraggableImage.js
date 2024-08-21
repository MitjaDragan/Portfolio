import React, { useState, useRef, useEffect } from 'react';

const DraggableImage = ({ src, alt, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();

    const rect = imgRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    draggingRef.current = true;
    imgRef.current.style.pointerEvents = 'none';
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

  const handleMouseUp = () => {
    draggingRef.current = false;
    imgRef.current.style.pointerEvents = 'auto';
  };

  useEffect(() => {
    const handleDocumentMouseMove = (e) => {
      if (draggingRef.current) {
        handleMouseMove(e);
      }
    };

    const handleDocumentMouseUp = () => {
      if (draggingRef.current) {
        handleMouseUp();
      }
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: draggingRef.current ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    />
  );
};

export default DraggableImage;
