// src/components/ImageLoader.js
import React, { useEffect, useState } from 'react';

// Function to import all images from a directory
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    const fileName = item.replace('./', ''); // Get just the file name
    images[fileName] = r(item); // Directly assign the imported path
  });
  return images;
};

// Import images for each level
const images4x4 = importAll(require.context('../assets/images/4x4', false, /\.(png|jpe?g|svg)$/));
const images6x6 = importAll(require.context('../assets/images/6x6', false, /\.(png|jpe?g|svg)$/));
const images8x8 = importAll(require.context('../assets/images/8x8', false, /\.(png|jpe?g|svg)$/));
  
// Configuration for each level
const levelConfigs = {
  easy: {
    images: images4x4,
    layout: [
        { key: 'A1', src: images4x4['A1.png'].default, correctPosition: { x: 2434, y: 850 }, size: { width: 636, height: 474 } },
        { key: 'A2', src: images4x4['A2.png'].default, correctPosition: { x: 3176, y: 850 }, size: { width: 636, height: 474 } },
        { key: 'A3', src: images4x4['A3.png'].default, correctPosition: { x: 3662, y: 850 }, size: { width: 636, height: 474 } },
        { key: 'A4', src: images4x4['A4.png'].default, correctPosition: { x: 4676, y: 850 }, size: { width: 636, height: 474 } },
        { key: 'B1', src: images4x4['B1.png'].default, correctPosition: { x: 2434, y: 1328 }, size: { width: 636, height: 474 } },
        { key: 'B2', src: images4x4['B2.png'].default, correctPosition: { x: 2912, y: 1592 }, size: { width: 636, height: 474 } },
        { key: 'B3', src: images4x4['B3.png'].default, correctPosition: { x: 3934, y: 1328 }, size: { width: 636, height: 474 } },
        { key: 'B4', src: images4x4['B4.png'].default, correctPosition: { x: 4412, y: 1592 }, size: { width: 636, height: 474 } },
        { key: 'C1', src: images4x4['C1.png'].default, correctPosition: { x: 2434, y: 2342 }, size: { width: 636, height: 474 } },
        { key: 'C2', src: images4x4['C2.png'].default, correctPosition: { x: 3176, y: 2078 }, size: { width: 636, height: 474 } },
        { key: 'C3', src: images4x4['C3.png'].default, correctPosition: { x: 3662, y: 2342 }, size: { width: 636, height: 474 } },
        { key: 'C4', src: images4x4['C4.png'].default, correctPosition: { x: 4676, y: 2078 }, size: { width: 636, height: 474 } },
        { key: 'D1', src: images4x4['D1.png'].default, correctPosition: { x: 2434, y: 2828 }, size: { width: 636, height: 474 } },
        { key: 'D2', src: images4x4['D2.png'].default, correctPosition: { x: 2912, y: 3092 }, size: { width: 636, height: 474 } },
        { key: 'D3', src: images4x4['D3.png'].default, correctPosition: { x: 3926, y: 2828 }, size: { width: 636, height: 474 } },
        { key: 'D4', src: images4x4['D4.png'].default, correctPosition: { x: 4412, y: 3092 }, size: { width: 636, height: 474 } },
      ],
    neighborMap: {
      A1: ['A2', 'B1'],
      A2: ['A1', 'A3', 'B2'],
      A3: ['A2', 'A4', 'B3'],
      A4: ['A3', 'B4'],
      B1: ['A1', 'B2', 'C1'],
      B2: ['A2', 'B1', 'B3', 'C2'],
      B3: ['A3', 'B2', 'B4', 'C3'],
      B4: ['A4', 'B3', 'C4'],
      C1: ['B1', 'C2', 'D1'],
      C2: ['B2', 'C1', 'C3', 'D2'],
      C3: ['B3', 'C2', 'C4', 'D3'],
      C4: ['B4', 'C3', 'D4'],
      D1: ['C1', 'D2'],
      D2: ['C2', 'D1', 'D3'],
      D3: ['C3', 'D2', 'D4'],
      D4: ['C4', 'D3'],
    },
  },
  // Define layouts and neighbor maps for "medium" and "hard" levels
};


const ImageLoader = ({ level = 'easy', onImagesLoaded }) => {
    useEffect(() => {
      const selectedLevel = levelConfigs[level];
      if (selectedLevel) {
        onImagesLoaded(selectedLevel.layout, selectedLevel.neighborMap || {});
      } else {
        console.warn(`No configuration found for level: ${level}`);
      }
    }, [level, onImagesLoaded]);
  
    return null; // No UI needed
  };
  
  export { ImageLoader };