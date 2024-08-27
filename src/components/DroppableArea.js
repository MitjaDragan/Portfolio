import React, { useState } from 'react';
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
const images6x6 = importAll(require.context('../assets/images/6x6', false, /\.(png|jpe?g|svg)$/));
const images8x8 = importAll(require.context('../assets/images/8x8', false, /\.(png|jpe?g|svg)$/));


console.log(images4x4['A1.png']);

const levels = {
  easy: [
    { key: 'A1', src: images4x4['A1.png'].default, correctPosition: { x: 600, y: 100 } },
    { key: 'A2', src: images4x4['A2.png'].default, correctPosition: { x: 676.1, y: 100 } },
    { key: 'A3', src: images4x4['A3.png'].default, correctPosition: { x: 727.5, y: 102 } },
    { key: 'A4', src: images4x4['A4.png'].default, correctPosition: { x: 831, y: 102 } },
    { key: 'B1', src: images4x4['B1.png'].default, correctPosition: { x: 600, y: 150 } },
    { key: 'B2', src: images4x4['B2.png'].default, correctPosition: { x: 651, y: 178 } },
    { key: 'B3', src: images4x4['B3.png'].default, correctPosition: { x: 754.2, y: 151 } },
    { key: 'B4', src: images4x4['B4.png'].default, correctPosition: { x: 805.3, y: 177 } },
    { key: 'C1', src: images4x4['C1.png'].default, correctPosition: { x: 602, y: 255.5 } },
    { key: 'C2', src: images4x4['C2.png'].default, correctPosition: { x: 677, y: 228.7 } },
    { key: 'C3', src: images4x4['C3.png'].default, correctPosition: { x: 728, y: 254.7 } },
    { key: 'C4', src: images4x4['C4.png'].default, correctPosition: { x: 830.5, y: 228 } },
    { key: 'D1', src: images4x4['D1.png'].default, correctPosition: { x: 602, y: 305.5 } },
    { key: 'D2', src: images4x4['D2.png'].default, correctPosition: { x: 651.5, y: 331 } },
    { key: 'D3', src: images4x4['D3.png'].default, correctPosition: { x: 754.5, y: 305.6 } },
    { key: 'D4', src: images4x4['D4.png'].default, correctPosition: { x: 805.1, y: 331 } },
  ],
  medium: [
    { key: 'A1', src: images6x6['A1.png'].default, correctPosition: { x: 600, y: 100 } },
    { key: 'A2', src: images6x6['A2.png'].default, correctPosition: { x: 676.1, y: 100 } },
    { key: 'A3', src: images6x6['A3.png'].default, correctPosition: { x: 727.5, y: 102 } },
    { key: 'A4', src: images6x6['A4.png'].default, correctPosition: { x: 831, y: 102 } },
    { key: 'A5', src: images6x6['A5.png'].default, correctPosition: { x: 727.5, y: 102 } },
    { key: 'A6', src: images6x6['A6.png'].default, correctPosition: { x: 831, y: 102 } },
    { key: 'B1', src: images6x6['B1.png'].default, correctPosition: { x: 600, y: 150 } },
    { key: 'B2', src: images6x6['B2.png'].default, correctPosition: { x: 651, y: 178 } },
    { key: 'B3', src: images6x6['B3.png'].default, correctPosition: { x: 754.2, y: 151 } },
    { key: 'B4', src: images6x6['B4.png'].default, correctPosition: { x: 805.3, y: 177 } },
    { key: 'B5', src: images6x6['B5.png'].default, correctPosition: { x: 754.2, y: 151 } },
    { key: 'B6', src: images6x6['B6.png'].default, correctPosition: { x: 805.3, y: 177 } },
    { key: 'C1', src: images6x6['C1.png'].default, correctPosition: { x: 602, y: 255.5 } },
    { key: 'C2', src: images6x6['C2.png'].default, correctPosition: { x: 677, y: 228.7 } },
    { key: 'C3', src: images6x6['C3.png'].default, correctPosition: { x: 728, y: 254.7 } },
    { key: 'C4', src: images6x6['C4.png'].default, correctPosition: { x: 830.5, y: 228 } },
    { key: 'C5', src: images6x6['C5.png'].default, correctPosition: { x: 728, y: 254.7 } },
    { key: 'C6', src: images6x6['C6.png'].default, correctPosition: { x: 830.5, y: 228 } },
    { key: 'D1', src: images6x6['D6.png'].default, correctPosition: { x: 602, y: 305.5 } },
    { key: 'D2', src: images6x6['D2.png'].default, correctPosition: { x: 651.5, y: 331 } },
    { key: 'D3', src: images6x6['D3.png'].default, correctPosition: { x: 754.5, y: 305.6 } },
    { key: 'D4', src: images6x6['D4.png'].default, correctPosition: { x: 805.1, y: 331 } },
    { key: 'D5', src: images6x6['D5.png'].default, correctPosition: { x: 754.5, y: 305.6 } },
    { key: 'D6', src: images6x6['D6.png'].default, correctPosition: { x: 805.1, y: 331 } },
    { key: 'E1', src: images6x6['E6.png'].default, correctPosition: { x: 602, y: 305.5 } },
    { key: 'E2', src: images6x6['E2.png'].default, correctPosition: { x: 651.5, y: 331 } },
    { key: 'E3', src: images6x6['E3.png'].default, correctPosition: { x: 754.5, y: 305.6 } },
    { key: 'E4', src: images6x6['E4.png'].default, correctPosition: { x: 805.1, y: 331 } },
    { key: 'E5', src: images6x6['E5.png'].default, correctPosition: { x: 754.5, y: 305.6 } },
    { key: 'E6', src: images6x6['E6.png'].default, correctPosition: { x: 805.1, y: 331 } },
    { key: 'F1', src: images6x6['F6.png'].default, correctPosition: { x: 602, y: 305.5 } },
    { key: 'F2', src: images6x6['F2.png'].default, correctPosition: { x: 651.5, y: 331 } },
    { key: 'F3', src: images6x6['F3.png'].default, correctPosition: { x: 754.5, y: 305.6 } },
    { key: 'F4', src: images6x6['F4.png'].default, correctPosition: { x: 805.1, y: 331 } },
    { key: 'F5', src: images6x6['F5.png'].default, correctPosition: { x: 754.5, y: 305.6 } },
    { key: 'F6', src: images6x6['F6.png'].default, correctPosition: { x: 805.1, y: 331 } },
  ],
  hard: [
    
  ],
};

