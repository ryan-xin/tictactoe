$(document).ready(function () {
  
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

  // Counts for winning times
  let playerOneResult = 0;
  let playerTwoResult = 0;
  let tieResult = 0;


  /* -------------------------- Player Play Function -------------------------- */

  const playerPlay = function() {
    // Check if there is already a token. When 'src' empty run place a token
    if ($(this).children().attr('src') === "") {
      if (playerTurn === 1) { // Player One plays
        $(this).children().attr('src', playerOne.token);
        $(this).addClass('player1');
        // Update the message
        $('.message h2').text('It is ' + playerTwo.name + '\'s turn.');
        // Checking if Player One wins
        if(winnerCheck(playerOne, 'player1')) {
          playerOneResult += 1;
          // Update the message
          $('.message h2').text(playerOne.name + ' wins!');
          gameOver();
        };
      } else if (playerTurn === -1) { // Player Two player
        $(this).children().attr('src', playerTwo.token);
        $(this).addClass('player2');
        // Update the message
        $('.message h2').text('It is ' + playerOne.name + '\'s turn.');
        // Checking if Player Two wins
        if (winnerCheck(playerTwo, 'player2')) {
          playerTwoResult += 1;
          // Update the message
          $('.message h2').text(playerTwo.name + ' wins!');
          gameOver();
        };
      }
      playerTurn *= (-1); // Change turn to another player
      // Check if it is a tie.
      if (tieCheck(playerOne, 'player1', playerTwo, 'player2')) {
        tieResult += 1;
        // Update the message
        $('.message h2').text('It is a tie.');
          gameOver();
      };
      // Remove Hover and Pointer to inform user the clicked block is not clickable
      $(this).unbind('mouseenter mouseleave');
      $(this).css('cursor', 'default');
    }
  };



/* ----------------------------- Checking Winner ---------------------------- */

  const winnerCheck = function(playerNumber, className) {
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

  /* ------------------------------ Stop The Game ----------------------------- */

  const gameOver = function() {
    $('.player-one-result-number').text(playerOneResult);
    $('.player-two-result-number').text(playerTwoResult);
    $('.tie-result-number').text(tieResult);
    $('.block').unbind('click');
    $('.block').unbind('mouseenter mouseleave');
    $('.block').css('cursor', 'default');
  }; 


/* --------------------------- Block Hover Effect --------------------------- */

  const blockMouseEnter = function() {
    $(this).css('background', '#454545');
  };
  const blockMouseLeave = function() {
    $(this).css('background', '#292929');
  };


  /* ---------------------------- Restart The Game ---------------------------- */

  const restartGame = function() {
    $('.block').children().attr('src', '');
    $('.block').removeClass('player1').removeClass('player2');
    $('.block').on('click', playerPlay);
    $('.block').hover(blockMouseEnter, blockMouseLeave);
    $('.block').css('background', '#292929');
    $('.block').css('cursor', 'pointer');
    $('.message h2').text('It is Player One\'s turn.');
  };

  /* -------------------------------- Show Menu ------------------------------- */

  const showMenu = function() {
    $('.menu-container').height('100%');
  };


  const hideMenu = function() {
    $('.menu-container').height('0%');
  }

  /* ------------------------------ Select Tokens ----------------------------- */

  const changeToTokenSetOne = function() {
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    playerOne.token = 'assets/token_bone.svg';
    playerOne.tokenWin = 'assets/token_bone_win.svg';
  }

  const changeToTokenSetTwo = function() {
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    playerOne.token = 'assets/token_fish.svg';
    playerOne.tokenWin = 'assets/token_fish_win.svg';
  }

  /* ------------------------------ Event Handler ----------------------------- */

  $('.block').on('click', playerPlay);


  $('.block').hover(blockMouseEnter, blockMouseLeave);
  

  $('.restart').on('click', restartGame);
 

  $('.burger_menu').on('click', showMenu);

  
  $('.burger_close').on('click', hideMenu);


  $('.token-set-one').on('click', changeToTokenSetOne);

  
  $('.token-set-two').on('click', changeToTokenSetTwo);



});
