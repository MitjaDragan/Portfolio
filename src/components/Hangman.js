import React, { useState, useEffect } from 'react';
import './Hangman.css'; // Import the CSS file for styling
import DrawingAnimation from './DrawingAnimation';

const Hangman = () => {
  const [word, setWord] = useState(''); // The word to guess
  const [guessedLetters, setGuessedLetters] = useState([]); // Letters guessed by the user
  const [attemptsLeft, setAttemptsLeft] = useState(8); // Number of attempts left
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [inputLetter, setInputLetter] = useState(''); // Current input letter
  const [resetKey, setResetKey] = useState(0); // Key to reset the DrawingAnimation component

  // Fetch a random word from the Free Dictionary API
  const fetchWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word');
      const data = await response.json();
      const word = data[0].toLowerCase();
      setWord(word);
      setGuessedLetters([]);
      setAttemptsLeft(8);
      setGameStatus('playing');
      setResetKey((prevKey) => prevKey + 1); // Increment reset key to reset animation
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  };

  // Initialize the game when the component mounts
  useEffect(() => {
    fetchWord();
  }, []);

  // Function to handle a user's guess submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputLetter.length !== 1 || guessedLetters.includes(inputLetter) || gameStatus !== 'playing') return;

    handleGuess(inputLetter);
    setInputLetter(''); // Reset input after submission
  };

  // Function to handle a user's guess
  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter)) return;

    setGuessedLetters((prevGuessedLetters) => [...prevGuessedLetters, letter]);

    if (!word.includes(letter)) {
      setAttemptsLeft((prevAttemptsLeft) => prevAttemptsLeft - 1);
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

  useEffect(() => {
    checkGameStatus();
  }, [guessedLetters, attemptsLeft]);

  // Render the word with underscores for unguessed letters
  const renderWord = () => {
    return word
      .split('')
      .map((letter, index) =>
        guessedLetters.includes(letter) ? letter : '_'
      )
      .join(' ');
  };

  return (
    <div className="hangman-container">
      {/* Pass the attemptsLeft and resetKey to the DrawingAnimation component */}
      <DrawingAnimation attemptsLeft={attemptsLeft} resetKey={resetKey} />
      <h1 className="title">Hangman Game</h1>
      <div className="hangman-drawing">
        <p>{`Attempts Left: ${attemptsLeft}`}</p>
      </div>
      <p className="word">{renderWord()}</p>
      <p className="guessed-letters">Guessed Letters: {guessedLetters.join(', ')}</p>

      {gameStatus === 'playing' && (
        <form onSubmit={handleSubmit} className="guess-form">
          <input
            type="text"
            maxLength="1"
            value={inputLetter}
            onChange={(e) => setInputLetter(e.target.value.toLowerCase())}
            className="input-letter"
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      )}

      {gameStatus === 'won' && <p className="message win">Congratulations! You've won!</p>}
      {gameStatus === 'lost' && <p className="message lose">Game Over! The word was "{word}".</p>}

      <button onClick={fetchWord} className="reset-button">Reset Game</button>
    </div>
  );
};

export default Hangman;
