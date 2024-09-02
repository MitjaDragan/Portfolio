import React, { useState, useLayoutEffect, useRef } from 'react';
import DraggableImage from './DraggableImage';
import LevelSelector from './LevelSelector';

const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    const fileName = item.replace('./', '');
    images[fileName] = r(item);
  });
  return images;
};

const images4x4 = importAll(require.context('../assets/images/4x4', false, /\.(png|jpe?g|svg)$/));

const levels = {
  easy: [
    { key: 'A1', src: images4x4['A1.png'].default, correctPosition: { x: 100, y: 100 }, size: { width: 106, height: 79 } },
    { key: 'A2', src: images4x4['A2.png'].default, correctPosition: { x: 175, y: 100 }, size: { width: 106, height: 79 } },
    { key: 'A3', src: images4x4['A3.png'].default, correctPosition: { x: 225, y: 102 }, size: { width: 106, height: 79 } },
    { key: 'A4', src: images4x4['A4.png'].default, correctPosition: { x: 327, y: 102 }, size: { width: 106, height: 79 } },
    { key: 'B1', src: images4x4['B1.png'].default, correctPosition: { x: 100, y: 148 }, size: { width: 106, height: 79 } },
    { key: 'B2', src: images4x4['B2.png'].default, correctPosition: { x: 149, y: 175 }, size: { width: 106, height: 79 } },
    { key: 'B3', src: images4x4['B3.png'].default, correctPosition: { x: 251, y: 149 }, size: { width: 106, height: 79 } },
    { key: 'B4', src: images4x4['B4.png'].default, correctPosition: { x: 300, y: 175 }, size: { width: 106, height: 79 } },
    { key: 'C1', src: images4x4['C1.png'].default, correctPosition: { x: 102, y: 250 }, size: { width: 106, height: 79 } },
    { key: 'C2', src: images4x4['C2.png'].default, correctPosition: { x: 176, y: 224 }, size: { width: 106, height: 79 } },
    { key: 'C3', src: images4x4['C3.png'].default, correctPosition: { x: 225, y: 250 }, size: { width: 106, height: 79 } },
    { key: 'C4', src: images4x4['C4.png'].default, correctPosition: { x: 327, y: 224 }, size: { width: 106, height: 79 } },
    { key: 'D1', src: images4x4['D1.png'].default, correctPosition: { x: 103, y: 299 }, size: { width: 106, height: 79 } },
    { key: 'D2', src: images4x4['D2.png'].default, correctPosition: { x: 149, y: 326 }, size: { width: 106, height: 79 } },
    { key: 'D3', src: images4x4['D3.png'].default, correctPosition: { x: 250, y: 299 }, size: { width: 106, height: 79 } },
    { key: 'D4', src: images4x4['D4.png'].default, correctPosition: { x: 300, y: 326 }, size: { width: 106, height: 79 } },
  ],  
};

const BASE_SCREEN_WIDTH = 1920;

const neighborMap = {
  A1: ['A2', 'B1'],
  A2: ['A1', 'A3', 'B2'],
  A3: ['A2', 'A4', 'B3'],
  A4: ['A3', 'B4'],
  B1: ['A1', 'B2', 'C1'],
  B2: ['A2', 'B1', 'B3', 'C2'],
  B3: ['A3', 'B2', 'B4', 'C3'],
  B4: ['A4', 'B3', 'C4'],
  C1: ['B1', 'C2', 'D1'],
  C2: ['B2', 'C1', 'C3', 'D2'],
  C3: ['B3', 'C2', 'C4', 'D3'],
  C4: ['B4', 'C3', 'D4'],
  D1: ['C1', 'D2'],
  D2: ['C2', 'D1', 'D3'],
  D3: ['C3', 'D2', 'D4'],
  D4: ['C4', 'D3'],
};

const getRandomPosition = () => {
  const x = Math.floor(Math.random() * (BASE_SCREEN_WIDTH - 100));
  const y = Math.floor(Math.random() * (400 - 150 + 1)) + 150;
  return { x, y };
};

