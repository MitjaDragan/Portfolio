import React from 'react';
import './FlipBox.css';

const FlipBox = () => {
  return (
    <div className="flip-box-container">
      {['Box 1', 'Box 2', 'Box 3'].map((box, index) => (
        <div key={index} className="flip-box">
          <div className="flip-box-inner">
            <div className="flip-box-front">
              <h2>{box}</h2>
              <p>Hover to flip</p>
            </div>
            <div className="flip-box-back">
              <h2>{box} Back</h2>
              <p>More information here</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlipBox;
