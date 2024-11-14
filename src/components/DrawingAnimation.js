import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const DrawingAnimation = ({ attemptsLeft, resetKey }) => {
  const parts = useRef([]);
  const isGameStarted = useRef(false);

  const initializeParts = () => {
    parts.current.forEach((part) => {
      if (part) {
        const length = part.getTotalLength();
        part.style.strokeDasharray = length;
        part.style.strokeDashoffset = length;
      }
    });
  };

  useEffect(() => {
    initializeParts();
    isGameStarted.current = false;
  }, [resetKey]);

  useEffect(() => {
    if (!isGameStarted.current) {
      if (attemptsLeft < 9) {
        isGameStarted.current = true;
      } else {
        return;
      }
    }

    const wrongGuesses = 10 - attemptsLeft;

    if (wrongGuesses > 0 && parts.current[wrongGuesses - 1]) {
      gsap.to(parts.current[wrongGuesses - 1], {
        strokeDashoffset: 0,
        duration: 1,
      });
    }
  }, [attemptsLeft]);

  return (
    <svg
      width="50%"
      height="50%"
      viewBox="0 0 200 250"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Gallows */}
      <line ref={(el) => (parts.current[0] = el)} x1="20" y1="230" x2="180" y2="230" stroke="black" strokeWidth="4" />
      <line ref={(el) => (parts.current[1] = el)} x1="100" y1="230" x2="100" y2="50" stroke="black" strokeWidth="4" />
      <line ref={(el) => (parts.current[2] = el)} x1="100" y1="50" x2="160" y2="50" stroke="black" strokeWidth="4" />
      <line ref={(el) => (parts.current[3] = el)} x1="160" y1="50" x2="160" y2="70" stroke="black" strokeWidth="4" />

      {/* Hangman parts */}
      <circle ref={(el) => (parts.current[4] = el)} cx="160" cy="90" r="20" stroke="black" strokeWidth="4" fill="transparent" />
      <line ref={(el) => (parts.current[5] = el)} x1="160" y1="110" x2="160" y2="170" stroke="black" strokeWidth="4" />
      <line ref={(el) => (parts.current[6] = el)} x1="160" y1="130" x2="140" y2="150" stroke="black" strokeWidth="4" />
      <line ref={(el) => (parts.current[7] = el)} x1="160" y1="130" x2="180" y2="150" stroke="black" strokeWidth="4" />
      <line ref={(el) => (parts.current[8] = el)} x1="160" y1="170" x2="140" y2="200" stroke="black" strokeWidth="4" />
      <line ref={(el) => (parts.current[9] = el)} x1="160" y1="170" x2="180" y2="200" stroke="black" strokeWidth="4" />
    </svg>
  );
};

export default DrawingAnimation;
