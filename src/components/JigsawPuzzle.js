// src/components/JigsawPuzzle.js
import React from 'react';
import DroppableArea from './DroppableArea';
import DraggableImage from './DraggableImage';

import A1 from '../assets/images/Level1/A1.png';
import A2 from '../assets/images/Level1/A2.png';
import A3 from '../assets/images/Level1/A3.png';
import A4 from '../assets/images/Level1/A4.png';
import B1 from '../assets/images/Level1/B1.png';
import B2 from '../assets/images/Level1/B2.png';
import B3 from '../assets/images/Level1/B3.png';
import B4 from '../assets/images/Level1/B4.png';
import C1 from '../assets/images/Level1/C1.png';
import C2 from '../assets/images/Level1/C2.png';
import C3 from '../assets/images/Level1/C3.png';
import C4 from '../assets/images/Level1/C4.png';
import D1 from '../assets/images/Level1/D1.png';
import D2 from '../assets/images/Level1/D2.png';
import D3 from '../assets/images/Level1/D3.png';
import D4 from '../assets/images/Level1/D4.png';

function JigsawPuzzle() {
    return (
        <div className="jigsaw-puzzle">
            <h1>Drag and Drop Puzzle Pieces</h1>
            <DroppableArea>
                <DraggableImage src={A1} alt="A1" />
                <DraggableImage src={A2} alt="A2" />
                <DraggableImage src={A3} alt="A3" />
                <DraggableImage src={A4} alt="A4" />
                <DraggableImage src={B1} alt="B1" />
                <DraggableImage src={B2} alt="B2" />
                <DraggableImage src={B3} alt="B3" />
                <DraggableImage src={B4} alt="B4" />
                <DraggableImage src={C1} alt="C1" />
                <DraggableImage src={C2} alt="C2" />
                <DraggableImage src={C3} alt="C3" />
                <DraggableImage src={C4} alt="C4" />
                <DraggableImage src={D1} alt="D1" />
                <DraggableImage src={D2} alt="D2" />
                <DraggableImage src={D3} alt="D3" />
                <DraggableImage src={D4} alt="D4" />
            </DroppableArea>
        </div>
    );
}

export default JigsawPuzzle;
