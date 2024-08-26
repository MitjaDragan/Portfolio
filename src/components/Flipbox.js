import React from 'react';
import './FlipBox.css';

const FlipBox = () => {
  return (
    <div className="flip-box-container">
      <div className="flip-box">
        <div className="flip-box-inner">
          <div className="flip-box-front">
            <h2>Box 1</h2>
            <p>Hover to flip</p>
          </div>
          <div className="flip-box-back">
            <h2>Box 1 Back</h2>
            <p>More information here</p>
          </div>
        </div>
      </div>
      <div className="flip-box">
        <div className="flip-box-inner">
          <div className="flip-box-front">
            <h2>Box 2</h2>
            <p>Hover to flip</p>
          </div>
          <div className="flip-box-back">
            <h2>Box 2 Back</h2>
            <p>More information here</p>
          </div>
        </div>
      </div>
      <div className="flip-box">
        <div className="flip-box-inner">
          <div className="flip-box-front">
            <h2>Box 3</h2>
            <p>Hover to flip</p>
          </div>
          <div className="flip-box-back">
            <h2>Box 3 Back</h2>
            <p>More information here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipBox;
