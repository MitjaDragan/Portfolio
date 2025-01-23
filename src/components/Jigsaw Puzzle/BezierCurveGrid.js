import React, { useState, useEffect } from "react";

const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

const generateBezierCurveWithLines = (cellSize) => {
  const baselineOffsets = {
    xMin: 51,
    xMax: 22,
    yMin: -5,
    yMax: 5,
  };

  const upperOffsets = {
    xMin: 20,
    xMax: 15,
    yMin: 20,
    yMax: 44,
  };

  const path = `
    M 0 0 
    L ${randomBetween(baselineOffsets.xMin, baselineOffsets.xMax)} ${randomBetween(baselineOffsets.yMin, baselineOffsets.yMax)}
    C ${randomBetween(upperOffsets.xMin, upperOffsets.xMax)},${randomBetween(upperOffsets.yMin, upperOffsets.yMax)} 
    ${randomBetween(100 - upperOffsets.xMax, 100 - upperOffsets.xMin)},${randomBetween(upperOffsets.yMin, upperOffsets.yMax)}
    ${randomBetween(100 - baselineOffsets.xMax, 100 - baselineOffsets.xMin)},${randomBetween(baselineOffsets.yMin, baselineOffsets.yMax)}
    L 100 0`;

  return path;
};

const BezierCurveGrid = ({ cellSize = 50, gridRows = 4, gridCols = 4 }) => {
  const [paths, setPaths] = useState([]);

  const drawCurveGrid = () => {
    const xSpacing = cellSize * 3;
    const ySpacing = cellSize * 3;
    const newPaths = [];

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const pathData = generateBezierCurveWithLines(cellSize);
        newPaths.push({ pathData, transform: `translate(${col * xSpacing}, ${row * ySpacing})` });
      }
    }

    setPaths(newPaths);
  };

  useEffect(() => {
    drawCurveGrid(); // Generate the initial grid on mount
  }, []);

  return (
    <div>
      <svg id="random-shape" width="800" height="800">
        {paths.map((curve, index) => (
          <path
            key={index}
            d={curve.pathData}
            fill="none"
            stroke="black"
            strokeWidth={2}
            transform={curve.transform}
          />
        ))}
      </svg>
      <button onClick={drawCurveGrid}>Generate New Grid</button>
    </div>
  );
};

export default BezierCurveGrid;
