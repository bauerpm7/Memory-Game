/**
 * Create a list that holds all of your cards
 */
let cardSymbols = ['fa-apple', 'fa-windows', 'fa-android', 'fa-linux', 'fa-tumblr-square', 'fa-thumbs-up', 'fa-thumbs-down', 'fa-instagram','fa-apple', 'fa-windows', 'fa-android', 'fa-linux', 'fa-tumblr-square', 'fa-thumbs-up', 'fa-thumbs-down', 'fa-instagram']

/**
 * creates a list to hold the open (but not matched) cards
 */
let openCards = [];
/**
 * creates a list to hold the matched cards
 */
let matchedCards = [];
/**
 * variable to hold the number of moves taken by player
 */
let moves = 0
/**
 * holds the current time from timer
 */
let totalSeconds = 0;
/**
 * variable to hold the timer interval
 */
let timer = setInterval(displayTimer, 1000)
/**
 * variable to hold whether it is the first click of the game
 */
let isFirstClick = true;
/**
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 /**
  * @ description starts a new game.  Flips cards symbol down, resets arrays for open and matched cards, calls function to shuffle deck cardSymbols array, calls function to reassign cardsSymbols to blank cards, resets timer and move counter
  */
function newGame(){
	let card = $('.card');
	card.removeClass('match open show');
	shuffledSymbols = shuffle(cardSymbols);
	matchedCards = []
	openCards = []
	moves = 0;
	stars = $('.stars').find('.fa-star')
	stars.css('color', 'rgb(255, 211, 0)')
	$('.moves').text(0);
	currentSymbols = card.children('i');
	currentSymbols.removeClass('fa-apple fa-windows fa-android fa-linux fa-tumblr-square fa-thumbs-up fa-thumbs-down fa-instagram')
	currentSymbols.each( function(index, item){
		$(item).addClass(shuffledSymbols[index]);
	})
	resetTimer();
}
/**
 * restarts the game when reset button is clicked
 */
$('.restart').click(newGame);
/**
 * @description starts a new game on page load.
 */
$(document).ready(newGame);
/** 
 * @description Shuffle function from http://stackoverflow.com/a/2450976
 * @param {array} cardSymbols[] 
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
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

/**
 * @description event listener: upon clicking on a card calls a function that checks if the card is hidden  and if it is flips card and 
 *  pushes the card to the array of open cards
 * @param {event} 
 */

 $('.card').click( function(event) {
 	if (isFirstClick) {
		startTimer();
		isFirstClick = false;
	}
	let card = $(event.target); 
	if (!card.hasClass('match') && !card.hasClass('show')){
		if (openCards.length < 2){
			toggleCard(card);	
			cardIsOpen(card);
			setTimeout(reconcileTurn,800);
		}
	}
	console.log(matchedCards)		
	console.log(openCards)
});
/**
 * @description checks to see if two open cards match and calls various functions to deal with matched or unmatched showing cards. 
 *  clears the openCards array, calls methods to increment the move counter and set the current score.
 */
function reconcileTurn(){
	if ( openCards.length === 2 ){
		if( openCards[0] === openCards[1]){
			matchedCards.push(openCards[0]);
			match($('.open'))
		}
		else {
			$('.open').effect('shake', { times:3 }, 450)
			setTimeout(hideCard($('.open')),1000)
		}
		openCards = []
		incrementMoves();
		countStars();
		win()
	}
}

/**
 * @description adds the classes open and show to a card
 * @param {jQuery object} $(event.target) - this is whichever card has been clicked on
 */
function toggleCard(card) {
	card.addClass('open show');
}
/** 
 * @description hides an open card by removing classes open and show
 * @param {jQuery object} $(.open) - any card that has the class 'open'
 */
function hideCard(card)	{
	card.removeClass('open show')
}

/**
 * @description add the class match to matched cards and removes classes open and show
 * @param {jQuery object}  $(.open) - any card that has the class 'open'
 */
function match(card) {
	card.addClass('match')
	card.removeClass('open show')
}
/**
 * @ description pushes open cards to the openCards array
 * @ param {jQuery object} $(event.target) - this is whichever card has been clicked on
 */
function cardIsOpen(card){
	openCard = card.children('i').attr('class')
	openCards.push(openCard)
}
/**
 * @description increments the move counter and sends the current move count to the web app
 */
function incrementMoves(){
	moves += 1;
	$('.moves').text(moves);
}
/**
 * @description displays and increments the timer
 */
function displayTimer() {
  let secondsLabel = document.getElementById("seconds");
  ++totalSeconds;
  secondsLabel.innerHTML = '&nbsp; &nbsp; Timer ' + totalSeconds;
}
/**
 * @description starts the timer
 */
function startTimer() {
	timer = setInterval(displayTimer, 1000);
}
/**
 * @description resets the timer to 0
 */
function resetTimer() {
	totalSeconds = 0;
	document.getElementById('seconds').innerHTML = '&nbsp; &nbsp; Timer ' + totalSeconds;
	isFirstClick = true;
	clearInterval(timer);
}
/** 
 *  @description checks number of moves to set score, if moves > 25 stops timer and displays losing modal window
 */
function countStars(){
	if (moves <= 15){
		stars = $('.stars').find('.fa-star')
		stars.css('color', 'rgb(255, 211, 0)')
		return
	}
	else if (moves > 15 && moves <= 20){
		$('.third_star').css('color', '#eee')
		return
	}
	else {
		$('.second_star').css('color', '#eee')
		return
	}
}	
/**
 * @description checks to see if player has won, if so stops timer calls function to display winning modal window
 */
function win(){
	if (matchedCards.length === 8){
		winningMessage();
		clearInterval(timer);
	}
	else{
		return
	}
}
/**
 * @description displays modal window when you win.
 */
function winningMessage() {
	countStars();
	$('#winningText').text("It took you "+totalSeconds+" seconds");
	$('#winningModal').css('display','block');
}

/**
 * @description Event listener executes a funciton to closes the modal window when (x) is clicked
 */
$('.close').click(function() {
    $('.modal').css('display', 'none');
});

/**
 * @description Event listener executes a function to closes the modal window when you click outside the modal window
 */
window.onclick = function() {
    $('.modal').css('display', 'none');
};

/**
 * @description Event listener executes a function to start a new game and rest the timer when the play-again button is clicked
 */
$('.play').click(function (){
	newGame();
	resetTimer();
})