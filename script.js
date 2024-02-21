// Example theme and words
const theme = "Ocean";
const words = ["fish", "boat", "wave", "sand"];
let scrambledLetters = shuffle(words.join('').split('')).join('');
let guesses = [];
let guessCount = 0; // Initialize guess count

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Set theme in HTML
document.getElementById('theme').querySelector('span').textContent = theme;
document.getElementById('letters').textContent = scrambledLetters;

document.getElementById('submitGuess').addEventListener('click', () => {
    const guessInput = document.getElementById('guess');
    const guess = guessInput.value.trim().toLowerCase();
    guessCount++; // Increment guess count on every attempt
    document.getElementById('guessCount').querySelector('span').textContent = guessCount; // Update guess count display

    if (guess && !guesses.includes(guess)) {
        if (words.includes(guess)) {
            guesses.push(guess);
            document.getElementById('guesses').innerHTML = guesses.join(', ');
            if (guesses.length === words.length) {
                alert("Congratulations! You've found all the words.");
            }
        } else {
            alert("Incorrect guess or not related to the theme. Try again!");
        }
    }
    guessInput.value = ''; // Clear input after guess
});
