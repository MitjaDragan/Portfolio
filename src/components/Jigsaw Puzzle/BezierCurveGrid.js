import React, { useState, useEffect } from "react";

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a jigsaw-style edge path. 
 * @param {string} orientation - 'horizontal' or 'vertical'
 */
function generateEdge(orientation = "horizontal") {
  // Randomly choose whether the "bump" goes up/down (for horizontal)
  // or left/right (for vertical).
  const sign = Math.random() < 0.5 ? -1 : 1;

  // Amount of random perturbation
  const d = 0.04;

  // Base control points for a horizontal edge (start at (0,0), end at (1,0)):
  const p1H = [0, 0];
  const p2H = [0.763, -0.113];
  const p3H = [0.127, 0.35];
  const p4H = [0.438, 0.347];
  const p5H = [0.915, 0.342];
  const p6H = [0.064, -0.024];
  const p7H = [1, 0];

  // If orientation is vertical, we swap x/y so that we go top->bottom
  // from (0,0) to (0,1) with a shape that has sideways bumps:
  function orient([x, y]) {
    if (orientation === "vertical") {
      return [y, x];
    }
    return [x, y];
  }

  // Perturb the base point in the 'bump' direction
  function perturb([x, y]) {
    if (orientation === "horizontal") {
      // Horizontal => random in Y direction uses sign
      return [
        x + randomBetween(-d, d), // small random shift in X
        y + sign * randomBetween(-d, d) // bump up/down
      ];
    } else {
      // Vertical => random in X direction uses sign
      return [
        x + sign * randomBetween(-d, d), // bump left/right
        y + randomBetween(-d, d) // small random shift in Y
      ];
    }
  }

  // Apply orientation transform (swap x/y if vertical)
  const p1 = orient(p1H);
  const p2 = orient(perturb(p2H));
  const p3 = orient(perturb(p3H));
  const p4 = orient(perturb(p4H));
  const p5 = orient(perturb(p5H));
  const p6 = orient(perturb(p6H));
  const p7 = orient(p7H);

  // Scale everything up
  const scale = 200;
  function sx([x, _]) {
    return (x * scale).toFixed(3);
  }
  function sy([_, y]) {
    return (y * scale).toFixed(3);
  }

  const path = `
    M ${sx(p1)},${sy(p1)}
    C ${sx(p2)},${sy(p2)} ${sx(p3)},${sy(p3)} ${sx(p4)},${sy(p4)}
    C ${sx(p5)},${sy(p5)} ${sx(p6)},${sy(p6)} ${sx(p7)},${sy(p7)}
  `;

  const points = [p1, p2, p3, p4, p5, p6, p7].map(([x, y]) => [
    x * scale,
    y * scale
  ]);

  return { path, points };
}

const BezierCurveGrid = () => {
  const [curves, setCurves] = useState([]);

  function drawCurveGrid() {
    const rows = 4;
    const cols = 4;
    const xSpacing = 250;
    const ySpacing = 250;

    const newCurves = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Randomly choose orientation for each edge:
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        const { path, points } = generateEdge(orientation);
        newCurves.push({
          path,
          points,
          transform: `translate(${col * xSpacing}, ${row * ySpacing})`
        });
      }
    }
    setCurves(newCurves);
  }

  useEffect(() => {
    drawCurveGrid();
  }, []);

  return (
    <div>
      <button onClick={drawCurveGrid}>Generate New Grid</button>
      <svg width="1000" height="1000" style={{ background: "#f9f9f9" }}>
        {curves.map((curve, i) => (
          <g key={i} transform={curve.transform}>
            <path d={curve.path} fill="none" stroke="black" strokeWidth={3} />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default BezierCurveGrid;
