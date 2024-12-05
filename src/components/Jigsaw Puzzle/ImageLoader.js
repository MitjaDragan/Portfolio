import React, { useEffect, useState } from 'react';

const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    const fileName = item.replace('./', '');
    images[fileName] = r(item);
  });
  return images;
};

const images4x4 = importAll(require.context('/src/assets/images/4x4', false, /\.(png|jpe?g|svg)$/));
const images6x6 = importAll(require.context('/src/assets/images/6x6', false, /\.(png|jpe?g|svg)$/));
const images8x8 = importAll(require.context('/src/assets/images/8x8', false, /\.(png|jpe?g|svg)$/));

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
    medium: {
    images: images6x6,
    layout: [
        { key: 'A1', src: images6x6['A1.png'].default, correctPosition: { x: 2400, y: 800 }, size: { width: 300, height: 300 } },
        { key: 'A2', src: images6x6['A2.png'].default, correctPosition: { x: 3047, y: 800 }, size: { width: 300, height: 300 } },
        { key: 'A3', src: images6x6['A3.png'].default, correctPosition: { x: 3480, y: 800 }, size: { width: 300, height: 300 } },
        { key: 'A4', src: images6x6['A4.png'].default, correctPosition: { x: 4385, y: 800 }, size: { width: 300, height: 300 } },
        { key: 'A5', src: images6x6['A5.png'].default, correctPosition: { x: 4825, y: 800 }, size: { width: 300, height: 300 } },
        { key: 'A6', src: images6x6['A6.png'].default, correctPosition: { x: 5730, y: 800 }, size: { width: 300, height: 300 } },
    
        { key: 'B1', src: images6x6['B1.png'].default, correctPosition: { x: 2400, y: 1210 }, size: { width: 300, height: 300 } },
        { key: 'B2', src: images6x6['B2.png'].default, correctPosition: { x: 2815, y: 1450 }, size: { width: 300, height: 300 } },
        { key: 'B3', src: images6x6['B3.png'].default, correctPosition: { x: 3720, y: 1210 }, size: { width: 300, height: 300 } },
        { key: 'B4', src: images6x6['B4.png'].default, correctPosition: { x: 4160, y: 1450 }, size: { width: 300, height: 300 } },
        { key: 'B5', src: images6x6['B5.png'].default, correctPosition: { x: 5065, y: 1210 }, size: { width: 300, height: 300 } },
        { key: 'B6', src: images6x6['B6.png'].default, correctPosition: { x: 5500, y: 1450 }, size: { width: 300, height: 300 } },
    
        { key: 'C1', src: images6x6['C1.png'].default, correctPosition: { x: 2400, y: 2120 }, size: { width: 300, height: 300 } },
        { key: 'C2', src: images6x6['C2.png'].default, correctPosition: { x: 3047, y: 1885 }, size: { width: 300, height: 300 } },
        { key: 'C3', src: images6x6['C3.png'].default, correctPosition: { x: 3480, y: 2120 }, size: { width: 300, height: 300 } },
        { key: 'C4', src: images6x6['C4.png'].default, correctPosition: { x: 4385, y: 1885 }, size: { width: 300, height: 300 } },
        { key: 'C5', src: images6x6['C5.png'].default, correctPosition: { x: 4825, y: 2120 }, size: { width: 300, height: 300 } },
        { key: 'C6', src: images6x6['C6.png'].default, correctPosition: { x: 5730, y: 1885 }, size: { width: 300, height: 300 } },
    
        { key: 'D1', src: images6x6['D1.png'].default, correctPosition: { x: 2400, y: 2550 }, size: { width: 300, height: 300 } },
        { key: 'D2', src: images6x6['D2.png'].default, correctPosition: { x: 2815, y: 2785 }, size: { width: 300, height: 300 } },
        { key: 'D3', src: images6x6['D3.png'].default, correctPosition: { x: 3720, y: 2550 }, size: { width: 300, height: 300 } },
        { key: 'D4', src: images6x6['D4.png'].default, correctPosition: { x: 4160, y: 2785 }, size: { width: 300, height: 300 } },
        { key: 'D5', src: images6x6['D5.png'].default, correctPosition: { x: 5065, y: 2550 }, size: { width: 300, height: 300 } },
        { key: 'D6', src: images6x6['D6.png'].default, correctPosition: { x: 5500, y: 2785 }, size: { width: 300, height: 300 } },
    
        { key: 'E1', src: images6x6['E1.png'].default, correctPosition: { x: 2400, y: 3455 }, size: { width: 300, height: 300 } },
        { key: 'E2', src: images6x6['E2.png'].default, correctPosition: { x: 3047, y: 3220 }, size: { width: 300, height: 300 } },
        { key: 'E3', src: images6x6['E3.png'].default, correctPosition: { x: 3480, y: 3455 }, size: { width: 300, height: 300 } },
        { key: 'E4', src: images6x6['E4.png'].default, correctPosition: { x: 4385, y: 3220 }, size: { width: 300, height: 300 } },
        { key: 'E5', src: images6x6['E5.png'].default, correctPosition: { x: 4825, y: 3455 }, size: { width: 300, height: 300 } },
        { key: 'E6', src: images6x6['E6.png'].default, correctPosition: { x: 5730, y: 3220 }, size: { width: 300, height: 300 } },

        { key: 'F1', src: images6x6['F1.png'].default, correctPosition: { x: 2400, y: 3890 }, size: { width: 300, height: 300 } },
        { key: 'F2', src: images6x6['F2.png'].default, correctPosition: { x: 2815, y: 4125 }, size: { width: 300, height: 300 } },
        { key: 'F3', src: images6x6['F3.png'].default, correctPosition: { x: 3720, y: 3890 }, size: { width: 300, height: 300 } },
        { key: 'F4', src: images6x6['F4.png'].default, correctPosition: { x: 4160, y: 4125 }, size: { width: 300, height: 300 } },
        { key: 'F5', src: images6x6['F5.png'].default, correctPosition: { x: 5065, y: 3890 }, size: { width: 300, height: 300 } },
        { key: 'F6', src: images6x6['F6.png'].default, correctPosition: { x: 5500, y: 4125 }, size: { width: 300, height: 300 } },
      ],
    neighborMap: {
        A1: ['A2', 'B1'],
        A2: ['A1', 'A3', 'B2'],
        A3: ['A2', 'A4', 'B3'],
        A4: ['A3', 'A5', 'B4'],
        A5: ['A4', 'A6', 'B5'],
        A6: ['A5', 'B6'],
        
        B1: ['A1', 'B2', 'C1'],
        B2: ['A2', 'B1', 'B3', 'C2'],
        B3: ['A3', 'B2', 'B4', 'C3'],
        B4: ['A4', 'B3', 'B5', 'C4'],
        B5: ['A5', 'B4', 'B6', 'C5'],
        B6: ['A6', 'B5', 'C6'],
        
        C1: ['B1', 'C2', 'D1'],
        C2: ['B2', 'C1', 'C3', 'D2'],
        C3: ['B3', 'C2', 'C4', 'D3'],
        C4: ['B4', 'C3', 'C5', 'D4'],
        C5: ['B5', 'C4', 'C6', 'D5'],
        C6: ['B6', 'C5', 'D6'],
        
        D1: ['C1', 'D2', 'E1'],
        D2: ['C2', 'D1', 'D3', 'E2'],
        D3: ['C3', 'D2', 'D4', 'E3'],
        D4: ['C4', 'D3', 'D5', 'E4'],
        D5: ['C5', 'D4', 'D6', 'E5'],
        D6: ['C6', 'D5', 'E6'],
        
        E1: ['D1', 'E2', 'F1'],
        E2: ['D2', 'E1', 'E3', 'F2'],
        E3: ['D3', 'E2', 'E4', 'F3'],
        E4: ['D4', 'E3', 'E5', 'F4'],
        E5: ['D5', 'E4', 'E6', 'F5'],
        E6: ['D6', 'E5', 'F6'],
        
        F1: ['E1', 'F2'],
        F2: ['E2', 'F1', 'F3'],
        F3: ['E3', 'F2', 'F4'],
        F4: ['E4', 'F3', 'F5'],
        F5: ['E5', 'F4', 'F6'],
        F6: ['E6', 'F5']
        },
    },
    hard: {
        images: images8x8,
        layout: [
            { key: 'A1', src: images8x8['A1.png'].default, correctPosition: { x: 2400, y: 800 }, size: { width: 300, height: 300 } },
            { key: 'A2', src: images8x8['A2.png'].default, correctPosition: { x: 2887, y: 800 }, size: { width: 300, height: 300 } },
            { key: 'A3', src: images8x8['A3.png'].default, correctPosition: { x: 3210, y: 800 }, size: { width: 300, height: 300 } },
            { key: 'A4', src: images8x8['A4.png'].default, correctPosition: { x: 3890, y: 800 }, size: { width: 300, height: 300 } },
            { key: 'A5', src: images8x8['A5.png'].default, correctPosition: { x: 4212, y: 800 }, size: { width: 300, height: 300 } },
            { key: 'A6', src: images8x8['A6.png'].default, correctPosition: { x: 4892, y: 800 }, size: { width: 300, height: 300 } },
            { key: 'A7', src: images8x8['A7.png'].default, correctPosition: { x: 5215, y: 800 }, size: { width: 300, height: 300 } },
            { key: 'A8', src: images8x8['A8.png'].default, correctPosition: { x: 5893, y: 800 }, size: { width: 300, height: 300 } },
        
            { key: 'B1', src: images8x8['B1.png'].default, correctPosition: { x: 2400, y: 1115 }, size: { width: 300, height: 300 } },
            { key: 'B2', src: images8x8['B2.png'].default, correctPosition: { x: 2712, y: 1290 }, size: { width: 300, height: 300 } },
            { key: 'B3', src: images8x8['B3.png'].default, correctPosition: { x: 3387, y: 1115 }, size: { width: 300, height: 300 } },
            { key: 'B4', src: images8x8['B4.png'].default, correctPosition: { x: 3715, y: 1290 }, size: { width: 300, height: 300 } },
            { key: 'B5', src: images8x8['B5.png'].default, correctPosition: { x: 4390, y: 1115 }, size: { width: 300, height: 300 } },
            { key: 'B6', src: images8x8['B6.png'].default, correctPosition: { x: 4716, y: 1290 }, size: { width: 300, height: 300 } },
            { key: 'B7', src: images8x8['B7.png'].default, correctPosition: { x: 5392, y: 1115 }, size: { width: 300, height: 300 } },
            { key: 'B8', src: images8x8['B8.png'].default, correctPosition: { x: 5715, y: 1290 }, size: { width: 300, height: 300 } },
        
            { key: 'C1', src: images8x8['C1.png'].default, correctPosition: { x: 2400, y: 1790 }, size: { width: 300, height: 300 } },
            { key: 'C2', src: images8x8['C2.png'].default, correctPosition: { x: 2889, y: 1615 }, size: { width: 300, height: 300 } },
            { key: 'C3', src: images8x8['C3.png'].default, correctPosition: { x: 3218, y: 1790 }, size: { width: 300, height: 300 } },
            { key: 'C4', src: images8x8['C4.png'].default, correctPosition: { x: 3895, y: 1615 }, size: { width: 300, height: 300 } },
            { key: 'C5', src: images8x8['C5.png'].default, correctPosition: { x: 4220, y: 1790 }, size: { width: 300, height: 300 } },
            { key: 'C6', src: images8x8['C6.png'].default, correctPosition: { x: 4894, y: 1615 }, size: { width: 300, height: 300 } },
            { key: 'C7', src: images8x8['C7.png'].default, correctPosition: { x: 5219, y: 1790 }, size: { width: 300, height: 300 } },
            { key: 'C8', src: images8x8['C8.png'].default, correctPosition: { x: 5895, y: 1615 }, size: { width: 300, height: 300 } },
        
            { key: 'D1', src: images8x8['D1.png'].default, correctPosition: { x: 2400, y: 2112 }, size: { width: 300, height: 300 } },
            { key: 'D2', src: images8x8['D2.png'].default, correctPosition: { x: 2712, y: 2288 }, size: { width: 300, height: 300 } },
            { key: 'D3', src: images8x8['D3.png'].default, correctPosition: { x: 3387, y: 2112 }, size: { width: 300, height: 300 } },
            { key: 'D4', src: images8x8['D4.png'].default, correctPosition: { x: 3715, y: 2288 }, size: { width: 300, height: 300 } },
            { key: 'D5', src: images8x8['D5.png'].default, correctPosition: { x: 4390, y: 2112 }, size: { width: 300, height: 300 } },
            { key: 'D6', src: images8x8['D6.png'].default, correctPosition: { x: 4716, y: 2288 }, size: { width: 300, height: 300 } },
            { key: 'D7', src: images8x8['D7.png'].default, correctPosition: { x: 5392, y: 2112 }, size: { width: 300, height: 300 } },
            { key: 'D8', src: images8x8['D8.png'].default, correctPosition: { x: 5715, y: 2288 }, size: { width: 300, height: 300 } },
        
            { key: 'E1', src: images8x8['E1.png'].default, correctPosition: { x: 2400, y: 2787 }, size: { width: 300, height: 300 } },
            { key: 'E2', src: images8x8['E2.png'].default, correctPosition: { x: 2889, y: 2613 }, size: { width: 300, height: 300 } },
            { key: 'E3', src: images8x8['E3.png'].default, correctPosition: { x: 3218, y: 2787 }, size: { width: 300, height: 300 } },
            { key: 'E4', src: images8x8['E4.png'].default, correctPosition: { x: 3895, y: 2613 }, size: { width: 300, height: 300 } },
            { key: 'E5', src: images8x8['E5.png'].default, correctPosition: { x: 4220, y: 2787 }, size: { width: 300, height: 300 } },
            { key: 'E6', src: images8x8['E6.png'].default, correctPosition: { x: 4894, y: 2613 }, size: { width: 300, height: 300 } },
            { key: 'E7', src: images8x8['E7.png'].default, correctPosition: { x: 5219, y: 2787 }, size: { width: 300, height: 300 } },
            { key: 'E8', src: images8x8['E8.png'].default, correctPosition: { x: 5895, y: 2613 }, size: { width: 300, height: 300 } },
        
            { key: 'F1', src: images8x8['F1.png'].default, correctPosition: { x: 2400, y: 3109 }, size: { width: 300, height: 300 } },
            { key: 'F2', src: images8x8['F2.png'].default, correctPosition: { x: 2712, y: 3286 }, size: { width: 300, height: 300 } },
            { key: 'F3', src: images8x8['F3.png'].default, correctPosition: { x: 3387, y: 3109 }, size: { width: 300, height: 300 } },
            { key: 'F4', src: images8x8['F4.png'].default, correctPosition: { x: 3715, y: 3286 }, size: { width: 300, height: 300 } },
            { key: 'F5', src: images8x8['F5.png'].default, correctPosition: { x: 4390, y: 3109 }, size: { width: 300, height: 300 } },
            { key: 'F6', src: images8x8['F6.png'].default, correctPosition: { x: 4716, y: 3286 }, size: { width: 300, height: 300 } },
            { key: 'F7', src: images8x8['F7.png'].default, correctPosition: { x: 5392, y: 3109 }, size: { width: 300, height: 300 } },
            { key: 'F8', src: images8x8['F8.png'].default, correctPosition: { x: 5715, y: 3286 }, size: { width: 300, height: 300 } },
        
            { key: 'G1', src: images8x8['G1.png'].default, correctPosition: { x: 2400, y: 3784 }, size: { width: 300, height: 300 } },
            { key: 'G2', src: images8x8['G2.png'].default, correctPosition: { x: 2889, y: 3611 }, size: { width: 300, height: 300 } },
            { key: 'G3', src: images8x8['G3.png'].default, correctPosition: { x: 3218, y: 3784 }, size: { width: 300, height: 300 } },
            { key: 'G4', src: images8x8['G4.png'].default, correctPosition: { x: 3895, y: 3611 }, size: { width: 300, height: 300 } },
            { key: 'G5', src: images8x8['G5.png'].default, correctPosition: { x: 4220, y: 3784 }, size: { width: 300, height: 300 } },
            { key: 'G6', src: images8x8['G6.png'].default, correctPosition: { x: 4894, y: 3611 }, size: { width: 300, height: 300 } },
            { key: 'G7', src: images8x8['G7.png'].default, correctPosition: { x: 5219, y: 3784 }, size: { width: 300, height: 300 } },
            { key: 'G8', src: images8x8['G8.png'].default, correctPosition: { x: 5895, y: 3611 }, size: { width: 300, height: 300 } },
        
            { key: 'H1', src: images8x8['H1.png'].default, correctPosition: { x: 2400, y: 4110 }, size: { width: 300, height: 300 } },
            { key: 'H2', src: images8x8['H2.png'].default, correctPosition: { x: 2712, y: 4284 }, size: { width: 300, height: 300 } },
            { key: 'H3', src: images8x8['H3.png'].default, correctPosition: { x: 3387, y: 4110 }, size: { width: 300, height: 300 } },
            { key: 'H4', src: images8x8['H4.png'].default, correctPosition: { x: 3715, y: 4284 }, size: { width: 300, height: 300 } },
            { key: 'H5', src: images8x8['H5.png'].default, correctPosition: { x: 4390, y: 4110 }, size: { width: 300, height: 300 } },
            { key: 'H6', src: images8x8['H6.png'].default, correctPosition: { x: 4716, y: 4284 }, size: { width: 300, height: 300 } },
            { key: 'H7', src: images8x8['H7.png'].default, correctPosition: { x: 5392, y: 4110 }, size: { width: 300, height: 300 } },
            { key: 'H8', src: images8x8['H8.png'].default, correctPosition: { x: 5715, y: 4284 }, size: { width: 300, height: 300 } },
        ],
        neighborMap: {
        A1: ['A2', 'B1'],
        A2: ['A1', 'A3', 'B2'],
        A3: ['A2', 'A4', 'B3'],
        A4: ['A3', 'A5', 'B4'],
        A5: ['A4', 'A6', 'B5'],
        A6: ['A5', 'A7', 'B6'],
        A7: ['A6', 'A8', 'B7'],
        A8: ['A7', 'B8'],
        B1: ['A1', 'B2', 'C1'],
        B2: ['A2', 'B1', 'B3', 'C2'],
        B3: ['A3', 'B2', 'B4', 'C3'],
        B4: ['A4', 'B3', 'B5', 'C4'],
        B5: ['A5', 'B4', 'B6', 'C5'],
        B6: ['A6', 'B5', 'B7', 'C6'],
        B7: ['A7', 'B6', 'B8', 'C7'],
        B8: ['A8', 'B7', 'C8'],
        C1: ['B1', 'C2', 'D1'],
        C2: ['B2', 'C1', 'C3', 'D2'],
        C3: ['B3', 'C2', 'C4', 'D3'],
        C4: ['B4', 'C3', 'C5', 'D4'],
        C5: ['B5', 'C4', 'C6', 'D5'],
        C6: ['B6', 'C5', 'C7', 'D6'],
        C7: ['B7', 'C6', 'C8', 'D7'],
        C8: ['B8', 'C7', 'D8'],
        D1: ['C1', 'D2', 'E1'],
        D2: ['C2', 'D1', 'D3', 'E2'],
        D3: ['C3', 'D2', 'D4', 'E3'],
        D4: ['C4', 'D3', 'D5', 'E4'],
        D5: ['C5', 'D4', 'D6', 'E5'],
        D6: ['C6', 'D5', 'D7', 'E6'],
        D7: ['C7', 'D6', 'D8', 'E7'],
        D8: ['C8', 'D7', 'E8'],
        E1: ['D1', 'E2', 'F1'],
        E2: ['D2', 'E1', 'E3', 'F2'],
        E3: ['D3', 'E2', 'E4', 'F3'],
        E4: ['D4', 'E3', 'E5', 'F4'],
        E5: ['D5', 'E4', 'E6', 'F5'],
        E6: ['D6', 'E5', 'E7', 'F6'],
        E7: ['D7', 'E6', 'E8', 'F7'],
        E8: ['D8', 'E7', 'F8'],
        F1: ['E1', 'F2', 'G1'],
        F2: ['E2', 'F1', 'F3', 'G2'],
        F3: ['E3', 'F2', 'F4', 'G3'],
        F4: ['E4', 'F3', 'F5', 'G4'],
        F5: ['E5', 'F4', 'F6', 'G5'],
        F6: ['E6', 'F5', 'F7', 'G6'],
        F7: ['E7', 'F6', 'F8', 'G7'],
        F8: ['E8', 'F7', 'G8'],
        G1: ['F1', 'G2', 'H1'],
        G2: ['F2', 'G1', 'G3', 'H2'],
        G3: ['F3', 'G2', 'G4', 'H3'],
        G4: ['F4', 'G3', 'G5', 'H4'],
        G5: ['F5', 'G4', 'G6', 'H5'],
        G6: ['F6', 'G5', 'G7', 'H6'],
        G7: ['F7', 'G6', 'G8', 'H7'],
        G8: ['F8', 'G7', 'H8'],
        H1: ['G1', 'H2'],
        H2: ['G2', 'H1', 'H3'],
        H3: ['G3', 'H2', 'H4'],
        H4: ['G4', 'H3', 'H5'],
        H5: ['G5', 'H4', 'H6'],
        H6: ['G6', 'H5', 'H7'],
        H7: ['G7', 'H6', 'H8'],
        H8: ['G8', 'H7'],
        },
    },
};


const ImageLoader = ({ level = 'hard', onImagesLoaded }) => {
    useEffect(() => {
      const selectedLevel = levelConfigs[level];
      if (selectedLevel) {
        onImagesLoaded(selectedLevel.layout, selectedLevel.neighborMap || {});
      } else {
        console.warn(`No configuration found for level: ${level}`);
      }
    }, [level, onImagesLoaded]);
  
    return null;
  };
  
  export { ImageLoader };