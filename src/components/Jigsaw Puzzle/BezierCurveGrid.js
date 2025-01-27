import React, { useState } from "react";

const edgeDistributions = (() => {
  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const baselineOffsets = {
    xMin: 30,
    xMax: 50,
    yMin: -10, // Subtle curvature for baseline
    yMax: 10,
  };

  const upperOffsets = {
    xMin: 15,
    xMax: 25,
    yMin: 10, // Subtle curvature for upper control points
    yMax: 20,
  };

  const emphasizedOffsets = {
    xMin: 45,
    xMax: 55,
    yMin: 20, // Emphasized curvature for P4
    yMax: 40,
  };

  return function () {
    const point1 = [0, 0]; // Start point (curve passes through)
    const point2 = [
      randomBetween(baselineOffsets.xMin, baselineOffsets.xMax),
      randomBetween(baselineOffsets.yMin, baselineOffsets.yMax),
    ]; // Control point for first curve
    const point3 = [
      randomBetween(upperOffsets.xMin, upperOffsets.xMax),
      randomBetween(upperOffsets.yMin, upperOffsets.yMax),
    ]; // Control point for first curve
    const point4 = [
      randomBetween(emphasizedOffsets.xMin, emphasizedOffsets.xMax),
      randomBetween(emphasizedOffsets.yMin, emphasizedOffsets.yMax),
    ]; // Control point for second curve
    const point5 = [
      randomBetween(baselineOffsets.xMax, baselineOffsets.xMin + 10),
      randomBetween(baselineOffsets.yMin, baselineOffsets.yMax),
    ]; // Control point for second curve
    const point6 = [100, 0]; // End point (curve passes through)

    return [point1, point2, point3, point4, point5, point6].map(([x, y]) => [
      x / 100,
      y / 100,
    ]);
  };
})();

const SingleEdge = () => {
  const [path, setPath] = useState("");
  const [points, setPoints] = useState([]);

  const generateEdge = () => {
    const generatedPoints = edgeDistributions();

    if (!generatedPoints || generatedPoints.length < 6) {
      console.error("Edge generation failed due to missing points.");
      return;
    }

    // Construct the path using two `C` commands for two connected curves
    const edgePath = `
      M ${generatedPoints[0][0] * 500},${250 + generatedPoints[0][1] * 500}
      C ${generatedPoints[1][0] * 500},${250 + generatedPoints[1][1] * 500}
        ${generatedPoints[2][0] * 500},${250 + generatedPoints[2][1] * 500}
        ${generatedPoints[3][0] * 500},${250 + generatedPoints[3][1] * 500}
        ${generatedPoints[3][0] * 500},${250 + generatedPoints[3][1] * 500},
        ${generatedPoints[4][0] * 500},${250 + generatedPoints[4][1] * 500},
        ${generatedPoints[5][0] * 500},${250 + generatedPoints[5][1] * 500}
    `;
    setPath(edgePath);
    setPoints(generatedPoints);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <button
        onClick={generateEdge}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Generate New Edge
      </button>
      <svg
        width="600"
        height="500"
        style={{ border: "1px solid black", backgroundColor: "white" }}
      >
        {/* Render the path */}
        <path d={path} fill="none" stroke="black" strokeWidth={2} />

        {/* Render the control points as colored circles */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point[0] * 500}
              cy={250 + point[1] * 500}
              r={5}
              fill={["red", "blue", "green", "orange", "purple", "brown"][index]}
            />
            <text
              x={point[0] * 500 + 10}
              y={250 + point[1] * 500}
              fontSize="12"
              fill="black"
            >
              {`P${index + 1}`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default SingleEdge;
