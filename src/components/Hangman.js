import React, { useState, useEffect } from 'react';
import './Hangman.css';
import DrawingAnimation from './DrawingAnimation';

const Hangman = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState();
  const [gameStatus, setGameStatus] = useState('playing');
  const [inputLetter, setInputLetter] = useState('');
  const [resetKey, setResetKey] = useState(0);


  // Fetch a random word from the Free Dictionary API
  const fetchWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word');
      const data = await response.json();
      const word = data[0].toUpperCase();
      setWord(word);
      setGuessedLetters([]);
      setAttemptsLeft(9);
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
    } else if (attemptsLeft < 1) {
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

    <DrawingAnimation attemptsLeft={attemptsLeft} resetKey={resetKey} />
    <h1 className="title">HANGMAN</h1>
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
          onChange={(e) => setInputLetter(e.target.value.toUpperCase())}
          className="input-letter"
        />
        <button type="submit" className="hangman-button">Submit</button>
      </form>
    )}

    {gameStatus === 'won' && <p className="message win">Congratulations! You've won!</p>}
    {gameStatus === 'lost' && <p className="message lose">Game Over! The word was "{word}".</p>}

    <button onClick={fetchWord} className="hangman-button">Reset Game</button>
  </div>
);
};

export default Hangman;