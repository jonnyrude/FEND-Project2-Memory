/*
 * Create a list that holds all of your cards
 */
const cards = document.querySelectorAll('.card');

// List of cards up/showing
let showingCards = [];

// This true/false flag keeps the user from clicking too fast
// and turning a 3rd card in the middle of the turn.
let inTurn = false;

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/
// Since this functionality is the same as restarting a new game
// I went ahead and put it into the restart function - called when
// the restart symbol is clicked - and ran that function at the beginning
restart();

function restart() {
    for (const card of showingCards) {
        card.classList.remove('match');
    }
    showingCards = [];
    shuffle(cards);
    for (const card of cards) {
        card.classList.remove('match', 'show', 'open');
    }
    document.querySelector('.deck').appendChild(...cards);

    // restart counter
    document.querySelector('.moves').textContent = '0';
}

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

function show(element) { // || element.classList.contains('match')
    if (element.classList.contains('show') ){
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
    // this ends the turn - needs to be here since function exec is delayed
    inTurn=false;
}

function notMatching() {
    showingCards[0].className = 'card';
    showingCards.shift();
    showingCards[0].className = 'card';
    showingCards.shift();
    inTurn = false;
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
    // Only execute when NOt already in a turn (prevents 3rd card flip) AND the click.target is a card
    if (!inTurn && evt.target.classList.value === "card") {

        console.log(evt.target); // TODO: Remove this log

        inTurn = true;
        const picked = event.target;
        show(picked);
        isShowing(picked);

        // If it's the second card turned, check for match
        if (showingCards.length % 2 === 0) {
            if (showingCards[0].firstElementChild.classList.value === showingCards[1].firstElementChild.classList.value) {
                setMatching();
            }
            else {
                window.setTimeout(notMatching, 500);
            }
        countTurn();
        }
        else {
            inTurn = false;
        }

        // if you've flipped the 16th card, you must have won
        if (showingCards.length === 16) {
            window.setTimeout(gameWon, 200);
        }
    }
    return;
})

document.querySelector('.restart').addEventListener('click', restart)