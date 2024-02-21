document.addEventListener('DOMContentLoaded', function() {
    const themes = ["ocean", "space", "forest", "music", "sports", "animals", "food", "coding"];
    let words = []; // Placeholder for fetched words

    const guessInput = document.getElementById('guess');
    const submitGuessButton = document.getElementById('submitGuess');
    const backspaceButton = document.getElementById('backspace');
    const scrambleButton = document.getElementById('scramble');
    const feedbackElement = document.getElementById('feedback');
    const guessedWordsElement = document.getElementById('guessedWords');
    const lettersContainer = document.getElementById('letters');
    const timerElement = document.getElementById('timeLeft');
    const pauseTimerButton = document.getElementById('pauseTimer');
    const dateElement = document.getElementById('todayDate');
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    let guessedWords = [];
    let timer;
    let timeLeft = 60; // Timer set for 1 minute

    // Display today's date
    dateElement.textContent = new Date().toLocaleDateString();

    // Fetch and initialize game with random theme words
    fetch(`https://api.datamuse.com/words?ml=${randomTheme}&max=10`)
        .then(response => response.json())
        .then(data => {
            words = data.filter(wordObj => !wordObj.word.includes(' ')).slice(0, 4).map(wordObj => wordObj.word);
            console.log("Fetched words:", words); // Log the fetched words for verification
            initializeGame(randomTheme, words);
        })
        .catch(error => console.error('Error fetching data:', error));

    function initializeGame(theme, wordsArray) {
        document.getElementById('theme').querySelector('span').textContent = theme;
        let allLetters = wordsArray.join('').split('');
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

    // Update the letters display
    function updateLettersDisplay(allLetters) {
        lettersContainer.innerHTML = '';
        allLetters.forEach((letter, index) => {
            const letterElement = document.createElement('button');
            letterElement.textContent = letter;
            letterElement.classList.add('letter', `letter-${index}`);
            letterElement.addEventListener('click', function() {
                guessInput.value += letter;
                this.classList.add('used');
            });
            lettersContainer.appendChild(letterElement);
        });
    }

    // Backspace functionality
    backspaceButton.addEventListener('click', function() {
        guessInput.value = guessInput.value.slice(0, -1);
    });

    // Submit guess
    submitGuessButton.addEventListener('click', submitGuess);

    // Keyboard support for submitting guess with Enter key
    guessInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitGuess();
        }
    });

    function submitGuess() {
        const guess = guessInput.value.trim().toLowerCase();
        if (guess && !guessedWords.includes(guess)) {
            guessedWords.push(guess);
            guessedWordsElement.textContent = guessedWords.join(', ');
            feedbackElement.textContent = "Correct guess!";
            guessInput.value = ''; // Reset input field
        } else {
            feedbackElement.textContent = "Try again or incorrect guess!";
        }
    }

    // Scramble letters
    scrambleButton.addEventListener('click', function() {
        scrambleLetters(words.join('').split(''));
    });

    function scrambleLetters(letters) {
        shuffle(letters);
        updateLettersDisplay(letters);
    }

    // Start and pause timer
    function startTimer() {
        timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                feedbackElement.textContent = "Time's up!";
            } else {
                timeLeft -= 1;
                timerElement.textContent = timeLeft + ' seconds left';
            }
        }, 1000);
    }

    pauseTimerButton.addEventListener('click', function() {
        if (pauseTimerButton.textContent === 'Pause') {
            clearInterval(timer);
            pauseTimerButton.textContent = 'Resume';
        } else {
            startTimer();
            pauseTimerButton.textContent = 'Pause';
        }
    });

    startTimer(); // Initiate the timer when the game loads
});
