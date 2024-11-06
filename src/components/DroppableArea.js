// src/components/DroppableArea.js
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import DraggableImage from './DraggableImage';
import LevelSelector from './LevelSelector';
import { ImageLoader } from './ImageLoader';
import './DroppableArea.css';

const BASE_SCREEN_WIDTH = 11520;

const getRandomPosition = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const SCREEN_HEIGHT = screenHeight * (BASE_SCREEN_WIDTH / screenWidth);

  const x = Math.floor(0.01 * BASE_SCREEN_WIDTH + Math.random() * 0.89 * BASE_SCREEN_WIDTH);
  const y = Math.floor(0.2 * SCREEN_HEIGHT + Math.random() * 0.5 * SCREEN_HEIGHT);
  return { x, y };
};

const DroppableArea = () => {
  const [level, setLevel] = useState('easy');
  const [images, setImages] = useState([]);
  const [neighborMap, setNeighborMap] = useState({});
  const [positions, setPositions] = useState({});
  const originalPositionsRef = useRef({});
  const [loaded, setLoaded] = useState(false); // Track if images have been loaded

  const handleImagesLoaded = (layout, loadedNeighborMap) => {
    if (loaded) return; // Prevent reloading if already loaded

    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;

    setImages(layout.map(({ key, correctPosition, size, src }) => ({
      key,
      src,
      correctPosition: {
        x: correctPosition.x * scaleFactor,
        y: correctPosition.y * scaleFactor,
      },
      size: {
        width: size.width * scaleFactor,
        height: size.height * scaleFactor,
      },
    })));

    setNeighborMap(loadedNeighborMap);
    setLoaded(true); // Mark as loaded
  };

  const initializePositions = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;
    const newPositions = images.reduce((acc, img) => {
      const randomPosition = getRandomPosition();
      acc[img.key] = {
        x: randomPosition.x * scaleFactor,
        y: randomPosition.y * scaleFactor,
      };
      return acc;
    }, {});

    setPositions(newPositions);
    originalPositionsRef.current = newPositions;
  };

  useEffect(() => {
    if (images.length) initializePositions();
  }, [images]); // Initialize positions when images change

  useLayoutEffect(() => {
    const handleResize = () => {
      const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;
      setPositions((prevPositions) =>
        Object.keys(prevPositions).reduce((acc, key) => {
          const originalPosition = originalPositionsRef.current[key];
          acc[key] = {
            x: originalPosition.x * scaleFactor,
            y: originalPosition.y * scaleFactor,
          };
          return acc;
        }, {})
      );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handlePositionChange = (key, newPosition) => {
    setPositions((prevPositions) => {
      const newPositions = { ...prevPositions, [key]: newPosition };
      originalPositionsRef.current[key] = newPosition;
      return newPositions;
    });
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setLoaded(false); // Reset loaded state when changing level
  };

  return (
    <div>
      <ImageLoader level={level} onImagesLoaded={handleImagesLoaded} />
      <LevelSelector onSelectLevel={handleLevelChange} />
      {images.map(({ key, src, correctPosition, size }) => (
        <DraggableImage
          key={key}
          src={src}
          alt={`Puzzle Piece ${key}`}
          initialPosition={correctPosition}
          externalPosition={positions[key]}
          size={size}
          onPositionChange={(newPosition) => handlePositionChange(key, newPosition)}
        />
      ))}
    </div>
  );
};

export default DroppableArea;
