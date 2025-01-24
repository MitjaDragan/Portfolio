
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
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="41.000000pt" height="51.000000pt" viewBox="0 0 41.000000 51.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,51.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M142 430 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M132 380 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
<path d="M122 316 l-2 -38 33 7 c17 4 42 9 54 12 24 6 47 -22 59 -70 l7 -29
-46 7 c-39 6 -47 4 -56 -13 -6 -12 -11 -27 -10 -34 0 -7 5 0 11 15 10 28 12
28 59 22 45 -6 49 -5 49 14 0 34 -33 91 -55 97 -11 3 -33 0 -49 -5 -40 -16
-44 -14 -49 22 -4 30 -4 30 -5 -7z"/>
<path d="M153 100 c0 -25 2 -35 4 -22 2 12 2 32 0 45 -2 12 -4 2 -4 -23z"/>
</g>
</svg>
    </div>
  );
};

export default BezierCurveGrid;