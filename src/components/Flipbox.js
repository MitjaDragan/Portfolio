import React from 'react';
import './FlipBox.css';
import { Link } from 'react-router-dom';
import jigsawImage from '../assets/images/Jigsaw/Jigsaw.jpg';
import hangmanImage from '../assets/images/Hangman/Hangman.jpg';

const FlipBox = () => {
  return (
    <div className="flip-box-container">
      {/* First Box */}
      <div className="flip-box">
        <div className="flip-box-inner">
          <div
            className="flip-box-front"
            style={{
              backgroundImage: `url(${jigsawImage})`,
              backgroundPosition: 'center', // Centers the image
              backgroundSize: 'cover' // Ensures the image covers the entire box
            }}
          >
          </div>
          <div className="flip-box-back">
            <h2>Box 1 Back</h2>
            <p>More information here</p>
            <Link to="/puzzle" className="navbar-brand">
              <button>Go to Puzzle</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Second Box */}
      <div className="flip-box">
        <div className="flip-box-inner">
          <div
            className="flip-box-front"
            style={{
              backgroundImage: `url(${hangmanImage})`,
              backgroundPosition: 'center', // Centers the image
              backgroundSize: 'cover' // Ensures the image covers the entire box
            }}
          >
          </div>
          <div className="flip-box-back">
            <h2>Box 2 Back</h2>
            <p>More information here</p>
            <Link to="/hangman" className="navbar-brand">
              <button>Go to Hangman</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Third Box */}
      <div className="flip-box">
        <div className="flip-box-inner">
          <div className="flip-box-front">
            <h2>Box 3</h2>
            <p>Hover to flip</p>
          </div>
          <div className="flip-box-back">
            <h2>Box 3 Back</h2>
            <p>More information here</p>
            <button onClick={() => window.location.href = '#'}>Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipBox;
