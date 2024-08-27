import React from 'react';

const LevelSelector = ({ onSelectLevel }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <button onClick={() => onSelectLevel('easy')}>Easy</button>
      <button onClick={() => onSelectLevel('medium')}>Medium</button>
      <button onClick={() => onSelectLevel('hard')}>Hard</button>
    </div>
  );
};

export default LevelSelector;
