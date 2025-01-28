import React, { useState, useEffect } from "react";

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateEdge() {
  const sign = Math.random() < 0.5 ? -1 : 1;

  const flipY = Math.random() < 0.5 ? -1 : 1;

  const p1 = [0, 0];
  const p2Base = [0.763, -0.113];
  const p3Base = [0.127, 0.35];
  const p4Base = [0.438, 0.347];
  const p5Base = [0.915, 0.342];
  const p6Base = [0.064, -0.024];
  const p7 = [1, 0];

  const d = 0.04;

  function perturb([x, y]) {
    return [
      x + randomBetween(-d, d),
      y + sign * randomBetween(-d, d)
    ];
  }

  const p2 = perturb(p2Base);
  const p3 = perturb(p3Base);
  const p4 = perturb(p4Base);
  const p5 = perturb(p5Base);
  const p6 = perturb(p6Base);

  const scale = 200;

  function sx([x, _y]) {
    return (x * scale).toFixed(3);
  }
  function sy([_x, y]) {
    return (y * scale * flipY).toFixed(3);
  }

  const path = `
    M ${sx(p1)},${sy(p1)}
    C ${sx(p2)},${sy(p2)} ${sx(p3)},${sy(p3)} ${sx(p4)},${sy(p4)}
    C ${sx(p5)},${sy(p5)} ${sx(p6)},${sy(p6)} ${sx(p7)},${sy(p7)}
  `;

  const points = [p1, p2, p3, p4, p5, p6, p7].map(([x, y]) => [
    x * scale,
    y * scale * flipY
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
        const { path, points } = generateEdge();
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
