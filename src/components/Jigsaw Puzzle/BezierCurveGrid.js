
import React, { useState, useEffect } from "react";

const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

const generateBezierCurveWithLines = (cellSize) => {
  const baselineOffsets = {
    xMin: 45,
    xMax: 30,
    yMin: -5,
    yMax: 5,
  };

  const upperOffsets = {
    xMin: 20,
    xMax: 15,
    yMin: 20,
    yMax: 44,
  };

  const points = [
    { x: 0, y: 0, color: "red" },
    { x: randomBetween(baselineOffsets.xMin, baselineOffsets.xMax), y: randomBetween(baselineOffsets.yMin, baselineOffsets.yMax), color: "blue" },
    { x: randomBetween(upperOffsets.xMin, upperOffsets.xMax), y: randomBetween(upperOffsets.yMin, upperOffsets.yMax), color: "green" },
    { x: randomBetween(100 - upperOffsets.xMax, 100 - upperOffsets.xMin), y: randomBetween(upperOffsets.yMin, upperOffsets.yMax), color: "orange" },
    { x: randomBetween(100 - baselineOffsets.xMax, 100 - baselineOffsets.xMin), y: randomBetween(baselineOffsets.yMin, baselineOffsets.yMax), color: "purple" },
    { x: 100, y: 0, color: "red" },
  ];

  const path = `
    M ${points[0].x} ${points[0].y} 
    L ${points[1].x} ${points[1].y}
    C ${points[2].x},${points[2].y}
      ${points[3].x},${points[3].y}
      ${points[4].x},${points[4].y}
    L ${points[5].x} ${points[5].y}`;

  return { path, points };
};

const BezierCurveGrid = ({ cellSize = 50, gridRows = 4, gridCols = 4 }) => {
  const [curves, setCurves] = useState([]);

  const drawCurveGrid = () => {
    const xSpacing = cellSize * 3;
    const ySpacing = cellSize * 3;
    const newCurves = [];

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const { path, points } = generateBezierCurveWithLines(cellSize);
        newCurves.push({
          path,
          points,
          transform: `translate(${col * xSpacing}, ${row * ySpacing})`,
        });
      }
    }

    setCurves(newCurves);
  };

  useEffect(() => {
    drawCurveGrid(); // Generate the initial grid on mount
  }, []);

  return (
    <div>
      <button onClick={drawCurveGrid}>Generate New Grid</button>
      <svg id="random-shape" width="800" height="800">
        {curves.map((curve, index) => (
          <g key={index} transform={curve.transform}>
            <path
              d={curve.path}
              fill="none"
              stroke="black"
              strokeWidth={2}
            />
            {curve.points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={point.color}
              />
            ))}
          </g>
        ))}
      </svg>
    
      <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">

  <path d="M -7,29 C 1,29,20,34,37,35,55,36,39,13,53,9,79,-5,67,30,79,30,101,30,124,34,126,28" 
        stroke="black" fill="transparent" strokeWidth="2" />
</svg>

    </div>
  );
};

export default BezierCurveGrid;