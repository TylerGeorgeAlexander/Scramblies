// Example theme and words
const theme = "Ocean";
const words = ["fish", "boat", "wave", "sand"];
let scrambledLetters = shuffle(words.join('').split('')).join('');
let guesses = [];
const maxGuesses = 4;

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.getElementById('letters').textContent = scrambledLetters;

document.getElementById('submitGuess').addEventListener('click', () => {
    const guessInput = document.getElementById('guess');
    const guess = guessInput.value.trim().toLowerCase();

    if (guess && !guesses.includes(guess) && guesses.length < maxGuesses) {
        if (words.includes(guess)) {
            guesses.push(guess);
            document.getElementById('guesses').innerHTML = guesses.join(', ');
            if (guesses.length === maxGuesses) {
                alert("Congratulations! You've found all the words.");
            }
        } else {
            alert("Incorrect guess or not related to the theme. Try again!");
        }
    }
    guessInput.value = ''; // Clear input after guess
});
