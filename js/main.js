/* ----------------------------- Game Variables ----------------------------- */

// Player One Data for changing information globally
let playerOne = {
  name: 'Player One',
  token: 'assets/token_circle.svg',
  tokenWin: 'assets/token_circle_win.svg',
  result: 0
};

// Player Two Data for changing information globally
let playerTwo = {
  name: 'Player Two',
  token: 'assets/token_cross.svg',
  tokenWin: 'assets/token_cross_win.svg',
  result: 0
};

// When playerTurn = 1 it is Player One's turn. When playerTurn = -1 it is Player Two's turn.
let playerTurn = 1;

// Counts for Tie times
let tieResult = 0;

// Starter message
let message = 'Enjoy the game!';

// Token toggle position when 1: highlight on Token Set One; 2 highlight on Token Set Two
let tokenToggle = 1;

// Grid toggle position when 3: highlight on Grid One 3x3; 3 highlight on Grid Two 4x4
let gridToggle = 3;

// Store the block classes to check which player has placed a token into
let blockClassArr = [];

// Store the block img > src to check which player has placed a token into
let blockImageArr = [];

// If the game is over: disable all blocks
let isGameOver = false;

// Check what is the play mode: If it's 1: 1 on 1; If it's 2: vs AI; If it's 3: on line
let playMode = 1;

// Check human's step in vs AI mode
let humanStep = 0;

// Check if Local Storage can be used
let localStorageSaved = true;
// If not available change to false
if (localStorage === undefined) {
  localStorageSaved = false;
}

// For testing & debugging
// localStorage.clear();


/* ----------------------- Everything Starts from Here ---------------------- */

