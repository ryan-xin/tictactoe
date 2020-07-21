
/* ----------------------------- Game Variables ----------------------------- */

let playerOne = {
  name: 'Player One',
  token: 'assets/token_circle.svg',
  tokenWin: 'assets/token_circle_win.svg',
  result: 0
};

let playerTwo = {
  name: 'Player Two',
  token: 'assets/token_cross.svg',
  tokenWin: 'assets/token_cross_win.svg',
  result: 0
};

// When playerTurn = 1 it is Player One's turn. When playerTurn = -1 it is Player Two's turn.
let playerTurn = 1;

// Counts for tie times
let tieResult = 0;

// Starter message
let message = 'Enjoy the game!';

// Token toggle position when 1: highlight on Set One; -1 highlight on Set Two
let tokenToggle;

// Store the block classes to check which player has placed a token
let blockClassArr = [];

// Store the block img > src to check which player has placed a token
let blockImageArr = [];

/* --------------------------- Load Local Storage --------------------------- */

if (localStorage !== undefined) {
  playerOne = JSON.parse(localStorage.getItem('playerOne'));
  tieResult = JSON.parse(localStorage.getItem('tieResult'));
  playerTwo = JSON.parse(localStorage.getItem('playerTwo'));
  playerTurn = JSON.parse(localStorage.getItem('playerTurn'));
  message = JSON.parse(localStorage.getItem('message'));
  tokenToggle = JSON.parse(localStorage.getItem('tokenToggle'));
  blockClassArr = JSON.parse(localStorage.getItem('blockClassArr'));
  blockImageArr = JSON.parse(localStorage.getItem('blockImageArr'));
  // console.log(blockClassArr, blockImageArr);
}


/* -------------------------- Player Play Function -------------------------- */

const playerPlay = function () {
  // Check if there is already a token. When 'src' empty run place a token
  if ($(this).children().attr('src') === "") {
    if (playerTurn === 1) { // Player One plays
      // Place Player One's token image
      $(this).children().attr('src', playerOne.token);
      // Add player1 class to the block
      $(this).addClass('player1');
      // Update the message
      $('.message h2').text('It is ' + playerTwo.name + '\'s turn.');
      // Checking if Player One wins
      if (winnerCheck(playerOne, 'player1')) {
        playerOne.result += 1;
        // Update the message
        message = playerOne.name + ' wins!';
        $('.message h2').text(message);
        // saveGame();
        gameOver();
        return;
      };
    } else if (playerTurn === -1) { // Player Two player
      // Place Player Two's token image
      $(this).children().attr('src', playerTwo.token);
      // Add player2 class to the block
      $(this).addClass('player2');
      // Update the message
      $('.message h2').text('It is ' + playerOne.name + '\'s turn.');
      // Checking if Player Two wins
      if (winnerCheck(playerTwo, 'player2')) {
        playerTwo.result += 1;
        // Update the message
        message = playerTwo.name + ' wins!';
        $('.message h2').text(message);
        // saveGame();
        gameOver();
        return;
      };
    }
    playerTurn *= (-1); // Change turn to another player
    // Check if it is a tie.
    if (tieCheck(playerOne, 'player1', playerTwo, 'player2')) {
      tieResult += 1;
      // Update the message
      message = 'It is a tie.';
      $('.message h2').text(message);
      gameOver();
    };
    saveGame();
    // Remove Hover and Pointer to inform user the clicked block is not clickable
    $(this).unbind('mouseenter mouseleave');
    $(this).css('cursor', 'default');
  }
};


/* ----------------------------- Checking Winner ---------------------------- */

