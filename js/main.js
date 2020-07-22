
  
/* ----------------------------- Game Variables ----------------------------- */

// Player One Data
let playerOne = {
  name: 'Player One',
  token: 'assets/token_circle.svg',
  tokenWin: 'assets/token_circle_win.svg',
  result: 0
};

// Player Two Data
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

// Token toggle position when 1: highlight on Set One; 2 highlight on Set Two
let tokenToggle = 1;

// Grid toggle position when 3: highlight on Grid One 3x3; 3 highlight on Grid Two 4x4
let gridToggle = 3;

// Store the block classes to check which player has placed a token into
let blockClassArr = [];

// Store the block img > src to check which player has placed a token into
let blockImageArr = [];

// If the game is over: disable all blocks
let isGameOver = false;

// Check if Local Storage can be used
let localStorageSaved = true;
if (localStorage === undefined) {
  localStorageSaved = false;
}


$(document).ready(function () {

  /* --------------------------- Load Local Storage --------------------------- */
  if (localStorageSaved) {
    // Check if the there is data saved in Local Storage
    if(!(localStorage.playerOne === null)) {
      playerOne = JSON.parse(localStorage.getItem('playerOne'));
      tieResult = JSON.parse(localStorage.getItem('tieResult'));
      playerTwo = JSON.parse(localStorage.getItem('playerTwo'));
      playerTurn = JSON.parse(localStorage.getItem('playerTurn'));
      message = JSON.parse(localStorage.getItem('message'));
      tokenToggle = JSON.parse(localStorage.getItem('tokenToggle'));
      gridToggle = JSON.parse(localStorage.getItem('gridToggle'));
      isGameOver = JSON.parse(localStorage.getItem('isGameOver'));
      blockClassArr = JSON.parse(localStorage.getItem('blockClassArr'));
      blockImageArr = JSON.parse(localStorage.getItem('blockImageArr'));
      
      // Check if the saved game is over
      if (isGameOver) {
        // If over disable all block click
        $('.block').css('pointer-events', 'none');
        // Remove pointer effect
        $('.block').css('cursor', 'default');
      }
  
      // Show saved result on screen
      $('.player-one-result').text(playerOne.name);
      $('.player-two-result').text(playerTwo.name);
      $('.player-one-result-number').text(playerOne.result);
      $('.player-two-result-number').text(playerTwo.result);
      $('.tie-result-number').text(tieResult);
      $('.message h2').text(message);
  
      // Check what token set the saved game use and show in menu
      if (tokenToggle === 1) {
        // Add highlighted border to itself; remove from its sibling
        $('.token-set-one').addClass('set-selected');
        $('.token-set-two').removeClass('set-selected');
      } else if (tokenToggle === 2) {
        // Add highlighted border to itself; remove from its sibling. And show in menu
        $('.token-set-two').addClass('set-selected');
        $('.token-set-one').removeClass('set-selected');
      }
  
      // Check if the game saved is Grid One 3x3 or Grid Two 4x4
      if (gridToggle === 3) {
        // Show Grid One 3x3 and hide the other one 
        $('.container-one').css('display', 'block');
        $('.container-two').css('display', 'none');
        // Add highlighted border to itself; remove from its sibling
        $('.grid-one').addClass('set-selected');
        $('.grid-two').removeClass('set-selected');
      } else if (gridToggle === 4) {
        // Show Grid Two 4x4 and hide the other one 
        $('.container-one').css('display', 'none');
        $('.container-two').css('display', 'block');
        // Add highlighted border to itself; remove from its sibling. And show in menu
        $('.grid-one').removeClass('set-selected');
        $('.grid-two').addClass('set-selected');
      }
    }
    

    // Load saved game play board.
    for (let i = 0; i < $('.block').length; i++) {
      // Use 'player1' and 'player2' classes to check if this block has been played
      if (blockClassArr[i] === 'player1' || blockClassArr[i] === 'player2') {
        // Show saved class on each block
        $('.block').eq(i).addClass(blockClassArr[i]);
        // Show saved block image src on each block
        $('.block').eq(i).children().attr('src', blockImageArr[i]);
        // Disable hover effect and pointer
        $('.block').eq(i).css('cursor', 'default');
      }
    }
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
        message = 'It is ' + playerTwo.name + '\'s turn.';
        $('.message h2').text(message);
        // Checking if Player One wins
        if (winnerCheck(playerOne, 'player1')) {
          // isGameOver = true;
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
        message = 'It is ' + playerOne.name + '\'s turn.';
        $('.message h2').text(message);
        // Checking if Player Two wins
        if (winnerCheck(playerTwo, 'player2')) {
          // isGameOver = true;
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
        // isGameOver = true;
        tieResult += 1;
        // Update the message
        message = 'It is a tie.';
        $('.message h2').text(message);
        gameOver();
      };
      saveGame();
      // Remove Hover and Pointer to inform user the clicked block is not clickable
      $(this).off('mouseenter mouseleave');
      $(this).css('cursor', 'default');
    }
  };


  /* -------------------------- Winner  Check ------------------------- */
  // VERY LONG CODE! Just check every possible winner conditions
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
    const $blockClass10 = $('.block').eq(9);
    const $blockClass11 = $('.block').eq(10);
    const $blockClass12 = $('.block').eq(11);
    const $blockClass13 = $('.block').eq(12);
    const $blockClass14 = $('.block').eq(13);
    const $blockClass15 = $('.block').eq(14);
    const $blockClass16 = $('.block').eq(15);
    const $blockClass17 = $('.block').eq(16);
    const $blockClass18 = $('.block').eq(17);
    const $blockClass19 = $('.block').eq(18);
    const $blockClass20 = $('.block').eq(19);
    const $blockClass21 = $('.block').eq(20);
    const $blockClass22 = $('.block').eq(21);
    const $blockClass23 = $('.block').eq(22);
    const $blockClass24 = $('.block').eq(23);
    const $blockClass25 = $('.block').eq(24);

    // For Grid One 3x3
    if (gridToggle === 3) {
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

    // For Grid Two 4x4
    } else if (gridToggle === 4) {
      if ($blockClass10.hasClass(className) && $blockClass11.hasClass(className) && $blockClass12.hasClass(className) && $blockClass13.hasClass(className)) {
        $blockClass10.children().attr('src', playerNumber.tokenWin);
        $blockClass11.children().attr('src', playerNumber.tokenWin);
        $blockClass12.children().attr('src', playerNumber.tokenWin);
        $blockClass13.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass14.hasClass(className) && $blockClass15.hasClass(className) && $blockClass16.hasClass(className) && $blockClass17.hasClass(className)) {
        $blockClass14.children().attr('src', playerNumber.tokenWin);
        $blockClass15.children().attr('src', playerNumber.tokenWin);
        $blockClass16.children().attr('src', playerNumber.tokenWin);
        $blockClass17.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass18.hasClass(className) && $blockClass19.hasClass(className) && $blockClass20.hasClass(className) && $blockClass21.hasClass(className)) {
        $blockClass18.children().attr('src', playerNumber.tokenWin);
        $blockClass19.children().attr('src', playerNumber.tokenWin);
        $blockClass20.children().attr('src', playerNumber.tokenWin);
        $blockClass21.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass22.hasClass(className) && $blockClass23.hasClass(className) && $blockClass24.hasClass(className) && $blockClass25.hasClass(className)) {
        $blockClass22.children().attr('src', playerNumber.tokenWin);
        $blockClass23.children().attr('src', playerNumber.tokenWin);
        $blockClass24.children().attr('src', playerNumber.tokenWin);
        $blockClass25.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass10.hasClass(className) && $blockClass11.hasClass(className) && $blockClass12.hasClass(className) && $blockClass13.hasClass(className)) {
        $blockClass10.children().attr('src', playerNumber.tokenWin);
        $blockClass11.children().attr('src', playerNumber.tokenWin);
        $blockClass12.children().attr('src', playerNumber.tokenWin);
        $blockClass13.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass14.hasClass(className) && $blockClass15.hasClass(className) && $blockClass16.hasClass(className) && $blockClass17.hasClass(className)) {
        $blockClass14.children().attr('src', playerNumber.tokenWin);
        $blockClass15.children().attr('src', playerNumber.tokenWin);
        $blockClass16.children().attr('src', playerNumber.tokenWin);
        $blockClass17.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass18.hasClass(className) && $blockClass19.hasClass(className) && $blockClass20.hasClass(className) && $blockClass21.hasClass(className)) {
        $blockClass18.children().attr('src', playerNumber.tokenWin);
        $blockClass19.children().attr('src', playerNumber.tokenWin);
        $blockClass20.children().attr('src', playerNumber.tokenWin);
        $blockClass21.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass22.hasClass(className) && $blockClass23.hasClass(className) && $blockClass24.hasClass(className) && $blockClass25.hasClass(className)) {
        $blockClass22.children().attr('src', playerNumber.tokenWin);
        $blockClass23.children().attr('src', playerNumber.tokenWin);
        $blockClass24.children().attr('src', playerNumber.tokenWin);
        $blockClass25.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass10.hasClass(className) && $blockClass15.hasClass(className) && $blockClass20.hasClass(className) && $blockClass25.hasClass(className)) {
        $blockClass10.children().attr('src', playerNumber.tokenWin);
        $blockClass15.children().attr('src', playerNumber.tokenWin);
        $blockClass20.children().attr('src', playerNumber.tokenWin);
        $blockClass25.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass13.hasClass(className) && $blockClass16.hasClass(className) && $blockClass19.hasClass(className) && $blockClass22.hasClass(className)) {
        $blockClass13.children().attr('src', playerNumber.tokenWin);
        $blockClass16.children().attr('src', playerNumber.tokenWin);
        $blockClass19.children().attr('src', playerNumber.tokenWin);
        $blockClass22.children().attr('src', playerNumber.tokenWin);
        return true;
      } else {
        return false;
      }
    }
  };


  /* ---------------------------- Tie Check --------------------------- */
  // Shorter than above! Just check if all blocks have been player and there is no winner
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
    const $blockClass10 = $('.block').eq(9);
    const $blockClass11 = $('.block').eq(10);
    const $blockClass12 = $('.block').eq(11);
    const $blockClass13 = $('.block').eq(12);
    const $blockClass14 = $('.block').eq(13);
    const $blockClass15 = $('.block').eq(14);
    const $blockClass16 = $('.block').eq(15);
    const $blockClass17 = $('.block').eq(16);
    const $blockClass18 = $('.block').eq(17);
    const $blockClass19 = $('.block').eq(18);
    const $blockClass20 = $('.block').eq(19);
    const $blockClass21 = $('.block').eq(20);
    const $blockClass22 = $('.block').eq(21);
    const $blockClass23 = $('.block').eq(22);
    const $blockClass24 = $('.block').eq(23);
    const $blockClass25 = $('.block').eq(24);
    // Check if all blocks have been clicked
    if (gridToggle === 3) {
      if ($blockClass1.children().attr('src') !== "" && $blockClass2.children().attr('src') !== "" && $blockClass3.children().attr('src') !== "" && $blockClass4.children().attr('src') !== "" && $blockClass5.children().attr('src') !== "" && $blockClass6.children().attr('src') !== "" && $blockClass7.children().attr('src') !== "" && $blockClass8.children().attr('src') !== "" && $blockClass9.children().attr('src') !== "") {
        // No one wins
        if (!winnerCheck(playerNumberOne, classNameOne) && !winnerCheck(playerNumberTwo, classNameTwo)) {
          return true;
        }
      }
    } else if (gridToggle === 4) {
      if ($blockClass10.children().attr('src') !== "" && $blockClass11.children().attr('src') !== "" && $blockClass12.children().attr('src') !== "" && $blockClass13.children().attr('src') !== "" && $blockClass14.children().attr('src') !== "" && $blockClass15.children().attr('src') !== "" && $blockClass16.children().attr('src') !== "" && $blockClass17.children().attr('src') !== "" && $blockClass18.children().attr('src') !== "" && $blockClass19.children().attr('src') !== "" && $blockClass20.children().attr('src') !== "" && $blockClass21.children().attr('src') !== "" && $blockClass22.children().attr('src') !== "" && $blockClass23.children().attr('src') !== "" && $blockClass24.children().attr('src') !== "" && $blockClass25.children().attr('src') !== "") {
        // No one wins
        if (!winnerCheck(playerNumberOne, classNameOne) && !winnerCheck(playerNumberTwo, classNameTwo)) {
          return true;
        }
      }
    }
  };

  /* -------------------------- Storing block class -------------------------- */

  const blockClassChecker = function() {
    // For in loop all blocks
    for (let i = 0; i < $('.block').length; i++ ) {
      // If the block has 'player1' class add to blockClassArr array
      if ($('.block').eq(i).hasClass('player1')) {
        blockClassArr.push('player1');
      // If the block has 'player2' class add to blockClassArr array
      } else if ($('.block').eq(i).hasClass('player2')) {
        blockClassArr.push('player2');
      // If the block has '' class add to blockClassArr array
      } else {
        blockClassArr.push('');
      }
    }
    // blockClassArr now has all blocks class in order
  };

  /* --------------------------- Storing block images --------------------------- */

  const blockImageChecker = function () {
    // For in loop all blocks
    for (let i = 0; i < $('.block').length; i++) {
      // Each block's img src
      imageSrc = $('.block').eq(i).children().attr('src');
      // Save each block's src in blockImageArr in order
      blockImageArr.push(imageSrc);
    }
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
    // tokenToggleCheck();
    // gridToggleCheck();
  };

  const hideMenu = function () {
    $('.menu-container').height('0%');
  }



  /* ------------------------------ Change Tokens ----------------------------- */

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


  /* ------------------------------- Change Grid ------------------------------ */

  const changeToGridOne = function () {
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    // Show Grid One 3x3, hide Grid One 4x4
    $('.container-one').css('display', 'block');
    $('.container-two').css('display', 'none');
    gridToggle = 3;
    saveGame();
    restartGame();
    hideMenu();
  }

  const changeToGridTwo = function () {
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    // Hide Grid One 3x3, show Grid One 4x4
    $('.container-one').css('display', 'none');
    $('.container-two').css('display', 'block');
    gridToggle = 4;
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
    $('.block').css('pointer-events', 'auto');
    // $('.block').on('click', playerPlay);
    // Enable hover event
    $('.block').hover(blockMouseEnter, blockMouseLeave);
    $('.block').css('background', '#292929');
    $('.block').css('cursor', 'pointer');
    message = 'Enjoy the game!';
    $('.message h2').text(message);
    playerTurn = 1;
    isGameOver = false;
    blockClassArr = [];
    blockImageArr = [];
    saveGame();
  };



  /* -------------------------------- New Game -------------------------------- */

  // Clear all saved data
  const newGame = function() {
    restartGame();
    playerOne.result = 0;
    playerTwo.result = 0;
    isGameOver = false;
    playerTurn = 1;
    tieResult = 0;  
    saveGame();
    hideMenu();
    $('.player-one-result').text(playerOne.name);
    $('.player-two-result').text(playerTwo.name);
    $('.player-one-result-number').text(playerOne.result);
    $('.player-two-result-number').text(playerTwo.result);
    $('.tie-result-number').text(tieResult);
  };

  /* ------------------------------ Game Over ----------------------------- */

  const gameOver = function () {
    // Show players counts
    $('.player-one-result-number').text(playerOne.result);
    $('.player-two-result-number').text(playerTwo.result);
    $('.tie-result-number').text(tieResult);
    // Make all blocks not clickable
    $('.block').css('pointer-events', 'none');
              // $('.block').off('click');
    // Remove hover effect
    $('.block').off('mouseenter mouseleave');
    // Remove pointer effect
    $('.block').css('cursor', 'default');
    // Change turn to Player One.
    isGameOver = true;
    playerTurn = 1;
    saveGame();
  };

  /* -------------------------------- Save Game ------------------------------- */

  const saveGame = function () {
    // Clear previous array
    blockClassArr = [];
    // Save current block classes into blockClassArr
    blockClassChecker();
    // Clear previous array
    blockImageArr = [];
    // Save current block images into blockImageChecker
    blockImageChecker();
    localStorage.setItem('blockClassArr', JSON.stringify(blockClassArr));
    localStorage.setItem('blockImageArr', JSON.stringify(blockImageArr));
    localStorage.setItem('playerOne', JSON.stringify(playerOne));
    localStorage.setItem('tieResult', JSON.stringify(tieResult));
    localStorage.setItem('playerTwo', JSON.stringify(playerTwo));
    localStorage.setItem('playerTurn', JSON.stringify(playerTurn));
    localStorage.setItem('message', JSON.stringify(message));
    localStorage.setItem('tokenToggle', JSON.stringify(tokenToggle));
    localStorage.setItem('gridToggle', JSON.stringify(gridToggle));
    localStorage.setItem('isGameOver', JSON.stringify(isGameOver));
  };


  /* ------------------------------ Event Handler ----------------------------- */


  $('.block').on('click', playerPlay);


  $('.block').hover(blockMouseEnter, blockMouseLeave);
  

  $('.restart').on('click', restartGame);
 

  $('.burger_menu').on('click', showMenu);

  
  $('.burger_close').on('click', hideMenu);


  $('.token-set-one').on('click', changeToTokenSetOne);


  $('.token-set-two').on('click', changeToTokenSetTwo);
  
  
  $('.grid-one').on('click', changeToGridOne);


  $('.grid-two').on('click', changeToGridTwo);
  
  
  $('.new-game').on('click', newGame);


});
