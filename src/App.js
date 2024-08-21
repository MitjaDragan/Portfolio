import React from 'react';
import Navbar from './Navbar';
import DraggableImage from './components/DraggableImage';
import DroppableArea from './components/DroppableArea';
import A1 from './assets/images/Level1/A1.png';
import A2 from './assets/images/Level1/A2.png';
import A3 from './assets/images/Level1/A3.png';
import A4 from './assets/images/Level1/A4.png';
import B1 from './assets/images/Level1/B1.png';
import B2 from './assets/images/Level1/B2.png';
import B3 from './assets/images/Level1/B3.png';
import B4 from './assets/images/Level1/B4.png';
import C1 from './assets/images/Level1/C1.png';
import C2 from './assets/images/Level1/C2.png';
import C3 from './assets/images/Level1/C3.png';
import C4 from './assets/images/Level1/C4.png';
import D1 from './assets/images/Level1/D1.png';
import D2 from './assets/images/Level1/D2.png';
import D3 from './assets/images/Level1/D3.png';
import D4 from './assets/images/Level1/D4.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <h1>Drag and Drop Puzzle Pieces</h1>
      <DroppableArea>
        <DraggableImage src={A1} alt="Puzzle Piece A1"  style="border: 2px solid blue"/>
        <DraggableImage src={A2} alt="Puzzle Piece A2" />
        <DraggableImage src={A3} alt="Puzzle Piece A3" />
        <DraggableImage src={A4} alt="Puzzle Piece A4" />
        <DraggableImage src={B1} alt="Puzzle Piece B1" />
        <DraggableImage src={B2} alt="Puzzle Piece B2" />
        <DraggableImage src={B3} alt="Puzzle Piece B3" />
        <DraggableImage src={B4} alt="Puzzle Piece B4" />
        <DraggableImage src={C1} alt="Puzzle Piece C1" />
        <DraggableImage src={C2} alt="Puzzle Piece C2" />
        <DraggableImage src={C3} alt="Puzzle Piece C3" />
        <DraggableImage src={C4} alt="Puzzle Piece C4" />
        <DraggableImage src={D1} alt="Puzzle Piece D1" />
        <DraggableImage src={D2} alt="Puzzle Piece D2" />
        <DraggableImage src={D3} alt="Puzzle Piece D3" />
        <DraggableImage src={D4} alt="Puzzle Piece D4" />
        {/* Add more DraggableImage components as needed */}
      </DroppableArea>
    </div>
  );
}

export default App;