const DroppableArea = () => {
  const [level, setLevel] = useState('easy');
  const [scaledImageMap, setScaledImageMap] = useState([]);
  const [relativePositions, setRelativePositions] = useState({});
  const [positions, setPositions] = useState({});
  const [imageSizes, setImageSizes] = useState({});
  const originalPositionsRef = useRef({});
  const correctNeighborPositions = useRef({});

  const calculateImageSizesAndPositions = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;

    const sizes = {};
    const newScaledImageMap = levels[level].map((image) => {
      sizes[image.key] = {
        width: image.size.width * scaleFactor,
        height: image.size.height * scaleFactor,
      };

      const scaledX = image.correctPosition.x * scaleFactor;
      const scaledY = image.correctPosition.y * scaleFactor;

      return { ...image, scaledPosition: { x: scaledX, y: scaledY } };
    });

    const newRelativePositions = {};
    newScaledImageMap.forEach((img1) => {
      newRelativePositions[img1.key] = {};
      neighborMap[img1.key].forEach((neighborKey) => {
        const img2 = newScaledImageMap.find((img) => img.key === neighborKey);
        if (img2) {
          newRelativePositions[img1.key][neighborKey] = {
            x: img2.scaledPosition.x - img1.scaledPosition.x,
            y: img2.scaledPosition.y - img1.scaledPosition.y,
          };
        }
      });
    });

    setImageSizes(sizes);
    setScaledImageMap(newScaledImageMap);
    setRelativePositions(newRelativePositions);
  };

  const initializePositions = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;
    const newUnscaledPositions = levels[level].reduce((acc, img) => {
      const randomPosition = getRandomPosition();
      acc[img.key] = {
        x: randomPosition.x,
        y: randomPosition.y,
      };
      return acc;
    }, {});

    const newScaledPositions = {};
    Object.entries(newUnscaledPositions).forEach(([key, position]) => {
      newScaledPositions[key] = {
        x: position.x * scaleFactor,
        y: position.y * scaleFactor,
      };
    });

    setPositions(newScaledPositions);
    originalPositionsRef.current = newUnscaledPositions;
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
      }
    });

    correctNeighborPositions.current = { ...correctNeighborPositions.current, ...newCorrectPositions };
  };

  const adjustPositionsOnResize = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;
    const adjustedPositions = {};

    Object.entries(originalPositionsRef.current).forEach(([key, originalPosition]) => {
      adjustedPositions[key] = {
        x: originalPosition.x * scaleFactor,
        y: originalPosition.y * scaleFactor,
      };

    });

    setPositions(adjustedPositions);
  };

  useLayoutEffect(() => {
    calculateImageSizesAndPositions();
    initializePositions();

    const handleResize = () => {
      setTimeout(() => {
        calculateImageSizesAndPositions();
        adjustPositionsOnResize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [level]);

  const handlePositionChange = (key, newPosition) => {
    setPositions((prevPositions) => {
      const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;
      const newPositions = { ...prevPositions, [key]: newPosition };
  
      const newUnscaledX = newPosition.x / scaleFactor;
      const newUnscaledY = newPosition.y / scaleFactor;
      originalPositionsRef.current[key] = { x: newUnscaledX, y: newUnscaledY };
  
      console.log(`Moved piece ${key} to new position:`, newPosition);

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
  
          console.log(
            `${key} relative to ${neighborKey} - Correct position: x=${correctX}, y=${correctY} | Distances - X: ${distanceX.toFixed(2)}, Y: ${distanceY.toFixed(2)}`
          );
  
          if (distanceX <= 30 && distanceY <= 30 && !didLock) {
            console.log('lock');
            newPositions[key] = { x: correctX, y: correctY };
            didLock = true;
  
            originalPositionsRef.current[key] = { x: correctX / scaleFactor, y: correctY / scaleFactor };
          }
        }
      });
  
      return newPositions;
    });
  };
  

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setImageSizes({});
    initializePositions();
  };

  return (
    <div>
      <LevelSelector onSelectLevel={handleLevelChange} />
      {scaledImageMap.map(({ key, src, scaledPosition }) => (
        <DraggableImage
          key={key}
          src={src}
          alt={`Puzzle Piece ${key}`}
          initialPosition={{ x: scaledPosition.x, y: scaledPosition.y }}
          externalPosition={positions[key]}
          size={imageSizes[key]}
          onPositionChange={(newPosition) => handlePositionChange(key, newPosition)}
        />
      ))}
    </div>
  );
};

export default DroppableArea;
