import React, { useState, useEffect, useRef } from 'react';
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
    { key: 'A1', src: images4x4['A1.png'].default, correctPosition: { x: 600, y: 100 }, size: { width: 106, height: 79 } },
    { key: 'A2', src: images4x4['A2.png'].default, correctPosition: { x: 675, y: 100 }, size: { width: 106, height: 79 } },
    { key: 'A3', src: images4x4['A3.png'].default, correctPosition: { x: 725, y: 102 }, size: { width: 106, height: 79 } },
    { key: 'A4', src: images4x4['A4.png'].default, correctPosition: { x: 827, y: 102 }, size: { width: 106, height: 79 } },
    { key: 'B1', src: images4x4['B1.png'].default, correctPosition: { x: 600, y: 148 }, size: { width: 106, height: 79 } },
    { key: 'B2', src: images4x4['B2.png'].default, correctPosition: { x: 649, y: 175 }, size: { width: 106, height: 79 } },
    { key: 'B3', src: images4x4['B3.png'].default, correctPosition: { x: 751, y: 149 }, size: { width: 106, height: 79 } },
    { key: 'B4', src: images4x4['B4.png'].default, correctPosition: { x: 800, y: 175 }, size: { width: 106, height: 79 } },
    { key: 'C1', src: images4x4['C1.png'].default, correctPosition: { x: 602, y: 250 }, size: { width: 106, height: 79 } },
    { key: 'C2', src: images4x4['C2.png'].default, correctPosition: { x: 676, y: 224 }, size: { width: 106, height: 79 } },
    { key: 'C3', src: images4x4['C3.png'].default, correctPosition: { x: 725, y: 250 }, size: { width: 106, height: 79 } },
    { key: 'C4', src: images4x4['C4.png'].default, correctPosition: { x: 827, y: 224 }, size: { width: 106, height: 79 } },
    { key: 'D1', src: images4x4['D1.png'].default, correctPosition: { x: 603, y: 299 }, size: { width: 106, height: 79 } },
    { key: 'D2', src: images4x4['D2.png'].default, correctPosition: { x: 649, y: 326 }, size: { width: 106, height: 79 } },
    { key: 'D3', src: images4x4['D3.png'].default, correctPosition: { x: 750, y: 299 }, size: { width: 106, height: 79 } },
    { key: 'D4', src: images4x4['D4.png'].default, correctPosition: { x: 800, y: 326 }, size: { width: 106, height: 79 } },
  ],
};

const BASE_SCREEN_WIDTH = 1920; // Base screen width for reference scaling

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
  const x = Math.floor(Math.random() * (window.innerWidth - 100));
  const y = Math.floor(Math.random() * (window.innerHeight - 100));
  return { x, y };
};

const DroppableArea = () => {
  const [level, setLevel] = useState('easy');
  const [scaledImageMap, setScaledImageMap] = useState([]);
  const [relativePositions, setRelativePositions] = useState({});
  const [positions, setPositions] = useState({});
  const [imageSizes, setImageSizes] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const originalPositionsRef = useRef({});

  const calculateImageSizes = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH; // Scale relative to screen width
    const sizes = {};

    levels[level].forEach(({ key, size }) => {
      sizes[key] = {
        width: size.width * scaleFactor,
        height: size.height * scaleFactor,
      };
    });

    setImageSizes(sizes);
    setImagesLoaded(true);
  };

  const calculateRelativePositions = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH; // Scale relative to screen width

    const scaledImageMap = levels[level].map((image) => {
      const scaledX = image.correctPosition.x * scaleFactor;
      const scaledY = image.correctPosition.y * scaleFactor;
      return { ...image, scaledPosition: { x: scaledX, y: scaledY } };
    });

    const newRelativePositions = {};
    scaledImageMap.forEach((img1) => {
      newRelativePositions[img1.key] = {};
      neighborMap[img1.key].forEach((neighborKey) => {
        const img2 = scaledImageMap.find((img) => img.key === neighborKey);
        if (img2) {
          newRelativePositions[img1.key][neighborKey] = {
            x: img1.scaledPosition.x - img2.scaledPosition.x,
            y: img1.scaledPosition.y - img2.scaledPosition.y,
          };
        }
      });
    });

    setScaledImageMap(scaledImageMap);
    setRelativePositions(newRelativePositions);
  };

  const initializePositions = () => {
    const newPositions = levels[level].reduce((acc, img) => {
      acc[img.key] = getRandomPosition();
      return acc;
    }, {});
    setPositions(newPositions);
    originalPositionsRef.current = newPositions; // Save the original positions
  };

  const adjustPositionsOnResize = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH; // Recalculate scale factor
    const adjustedPositions = {};

    Object.entries(originalPositionsRef.current).forEach(([key, originalPosition]) => {
      adjustedPositions[key] = {
        x: originalPosition.x * scaleFactor,
        y: originalPosition.y * scaleFactor,
      };
    });

    setPositions(adjustedPositions);
  };

  useEffect(() => {
    calculateImageSizes();
    calculateRelativePositions();
    initializePositions();

    const handleResize = () => {
      calculateImageSizes();
      calculateRelativePositions();
      adjustPositionsOnResize(); // Adjust positions proportionally
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [level]);

  const handlePositionChange = (key, newPosition) => {
    console.log(`Moved piece ${key} to new position:`, newPosition);

    setPositions((prevPositions) => {
      const newPositions = { ...prevPositions, [key]: newPosition };
      originalPositionsRef.current[key] = newPosition; // Update the original positions

      const neighbors = neighborMap[key] || [];

      neighbors.forEach((neighborKey) => {
        if (relativePositions[key] && relativePositions[key][neighborKey]) {
          const relativePos = relativePositions[key][neighborKey];

          const correctX = newPositions[neighborKey].x + relativePos.x;
          const correctY = newPositions[neighborKey].y + relativePos.y;

          console.log(`Relative correct position of ${neighborKey} to ${key}: x=${correctX}, y=${correctY}`);

          const distanceX = Math.abs(correctX - newPosition.x);
          const distanceY = Math.abs(correctY - newPosition.y);

          console.log(`Distance X to correct position: ${distanceX}, Distance Y to correct position: ${distanceY}`);

          if (distanceX <= 30 && distanceY <= 30) {
            console.log(`"Lock": Piece ${key} is close to its correct position relative to ${neighborKey}`);
            newPositions[key] = { x: correctX, y: correctY };
            originalPositionsRef.current[key] = { x: correctX, y: correctY }; // Update the original positions
            console.log(`Snapped ${key} to new position: x=${correctX}, y=${correctY}`);
          }
        }
      });

      return newPositions;
    });
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setImageSizes({});
    setImagesLoaded(false);
    initializePositions(); // Regenerate random positions on level change
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