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
    { key: 'A1', src: images4x4['A1.png'].default, correctPosition: { x: 600, y: 100 }, size: { width: 20, height: 20 } },
    { key: 'A2', src: images4x4['A2.png'].default, correctPosition: { x: 676.1, y: 100 }, size: { width: 20, height: 20 } },
    { key: 'A3', src: images4x4['A3.png'].default, correctPosition: { x: 727.5, y: 102 }, size: { width: 20, height: 20 } },
    { key: 'A4', src: images4x4['A4.png'].default, correctPosition: { x: 831, y: 102 }, size: { width: 20, height: 20 } },
    { key: 'B1', src: images4x4['B1.png'].default, correctPosition: { x: 600, y: 150 }, size: { width: 20, height: 20 } },
    { key: 'B2', src: images4x4['B2.png'].default, correctPosition: { x: 651, y: 178 }, size: { width: 20, height: 20 } },
    { key: 'B3', src: images4x4['B3.png'].default, correctPosition: { x: 754.2, y: 151 }, size: { width: 20, height: 20 } },
    { key: 'B4', src: images4x4['B4.png'].default, correctPosition: { x: 805.3, y: 177 }, size: { width: 20, height: 20 } },
    { key: 'C1', src: images4x4['C1.png'].default, correctPosition: { x: 602, y: 255.5 }, size: { width: 20, height: 20 } },
    { key: 'C2', src: images4x4['C2.png'].default, correctPosition: { x: 677, y: 228.7 }, size: { width: 20, height: 20 } },
    { key: 'C3', src: images4x4['C3.png'].default, correctPosition: { x: 728, y: 254.7 }, size: { width: 20, height: 20 } },
    { key: 'C4', src: images4x4['C4.png'].default, correctPosition: { x: 830.5, y: 228 }, size: { width: 20, height: 20 } },
    { key: 'D1', src: images4x4['D1.png'].default, correctPosition: { x: 602, y: 305.5 }, size: { width: 20, height: 20 } },
    { key: 'D2', src: images4x4['D2.png'].default, correctPosition: { x: 651.5, y: 331 }, size: { width: 20, height: 20 } },
    { key: 'D3', src: images4x4['D3.png'].default, correctPosition: { x: 754.5, y: 305.6 }, size: { width: 20, height: 20 } },
    { key: 'D4', src: images4x4['D4.png'].default, correctPosition: { x: 805.1, y: 331 }, size: { width: 20, height: 20 } },
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

  const calculateImageSizes = () => {
    const scaleFactor = window.innerWidth / BASE_SCREEN_WIDTH;
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
    const currentScreenWidth = window.innerWidth;
    const scaleFactor = currentScreenWidth / BASE_SCREEN_WIDTH; // Use a uniform scale factor for both X and Y

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
  };

  useEffect(() => {
    calculateImageSizes();
    calculateRelativePositions();
    initializePositions();

    const handleResize = () => {
      calculateImageSizes();
      calculateRelativePositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [level]);

  const handlePositionChange = (key, newPosition) => {
    console.log(`Moved piece ${key} to new position:, newPosition`); // Log the new position

    setPositions((prevPositions) => {
      const newPositions = { ...prevPositions, [key]: newPosition };

      // Get neighbors from the neighborMap
      const neighbors = neighborMap[key] || [];

      neighbors.forEach((neighborKey) => {
        if (relativePositions[key] && relativePositions[key][neighborKey]) {
          const relativePos = relativePositions[key][neighborKey]; // Get relative position of the moved piece to the neighbor

          // Calculate where the moved piece should be relative to the neighbor
          const correctX = positions[neighborKey].x + relativePos.x;
          const correctY = positions[neighborKey].y + relativePos.y;

          console.log(`Relative correct position of ${key} to ${neighborKey}: x=${correctX}, y=${correctY}`); // Log correct relative positions

          // Check if the distance to the correct position is within 30px
          const distanceX = Math.abs(correctX - newPosition.x);
          const distanceY = Math.abs(correctY - newPosition.y);

          console.log(`Distance X to correct position: ${distanceX}, Distance Y to correct position: ${distanceY}`);

          if (distanceX <= 30 && distanceY <= 30) {
            console.log(`"Lock": Piece ${key} is close to its correct position relative to ${neighborKey}`); // Log "lock" if close enough

            // Snap the moved piece to the correct position
            newPositions[key] = { x: correctX, y: correctY }; // Snap to the correct position

            console.log(`Snapped ${key} to new position: x=${correctX}, y=${correctY}`); // Log the snapped position
          }
        }
      });

      return newPositions; // Return the updated positions
    });
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setImageSizes({});
    setImagesLoaded(false);
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
          size={imageSizes[key]} // Use the calculated image size
          onPositionChange={(newPosition) => handlePositionChange(key, newPosition)}
        />
      ))}
    </div>
  );
};

export default DroppableArea;