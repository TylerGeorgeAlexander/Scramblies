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

  const guessInput = document.getElementById("guess");
  const submitGuessButton = document.getElementById("submitGuess");
  const backspaceButton = document.getElementById("backspace");
  const scrambleButton = document.getElementById("scramble");
  const feedbackElement = document.getElementById("feedback");
  const guessedWordsElement = document.getElementById("guessedWords");
  const lettersContainer = document.getElementById("letters");
  const timerElement = document.getElementById("timeLeft");
  const pauseTimerButton = document.getElementById("pauseTimer");
  const dateElement = document.getElementById("todayDate");
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];

  let guessedWords = [];
  let timer;
  let timeElapsed = 0; // Initialize timeElapsed for the incremental timer
  let letterSelections = []; // Array to track the sequence of letter selections

  // Display today's date
  dateElement.textContent = new Date().toLocaleDateString();

  // Fetch and initialize game with random theme words
  fetch(`https://api.datamuse.com/words?ml=${randomTheme}&max=10`)
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
  submitGuessButton.addEventListener("click", function () {
    const guess = guessInput.value.trim().toLowerCase();
    if (guess && words.includes(guess) && !guessedWords.includes(guess)) {
      guessedWords.push(guess);
      guessedWordsElement.textContent = guessedWords.join(", ");
      feedbackElement.textContent = "Correct guess!";
      // Remove the guessed word's letters from allLetters
      guess.split("").forEach((guessedLetter) => {
        const index = allLetters.indexOf(guessedLetter);
        if (index > -1) {
          allLetters.splice(index, 1); // Remove the letter
        }
      });
      updateLettersDisplay(); // Update the display with remaining letters
      guessInput.value = ""; // Reset input field
      letterSelections = []; // Reset selections
    } else if (guessedWords.includes(guess)) {
      feedbackElement.textContent = "Already guessed!";
    } else {
      feedbackElement.textContent = "Try again or incorrect guess!";
    }
  });

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
