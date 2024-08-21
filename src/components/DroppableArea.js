import React from 'react';
import DraggableImage from './DraggableImage';
import Piece1 from '../assets/images/Piece1.png';
import Piece2 from '../assets/images/Piece2.png';

const DroppableArea = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '500px',
        height: '500px',
        border: '2px solid #000',
        margin: '20px auto',
        overflow: 'hidden',
      }}
    >
      <DraggableImage src={Piece1} alt="Piece 1" initialPosition={{ x: 50, y: 50 }} />
      <DraggableImage src={Piece2} alt="Piece 2" initialPosition={{ x: 150, y: 50 }} />
      {/* Add more DraggableImage components as needed */}
    </div>
  );
};

export default DroppableArea;