$(document).ready(function () {

  // Declare all blocks. There are two boards:
  // 3x3 board
  const $blockClass1 = $('.block').eq(0);
  const $blockClass2 = $('.block').eq(1);
  const $blockClass3 = $('.block').eq(2);
  const $blockClass4 = $('.block').eq(3);
  const $blockClass5 = $('.block').eq(4);
  const $blockClass6 = $('.block').eq(5);
  const $blockClass7 = $('.block').eq(6);
  const $blockClass8 = $('.block').eq(7);
  const $blockClass9 = $('.block').eq(8);
  // 4x4 board
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


  // Firebase declaration
  var db = firebase.firestore();
  


  /* --------------------------- Reload Local Storage --------------------------- */
  if (localStorageSaved) {
    // Check if the there is data saved in Local Storage
    if (localStorage.playerOne !== undefined) { // Run the code if true
      // Read data from Local Storage
      playerOne = JSON.parse(localStorage.getItem('playerOne'));
      playerTwo = JSON.parse(localStorage.getItem('playerTwo'));
      tieResult = JSON.parse(localStorage.getItem('tieResult'));
      playerTurn = JSON.parse(localStorage.getItem('playerTurn'));
      message = JSON.parse(localStorage.getItem('message'));
      tokenToggle = JSON.parse(localStorage.getItem('tokenToggle'));
      gridToggle = JSON.parse(localStorage.getItem('gridToggle'));
      isGameOver = JSON.parse(localStorage.getItem('isGameOver'));
      playMode = JSON.parse(localStorage.getItem('playMode'));
      humanStep = JSON.parse(localStorage.getItem('humanStep'));
      blockClassArr = JSON.parse(localStorage.getItem('blockClassArr'));
      blockImageArr = JSON.parse(localStorage.getItem('blockImageArr'));
      
      // Check if the saved game is over
      if (isGameOver) {
        // If game over disable all block click
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
      
      // Check if the saved game is Grid One 3x3 or Grid Two 4x4
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

      // Check what mode it is
      // 1 on 1 mode
      if(playMode === 1) {
        $('.mode-one').addClass('set-selected');
        $('.mode-one').siblings().removeClass('set-selected');  
      // vs AI mode
      } else if (playMode === 2) {
        $('.mode-two').addClass('set-selected');
        $('.mode-two').siblings().removeClass('set-selected');  
      // Online game       
      } else if (playMode === 3) {
        $('.mode-three').addClass('set-selected');
        $('.mode-three').siblings().removeClass('set-selected');
      }

      // Load saved game play board.
      for (let i = 0; i < $('.block').length; i++) {
        // Use 'player1' and 'player2' classes to check if this block has been played
        if (blockClassArr[i] === 'player1' || blockClassArr[i] === 'player2') {
          // Show saved class on each block
          $('.block').eq(i).addClass(blockClassArr[i]);
          // Show saved block image src on each block
          $('.block').eq(i).children().attr('src', blockImageArr[i]);
          // Set the played block to clicked bg color
          $('.block').eq(i).css('background', '#454545');
          // Disable cursor pointer
          $('.block').eq(i).css('cursor', 'default');
          // Make the block not clickable
          $('.block').eq(i).css('pointer-events', 'none');;
        }
      }
    }
  }



  /* -------------------------- Player Play Function -------------------------- */

  // There are three play conditions for: 1on1, Ai and online
  const playerPlay = function () {
    // It's for 1 on 1 mode
    if(playMode === 1) {
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
            // Update Player One win result
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
            // Update Player Two win result
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
          // Update tie result
          tieResult += 1;
          // Update the message
          message = 'It is a tie.';
          $('.message h2').text(message);
          gameOver();
        };
        saveGame();
        // Remove Hover and Pointer to inform user the clicked block is not clickable
        $(this).css('cursor', 'default');
        $(this).off('mouseenter mouseleave');
      }
    } else if (playMode === 2) { // Vs AI mode
      // Check if there is already a token. When 'src' empty run place a token
      if ($(this).children().attr('src') === "") {       
        // Place Player One's token image
        $(this).children().attr('src', playerOne.token);
        // Add player1 class to the block
        $(this).addClass('player1');  
        // Update humanStep to call AI step
        humanStep += 1; 
        if (winnerCheck(playerOne, 'player1')) {
          // Make humanStep 0 when player wins
          humanStep = 0;
          // Update tie result
          playerOne.result += 1;
          // Update the message
          message = playerOne.name + ' saved human!!!';
          $('.message h2').text(message);
          // saveGame();
          gameOver();
          // Exit the whole play function
          return;     
        }
        // Save game data if human doesn't win
        saveGame();
        // Remove Hover and Pointer to inform user the clicked block is not clickable
        $(this).css('cursor', 'default');
        $(this).off('mouseenter mouseleave');
      }
      // AI Plays
      // As AI plays the second, it only has four steps. I create each step for AI
      if(humanStep === 1) {
        aiStepOne();
      } else if(humanStep === 2) {
        aiStepTwo();
      } else if(humanStep === 3) {
        aiStepThree();
      } else if(humanStep === 4) {
        aiStepFour();
      } else if(humanStep === 5) {
        // When reach's AI's 'fifth' step means it's a tie
        humanStep = 0;
        // Update tie result
        tieResult += 1;
        // Update the message
        message = 'Human needs you! Play again!';
        $('.message h2').text(message);
        gameOver();  
      }
      saveGame();      
      // For online Mode
    } else if (playMode === 3) {
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
            // Update Player One win result
            playerOne.result += 1;
            // Update the message
            message = playerOne.name + ' wins!';
            $('.message h2').text(message);
            gameOver();
            saveFirebase();
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
            // Update Player Two win result
            playerTwo.result += 1;
            // Update the message
            message = playerTwo.name + ' wins!';
            $('.message h2').text(message);
            gameOver();
            saveFirebase();
            return;
          };
        }
        playerTurn *= (-1); // Change turn to another player
        // Check if it is a tie.
        if (tieCheck(playerOne, 'player1', playerTwo, 'player2')) {
          // Update tie result
          tieResult += 1;
          // Update the message
          message = 'It is a tie.';
          $('.message h2').text(message);
          gameOver();
          saveFirebase();
        };
        saveGame();
        // Remove Hover and Pointer to inform user the clicked block is not clickable
        $(this).css('cursor', 'default');
        $(this).off('mouseenter mouseleave');
        saveFirebase();
      }
    }
  };



  /* --------------------------------- AI PLAY -------------------------------- */
  // For 3 x3 grid, the first 2 steps are much more important. After checking the first two steps AI only needs Attack and Defence. All the other steps will lead to a tie game.
  // AI step one
  const aiStepOne = function() {
    // Clear block class array first as I use arr.push() otherwise the there will be more item than the blocks
    blockClassArr = [];
    // Check current situation on the board(check if the block has 'player1' 'player2');
    blockClassChecker();
    // As a defender AI needs to play on the fifth block first
    // Check the human places token on the fifth block( index = 4 )
    if (blockClassArr[4] === "player1") {
      // If it is occupied place token on the first block
      aiPlay(0); 
      // If not place on the fifth block
    } else if (blockClassArr[4] === "") {
      aiPlay(4); 
    }
  };

  // AI step two
  const aiStepTwo = function() {
    // Clear block class array first as I use arr.push() otherwise the there will be more item than the blocks
    blockClassArr = [];
    blockClassChecker();
    // Some special conditions need to be checked for AI step two
    if (blockClassArr[4] === 'player1' && blockClassArr[8] === 'player1') {
      aiPlay(2); 
    } else if (blockClassArr[0] === 'player1' && blockClassArr[8] === 'player1') {
      aiPlay(1); 
    } else if (blockClassArr[1] === 'player1' && blockClassArr[3] === 'player1') {
      aiPlay(0); 
    } else if (blockClassArr[1] === 'player1' && blockClassArr[5] === 'player1') {
      aiPlay(2);
    } else if (blockClassArr[7] === 'player1' && blockClassArr[5] === 'player1') {
      aiPlay(8);
    } else if (blockClassArr[7] === 'player1' && blockClassArr[3] === 'player1') {
      aiPlay(6);
    } else {
      // AI is not able to win on its second step so only defence
      aiDefence();
    }
  };

  // AI step three
  const aiStepThree = function () {
    // Clear block class array first as I use arr.push() otherwise the there will be more item than the blocks
    blockClassArr = [];
    blockClassChecker();
    // From the third step, AI is able to win. So call aiAttack first
    aiAttack();
    // Check if AI wins or not
    if (winnerCheck(playerTwo, 'player2')) {
      // Update AI win result
      playerTwo.result += 1;
      // Update the message
      message = 'AI controls the world!';
      $('.message h2').text(message);
      // saveGame();
      gameOver();
      return;  
    }
    // If there is no winning block then defence
    aiDefence();
  };
  
  // AI step four
  const aiStepFour = function () {
    // Clear block class array first as I use arr.push() otherwise the there will be more item than the blocks
    blockClassArr = [];
    blockClassChecker();
    aiAttack();
    if (winnerCheck(playerTwo, 'player2')) {
      // Update AI win result
      playerTwo.result += 1;
      // Update the message
      message = 'AI controls the world!';
      $('.message h2').text(message);
      // saveGame();
      gameOver();
      return;  
    }
    aiDefence();
  };


  /* ----------------------------- AI Attack Play ----------------------------- */
  // If there are two AI tokens on a line or diagonal then place token on the other blank block
  const aiAttack = function() {
    // Checking self win block and place token on it
    if (blockClassArr[0] === 'player2' && blockClassArr[1] === 'player2' && blockClassArr[2] === "") {
      aiPlay(2); 
    } else if (blockClassArr[2] === 'player2' && blockClassArr[0] === 'player2' && blockClassArr[1] === "") {
      aiPlay(1); 
    } else if (blockClassArr[1] === 'player2' && blockClassArr[2] === 'player2' && blockClassArr[0] === "") {
      aiPlay(0);
    } else if (blockClassArr[3] === 'player2' && blockClassArr[4] === 'player2' && blockClassArr[5] === "") {
      aiPlay(5);
    } else if (blockClassArr[5] === 'player2' && blockClassArr[3] === 'player2' && blockClassArr[4] === "") {
      aiPlay(4);
    } else if (blockClassArr[4] === 'player2' && blockClassArr[5] === 'player2' && blockClassArr[3] === "") {
      aiPlay(3);
    } else if (blockClassArr[6] === 'player2' && blockClassArr[7] === 'player2' && blockClassArr[8] === "") {
      aiPlay(8);
    } else if (blockClassArr[8] === 'player2' && blockClassArr[6] === 'player2' && blockClassArr[7] === "") {
      aiPlay(7);
    } else if (blockClassArr[7] === 'player2' && blockClassArr[8] === 'player2' && blockClassArr[6] === "") {
      aiPlay(6);
    } else if (blockClassArr[0] === 'player2' && blockClassArr[3] === 'player2' && blockClassArr[6] === "") {
      aiPlay(6);
    } else if (blockClassArr[6] === 'player2' && blockClassArr[0] === 'player2' && blockClassArr[3] === "") {
      aiPlay(3);
    } else if (blockClassArr[3] === 'player2' && blockClassArr[6] === 'player2' && blockClassArr[0] === "") {
      aiPlay(0);
    } else if (blockClassArr[1] === 'player2' && blockClassArr[4] === 'player2' && blockClassArr[7] === "") {
      aiPlay(7);
    } else if (blockClassArr[7] === 'player2' && blockClassArr[1] === 'player2' && blockClassArr[4] === "") {
      aiPlay(4);
    } else if (blockClassArr[4] === 'player2' && blockClassArr[7] === 'player2' && blockClassArr[1] === "") {
      aiPlay(1);
    } else if (blockClassArr[2] === 'player2' && blockClassArr[5] === 'player2' && blockClassArr[8] === "") {
      aiPlay(8);
    } else if (blockClassArr[8] === 'player2' && blockClassArr[2] === 'player2' && blockClassArr[5] === "") {
      aiPlay(5);
    } else if (blockClassArr[5] === 'player2' && blockClassArr[8] === 'player2' && blockClassArr[2] === "") {
      aiPlay(2);
    } else if (blockClassArr[0] === 'player2' && blockClassArr[4] === 'player2' && blockClassArr[8] === "") {
      aiPlay(8);
    } else if (blockClassArr[8] === 'player2' && blockClassArr[0] === 'player2' && blockClassArr[4] === "") {
      aiPlay(4);
    } else if (blockClassArr[4] === 'player2' && blockClassArr[8] === 'player2' && blockClassArr[0] === "") {
      aiPlay(0);
    } else if (blockClassArr[2] === 'player2' && blockClassArr[4] === 'player2' && blockClassArr[6] === "") {
      aiPlay(6);
    } else if (blockClassArr[6] === 'player2' && blockClassArr[2] === 'player2' && blockClassArr[4] === "") {
      aiPlay(4);
    } else if (blockClassArr[4] === 'player2' && blockClassArr[6] === 'player2' && blockClassArr[2] === "") {
      aiPlay(2);
    }
  };


  /* ----------------------------- AI Defence Play ---------------------------- */
  // If there are two Human tokens on a line or diagonal then place token on the other blank block
  const aiDefence = function() {
    // Checking player win block and place token on it
    if (blockClassArr[0] === 'player1' && blockClassArr[1] === 'player1' && blockClassArr[2] === "") {
      aiPlay(2); 
    } else if (blockClassArr[2] === 'player1' && blockClassArr[0] === 'player1' && blockClassArr[1] === "") {
      aiPlay(1); 
    } else if (blockClassArr[1] === 'player1' && blockClassArr[2] === 'player1' && blockClassArr[0] === "") {
      aiPlay(0);
    } else if (blockClassArr[3] === 'player1' && blockClassArr[4] === 'player1' && blockClassArr[5] === "") {
      aiPlay(5);
    } else if (blockClassArr[5] === 'player1' && blockClassArr[3] === 'player1' && blockClassArr[4] === "") {
      aiPlay(4);
    } else if (blockClassArr[4] === 'player1' && blockClassArr[5] === 'player1' && blockClassArr[3] === "") {
      aiPlay(3);
    } else if (blockClassArr[6] === 'player1' && blockClassArr[7] === 'player1' && blockClassArr[8] === "") {
      aiPlay(8);
    } else if (blockClassArr[8] === 'player1' && blockClassArr[6] === 'player1' && blockClassArr[7] === "") {
      aiPlay(7);
    } else if (blockClassArr[7] === 'player1' && blockClassArr[8] === 'player1' && blockClassArr[6] === "") {
      aiPlay(6);
    } else if (blockClassArr[0] === 'player1' && blockClassArr[3] === 'player1' && blockClassArr[6] === "") {
      aiPlay(6);
    } else if (blockClassArr[6] === 'player1' && blockClassArr[0] === 'player1' && blockClassArr[3] === "") {
      aiPlay(3);
    } else if (blockClassArr[3] === 'player1' && blockClassArr[6] === 'player1' && blockClassArr[0] === "") {
      aiPlay(0);
    } else if (blockClassArr[1] === 'player1' && blockClassArr[4] === 'player1' && blockClassArr[7] === "") {
      aiPlay(7);
    } else if (blockClassArr[7] === 'player1' && blockClassArr[1] === 'player1' && blockClassArr[4] === "") {
      aiPlay(4);
    } else if (blockClassArr[4] === 'player1' && blockClassArr[7] === 'player1' && blockClassArr[1] === "") {
      aiPlay(1);
    } else if (blockClassArr[2] === 'player1' && blockClassArr[5] === 'player1' && blockClassArr[8] === "") {
      aiPlay(8);
    } else if (blockClassArr[8] === 'player1' && blockClassArr[2] === 'player1' && blockClassArr[5] === "") {
      aiPlay(5);
    } else if (blockClassArr[5] === 'player1' && blockClassArr[8] === 'player1' && blockClassArr[2] === "") {
      aiPlay(2);
    } else if (blockClassArr[0] === 'player1' && blockClassArr[4] === 'player1' && blockClassArr[8] === "") {
      aiPlay(8);
    } else if (blockClassArr[8] === 'player1' && blockClassArr[0] === 'player1' && blockClassArr[4] === "") {
      aiPlay(4);
    } else if (blockClassArr[4] === 'player1' && blockClassArr[8] === 'player1' && blockClassArr[0] === "") {
      aiPlay(0);
    } else if (blockClassArr[2] === 'player1' && blockClassArr[4] === 'player1' && blockClassArr[6] === "") {
      aiPlay(6);
    } else if (blockClassArr[6] === 'player1' && blockClassArr[2] === 'player1' && blockClassArr[4] === "") {
      aiPlay(4);
    } else if (blockClassArr[4] === 'player1' && blockClassArr[6] === 'player1' && blockClassArr[2] === "") {
      aiPlay(2);
    } else {
      aiRandom();
    }
  };


  /* ----------------------------- AI Random Play ----------------------------- */
  // Just plays on the first blank block because AI knows it's already a tie game
  const aiRandom = function () {
    // AI knowns it's already a tie...
    for(let i = 0; i < 9; i++) {
      // Just fill the first blank block
      if (blockClassArr[i] === "") {
        aiPlay(i);
        return;
      }
    }
  };


  /* ----------------------------- AI place token; ---------------------------- */

  const aiPlay = function(num) {
    // Add class 
    $('.block').eq(num).addClass('player2');
    // Add image
    $('.block').eq(num).children().attr('src', playerTwo.token);
    // Update block background
    $('.block').eq(num).css('background', '#454545');
    $('.block').eq(num).css('cursor', 'default');
    $('.block').eq(num).off('mouseenter mouseleave'); 
  }


  /* -------------------------- Winner  Check ------------------------- */
  // VERY LONG CODE! Just check every possible winner conditions
  const winnerCheck = function (playerNumber, className) {

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
      } else if ($blockClass10.hasClass(className) && $blockClass14.hasClass(className) && $blockClass18.hasClass(className) && $blockClass22.hasClass(className)) {
        $blockClass10.children().attr('src', playerNumber.tokenWin);
        $blockClass14.children().attr('src', playerNumber.tokenWin);
        $blockClass18.children().attr('src', playerNumber.tokenWin);
        $blockClass22.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass11.hasClass(className) && $blockClass15.hasClass(className) && $blockClass19.hasClass(className) && $blockClass23.hasClass(className)) {
        $blockClass11.children().attr('src', playerNumber.tokenWin);
        $blockClass15.children().attr('src', playerNumber.tokenWin);
        $blockClass19.children().attr('src', playerNumber.tokenWin);
        $blockClass23.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass12.hasClass(className) && $blockClass16.hasClass(className) && $blockClass20.hasClass(className) && $blockClass24.hasClass(className)) {
        $blockClass12.children().attr('src', playerNumber.tokenWin);
        $blockClass16.children().attr('src', playerNumber.tokenWin);
        $blockClass20.children().attr('src', playerNumber.tokenWin);
        $blockClass24.children().attr('src', playerNumber.tokenWin);
        return true;
      } else if ($blockClass13.hasClass(className) && $blockClass17.hasClass(className) && $blockClass21.hasClass(className) && $blockClass25.hasClass(className)) {
        $blockClass13.children().attr('src', playerNumber.tokenWin);
        $blockClass17.children().attr('src', playerNumber.tokenWin);
        $blockClass21.children().attr('src', playerNumber.tokenWin);
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
    // blockClassArr now has all blocks class in an order
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
    // blockClassArr now has all blocks token images in an order
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
  };

  const hideMenu = function () {
    $('.menu-container').height('0%');
  }


  /* ------------------------------ Change Tokens ----------------------------- */

  const changeToTokenSetOne = function () {
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    // Update token imgs in playerOne and playerTwo arrays
    playerOne.token = 'assets/token_circle.svg';
    playerOne.tokenWin = 'assets/token_circle_win.svg';
    playerTwo.token = 'assets/token_cross.svg';
    playerTwo.tokenWin = 'assets/token_cross_win.svg';
    tokenToggle = 1;
    restartGame();
    saveGame();
    saveFirebase();
  }

  const changeToTokenSetTwo = function () {
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    // Update token imgs in playerOne and playerTwo arrays
    playerOne.token = 'assets/token_bone.svg';
    playerOne.tokenWin = 'assets/token_bone_win.svg';
    playerTwo.token = 'assets/token_fish.svg';
    playerTwo.tokenWin = 'assets/token_fish_win.svg';
    tokenToggle = 2;
    restartGame();
    saveGame();
    saveFirebase();
  }


  /* ------------------------------- Change Grid ------------------------------ */

  const changeToGridOne = function () {
    restartGame();
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    // Show Grid One 3x3, hide Grid One 4x4
    $('.container-one').css('display', 'block');
    $('.container-two').css('display', 'none');
    gridToggle = 3;
    saveGame();
    saveFirebase();
  }

  const changeToGridTwo = function () {
    restartGame();
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    // Hide Grid One 3x3, show Grid One 4x4
    $('.container-one').css('display', 'none');
    $('.container-two').css('display', 'block');
    gridToggle = 4;
    saveGame();
    saveFirebase();
  }

  /* ---------------------------- Change Play Mode ---------------------------- */

  const changeToOneOnOne = function() {
    // When change play mode everything should be reset
    localStorage.clear();
    newGame();
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    playMode = 1;
    saveFirebase();

  };

  const changeToVsRobot = function() {
    // When change play mode everything should be reset
    localStorage.clear();
    newGame();
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    playMode = 2;
    playerTwo.name = 'AI';
    $('.player-two-result').text(playerTwo.name);
    // Update the message
    message = 'Save human!!!';
    $('.message h2').text(message); 
    saveFirebase();
  };

  const changeToOnline = function () {
    // When change play mode everything should be reset
    localStorage.clear();
    newGame();
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    playMode = 3;
    playerTwo.name = 'Player Two';
    $('.player-two-result').text(playerTwo.name);
    saveGame();
    saveFirebase();
    // Show Copy URL modal
    $('.online-modal-background').height('100%');
  };


  /* -------------------------------- Copy Url -------------------------------- */

  const copyUrl = function() {
    $('.online-modal-background').height('0%');
    // Copy url to clipboard
    let $temp = $('<input>');
    $("body").append($temp);
    $temp.val($('.url-address').text()).select();
    document.execCommand("copy");
    $temp.remove();
  };

  /* ---------------------------- Restart The Game ---------------------------- */

  const restartGame = function () {
    // Clear all blocks img 
    $('.block').children().attr('src', '');
    // Clear all blocks class
    $('.block').removeClass('player1').removeClass('player2');
    // Enable click event
    $('.block').css('pointer-events', 'auto');
    // Enable hover event
    $('.block').hover(blockMouseEnter, blockMouseLeave);
    $('.block').css('background', '#292929');
    $('.block').css('cursor', 'pointer');
    message = 'Enjoy the game!';
    $('.message h2').text(message);
    playerTurn = 1;
    isGameOver = false;
    humanStep = 0;
    blockClassArr = [];
    blockImageArr = [];
    saveGame();
    saveFirebase();
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
    humanStep = 0; 
    hideMenu();
    $('.player-one-result').text(playerOne.name);
    $('.player-two-result').text(playerTwo.name);
    $('.player-one-result-number').text(playerOne.result);
    $('.player-two-result-number').text(playerTwo.result);
    $('.tie-result-number').text(tieResult);
    localStorage.clear();
    saveFirebase();
  };

  /* ------------------------------ Game Over ----------------------------- */

  const gameOver = function () {
    // Show players counts
    $('.player-one-result-number').text(playerOne.result);
    $('.player-two-result-number').text(playerTwo.result);
    $('.tie-result-number').text(tieResult);
    // Make all blocks not clickable
    $('.block').css('pointer-events', 'none');
    // Remove hover effect
    $('.block').off('mouseenter mouseleave');
    // Remove pointer effect
    $('.block').css('cursor', 'default');
    // Change turn to Player One.
    isGameOver = true;
    playerTurn = 1;
    humanStep = 0;
    saveGame();
  };

  /* -------------------------------- Save Game for Local Storage ------------------------------- */

  const saveGame = function () {
    // Clear previous array
    blockClassArr = [];
    // Save current block classes into blockClassArr
    blockClassChecker();
    // Clear previous array
    blockImageArr = [];
    // Save current block images into blockImageChecker
    blockImageChecker();
    localStorage.setItem('playerOne', JSON.stringify(playerOne));
    localStorage.setItem('playerTwo', JSON.stringify(playerTwo));
    localStorage.setItem('tieResult', JSON.stringify(tieResult));
    localStorage.setItem('playerTurn', JSON.stringify(playerTurn));
    localStorage.setItem('message', JSON.stringify(message));
    localStorage.setItem('tokenToggle', JSON.stringify(tokenToggle));
    localStorage.setItem('gridToggle', JSON.stringify(gridToggle));
    localStorage.setItem('isGameOver', JSON.stringify(isGameOver));
    localStorage.setItem('playMode', JSON.stringify(playMode));
    localStorage.setItem('humanStep', JSON.stringify(humanStep));
    localStorage.setItem('blockClassArr', JSON.stringify(blockClassArr));
    localStorage.setItem('blockImageArr', JSON.stringify(blockImageArr));
  };


  /* -------------------------- Save Data to Firebase ------------------------- */

  const saveFirebase = function() {
    // Save playerOne to Firebase collection: gameData > document: playerOne 
    db.collection("gameData").doc('playerOne').set(playerOne);
    // Save playerTwo to Firebase collection: gameData > document: playerTwo 
    db.collection("gameData").doc('playerTwo').set(playerTwo);
    // Save current status to Firebase collection: gameData > document: playStatus (Firebase Firestore only accepts object?) 
    db.collection("gameData").doc('playStatus').set({
      playMode: playMode,
      tieResult: tieResult,
      playerTurn: playerTurn,
      message: message,
      tokenToggle: tokenToggle,
      gridToggle: gridToggle,
      isGameOver: isGameOver
    })
    // Clear the array first as I use array.push()
    blockClassArr = [];
    blockClassChecker();
    blockImageArr = [];
    blockImageChecker();
    // Save current block status to Firebase collection: gameData > document: blockStatus (Firebase Firestore only accepts object?) 
    db.collection("gameData").doc('blockStatus').set({
      blockClassArr: blockClassArr,
      blockImageArr: blockImageArr
    })
  };



  /* ------------------------ Firebase Realtime Updates ----------------------- */

  // It runs all the time as long as the data snapshot changes
  db.collection('gameData').onSnapshot(snapshot => {
    // But only make it realtime update when playMode === 3 which is online game mode
    db.collection('gameData').doc('playStatus').get().then(function(doc) {
      if(doc.data().playMode === 3) {
        // Retrieve playerOne data from Firebase
        db.collection('gameData').doc('playerOne').get().then(function (doc) {
          playerOne = doc.data();
          $('.player-one-result').text(playerOne.name);
          $('.player-one-result-number').text(playerOne.result);
        });
        // Retrieve playerTwo data from Firebase
        db.collection('gameData').doc('playerTwo').get().then(function (doc) {
          playerTwo = doc.data();
          $('.player-two-result').text(playerTwo.name);
          $('.player-two-result-number').text(playerTwo.result);
        });
        // Retrieve playStatus data from Firebase
        db.collection('gameData').doc('playStatus').get().then(function (doc) {
          const playStatus = doc.data();
          gridToggle = playStatus.gridToggle;
          tieResult = playStatus.tieResult;
          message = playStatus.message;
          playMode = playStatus.playMode;
          playerTurn = playStatus.playerTurn;
          tokenToggle = playStatus.tokenToggle;
          isGameOver = playStatus.isGameOver;

          /* -------------------------- Update user interface ------------------------- */

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
          // Check if the saved game is over to disable the block
          if (isGameOver) {
            // If game over disable all block click
            $('.block').css('pointer-events', 'none');
            // Remove pointer effect
            $('.block').css('cursor', 'default');
          }
          // Check if the play board is 3x3 or 4x4
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
        });
        // Update play board
        db.collection('gameData').doc('blockStatus').get().then(function (doc) {
          const blockStatus = doc.data();
          // Update block class
          blockClassArr = blockStatus.blockClassArr;
          // Variable to check how many blocks don't have class on Firebase. When no block has class clear update the play board
          let blankClassBlock = 0;
          for (let i = 0; i < $('.block').length; i++) {
            // Use 'player1' and 'player2' classes to check if this block has been played
            if (blockClassArr[i] === 'player1' || blockClassArr[i] === 'player2') {
              // Show saved class on each block
              $('.block').eq(i).addClass(blockClassArr[i]);
              // Set the played block to clicked bg color
              $('.block').eq(i).css('background', '#454545');
              // Disable cursor pointer
              $('.block').eq(i).css('cursor', 'default');
              // Make the block not clickable
              $('.block').eq(i).css('pointer-events', 'none');;
            } else if(blockClassArr[i] === '' ) {
              blankClassBlock += 1;
            }
            // No block has class, reset the play board
            if (blankClassBlock === $('.block').length) {
              $('.block').removeClass('player1').removeClass('player2');
              // Enable click event
              $('.block').css('pointer-events', 'auto');
              // Enable hover event
              $('.block').hover(blockMouseEnter, blockMouseLeave);
              $('.block').css('background', '#292929');
              $('.block').css('cursor', 'pointer');
              blankClassBlock = 0;
            }
          }
          blockImageArr = blockStatus.blockImageArr;
          // Variable to check how many blocks don't have token images on Firebase. When no block has class clear update the play board
          let blankImageBlock = 0;
          for (let i = 0; i < $('.block').length; i++) {
            // Use '' classes to check if this block has been played
            if (!(blockImageArr[i] === '')) {
              // Show saved block image src on each block
              $('.block').eq(i).children().attr('src', blockImageArr[i]);
            } else if (blockImageArr[i] === '') {
              blankImageBlock += 1;
              console.log(blankImageBlock);
            }
            // No block has image, reset the play board
            if (blankImageBlock === $('.block').length) {
              $('.block').children().attr('src', '');
              blankImageBlock = 0;
            }
          }  
        });
      }
    });
  });
  


  /* ------------------------------- Clear data on Firebase ------------------------------- */

  const clearFirebase = function() {
    db.collection("gameData").doc('playerOne').delete();
    db.collection("gameData").doc('playerTwo').delete();
    db.collection("gameData").doc('playStatus').delete();
    db.collection("gameData").doc('blockStatus').delete();
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


  $('.mode-one').on('click', changeToOneOnOne);


  $('.mode-two').on('click', changeToVsRobot);
  

  $('.mode-three').on('click', changeToOnline);
  

  $('.new-game').on('click', newGame);

 
  $('.copy-url-button').on('click', copyUrl);

});
