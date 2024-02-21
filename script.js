// Example themes
const themes = ["ocean", "space", "forest", "music", "sports", "animals", "food", "technology"];

// Function to shuffle letters
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to update the letters display
function updateLettersDisplay(allLetters) {
    const lettersContainer = document.getElementById('letters');
    lettersContainer.innerHTML = ''; // Clear previous letters
    allLetters.forEach((letter, index) => {
        const letterElement = document.createElement('span');
        letterElement.textContent = letter;
        letterElement.classList.add('letter', `letter-${index}`); // Add unique class for each letter
        letterElement.addEventListener('click', function() {
            document.getElementById('guess').value += letter;
            this.classList.add('used');
            this.removeEventListener('click', this.onclick);
        });
        lettersContainer.appendChild(letterElement);
    });
}

// Backspace functionality
document.getElementById('backspace').addEventListener('click', () => {
    let guessInput = document.getElementById('guess');
    let currentGuess = guessInput.value;
    if (currentGuess.length > 0) {
        // Remove the last character from the input
        const removedLetter = currentGuess[currentGuess.length - 1];
        guessInput.value = currentGuess.substring(0, currentGuess.length - 1);
        
        // Re-enable the last used letter in the letter pool
        const usedLetterElements = document.querySelectorAll(`.letter.used`);
        const toBeReenabled = Array.from(usedLetterElements).reverse().find(el => el.textContent === removedLetter);
        if (toBeReenabled) {
            toBeReenabled.classList.remove('used');
            toBeReenabled.addEventListener('click', toBeReenabled.onclick);
            toBeReenabled.style.pointerEvents = 'auto'; // Re-enable pointer events
        }
    }
});

// Function to initialize game
function initializeGame(theme, words) {
    let allLetters = words.join('').split('');
    allLetters = shuffle(allLetters);
    let guesses = [];
    let guessCount = 0;

    // Set theme in HTML
    document.getElementById('theme').querySelector('span').textContent = theme;

    // Display each letter as a clickable element
    updateLettersDisplay(allLetters);

    // Event listener for guess submission
    document.getElementById('submitGuess').addEventListener('click', () => {
        const guessInput = document.getElementById('guess');
        const guess = guessInput.value.trim().toLowerCase();
        guessCount++;
        document.getElementById('guessCount').querySelector('span').textContent = guessCount;

        if (guess && !guesses.includes(guess)) {
            if (words.includes(guess)) {
                guesses.push(guess);
                document.getElementById('guesses').innerHTML = guesses.join(', ');

                // Remove guessed word's letters from the letter pool
                guess.split('').forEach(letter => {
                    const index = allLetters.indexOf(letter);
                    if (index > -1) allLetters.splice(index, 1);
                });

                guessInput.value = ''; // Clear input after guess

                // Update letters display without re-initializing
                updateLettersDisplay(allLetters);
            } else {
                alert("Incorrect guess or not related to the theme. Try again!");
            }
        }
        guessInput.value = ''; // Clear input after guess regardless
    });
}

// Randomly select a theme and fetch words related to the random theme
const randomTheme = themes[Math.floor(Math.random() * themes.length)];
fetch(`https://api.datamuse.com/words?ml=${randomTheme}&max=10`)
    .then(response => response.json())
    .then(data => {
        // Filter for single words and limit to 4
        const words = data.filter(wordObj => !wordObj.word.includes(' ')).slice(0, 4).map(wordObj => wordObj.word);
        console.log("Fetched words:", words); // Log the fetched words for verification
        // Initialize the game with fetched words
        initializeGame(randomTheme, words);
    })
    .catch(error => console.error('Error fetching data:', error));
