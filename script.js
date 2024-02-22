document.addEventListener("DOMContentLoaded", function () {
  const themes = [
    "ocean",
    "space",
    "forest",
    "music",
    "sports",
    "animals",
    "food",
    "coding",
  ];
  let words = []; // Placeholder for fetched words
  let allLetters = [];

  const correctGuessesElement = document
    .getElementById("correctGuesses")
    .querySelector("span");
  const incorrectGuessesElement = document
    .getElementById("incorrectGuesses")
    .querySelector("span");
  const guessInput = document.getElementById("guess");
  const submitGuessButton = document.getElementById("submitGuess");
  const backspaceButton = document.getElementById("backspace");
  const scrambleButton = document.getElementById("scramble");
  const feedbackElement = document.getElementById("feedback");
  const lettersContainer = document.getElementById("letters");
  const timerElement = document.getElementById("timeLeft");
  const pauseTimerButton = document.getElementById("pauseTimer");
  const dateElement = document.getElementById("todayDate");
  const guessCountElement = document.getElementById("guessCount");
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];

  let guessedWords = [];
  let timer;
  let timeElapsed = 0; // Initialize timeElapsed for the incremental timer
  let letterSelections = []; // Array to track the sequence of letter selections

  // Display today's date
  dateElement.textContent = new Date().toLocaleDateString();

  // Fetch and initialize game with random theme words
  // adjectives that are often used to describe ocean	/words?rel_jjb=ocean
  // nouns that are often described by the adjective yellow	/words?rel_jja=yellow
  // words that are triggered by (strongly associated with) the word "cow"	/words?rel_trg=cow
  fetch(`https://api.datamuse.com/words?rel_trg=${randomTheme}&max=10`)
    .then((response) => response.json())
    .then((data) => {
      words = data
        .filter((wordObj) => !wordObj.word.includes(" "))
        .slice(0, 4)
        .map((wordObj) => wordObj.word);
      console.log("Fetched words:", words); // Log the fetched words for verification
      initializeGame(randomTheme, words);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function initializeGame(theme, wordsArray) {
    document.getElementById("theme").querySelector("span").textContent = theme;
    allLetters = wordsArray.join("").split("");
    allLetters = shuffle(allLetters);
    updateLettersDisplay(allLetters);
  }

  // Shuffle letters
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Function to update the letters display with current allLetters
  function updateLettersDisplay() {
    lettersContainer.innerHTML = ""; // Clear previous letters
    allLetters.forEach((letter, index) => {
      const letterElement = document.createElement("button");
      letterElement.textContent = letter;
      letterElement.classList.add("letter"); // Add letter class

      letterElement.addEventListener("click", function () {
        toggleLetterSelection(letter, index, this);
      });

      lettersContainer.appendChild(letterElement);
    });
  }

  // Toggle the selection of letters
  function toggleLetterSelection(letter, index, element) {
    if (!element.classList.contains("used")) {
      element.classList.add("used");
      guessInput.value += letter;
      letterSelections.push({ letter, index });
    } else {
      // Remove the selected letter
      letterSelections = letterSelections.filter(
        (selection) =>
          !(selection.letter === letter && selection.index === index)
      );
      updateGuessInputAndSelections(); // Update the input field and selections visually
    }
  }

  // Function to update the guess input and letter selections based on `letterSelections`
  function updateGuessInputAndSelections() {
    guessInput.value = letterSelections
      .map((selection) => selection.letter)
      .join("");
    // Reset all letters to unused state
    document
      .querySelectorAll(".letter")
      .forEach((button) => button.classList.remove("used"));
    // Mark currently selected letters as used
    letterSelections.forEach((selection) => {
      document
        .getElementById("letters")
        .children[selection.index].classList.add("used");
    });
  }

  // Backspace functionality
  backspaceButton.addEventListener("click", function () {
    letterSelections.pop(); // Remove the last selection
    updateGuessInputAndSelections(); // Reflect this change in the input and visual state
  });

  // submitGuess function
  let correctGuesses = [];
  let incorrectGuesses = [];
  let guessCount = 0;

  function submitGuess() {
    guessCount++;
    const guess = guessInput.value.trim().toLowerCase();
    if (guess && words.includes(guess) && !guessedWords.includes(guess)) {
      guessedWords.push(guess);
      correctGuesses.push(guess); // Add to correct guesses
      correctGuessesElement.textContent = correctGuesses.join(", "); // Update correct guesses display
      feedbackElement.textContent = "Correct guess!";
      guessInput.value = ""; // Reset input field
      // Remove guessed word's letters from allLetters
      guess.split("").forEach((guessedLetter) => {
        const index = allLetters.indexOf(guessedLetter);
        if (index > -1) {
          allLetters.splice(index, 1); // Remove the letter
        }
      });
      updateLettersDisplay(); // Update display with remaining letters
      letterSelections = []; // Reset selections
    } else {
      if (!guessedWords.includes(guess)) {
        incorrectGuesses.push(guess); // Add to incorrect guesses if not already guessed
        incorrectGuessesElement.textContent = incorrectGuesses.join(", "); // Update incorrect guesses display
        feedbackElement.textContent = "Incorrect guess. Try again!";
      } else {
        feedbackElement.textContent = "Already guessed that word!";
      }
      guessInput.value = ""; // Reset input field for a new guess
    }
    // Clear used letters after processing the guess
    clearUsedLetters(); // This ensures the UI is updated irrespective of how the guess was submitted
    guessCountElement.innerText = `Guesses Attempted: ${guessCount}`;
    // Check to see if any letters in the pool are left, if not, then the game is won!
    gameOver()
  }

  async function gameOver(){
    // One second timer
    setTimeout(function(){ 
        if(allLetters == 0) alert("You Won!")
    }, 1000);
  }

  // Update the click event listener to use the refactored function
  submitGuessButton.addEventListener("click", submitGuess);

  // Listen for the Enter key press on the guess input
  guessInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      submitGuess(); // Call submitGuess function directly if you want to refactor the existing click listener logic into a named function
      clearUsedLetters(); // Call a function to clear the used letters
    }
  });

  function clearUsedLetters() {
    // Clear the letterSelections array
    letterSelections = [];

    // Clear the input field
    guessInput.value = "";

    // Remove the 'used' class from all letter buttons
    document.querySelectorAll(".letter").forEach((button) => {
      button.classList.remove("used");
    });
  }

  // Scramble letters
  scrambleButton.addEventListener("click", function () {
    // Shuffle the current allLetters array
    shuffle(allLetters);
    // Update the display with the shuffled letters
    updateLettersDisplay();
  });

  // Start and pause timer function modified for incremental timing
  function startTimer() {
    timerElement.textContent = "0:00"; // Initialize timer display
    timer = setInterval(() => {
      timeElapsed += 1;
      let minutes = Math.floor(timeElapsed / 60);
      let seconds = timeElapsed % 60;
      timerElement.textContent =
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds; // Format to M:SS
    }, 1000);
  }

  pauseTimerButton.addEventListener("click", function () {
    if (pauseTimerButton.textContent === "Pause") {
      clearInterval(timer);
      pauseTimerButton.textContent = "Resume";
    } else {
      startTimer();
      pauseTimerButton.textContent = "Pause";
    }
  });

  startTimer(); // Initiate the timer when the game loads
});
