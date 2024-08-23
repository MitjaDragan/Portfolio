import React, { useState } from 'react';
import DraggableImage from './DraggableImage';
import A1 from '../assets/images/Level1/A1.png';
import A2 from '../assets/images/Level1/A2.png';
import A3 from '../assets/images/Level1/A3.png';
import A4 from '../assets/images/Level1/A4.png';
import B1 from '../assets/images/Level1/B1.png';
import B2 from '../assets/images/Level1/B2.png';
import B3 from '../assets/images/Level1/B3.png';
import B4 from '../assets/images/Level1/B4.png';
import C1 from '../assets/images/Level1/C1.png';
import C2 from '../assets/images/Level1/C2.png';
import C3 from '../assets/images/Level1/C3.png';
import C4 from '../assets/images/Level1/C4.png';
import D1 from '../assets/images/Level1/D1.png';
import D2 from '../assets/images/Level1/D2.png';
import D3 from '../assets/images/Level1/D3.png';
import D4 from '../assets/images/Level1/D4.png';

const imageMap = [
  { key: 'A1', src: A1, correctPosition: { x: 600, y: 100 } },
  { key: 'A2', src: A2, correctPosition: { x: 676.1, y: 100 } },
  { key: 'A3', src: A3, correctPosition: { x: 727.5, y: 102 } },
  { key: 'A4', src: A4, correctPosition: { x: 831, y: 102 } },
  { key: 'B1', src: B1, correctPosition: { x: 600, y: 150 } },
  { key: 'B2', src: B2, correctPosition: { x: 651, y: 178 } },
  { key: 'B3', src: B3, correctPosition: { x: 754.2, y: 151 } },
  { key: 'B4', src: B4, correctPosition: { x: 805.3, y: 177 } },
  { key: 'C1', src: C1, correctPosition: { x: 602, y: 255.5 } },
  { key: 'C2', src: C2, correctPosition: { x: 677, y: 228.7 } },
  { key: 'C3', src: C3, correctPosition: { x: 728, y: 254.7 } },
  { key: 'C4', src: C4, correctPosition: { x: 830.5, y: 228 } },
  { key: 'D1', src: D1, correctPosition: { x: 602, y: 305.5 } },
  { key: 'D2', src: D2, correctPosition: { x: 651.5, y: 331 } },
  { key: 'D3', src: D3, correctPosition: { x: 754.5, y: 305.6 } },
  { key: 'D4', src: D4, correctPosition: { x: 805.1, y: 331 } },
];

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

const relativePositions = calculateRelativePositions(imageMap);

const getRandomPosition = () => {
  const x = Math.floor(Math.random() * 400); // Random within the left area
  const y = Math.floor(Math.random() * 400); // Random within the container height
  return { x, y };
};

const DroppableArea = () => {
  const [positions, setPositions] = useState(
    imageMap.reduce((acc, img) => {
      acc[img.key] = getRandomPosition();
      return acc;
    }, {})
  );

  const SNAP_THRESHOLD = 30;

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
            console.log("Lock");
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

  return (
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
  );
};

export default DroppableArea;