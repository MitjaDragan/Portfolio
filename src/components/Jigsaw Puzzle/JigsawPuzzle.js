import React from 'react';
import DroppableArea from './DroppableArea';
import JigsawImageSplitter from './JigsawImageSplitter';

//<DroppableArea testMode={true} />

function JigsawPuzzle() {
    return (
        <div className="jigsaw-puzzle">
            <JigsawImageSplitter />
        </div>
    );
}

export default JigsawPuzzle;
