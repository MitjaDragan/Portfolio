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

const imageMap = [A1, A2, A3, A4, B1, B2, B3, B4, C1, C2, C3, C4, D1, D2, D3, D4];

const DroppableArea = () => {

  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * 400); // Random within the left area
    const y = Math.floor(Math.random() * 400); // Random within the container height
    return { x, y };
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

      {imageMap.map((key) => (
        <DraggableImage
          key={String(key)}
          src={key}
          alt={`Puzzle Piece ${String(key)}`}
          initialPosition={getRandomPosition()}
        />
      ))}
    </div>
  );
};

export default DroppableArea;
