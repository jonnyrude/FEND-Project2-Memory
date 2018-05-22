/*
 * Create a list that holds all of your cards
 */
const cards = document.querySelectorAll('.card');
const showingCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
shuffle(cards);
for (const card of cards) {
    card.classList.remove('match', 'show', 'open');
}
document.querySelector('.deck').appendChild(...cards);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function show(element) {
    if (element.classList.contains('show')){
        return;
    }
    else {
        element.classList.add('show', 'open');
        return;
    }
}

function isShowing(element) {
    if (!showingCards.includes(element)) {
        showingCards.unshift(element)
    }
    return;
}

function setMatching() {
    showingCards[0].className = 'card match';
    showingCards[1].className = 'card match';
}

function notMatching() {
    showingCards[0].className = 'card';
    showingCards.shift();
    showingCards[0].className = 'card';
    showingCards.shift();
}

function countTurn() {
    const counter = document.querySelector('.moves');
    counter.textContent = (Number(counter.textContent) + 1).toString()
}

function gameWon() {
    window.alert('you won. what fun.')
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
document.querySelector('.deck').addEventListener('click', function(evt){
    const picked = event.target;
    show(picked);
    isShowing(picked);
    if (showingCards.length % 2 === 0) {
        if (showingCards[0].firstElementChild.classList.value === showingCards[1].firstElementChild.classList.value) {
            setMatching();
        }
        else {
            setTimeout(notMatching(), 10000);
        }
    countTurn();
    }

    if (showingCards.length === 16) {
        gameWon();
    }
})