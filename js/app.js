// Initial variables
var timer = document.querySelector('.timer');
var seconds = 0;
var minutes = 0
var stopAdd = false;
var numberPlays = 0;
var moves = 0;

// Add a second to the timer - Recursive function
function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
        }
    }

    timer.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    if (!stopAdd) setTimeout(add, 1000);

}

// Shuffles initial cards
function shuffleCards() {
    var list = document.querySelectorAll('.card');
    var shuffled = shuffle(Array.from(list));

    for (let i = 0; i < shuffled.length; i++) {
        list[i].outerHTML = shuffled[i].outerHTML;
    }
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

// Restart the game
function restart() {
    var restart = document.querySelector('.restart');
    var playAgain = document.querySelector('.again');
    restart.addEventListener('click', function () {
        location.reload();
    });
    playAgain.addEventListener('click', function () {
        location.reload();
    });
}

// Event when user clicks card
function clickCard() {
    var list = document.querySelectorAll('.card');
    for (var i = 0; i < list.length; i++) {
        list[i].addEventListener('click', function (event) {
            showCard(event);
        });
    }
}

// Showing cards clicked
function showCard(event) {
    event.target.classList.add('open');
    event.target.classList.add('show');
    conditionMatch();
}

// Condition if two cards are a match
function conditionMatch() {
    numberPlays++;

    if (numberPlays === 1 && moves === 0) setTimeout(add, 1000);

    if (numberPlays === 2) {
        moves++;
        updateMoves(moves);
        numberPlays = 0;

        // function call removing star
        removeStar();

        var first = document.getElementsByClassName('open')[0];
        var firstClass = first.firstChild.nextElementSibling.classList[1];
        var second = document.getElementsByClassName('show')[1];
        var secondClass = second.firstChild.nextElementSibling.classList[1];

        // Condition if matches
        if (firstClass === secondClass) {
            first.classList.remove("open");
            first.classList.remove("show");
            second.classList.remove("open");
            second.classList.remove("show");

            first.classList.add("match");
            first.classList.add("match-animate");
            second.classList.add("match");
            second.classList.add("match-animate");

            setTimeout(function () {
                first.classList.remove("match-animate");
                second.classList.remove("match-animate");
            }, 1000);

            // function call to check if game is over
            isEndGame();

            // Cards not match
        } else {
            first.classList.add("mismatch");
            second.classList.add("mismatch");
            document.querySelector('.deck').style.pointerEvents = 'none';
            setTimeout(function () {
                first.classList.remove("open");
                first.classList.remove("show");
                second.classList.remove("open");
                second.classList.remove("show");
                first.classList.remove("mismatch");
                second.classList.remove("mismatch");
                document.querySelector('.deck').removeAttribute('style');
            }, 1000);

        }

        // Reset so the user can click the card again
        numberPlays = 0;
    }
}

// Removing star due to many moves
function removeStar() {
    var stars = document.querySelectorAll('.stars li');
    var star = document.querySelector('.stars li')

    if (stars.length > 1 && (moves == 11 || moves == 13 || moves == 15 || moves == 18)) {
        star.remove();
    }
}

// Updating front move, showing to the user
function updateMoves(moves) {
    document.querySelector('.moves').innerHTML = moves;
}

// End game validator
function isEndGame() {
    var cards = document.querySelectorAll('.card');
    var cardsMatch = document.querySelectorAll('.match');

    if (cards.length === cardsMatch.length) {
        stopAdd = true;
        setTimeout(function () {
            modalWin();
        }, 1000);
    }
}

// End game modal information
function modalWin() {

    var time = document.querySelector('.timer').innerHTML;
    var stars = document.querySelectorAll('.stars li').length;

    document.querySelector('.final-time').innerHTML = time;
    document.querySelector('.final-stars').innerHTML = stars;

    fadeInModal();
}

// End game modal show
function fadeInModal() {
    var modal = document.querySelector('.win-modal');
    var overlay = document.querySelector('.overlay');
    var op = 0.1;  // initial opacity
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        modal.style.opacity = op;
        modal.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

// Starter functions
function init() {
    // Shuffles and start the game
    shuffleCards();

    // Events when card is clicked
    clickCard();

    // Restart the game
    restart();

}
init();