import React from 'react';
import DroppableArea from './DroppableArea';

//<DroppableArea testMode={true} />

function JigsawPuzzle() {
    return (
        <div className="jigsaw-puzzle">
            <DroppableArea />
        </div>
    );
}

export default JigsawPuzzle;