const winnerCheck = function (playerNumber, className) {
  const $blockClass1 = $('.block').eq(0);
  const $blockClass2 = $('.block').eq(1);
  const $blockClass3 = $('.block').eq(2);
  const $blockClass4 = $('.block').eq(3);
  const $blockClass5 = $('.block').eq(4);
  const $blockClass6 = $('.block').eq(5);
  const $blockClass7 = $('.block').eq(6);
  const $blockClass8 = $('.block').eq(7);
  const $blockClass9 = $('.block').eq(8);

  if ($blockClass1.hasClass(className) && $blockClass2.hasClass(className) && $blockClass3.hasClass(className)) {
    $blockClass1.children().attr('src', playerNumber.tokenWin);
    $blockClass2.children().attr('src', playerNumber.tokenWin);
    $blockClass3.children().attr('src', playerNumber.tokenWin);
    return true;
  } else if ($blockClass4.hasClass(className) && $blockClass5.hasClass(className) && $blockClass6.hasClass(className)) {
    $blockClass4.children().attr('src', playerNumber.tokenWin);
    $blockClass5.children().attr('src', playerNumber.tokenWin);
    $blockClass6.children().attr('src', playerNumber.tokenWin);
    return true;
  } else if ($blockClass7.hasClass(className) && $blockClass8.hasClass(className) && $blockClass9.hasClass(className)) {
    $blockClass7.children().attr('src', playerNumber.tokenWin);
    $blockClass8.children().attr('src', playerNumber.tokenWin);
    $blockClass9.children().attr('src', playerNumber.tokenWin);
    return true;
  } else if ($blockClass1.hasClass(className) && $blockClass4.hasClass(className) && $blockClass7.hasClass(className)) {
    $blockClass1.children().attr('src', playerNumber.tokenWin);
    $blockClass4.children().attr('src', playerNumber.tokenWin);
    $blockClass7.children().attr('src', playerNumber.tokenWin);
    return true;
  } else if ($blockClass2.hasClass(className) && $blockClass5.hasClass(className) && $blockClass8.hasClass(className)) {
    $blockClass2.children().attr('src', playerNumber.tokenWin);
    $blockClass5.children().attr('src', playerNumber.tokenWin);
    $blockClass8.children().attr('src', playerNumber.tokenWin);
    return true;
  } else if ($blockClass3.hasClass(className) && $blockClass6.hasClass(className) && $blockClass9.hasClass(className)) {
    $blockClass3.children().attr('src', playerNumber.tokenWin);
    $blockClass6.children().attr('src', playerNumber.tokenWin);
    $blockClass9.children().attr('src', playerNumber.tokenWin);
    return true;
  } else if ($blockClass1.hasClass(className) && $blockClass5.hasClass(className) && $blockClass9.hasClass(className)) {
    $blockClass1.children().attr('src', playerNumber.tokenWin);
    $blockClass5.children().attr('src', playerNumber.tokenWin);
    $blockClass9.children().attr('src', playerNumber.tokenWin);
    return true;
  } else if ($blockClass3.hasClass(className) && $blockClass5.hasClass(className) && $blockClass7.hasClass(className)) {
    $blockClass3.children().attr('src', playerNumber.tokenWin);
    $blockClass5.children().attr('src', playerNumber.tokenWin);
    $blockClass7.children().attr('src', playerNumber.tokenWin);
    return true;
  } else {
    return false;
  }
};


/* ------------------------------ Tie Function ------------------------------ */

const tieCheck = function (playerNumberOne, classNameOne, playerNumberTwo, classNameTwo) {
  const $blockClass1 = $('.block').eq(0);
  const $blockClass2 = $('.block').eq(1);
  const $blockClass3 = $('.block').eq(2);
  const $blockClass4 = $('.block').eq(3);
  const $blockClass5 = $('.block').eq(4);
  const $blockClass6 = $('.block').eq(5);
  const $blockClass7 = $('.block').eq(6);
  const $blockClass8 = $('.block').eq(7);
  const $blockClass9 = $('.block').eq(8);
  // Check if all blocks have been clicked
  if ($blockClass1.children().attr('src') !== "" && $blockClass2.children().attr('src') !== "" && $blockClass3.children().attr('src') !== "" && $blockClass4.children().attr('src') !== "" && $blockClass5.children().attr('src') !== "" && $blockClass6.children().attr('src') !== "" && $blockClass7.children().attr('src') !== "" && $blockClass8.children().attr('src') !== "" && $blockClass9.children().attr('src') !== "") {
    if (!winnerCheck(playerNumberOne, classNameOne) && !winnerCheck(playerNumberTwo, classNameTwo)) {
      return true;
    }
  }
};

/* -------------------------- Storing block class -------------------------- */

const blockClassChecker = function() {
  for (let i = 0; i < $('.block').length; i++ ) {
    if ($('.block').eq(i).hasClass('player1')) {
      blockClassArr.push('player1');
    } else if ($('.block').eq(i).hasClass('player2')) {
      blockClassArr.push('player2');
    } else {
      blockClassArr.push('');
    }
  }
  // console.log(blockClassArr);
};

/* --------------------------- Storing block images --------------------------- */

const blockImageChecker = function () {
  for (let i = 0; i < $('.block').length; i++) {
    imageSrc = $('.block').eq(i).children().attr('src');
    blockImageArr.push(imageSrc);
  }
  // console.log(blockImageArr);
};


/* --------------------------- Block Hover Effect --------------------------- */

const blockMouseEnter = function () {
  $(this).css('background', '#454545');
};
const blockMouseLeave = function () {
  $(this).css('background', '#292929');
};

/* -------------------------------- Show Menu ------------------------------- */

const showMenu = function () {
  $('.menu-container').height('100%');
  // When slidedown checking which Token Set is highlight 1: Set One 2: Set Two
  tokenToggleCheck();
};

const hideMenu = function () {
  $('.menu-container').height('0%');
}

/* --------------------- Checking Token Toggle Position --------------------- */

const tokenToggleCheck = function () {
  if (tokenToggle === 1) {
    // Add highlighted border to itself; remove from its sibling
    $('.token-set-one').addClass('set-selected');
    $('.token-set-two').removeClass('set-selected');
  } else if (tokenToggle === 2) {
    $('.token-set-two').addClass('set-selected');
    $('.token-set-one').removeClass('set-selected');
  }
};

