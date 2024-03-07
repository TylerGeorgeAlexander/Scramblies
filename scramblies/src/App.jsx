import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure you have this CSS file

function App() {
  const themes = ["ocean", "space", "forest", "music", "sports", "animals", "food", "coding"];
  const [words, setWords] = useState([]);
  const [allLetters, setAllLetters] = useState([]);
  const [guessedWords, setGuessedWords] = useState([]);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [guessInput, setGuessInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [randomTheme, setRandomTheme] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const theme = themes[Math.floor(Math.random() * themes.length)];
    setRandomTheme(theme);
    fetchWords(theme);
    startTimer();
    // Clean up timer on component unmount
    return () => clearInterval(timer);
  }, []);

  const fetchWords = (theme) => {
    fetch(`https://api.datamuse.com/words?rel_trg=${theme}&max=10`)
      .then(response => response.json())
      .then(data => {
        const fetchedWords = data.filter(wordObj => !wordObj.word.includes(" ")).slice(0, 4).map(wordObj => wordObj.word);
        setWords(fetchedWords);
        const letters = shuffleArray(fetchedWords.join("").split(""));
        setAllLetters(letters);
      });
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleLetterClick = (letter) => {
    setGuessInput(prev => prev + letter);
    // More logic could be added here for managing selected letters
  };

  const handleGuessSubmit = () => {
    if (words.includes(guessInput) && !guessedWords.includes(guessInput)) {
      setGuessedWords(prev => [...prev, guessInput]);
      setCorrectGuesses(prev => [...prev, guessInput]);
      setFeedback("Correct guess!");
      // More logic for updating letters and checking win condition
    } else {
      setIncorrectGuesses(prev => [...prev, guessInput]);
      setFeedback("Try again!");
    }
    setGuessInput('');
  };

  const startTimer = () => {
    const newTimer = setInterval(() => {
      setTimeElapsed(prevTime => prevTime + 1);
    }, 1000);
    setTimer(newTimer);
  };

  const pauseTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    } else {
      startTimer();
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="container">
      <div id="game">
        <div id="date">Today: <span>{new Date().toLocaleDateString()}</span></div>
        <h1>Scramblies</h1>
        <div id="theme">Theme: <span>{randomTheme}</span></div>
        <button onClick={() => setAllLetters(shuffleArray([...allLetters]))}>Scramble Letters</button>
        <div id="letters" className="letters-style">
          {allLetters.map((letter, index) => (
            <button key={index} onClick={() => handleLetterClick(letter)}>
              {letter}
            </button>
          ))}
        </div>
        <div className="input-group">
          <input
            type="text"
            id="guess"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            placeholder="Your guess..."
            aria-label="Your guess"
          />
          <button id="backspace" aria-label="Delete last letter" onClick={() => setGuessInput(guessInput.slice(0, -1))}>
            <i className="fas fa-backspace"></i>
          </button>
        </div>
        <button id="submitGuess" onClick={handleGuessSubmit}>Enter</button>
        <div id="feedback" className="feedback-style">{feedback}</div>
        <div id="correctGuesses">Correct Guesses: <span>{correctGuesses.join(", ")}</span></div>
        <div id="incorrectGuesses">Incorrect Guesses: <span>{incorrectGuesses.join(", ")}</span></div>
        <div id="timer">Timer: <span>{formatTime()}</span> <button onClick={pauseTimer}>{timer ? "Pause" : "Resume"}</button></div>
      </div>
    </div>
  );
}

export default App;
