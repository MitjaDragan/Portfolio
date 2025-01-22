import React, { useState } from "react";

const JigsawImageSplitter = () => {
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const pieceSize = 100; // Size of each piece (100x100)

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const generateJigsawPieces = () => {
    if (!image) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const cols = Math.ceil(img.width / pieceSize);
      const rows = Math.ceil(img.height / pieceSize);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const newPieces = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const pieceCanvas = document.createElement("canvas");
          const pieceCtx = pieceCanvas.getContext("2d");
          pieceCanvas.width = pieceSize;
          pieceCanvas.height = pieceSize;

          // Draw the piece with jigsaw shape
          pieceCtx.beginPath();
          createJigsawPath(pieceCtx, col, row, cols, rows);
          pieceCtx.closePath();
          pieceCtx.clip();

          pieceCtx.drawImage(
            canvas,
            col * pieceSize,
            row * pieceSize,
            pieceSize,
            pieceSize,
            0,
            0,
            pieceSize,
            pieceSize
          );

          const pieceDataURL = pieceCanvas.toDataURL("image/png");
          newPieces.push(pieceDataURL);
        }
      }

      setPieces(newPieces);
    };
  };

  const createJigsawPath = (ctx, col, row, cols, rows) => {
    const tabSize = pieceSize / 4; // Size of the tabs/slots
    const startX = 0;
    const startY = 0;

    ctx.moveTo(startX, startY);

    // Top edge
    if (row === 0) {
      ctx.lineTo(pieceSize, startY);
    } else {
      createTabOrSlot(ctx, "top", col, tabSize);
    }

    // Right edge
    if (col === cols - 1) {
      ctx.lineTo(pieceSize, pieceSize);
    } else {
      createTabOrSlot(ctx, "right", row, tabSize);
    }

    // Bottom edge
    if (row === rows - 1) {
      ctx.lineTo(0, pieceSize);
    } else {
      createTabOrSlot(ctx, "bottom", col, tabSize);
    }

    // Left edge
    if (col === 0) {
      ctx.lineTo(startX, startY);
    } else {
      createTabOrSlot(ctx, "left", row, tabSize);
    }
  };

  const createTabOrSlot = (ctx, side, index, tabSize) => {
    const isTab = index % 2 === 0; // Alternate between tab and slot
    const direction = isTab ? 1 : -1;

    switch (side) {
      case "top":
        ctx.lineTo(pieceSize / 4, 0);
        ctx.quadraticCurveTo(
          pieceSize / 2,
          direction * tabSize,
          (3 * pieceSize) / 4,
          0
        );
        ctx.lineTo(pieceSize, 0);
        break;
      case "right":
        ctx.lineTo(pieceSize, pieceSize / 4);
        ctx.quadraticCurveTo(
          pieceSize + direction * tabSize,
          pieceSize / 2,
          pieceSize,
          (3 * pieceSize) / 4
        );
        ctx.lineTo(pieceSize, pieceSize);
        break;
      case "bottom":
        ctx.lineTo((3 * pieceSize) / 4, pieceSize);
        ctx.quadraticCurveTo(
          pieceSize / 2,
          pieceSize + direction * tabSize,
          pieceSize / 4,
          pieceSize
        );
        ctx.lineTo(0, pieceSize);
        break;
      case "left":
        ctx.lineTo(0, (3 * pieceSize) / 4);
        ctx.quadraticCurveTo(
          -direction * tabSize,
          pieceSize / 2,
          0,
          pieceSize / 4
        );
        ctx.lineTo(0, 0);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h1>Jigsaw Image Splitter</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={generateJigsawPieces}>Generate Jigsaw Pieces</button>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {pieces.map((piece, index) => (
          <img
            key={index}
            src={piece}
            alt={`Piece ${index}`}
            style={{
              width: pieceSize,
              height: pieceSize,
              border: "1px solid black",
              margin: "5px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default JigsawImageSplitter;
