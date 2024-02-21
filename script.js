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
    shuffle(allLetters.slice()).forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.textContent = letter;
        letterElement.classList.add('letter');
        letterElement.addEventListener('click', () => {
            document.getElementById('guess').value += letter;
            letterElement.classList.add('used'); // Optional: visually mark the letter as used
        });
        lettersContainer.appendChild(letterElement);
    });
}

// Function to initialize game
function initializeGame(theme, words) {
    let allLetters = words.join('').split('');
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
