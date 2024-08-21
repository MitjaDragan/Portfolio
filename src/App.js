import React from 'react';
import Navbar from './Navbar';
import DraggableImage from './components/DraggableImage';
import DroppableArea from './components/DroppableArea';
import Piece1 from './assets/images/Piece1.png';
import Piece2 from './assets/images/Piece2.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <h1>Drag and Drop Puzzle Pieces</h1>
      <DroppableArea>
        <DraggableImage src={Piece1} alt="Puzzle Piece 1" />
        <DraggableImage src={Piece2} alt="Puzzle Piece 2" />
        {/* Add more DraggableImage components as needed */}
      </DroppableArea>
    </div>
  );
}

export default App;