/* ------------------------------ Select Tokens ----------------------------- */

const changeToTokenSetOne = function () {
  // Add highlighted border to itself; remove from its sibling
  $(this).addClass('set-selected');
  $(this).siblings().removeClass('set-selected');
  // Update token imgs
  playerOne.token = 'assets/token_circle.svg';
  playerOne.tokenWin = 'assets/token_circle_win.svg';
  playerTwo.token = 'assets/token_cross.svg';
  playerTwo.tokenWin = 'assets/token_cross_win.svg';
  tokenToggle = 1;
  saveGame();
  restartGame();
  hideMenu();
}

const changeToTokenSetTwo = function () {
  // Add highlighted border to itself; remove from its sibling
  $(this).addClass('set-selected');
  $(this).siblings().removeClass('set-selected');
  // Update token imgs
  playerOne.token = 'assets/token_bone.svg';
  playerOne.tokenWin = 'assets/token_bone_win.svg';
  playerTwo.token = 'assets/token_fish.svg';
  playerTwo.tokenWin = 'assets/token_fish_win.svg';
  tokenToggle = 2;
  saveGame();
  restartGame();
  hideMenu();
}

/* ---------------------------- Restart The Game ---------------------------- */

const restartGame = function () {
  // Clear all blocks img 
  $('.block').children().attr('src', '');
  // Clear all blocks class
  $('.block').removeClass('player1').removeClass('player2');
  // Enable click event
  $('.block').on('click', playerPlay);
  // Enable hover event
  $('.block').hover(blockMouseEnter, blockMouseLeave);
  $('.block').css('background', '#292929');
  $('.block').css('cursor', 'pointer');
  $('.message h2').text('Enjoy the game!');
  playerTurn = 1;
};



/* -------------------------------- New Game -------------------------------- */

// Clear history
const newGame = function() {
  playerOne.result = 0;
  playerTwo.result = 0;
  playerTurn = 1;
  tieResult = 0;  
  tokenToggle = 1;
  restartGame();
  hideMenu();
  $('.player-one-result').text(playerOne.name);
  $('.player-two-result').text(playerTwo.name);
  $('.player-one-result-number').text(playerOne.result);
  $('.player-two-result-number').text(playerTwo.result);
  $('.tie-result-number').text(tieResult);
};

/* ------------------------------ Game Over ----------------------------- */

const gameOver = function () {
  // Show winner counts
  $('.player-one-result-number').text(playerOne.result);
  $('.player-two-result-number').text(playerTwo.result);
  $('.tie-result-number').text(tieResult);
  // Make all blocks not clickable
  $('.block').unbind('click');
  // Remove hover effect
  $('.block').unbind('mouseenter mouseleave');
  // Remove pointer effect
  $('.block').css('cursor', 'default');
  // Change turn to Player One.
  playerTurn = 1;
  saveGame();
};

/* -------------------------------- Save Game ------------------------------- */

const saveGame = function () {
  blockClassArr = [];
  blockClassChecker();
  blockImageArr = [];
  blockImageChecker();
  localStorage.setItem('blockClassArr', JSON.stringify(blockClassArr));
  localStorage.setItem('blockImageArr', JSON.stringify(blockImageArr));
  localStorage.setItem('playerOne', JSON.stringify(playerOne));
  localStorage.setItem('tieResult', JSON.stringify(tieResult));
  localStorage.setItem('playerTwo', JSON.stringify(playerTwo));
  localStorage.setItem('playerTurn', JSON.stringify(playerTurn));
  localStorage.setItem('message', JSON.stringify(message));
  localStorage.setItem('tokenToggle', JSON.stringify(tokenToggle));
};


/* ------------------------------ Event Handler ----------------------------- */


$(document).ready(function () {

  // Reset all data;
  $('.player-one-result').text(playerOne.name);
  $('.player-two-result').text(playerTwo.name);
  $('.player-one-result-number').text(playerOne.result);
  $('.player-two-result-number').text(playerTwo.result);
  $('.tie-result-number').text(tieResult);


  $('.block').on('click', playerPlay);


  $('.block').hover(blockMouseEnter, blockMouseLeave);
  

  $('.restart').on('click', restartGame);
 

  $('.burger_menu').on('click', showMenu);

  
  $('.burger_close').on('click', hideMenu);


  $('.token-set-one').on('click', changeToTokenSetOne);


  $('.token-set-two').on('click', changeToTokenSetTwo);


  $('.new-game').on('click', newGame);


  // Load saved game play board
  for (let j = 0; j < $('.block').length; j++) {
    if (blockClassArr[j] === 'player1' || blockClassArr[j] === 'player2') {
      // Show saved class on each block
      $('.block').eq(j).addClass(blockClassArr[j]);
      // Show saved block image src on each block
      $('.block').eq(j).children().attr('src', blockImageArr[j]);

      // Disable hover effect and pointer
      $('.block').eq(j).css('cursor', 'default');
      $('.block').eq(j).unbind('mouseenter mouseleave');
    }
  }


});