const calculateRelativePositions = (imageMap) => {
  const relativePositions = {};
  imageMap.forEach(img1 => {
    relativePositions[img1.key] = {};
    imageMap.forEach(img2 => {
      if (img1.key !== img2.key) {
        relativePositions[img1.key][img2.key] = {
          x: img2.correctPosition.x - img1.correctPosition.x,
          y: img2.correctPosition.y - img1.correctPosition.y,
        };
      }
    });
  });
  return relativePositions;
};

const getRandomPosition = () => {
  const x = Math.floor(Math.random() * 400); // Random within the left area
  const y = Math.floor(Math.random() * 400); // Random within the container height
  return { x, y };
};

const DroppableArea = () => {
  const [level, setLevel] = useState('easy');
  const [positions, setPositions] = useState(() => {
    const initialLevelImages = levels[level];
    return initialLevelImages.reduce((acc, img) => {
      acc[img.key] = getRandomPosition();
      return acc;
    }, {});
  });

  const SNAP_THRESHOLD = 30;
  const imageMap = levels[level];
  const relativePositions = calculateRelativePositions(imageMap);

  const handlePositionChange = (key, newPosition) => {
    setPositions(prevPositions => {
      let snapped = false;
      let newPositions = { ...prevPositions };

      for (const otherKey in prevPositions) {
        if (otherKey !== key) {
          const expectedPosition = {
            x: prevPositions[otherKey].x + relativePositions[otherKey][key].x,
            y: prevPositions[otherKey].y + relativePositions[otherKey][key].y,
          };

          const distanceX = Math.abs(newPosition.x - expectedPosition.x);
          const distanceY = Math.abs(newPosition.y - expectedPosition.y);

          if (distanceX <= SNAP_THRESHOLD && distanceY <= SNAP_THRESHOLD) {
            newPositions[key] = expectedPosition;
            snapped = true;
            break;
          }
        }
      }

      if (!snapped) {
        newPositions[key] = newPosition;
      }

      return newPositions;
    });
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setPositions(() => {
      const initialLevelImages = levels[newLevel];
      return initialLevelImages.reduce((acc, img) => {
        acc[img.key] = getRandomPosition();
        return acc;
      }, {});
    });
  };

  return (
    <div>
      <LevelSelector onSelectLevel={handleLevelChange} />
      <div
        style={{
          position: 'relative',
          width: '1000px',
          height: '500px',
          border: '2px solid #000',
          margin: '20px auto',
          overflow: 'hidden',
        }}
      >
        {imageMap.map(({ key, src, correctPosition }) => (
          <DraggableImage
            key={key}
            src={src}
            alt={`Puzzle Piece ${key}`}
            initialPosition={positions[key]} // Start in the current random position correctPosition / positions[key]
            externalPosition={positions[key]} // Allow external updates to position
            onPositionChange={(newPosition) => handlePositionChange(key, newPosition)}
          />
        ))}
      </div>
    </div>
  );
};

export default DroppableArea;
