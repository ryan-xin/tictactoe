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

// Check human's step in vs AI mode. Only did for 3x3
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
  var auth = firebase.auth();
  var db = firebase.firestore();
  const onlineState = {
    user: null,
    roomId: null,
    room: null,
    playerSlot: null,
    unsubscribe: null,
    isApplyingRemote: false
  };
  const onlineAuthReady = new Promise(function(resolve) {
    auth.onAuthStateChanged(function(user) {
      onlineState.user = user;
      if (user) {
        resolve(user);
      }
    });
  });

  auth.signInAnonymously().catch(function(error) {
    message = 'Online mode needs anonymous Firebase Auth.';
    $('.message h2').text(message);
    console.error('Firebase anonymous auth failed:', error);
  });

  const getRoomIdFromUrl = function() {
    return new URLSearchParams(window.location.search).get('game');
  };

  const getRoomUrl = function(roomId) {
    const url = new URL(window.location.href);
    url.searchParams.set('game', roomId);
    return url.toString();
  };

  const setRoomIdInUrl = function(roomId) {
    const roomUrl = getRoomUrl(roomId);
    window.history.replaceState({}, '', roomUrl);
    $('.url-address').text(roomUrl);
  };

  const clearRoomIdFromUrl = function() {
    const url = new URL(window.location.href);
    url.searchParams.delete('game');
    window.history.replaceState({}, '', url.toString());
    $('.url-address').text('ryan-xin.github.io/tictactoe/');
  };

  const setOnlineModeControls = function(isOnline) {
    if (isOnline) {
      $('.mode-one, .mode-two').addClass('mode-disabled');
      $('.mode-one h2, .mode-two h2').addClass('disabled-button');
      $('.leave-online').css('display', 'block');
    } else {
      $('.mode-one, .mode-two').removeClass('mode-disabled');
      $('.mode-one h2, .mode-two h2').removeClass('disabled-button');
      $('.leave-online').css('display', 'none');
    }
  };

  const getBoardClassMap = function() {
    const board = {};
    for (let i = 0; i < $('.block').length; i++) {
      if ($('.block').eq(i).hasClass('player1')) {
        board['c' + i] = 'player1';
      } else if ($('.block').eq(i).hasClass('player2')) {
        board['c' + i] = 'player2';
      } else {
        board['c' + i] = '';
      }
    }
    return board;
  };

  const getBoardArrayFromMap = function(board) {
    const boardArray = [];
    for (let i = 0; i < $('.block').length; i++) {
      boardArray.push(board && board['c' + i] ? board['c' + i] : '');
    }
    return boardArray;
  };

  const getWinningCellIndexes = function(board) {
    const boardArray = getBoardArrayFromMap(board);
    const offset = gridToggle === 3 ? 0 : 9;
    const lines = getWinLines(gridToggle);
    for (let i = 0; i < lines.length; i++) {
      const firstCell = boardArray[offset + lines[i][0]];
      if (firstCell === '') {
        continue;
      }
      if (lines[i].every(function(cell) { return boardArray[offset + cell] === firstCell; })) {
        return lines[i].map(function(cell) { return offset + cell; });
      }
    }
    return [];
  };

  const getOnlinePlayerSlot = function(room) {
    if (!onlineState.user || !room || !room.players) {
      return null;
    }
    if (room.players.player1 === onlineState.user.uid) {
      return 'player1';
    }
    if (room.players.player2 === onlineState.user.uid) {
      return 'player2';
    }
    return null;
  };

  const getUidForPlayerTurn = function(turn, room) {
    if (!room || !room.players) {
      return null;
    }
    return turn === 1 ? room.players.player1 : room.players.player2;
  };

  const getChangedBoardCells = function(previousBoard, nextBoard) {
    const changedCells = [];
    for (let i = 0; i < $('.block').length; i++) {
      const cell = 'c' + i;
      const previousValue = previousBoard && previousBoard[cell] ? previousBoard[cell] : '';
      const nextValue = nextBoard && nextBoard[cell] ? nextBoard[cell] : '';
      if (previousValue !== nextValue) {
        changedCells.push(cell);
      }
    }
    return changedCells;
  };

  const isEmptyBoardMap = function(board) {
    for (let i = 0; i < $('.block').length; i++) {
      if (board && board['c' + i]) {
        return false;
      }
    }
    return true;
  };

  const getWinnerClassFromBoard = function(board) {
    const boardArray = getBoardArrayFromMap(board);
    const offset = gridToggle === 3 ? 0 : 9;
    const lines = getWinLines(gridToggle);
    for (let i = 0; i < lines.length; i++) {
      const firstCell = boardArray[offset + lines[i][0]];
      if (firstCell === '') {
        continue;
      }
      if (lines[i].every(function(cell) { return boardArray[offset + cell] === firstCell; })) {
        return firstCell;
      }
    }
    return '';
  };

  const getWinnerUidFromBoard = function(board, room) {
    const winnerClass = getWinnerClassFromBoard(board);
    if (!room || !room.players || winnerClass === '') {
      return null;
    }
    return winnerClass === 'player1' ? room.players.player1 : room.players.player2;
  };

  const getOnlineDisplayName = function(defaultName) {
    const savedName = localStorage.getItem('onlineDisplayName');
    if (savedName) {
      return savedName;
    }
    const enteredName = window.prompt('Display name for this online room:', defaultName);
    const displayName = enteredName && enteredName.trim() ? enteredName.trim().slice(0, 24) : defaultName;
    localStorage.setItem('onlineDisplayName', displayName);
    return displayName;
  };

  const getRoomOptions = function() {
    return {
      tokenToggle: tokenToggle,
      gridToggle: gridToggle,
      playerOneToken: playerOne.token,
      playerOneTokenWin: playerOne.tokenWin,
      playerTwoToken: playerTwo.token,
      playerTwoTokenWin: playerTwo.tokenWin
    };
  };

  const applyRoomOptions = function(options) {
    if (!options) {
      return;
    }
    tokenToggle = options.tokenToggle;
    gridToggle = options.gridToggle;
    playerOne.token = options.playerOneToken;
    playerOne.tokenWin = options.playerOneTokenWin;
    playerTwo.token = options.playerTwoToken;
    playerTwo.tokenWin = options.playerTwoTokenWin;
  };

  const canCurrentOnlinePlayerMove = function(room) {
    const currentRoom = room || onlineState.room;
    return playMode === 3 &&
      onlineState.user &&
      currentRoom &&
      getOnlinePlayerSlot(currentRoom) !== null &&
      currentRoom.status === 'active' &&
      currentRoom.currentTurnUid === onlineState.user.uid &&
      !isGameOver;
  };

  const applyRoomBoard = function(board) {
    const winningCells = getWinningCellIndexes(board);
    for (let i = 0; i < $('.block').length; i++) {
      const blockClass = board && board['c' + i] ? board['c' + i] : '';
      const $block = $('.block').eq(i);
      $block.removeClass('player1').removeClass('player2');
      if (blockClass === 'player1') {
        $block.addClass('player1');
        $block.children().attr('src', winningCells.includes(i) ? playerOne.tokenWin : playerOne.token);
        $block.css('background', '#454545');
        $block.css('cursor', 'default');
      } else if (blockClass === 'player2') {
        $block.addClass('player2');
        $block.children().attr('src', winningCells.includes(i) ? playerTwo.tokenWin : playerTwo.token);
        $block.css('background', '#454545');
        $block.css('cursor', 'default');
      } else {
        $block.children().attr('src', '');
        $block.css('background', '#292929');
        $block.css('cursor', 'pointer');
      }
    }
  };

  const updateOnlineInteractivity = function(room) {
    const canMove = canCurrentOnlinePlayerMove(room);
    for (let i = 0; i < $('.block').length; i++) {
      const $block = $('.block').eq(i);
      if ($block.children().attr('src') === '' && canMove) {
        $block.css('pointer-events', 'auto');
        $block.css('cursor', 'pointer');
      } else {
        $block.css('pointer-events', 'none');
        if ($block.children().attr('src') !== '') {
          $block.css('cursor', 'default');
        }
      }
    }
  };

  const showOnlineRoomMessage = function(room) {
    const slot = getOnlinePlayerSlot(room);
    if (slot === null && room && room.players && room.players.player2) {
      message = 'This online room is full.';
    } else if (room && room.status === 'waiting') {
      message = 'Waiting for Player Two to join.';
    } else if (room && room.status === 'finished') {
      message = room.playStatus && room.playStatus.message ? room.playStatus.message : 'Round finished.';
    } else if (canCurrentOnlinePlayerMove(room)) {
      message = 'It is your turn.';
    } else {
      message = 'Waiting for the other player.';
    }
    $('.message h2').text(message);
  };

  const applyOnlineRoom = function(room) {
    if (!room) {
      return;
    }
    onlineState.isApplyingRemote = true;
    onlineState.room = room;
    onlineState.playerSlot = getOnlinePlayerSlot(room);

    applyRoomOptions(room.options);
    if (room.displayNames) {
      playerOne.name = room.displayNames.player1 || playerOne.name;
      playerTwo.name = room.displayNames.player2 || playerTwo.name;
    }
    if (room.scores) {
      playerOne.result = room.scores.player1;
      playerTwo.result = room.scores.player2;
      tieResult = room.scores.ties;
    }
    if (room.playStatus) {
      gridToggle = room.playStatus.gridToggle;
      tieResult = room.scores ? room.scores.ties : room.playStatus.tieResult;
      playerTurn = room.playStatus.playerTurn;
      tokenToggle = room.playStatus.tokenToggle;
      isGameOver = room.playStatus.isGameOver;
      message = room.playStatus.message;
    }

    $('.player-one-result').text(playerOne.name);
    $('.player-two-result').text(playerTwo.name);
    $('.player-one-result-number').text(playerOne.result);
    $('.player-two-result-number').text(playerTwo.result);
    $('.tie-result-number').text(tieResult);

    if (tokenToggle === 1) {
      $('.token-set-one').addClass('set-selected');
      $('.token-set-two').removeClass('set-selected');
    } else if (tokenToggle === 2) {
      $('.token-set-two').addClass('set-selected');
      $('.token-set-one').removeClass('set-selected');
    }

    if (gridToggle === 3) {
      $('.container-one').css('display', 'block');
      $('.container-two').css('display', 'none');
      $('.grid-one').addClass('set-selected');
      $('.grid-two').removeClass('set-selected');
    } else if (gridToggle === 4) {
      $('.container-one').css('display', 'none');
      $('.container-two').css('display', 'block');
      $('.grid-one').removeClass('set-selected');
      $('.grid-two').addClass('set-selected');
    }

    applyRoomBoard(room.board);
    showOnlineRoomMessage(room);
    updateOnlineInteractivity(room);
    onlineState.isApplyingRemote = false;
  };

  const buildOnlineRoomData = function(status) {
    const currentRoom = onlineState.room || {};
    const players = currentRoom.players || {};
    const board = getBoardClassMap();
    const currentTurnUid = isGameOver ? null : getUidForPlayerTurn(playerTurn, currentRoom);
    return {
      players: players,
      displayNames: currentRoom.displayNames || {
        player1: playerOne.name,
        player2: playerTwo.name
      },
      options: getRoomOptions(),
      scores: {
        player1: playerOne.result,
        player2: playerTwo.result,
        ties: tieResult
      },
      playStatus: {
        playMode: playMode,
        tieResult: tieResult,
        playerTurn: playerTurn,
        message: message,
        tokenToggle: tokenToggle,
        gridToggle: gridToggle,
        isGameOver: isGameOver
      },
      board: board,
      currentTurnUid: currentTurnUid,
      status: status,
      winnerUid: getWinnerUidFromBoard(board, currentRoom),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
  };

  const prepareFirstPlayerRoom = function(user) {
    playerOne.name = getOnlineDisplayName('Player One');
    onlineState.room = {
      players: {
        player1: user.uid,
        player2: null
      },
      displayNames: {
        player1: playerOne.name,
        player2: 'Player Two'
      },
      options: getRoomOptions()
    };
  };

  const buildOnlineRoomUpdate = function(room) {
    const board = getBoardClassMap();
    const currentTurnUid = isGameOver ? null : getUidForPlayerTurn(playerTurn, room);
    const hasSecondPlayer = !!(room.players && room.players.player2);
    const status = isGameOver ? 'finished' : (hasSecondPlayer ? 'active' : 'waiting');
    return {
      board: board,
      currentTurnUid: currentTurnUid,
      status: status,
      winnerUid: getWinnerUidFromBoard(board, room),
      scores: {
        player1: playerOne.result,
        player2: playerTwo.result,
        ties: tieResult
      },
      options: getRoomOptions(),
      playStatus: {
        playMode: playMode,
        tieResult: tieResult,
        playerTurn: playerTurn,
        message: message,
        tokenToggle: tokenToggle,
        gridToggle: gridToggle,
        isGameOver: isGameOver
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
  };

  const isAllowedOnlineRoomUpdate = function(room, updateData) {
    const slot = getOnlinePlayerSlot(room);
    const changedCells = getChangedBoardCells(room.board, updateData.board);
    const isReset = isEmptyBoardMap(updateData.board);
    const isOptionOnly = changedCells.length === 0 && !room.playStatus.isGameOver;
    const isLegalMove = changedCells.length === 1 &&
      room.board[changedCells[0]] === '' &&
      updateData.board[changedCells[0]] === slot &&
      room.currentTurnUid === onlineState.user.uid;
    return slot !== null && (isLegalMove || isReset || isOptionOnly);
  };

  const startRoomListener = function(roomId) {
    if (onlineState.unsubscribe) {
      onlineState.unsubscribe();
    }
    onlineState.roomId = roomId;
    onlineState.unsubscribe = db.collection('games').doc(roomId).onSnapshot(function(doc) {
      if (!doc.exists) {
        message = 'Online room was not found.';
        $('.message h2').text(message);
        return;
      }
      applyOnlineRoom(doc.data());
    }, function(error) {
      message = 'Could not load online room.';
      $('.message h2').text(message);
      console.error('Online room listener failed:', error);
    });
  };

  const stopOnlineRoom = function() {
    if (onlineState.unsubscribe) {
      onlineState.unsubscribe();
    }
    onlineState.roomId = null;
    onlineState.room = null;
    onlineState.playerSlot = null;
    onlineState.unsubscribe = null;
  };

  const leaveOnlineRoom = function() {
    stopOnlineRoom();
    clearRoomIdFromUrl();
    localStorage.clear();
    playMode = 1;
    playerOne.name = 'Player One';
    playerTwo.name = 'Player Two';
    newGame();
    $('.mode-one').addClass('set-selected');
    $('.mode-one').siblings().removeClass('set-selected');
    setOnlineModeControls(false);
    message = 'Enjoy the game!';
    $('.message h2').text(message);
    hideMenu();
  };

  const createOnlineRoom = function(user) {
    const roomRef = db.collection('games').doc();
    onlineState.roomId = roomRef.id;
    prepareFirstPlayerRoom(user);
    const roomData = buildOnlineRoomData('waiting');
    roomData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    roomData.currentTurnUid = user.uid;
    return roomRef.set(roomData).then(function() {
      setRoomIdInUrl(roomRef.id);
      startRoomListener(roomRef.id);
      $('.online-modal-background').height('100%');
    });
  };

  const joinOnlineRoom = function(roomId, user) {
    const roomRef = db.collection('games').doc(roomId);
    return db.runTransaction(function(transaction) {
      return transaction.get(roomRef).then(function(doc) {
        if (!doc.exists) {
          onlineState.roomId = roomId;
          prepareFirstPlayerRoom(user);
          const roomData = buildOnlineRoomData('waiting');
          roomData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          roomData.currentTurnUid = user.uid;
          transaction.set(roomRef, roomData);
          return;
        }
        const room = doc.data();
        if (room.players.player1 === user.uid || room.players.player2 === user.uid) {
          return;
        }
        if (!room.players.player2) {
          const displayName = getOnlineDisplayName('Player Two');
          transaction.update(roomRef, {
            'players.player2': user.uid,
            'displayNames.player2': displayName,
            status: 'active',
            currentTurnUid: room.players.player1,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      });
    }).then(function() {
      setRoomIdInUrl(roomId);
      startRoomListener(roomId);
    });
  };

  const startOnlineMode = function() {
    onlineAuthReady.then(function(user) {
      const roomId = getRoomIdFromUrl();
      if (roomId) {
        return joinOnlineRoom(roomId, user);
      }
      return createOnlineRoom(user);
    }).catch(function(error) {
      message = 'Could not start online mode.';
      $('.message h2').text(message);
      console.error('Online mode failed:', error);
    });
  };
  


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
      
      // Update UI
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
        setOnlineModeControls(false);
      // vs AI mode
      } else if (playMode === 2) {
        $('.mode-two').addClass('set-selected');
        $('.mode-two').siblings().removeClass('set-selected');  
        setOnlineModeControls(false);
      // Online game       
      } else if (playMode === 3) {
        $('.mode-three').addClass('set-selected');
        $('.mode-three').siblings().removeClass('set-selected');
        setOnlineModeControls(true);
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
        // Remove Hover and Pointer to inform user the clicked block is not clickable
        $(this).css('cursor', 'default');
        $(this).off('mouseenter mouseleave');

        if (tieCheck(playerOne, 'player1', playerTwo, 'player2')) {
          humanStep = 0;
          tieResult += 1;
          message = 'Human needs you! Play again!';
          $('.message h2').text(message);
          gameOver();
          return;
        };

        const aiMove = getBestMove();
        if (aiMove !== null) {
          aiPlay(aiMove);
          if (winnerCheck(playerTwo, 'player2')) {
            playerTwo.result += 1;
            message = 'AI controls the world!';
            $('.message h2').text(message);
            gameOver();
            return;
          }
        }

        if (tieCheck(playerOne, 'player1', playerTwo, 'player2')) {
          humanStep = 0;
          tieResult += 1;
          message = 'Human needs you! Play again!';
          $('.message h2').text(message);
          gameOver();
          return;
        };

        saveGame();
      }
      // For online Mode
    } else if (playMode === 3) {
      if (!canCurrentOnlinePlayerMove()) {
        showOnlineRoomMessage(onlineState.room);
        return;
      }
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

  const getActiveBoardConfig = function() {
    const size = gridToggle;
    return {
      size: size,
      offset: size === 3 ? 0 : 9,
      maxDepth: size === 3 ? 9 : 4,
      deadline: size === 3 ? Number.POSITIVE_INFINITY : Date.now() + 150
    };
  };

  const getActiveBoardState = function(config) {
    const board = [];
    for (let i = 0; i < config.size * config.size; i++) {
      const $block = $('.block').eq(config.offset + i);
      if ($block.hasClass('player1')) {
        board.push('player1');
      } else if ($block.hasClass('player2')) {
        board.push('player2');
      } else {
        board.push('');
      }
    }
    return board;
  };

  const getWinLines = function(size) {
    const lines = [];
    for (let row = 0; row < size; row++) {
      const line = [];
      for (let col = 0; col < size; col++) {
        line.push(row * size + col);
      }
      lines.push(line);
    }
    for (let col = 0; col < size; col++) {
      const line = [];
      for (let row = 0; row < size; row++) {
        line.push(row * size + col);
      }
      lines.push(line);
    }
    const leftDiagonal = [];
    const rightDiagonal = [];
    for (let i = 0; i < size; i++) {
      leftDiagonal.push(i * size + i);
      rightDiagonal.push(i * size + (size - 1 - i));
    }
    lines.push(leftDiagonal);
    lines.push(rightDiagonal);
    return lines;
  };

  const getBoardWinner = function(board, size) {
    const lines = getWinLines(size);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const firstCell = board[line[0]];
      if (firstCell === '') {
        continue;
      }
      if (line.every(function(cell) { return board[cell] === firstCell; })) {
        return firstCell;
      }
    }
    return '';
  };

  const isBoardFull = function(board) {
    return board.every(function(cell) { return cell !== ''; });
  };

  const getAvailableMoves = function(board) {
    const moves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        moves.push(i);
      }
    }
    return moves;
  };

  const getOrderedMoves = function(board, size) {
    const center = (size - 1) / 2;
    return getAvailableMoves(board).sort(function(moveA, moveB) {
      const rowA = Math.floor(moveA / size);
      const colA = moveA % size;
      const rowB = Math.floor(moveB / size);
      const colB = moveB % size;
      const distanceA = Math.abs(rowA - center) + Math.abs(colA - center);
      const distanceB = Math.abs(rowB - center) + Math.abs(colB - center);
      const cornerA = (rowA === 0 || rowA === size - 1) && (colA === 0 || colA === size - 1);
      const cornerB = (rowB === 0 || rowB === size - 1) && (colB === 0 || colB === size - 1);

      if (distanceA !== distanceB) {
        return distanceA - distanceB;
      }
      if (cornerA !== cornerB) {
        return cornerA ? -1 : 1;
      }
      return moveA - moveB;
    });
  };

  const scoreBoard = function(board, size, depth) {
    const winner = getBoardWinner(board, size);
    if (winner === 'player2') {
      return 100000 + depth;
    }
    if (winner === 'player1') {
      return -100000 - depth;
    }

    const lines = getWinLines(size);
    let score = 0;
    for (let i = 0; i < lines.length; i++) {
      let aiCount = 0;
      let humanCount = 0;
      for (let j = 0; j < lines[i].length; j++) {
        if (board[lines[i][j]] === 'player2') {
          aiCount += 1;
        } else if (board[lines[i][j]] === 'player1') {
          humanCount += 1;
        }
      }
      if (aiCount > 0 && humanCount === 0) {
        score += Math.pow(10, aiCount);
      } else if (humanCount > 0 && aiCount === 0) {
        score -= Math.pow(10, humanCount) * 1.1;
      }
    }
    return score;
  };

  const minimax = function(board, size, depth, isMaximizing, alpha, beta, deadline) {
    if (Date.now() > deadline || depth === 0 || getBoardWinner(board, size) !== '' || isBoardFull(board)) {
      return scoreBoard(board, size, depth);
    }

    const moves = getOrderedMoves(board, size);
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        board[moves[i]] = 'player2';
        bestScore = Math.max(bestScore, minimax(board, size, depth - 1, false, alpha, beta, deadline));
        board[moves[i]] = '';
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha || Date.now() > deadline) {
          break;
        }
      }
      return bestScore;
    }

    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      board[moves[i]] = 'player1';
      bestScore = Math.min(bestScore, minimax(board, size, depth - 1, true, alpha, beta, deadline));
      board[moves[i]] = '';
      beta = Math.min(beta, bestScore);
      if (beta <= alpha || Date.now() > deadline) {
        break;
      }
    }
    return bestScore;
  };

  const getImmediateMove = function(board, size, playerClass) {
    const moves = getOrderedMoves(board, size);
    for (let i = 0; i < moves.length; i++) {
      board[moves[i]] = playerClass;
      if (getBoardWinner(board, size) === playerClass) {
        board[moves[i]] = '';
        return moves[i];
      }
      board[moves[i]] = '';
    }
    return null;
  };

  const getBestMove = function() {
    const config = getActiveBoardConfig();
    const board = getActiveBoardState(config);
    const moves = getOrderedMoves(board, config.size);
    const winningMove = getImmediateMove(board, config.size, 'player2');
    if (winningMove !== null) {
      return config.offset + winningMove;
    }
    const blockingMove = getImmediateMove(board, config.size, 'player1');
    if (blockingMove !== null) {
      return config.offset + blockingMove;
    }

    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      board[move] = 'player2';
      const score = minimax(board, config.size, config.maxDepth - 1, false, -Infinity, Infinity, config.deadline);
      board[move] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      if (Date.now() > config.deadline) {
        break;
      }
    }

    if (bestMove === null && moves.length > 0) {
      bestMove = moves[0];
    }
    return bestMove === null ? null : config.offset + bestMove;
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
    stopOnlineRoom();
    localStorage.clear();
    newGame();
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    playMode = 1;
    setOnlineModeControls(false);
    // Enable 4x4 grid button
    $('.grid-two').css('pointer-events', 'auto');
    $('.grid-two').children().removeClass('disabled-button');
    saveFirebase();

  };

  const changeToVsRobot = function() {
    // When change play mode everything should be reset
    stopOnlineRoom();
    localStorage.clear();
    newGame();
    hideMenu();
    // Add highlighted border to itself; remove from its sibling
    $(this).addClass('set-selected');
    $(this).siblings().removeClass('set-selected');
    playMode = 2;
    setOnlineModeControls(false);
    playerTwo.name = 'AI';
    $('.player-two-result').text(playerTwo.name);
    // Update the message
    message = 'Save human!!!';
    $('.message h2').text(message); 
    // Enable 4x4 grid button
    $('.grid-two').css('pointer-events', 'auto');
    $('.grid-two').children().removeClass('disabled-button');
    saveGame();
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
    setOnlineModeControls(true);
    playerTwo.name = 'Player Two';
    $('.player-two-result').text(playerTwo.name);
    // Enable 4x4 grid button
    $('.grid-two').css('pointer-events', 'auto');
    $('.grid-two').children().removeClass('disabled-button');
    saveGame();
    startOnlineMode();
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
    if (playMode === 3) {
      restartGame();
      return;
    }
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
    if (playMode !== 3 || onlineState.isApplyingRemote || !onlineState.roomId || !onlineState.user || !onlineState.room) {
      return;
    }
    if (getOnlinePlayerSlot(onlineState.room) === null) {
      return;
    }

    const roomRef = db.collection('games').doc(onlineState.roomId);
    db.runTransaction(function(transaction) {
      return transaction.get(roomRef).then(function(doc) {
        if (!doc.exists) {
          throw new Error('Online room does not exist.');
        }
        const room = doc.data();
        const updateData = buildOnlineRoomUpdate(room);
        if (!isAllowedOnlineRoomUpdate(room, updateData)) {
          throw new Error('Online room update is not allowed.');
        }
        transaction.update(roomRef, updateData);
      });
    }).catch(function(error) {
      message = 'Online move was rejected.';
      $('.message h2').text(message);
      console.error('Saving online room failed:', error);
    });
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


  $('.leave-online').on('click', leaveOnlineRoom);

 
  $('.copy-url-button').on('click', copyUrl);

  if (getRoomIdFromUrl()) {
    localStorage.clear();
    playMode = 3;
    playerTwo.name = 'Player Two';
    $('.player-two-result').text(playerTwo.name);
    $('.mode-three').addClass('set-selected');
    $('.mode-three').siblings().removeClass('set-selected');
    setOnlineModeControls(true);
    saveGame();
    startOnlineMode();
  }

});
