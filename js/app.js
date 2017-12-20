/*
 * Create a list that holds all of your cards
 */
var cardSymbols = ['fa-apple', 'fa-windows', 'fa-android', 'fa-linux', 'fa-tumblr-square', 'fa-thumbs-up', 'fa-thumbs-down', 'fa-instagram','fa-apple', 'fa-windows', 'fa-android', 'fa-linux', 'fa-tumblr-square', 'fa-thumbs-up', 'fa-thumbs-down', 'fa-instagram']

/*
 * creates a list to hold the open (but not matched) cards
 */
var openCards = [];
/*
 * creates a list to hold the matched cards
 */
var matchedCards = [];
/*
 * variable to hold the number of moves taken by player
 */
var moves = 0
// holds the current time from timer
var totalSeconds = 0;
//variable to hols the timer interval
var timer = setInterval(displayTimer, 1000)
//variable to hold html timer location
var secondsLabel = document.getElementById("seconds");
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 /*
  * starts a new game.  Flips cards symbol down, resets  arrays for open and matched cards, calls function to shuffle deck, resets timer and move counter
  */
function newGame(){
	var card = $('.card');
	card.removeClass('match open show');
	shuffledSymbols = shuffle(cardSymbols);
	matchedCards = []
	openCards = []
	moves = 0;
	stars = $('.stars').find('.fa-star')
		stars.css('color', 'rgb(255, 211, 0)')
	$('.moves').text(0);
	console.log(moves)
	currentSymbols = card.children('i');
	currentSymbols.removeClass('fa-apple fa-windows fa-android fa-linux fa-tumblr-square fa-thumbs-up fa-thumbs-down fa-instagram')
	currentSymbols.each( function(index, item){
		$(item).addClass(shuffledSymbols[index]);
	})
	resetTimer()
}
//restarts the game when reset button is clicke
$('.restart').click(newGame);
//starts a new game on page load.
$(document).ready(newGame);
	

/* 
 * Shuffle function from http://stackoverflow.com/a/2450976
 */

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

/* 
 * event listener: upon clicking on a hidden card flips card and pushes the card to the array of open cards
 * input = event
 */

 $('.card').click( function(event) {
	var card = $(event.target); 
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

/* checks to see if two open cards match and calls various functions to deal with matched or unmatched showing cards. 
 * clears the openCards array, calls methods to increment the move counter and set the current score.
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


/*
 * adds the classes open and show to a card
 */
function toggleCard(card) {
	card.addClass('open show');
}
/* 
 * hides an open card by removing classes open and show
 */
function hideCard(card)	{
	card.removeClass('open show')
}

/*
 * add the class match to matched cards and removes classes open and show
 */
function match(card) {
	card.addClass('match')
	card.removeClass('open show')
}
/* 
 * pushes open cards to the opeCards array
 */
function cardIsOpen(card){
	openCard = card.children('i').attr('class')
	openCards.push(openCard)
}
/*
 * increments the move counter and sends the current move count to the web app
 */
function incrementMoves(){
	moves += 1;
	$('.moves').text(moves);
}
/* 
 * sets up the timer
 */
/*function setTimeInterval(){
	setInterval(displayTimer, 1000);
}*/

//displays and increments the timer
function displayTimer() {
  ++totalSeconds;
  secondsLabel.innerHTML = '&nbsp &nbsp Timer ' + totalSeconds;
}

//resets the timer
function resetTimer() {
	clearInterval(timer);
	totalSeconds = 0;
	timer = setInterval(displayTimer, 1000);
}

/* 
 * checks number of moves to set score, if moves > 25 stops timer and displays losing modal window
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
	else if (moves >20  && moves <= 25){
		$('.second_star').css('color', '#eee')
		return
	}
	else{
		$('.first_star').css('color', '#eee')
	}
	losingMessage();
	clearInterval(timer);
}	

//checks to see if player has won, if so stops timer calls function to display winning modal window
function win(){
	if (matchedCards.length === 8){
		winningMessage();
		clearInterval(timer);
	}
	else{
		return
	}
}
//displays modal window when you win.
function winningMessage() {
	countStars();
	$('#winningText').text("It took you "+totalSeconds+" seconds");
	$('#winningModal').css('display','block');

}
//displays modal window when you lose
function losingMessage() {
	$('#losingModal').css('display','block');
}

// clicking on the (x), closes the modal windw
$('.close').click(function() {
    $('.modal').css('display', 'none');
});

// clicking outside model windoe closes it
window.onclick = function(event) {
    $('.modal').css('display', 'none');
};

// play again starts a new game
$('.play').click(newGame);
 

/*
 * these two lines of code call newGame upon page load or when the reset button is clicked.
 */
$('.restart').click(newGame);
$(document).ready(newGame);

// clicking on the (x), closes the modal windw
$('.close').click(function() {
    $('.modal').css('display', 'none');
});

// clicking outside model windoe closes it
window.onclick = function(event) {
    $('.modal').css('display', 'none');
};
// play again starts a new game
$('.play').click(newGame);
