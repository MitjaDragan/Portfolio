import React, { useState, useEffect } from 'react';

const Hangman = () => {
  const [word, setWord] = useState(''); // The word to guess
  const [guessedLetters, setGuessedLetters] = useState([]); // Letters guessed by the user
  const [attemptsLeft, setAttemptsLeft] = useState(6); // Number of attempts left
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

  // Fetch a random word from the Free Dictionary API
  const fetchWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word');
      const data = await response.json();
      const word = data[0].toLowerCase();
      setWord(word);
    } catch (error) {a
      console.error('Error fetching word:', error);
    }
  };

  // Initialize the game when the component mounts
  useEffect(() => {
    fetchWord();
  }, []);

  // Function to handle a user's guess
  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || gameStatus !== 'playing') return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!word.includes(letter)) {
      setAttemptsLeft(attemptsLeft - 1);
    }

    checkGameStatus(letter);
  };

  // Check if the game is won or lost
  const checkGameStatus = () => {
    const wordSet = new Set(word.split(''));
    const guessedSet = new Set(guessedLetters);

    if ([...wordSet].every((letter) => guessedSet.has(letter))) {
      setGameStatus('won');
    } else if (attemptsLeft <= 1) {
      setGameStatus('lost');
    }
  };

  // Render the word with underscores for unguessed letters
  const renderWord = () => {
    return word.split('').map((letter, index) =>
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  return (
    <div className="hangman">
      <h1>Hangman Game</h1>
      <p>Word: {renderWord()}</p>
      <p>Attempts Left: {attemptsLeft}</p>
      <p>Guessed Letters: {guessedLetters.join(', ')}</p>

      {gameStatus === 'playing' && (
        <div>
          <p>Enter a letter:</p>
          <input
            type="text"
            maxLength="1"
            onChange={(e) => handleGuess(e.target.value.toLowerCase())}
          />
        </div>
      )}

      {gameStatus === 'won' && <p>Congratulations! You've won!</p>}
      {gameStatus === 'lost' && <p>Game Over! The word was "{word}".</p>}

      <button onClick={fetchWord}>Reset Game</button>
    </div>
  );
};

export default Hangman;
