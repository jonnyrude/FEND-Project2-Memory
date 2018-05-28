/*****************
 * SET VARIABLES
 ***************** */

/* Create a list that holds all of your cards */
const cards = document.querySelectorAll('.card');

// List of cards up/showing
let showingCards = [];

// This true/false flag keeps the user from clicking too fast
// and turning a 3rd card in the middle of the turn.
let inTurn = false;

// timer variable
let timerId;
let timerRunning = false;
let seconds = 0;
let minutes = 0;

// this array will be shuffled(), then will be used to create card HTML elements
const deck = ['diamond','diamond',
            'paper-plane', 'paper-plane',
            'anchor', 'anchor',
            'bolt',  'bolt',
            'cube', 'cube',
            'leaf', 'leaf',
            'bomb', 'bomb',
            'bicycle', 'bicycle']


/* ****************
 * Start the game:
 ******************* */

newGame();

/* *****************
*   HELPER FUNCTIONS:
********************* */

function newGame() {
    // shuffle aray/deck
    shuffle(deck);

    // generate HTML for card elements from deck array
    let deckHTML = '';
    for (const card of deck) {
        deckHTML = deckHTML.concat(
            `<li class="card" draggalbe="false">
            <i class="fa fa-${card}"></i>
            </li>`);
        }
    // insert deckHTML into page
    document.querySelector('.deck').innerHTML = deckHTML;

    // reset/clear the list of showing cards
    showingCards = [];

    // reset counter
    document.querySelector('.moves').textContent = '0';

    // reset timer
    if (timerRunning) {
        toggleTimer();
    }

    // reset stars - put back all 3 on page
    const allStars =
    '<li><i class="fa fa-star"></i></li>' +
    '<li><i class="fa fa-star"></i></li>' +
    '<li><i class="fa fa-star"></i></li>';
    document.querySelector('.stars').innerHTML = allStars;
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

function show(element) {
        // add clases that display the card
        element.classList.add('show', 'open');
        return;
}

function isShowing(element) {
    // add element to list of showingCards
    showingCards.unshift(element)
    return;
}

function setMatching() {
    // set class of newly matching cards
    showingCards[0].className = 'card match';
    showingCards[1].className = 'card match';
    inTurn=false; // ends the turn - needs to be here since functions execution is delayed
}

function notMatching() {
    // returns cards' classes to just 'card' and removes from list of showingCards
    showingCards[0].className = 'card';
    showingCards.shift();
    showingCards[0].className = 'card';
    showingCards.shift();
    inTurn = false; // ends the turn - needs to be here since function execution is delayed
}

function countTurn() {
    // increments the counter for turns & decrements stars!
    const counter = document.querySelector('.moves');
    counter.textContent = (Number(counter.textContent) + 1).toString()

    // Star lost at 11 turns and 14 turns
    if(Number(counter.textContent) === 11 || Number(counter.textContent) === 14) {
        removeStar();
    }
}

function gameWon() {
    // add stars awarded to winner-screen
    document.querySelector('.stars-won').innerHTML = document.querySelector('.stars').innerHTML;

    // add time completed to winner-screen
    document.querySelector('.timer-won').innerHTML = document.querySelector('.timer').innerHTML;

    // stop timer
    toggleTimer();

    // display winner-screen
    document.querySelector('.winner-screen').classList.toggle('won');
}

function toggleTimer() {
    // clear and stop or restart the timer
    seconds = 0;
    minutes = 0;

    if (!timerRunning) {
        timerID = window.setInterval(function(){
            seconds += 1;
            if (seconds === 60) {
                minutes += 1;
                seconds = 0;
            }
            const fillerZero = seconds >= 10 ? '' : '0';
            document.querySelector('.timer').textContent = `${minutes}:${fillerZero}${seconds}`;
        }, 1000)
        timerRunning = true;
    }
    else {
        window.clearInterval(timerID);
        timerRunning = false;
        document.querySelector('.timer').textContent = `0:00`;
    }
}

function removeStar() {
    const stars = document.querySelectorAll('.fa-star')
    if (stars.length === 1) {
        return;
    }
    else {
        stars[0].remove();
    }
}

/* *******************
 * EVENT LISTENERS:
 ********************* */
    /*
     * GAME LOGIC:
     */

document.querySelector('.deck').addEventListener('click', function(evt){
    // Only execute when NOt already in a turn (prevents 3rd card flip) AND the click.target is a card
    if (!inTurn && evt.target.classList.value === 'card') {

        // start the timer if not already started:
        if (!timerRunning) {
            toggleTimer();
        }

        inTurn = true;
        const picked = event.target;
        show(picked); // show/reveal the card
        isShowing(picked); // adds to list of showing cards

        // If it's the 2nd card turned
        if (showingCards.length % 2 === 0) {
            // if cards match
            if (showingCards[0].firstElementChild.classList.value === showingCards[1].firstElementChild.classList.value) {
                setMatching();
            }
            // if they DON'T match
            else {
                // add 'miss-match' class/animation
                showingCards[0].classList.toggle('miss-match');
                showingCards[1].classList.toggle('miss-match');
                window.setTimeout(notMatching, 800);
            }
        countTurn(); // increments the # of turns
        }
        // if it's the 1st card of a turn, just end the turn
        else {
            inTurn = false;
        }

        // Check for a win!
        // if you've flipped the 16th card, you must have won
        if (showingCards.length === 16) {
            // pause for flipping animation to complete, then end game
            window.setTimeout(gameWon, 200);
        }
    }
    return;
})

// Event listener for restart game
document.querySelector('.restart').addEventListener('click', newGame);

// Event listener for restarting from winner-screen
document.querySelector('.restart-won').addEventListener('click', function() {
    // hide winner screen
    document.querySelector('.winner-screen').classList.toggle('won');
    newGame();
});