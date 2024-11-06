// src/components/DroppableArea.js
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import DraggableImage from './DraggableImage';
import LevelSelector from './LevelSelector';
import { ImageLoader } from './ImageLoader';
import './DroppableArea.css';

const BASE_SCREEN_WIDTH = 11520;
const BASE_LOCK_THRESHOLD = 30;

const calculateScaleFactor = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;
    console.log("Calculated Scale Factor:", scaleFactor);
    return scaleFactor;
};

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
    const [relativePositions, setRelativePositions] = useState({});
    const originalPositionsRef = useRef({});
    const correctNeighborPositions = useRef({});
    const [loaded, setLoaded] = useState(false);

    const calculateRelativePositions = (map, imagesData, scaleFactor) => {
        const relativePositions = imagesData.reduce((acc, img1) => {
            const neighbors = map[img1.key] || [];
            acc[img1.key] = neighbors.reduce((neighborAcc, neighborKey) => {
                const img2 = imagesData.find((img) => img.key === neighborKey);
                if (img2) {
                    // Calculate the scaled relative position
                    const relativeX = (img2.correctPosition.x - img1.correctPosition.x) * scaleFactor;
                    const relativeY = (img2.correctPosition.y - img1.correctPosition.y) * scaleFactor;
                    neighborAcc[neighborKey] = { x: relativeX, y: relativeY };
                    console.log(`Relative position from ${img1.key} to ${neighborKey}: X=${relativeX}, Y=${relativeY}`);
                }
                return neighborAcc;
            }, {});
            return acc;
        }, {});

        console.log("Calculated Relative Positions (scaled):", JSON.stringify(relativePositions, null, 2));
        setRelativePositions(relativePositions);
    };

    const calculateCorrectNeighborPositions = (movedPieceKey, newPosition) => {
        const newCorrectPositions = {};
        const neighbors = neighborMap[movedPieceKey] || [];

        neighbors.forEach((neighborKey) => {
            if (relativePositions[movedPieceKey] && relativePositions[movedPieceKey][neighborKey]) {
                const relativePos = relativePositions[movedPieceKey][neighborKey];
                const correctX = newPosition.x + relativePos.x;
                const correctY = newPosition.y + relativePos.y;

                newCorrectPositions[neighborKey] = { x: correctX, y: correctY };

                console.log(`Target lock position for ${neighborKey} (relative to moved ${movedPieceKey} at ${newPosition.x}, ${newPosition.y}):`);
                console.log(`Expected lock position for ${neighborKey} -> X: ${correctX}, Y: ${correctY}`);
            }
        });

        correctNeighborPositions.current = { ...correctNeighborPositions.current, ...newCorrectPositions };
    };

    const handleImagesLoaded = (layout, loadedNeighborMap) => {
        if (loaded) return;

        const scaleFactor = calculateScaleFactor();
        const mappedImages = layout.map(({ key, correctPosition, size, src }) => ({
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
        }));

        console.log("Mapped Images with Scaling:", mappedImages);

        setImages(mappedImages);
        setNeighborMap(loadedNeighborMap);
        setLoaded(true);

        calculateRelativePositions(loadedNeighborMap, layout, scaleFactor); // Apply scale here
    };

    const initializePositions = () => {
        const scaleFactor = calculateScaleFactor();
        const unscaledPositions = images.reduce((acc, img) => {
            acc[img.key] = getRandomPosition();
            return acc;
        }, {});
        originalPositionsRef.current = unscaledPositions;

        setPositions(
            Object.keys(unscaledPositions).reduce((acc, key) => {
                acc[key] = {
                    x: unscaledPositions[key].x * scaleFactor,
                    y: unscaledPositions[key].y * scaleFactor,
                };
                return acc;
            }, {})
        );

        console.log("Initialized and Scaled Initial Positions:", positions);
    };

    useEffect(() => {
        if (images.length) initializePositions();
    }, [images]);

    useLayoutEffect(() => {
      const handleResize = () => {
          const scaleFactor = calculateScaleFactor();
  
          // Recalculate scaled images and positions
          const scaledImages = images.map(({ key, correctPosition, size, src }) => ({
              key,
              src,
              correctPosition: {
                  x: correctPosition.x / scaleFactor,
                  y: correctPosition.y / scaleFactor,
              },
              size: {
                  width: size.width / scaleFactor,
                  height: size.height / scaleFactor,
              },
          }));
          
          // Update images with newly scaled values
          setImages(scaledImages);
          
          // Recalculate initial and scaled positions
          const updatedPositions = Object.keys(originalPositionsRef.current).reduce((acc, key) => {
              acc[key] = {
                  x: originalPositionsRef.current[key].x * scaleFactor,
                  y: originalPositionsRef.current[key].y * scaleFactor,
              };
              return acc;
          }, {});
          setPositions(updatedPositions);
  
          // Recalculate relative positions based on the new scale
          calculateRelativePositions(neighborMap, scaledImages, scaleFactor);
  
          // Recalculate correct neighbor positions for each piece
          Object.keys(updatedPositions).forEach((key) => {
              calculateCorrectNeighborPositions(key, updatedPositions[key]);
          });
  
          console.log("Updated on Resize: Scaled Images, Positions, Relative Positions, and Correct Neighbor Positions");
      };
  
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
  
      return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('orientationchange', handleResize);
      };
  }, [images, neighborMap, relativePositions]);
  

    const handlePositionChange = (key, newPosition) => {
      console.log('Moved piece:', key, 'to:', newPosition);
  
      setPositions((prevPositions) => {
          const newPositions = { ...prevPositions, [key]: newPosition };
          const scaleFactor = calculateScaleFactor();
  
          // Calculate unscaled position
          const newUnscaledX = Math.round(newPosition.x / scaleFactor);
          const newUnscaledY = Math.round(newPosition.y / scaleFactor);
          originalPositionsRef.current[key] = { x: newUnscaledX, y: newUnscaledY };
  
          console.log(`Updated Unscaled Position for ${key}:`, originalPositionsRef.current[key]);
  
          // Recalculate correct positions for neighbors
          calculateCorrectNeighborPositions(key, newPosition);
  
          const neighbors = neighborMap[key] || [];
          let didLock = false;
  
          neighbors.forEach((neighborKey) => {
            const neighborPosition = prevPositions[neighborKey];
            const relativePos = relativePositions[neighborKey]?.[key];

            if (relativePos) {
              const correctX = neighborPosition.x + relativePos.x;
              const correctY = neighborPosition.y + relativePos.y;
      
              const distanceX = Math.abs(correctX - newPosition.x);
              const distanceY = Math.abs(correctY - newPosition.y);

                console.log(`Distance from ${key} to target position of ${neighborKey}: X=${distanceX}, Y=${distanceY}`);
                  // Check if distances are within lock threshold
                  if (distanceX <= BASE_LOCK_THRESHOLD && distanceY <= BASE_LOCK_THRESHOLD && !didLock) {
                      console.log(`Locking ${key} to ${neighborKey} at X=${correctX}, Y=${correctY}`);
                      newPositions[key] = { x: correctX, y: correctY };
                      didLock = true;
                      console.log(`Piece ${key} locked to position:`, newPositions[key]);
                      // Update unscaled positions for the locked piece
                      originalPositionsRef.current[key] = { x: correctX / scaleFactor, y: correctY / scaleFactor };
                  }
              }
          });

          return newPositions;
      });
  };

    const handleLevelChange = (newLevel) => {
        setLevel(newLevel);
        setLoaded(false);
        console.log(`Level changed to: ${newLevel}`);
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
