let board = [
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""]
]



$(document).ready(function () {
  
  const blockClassChecker2 = function() {
    blockClassArr = [];
    blockClassChecker();
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        board[i][j] = blockClassArr[i * 4 + j + 9];
      }
    }
    return board;
  }
 
  const winnerChecker = function() {
    for (let i = 0; i < 4; i++) {
      if (equal4(board[i][0], board[i][1], board[i][2], board[i][3])) {
        return true;
      }
    }
    for (let j = 0; j < 4; j++) {
      if (equal4(board[0][j], board[1][j], board[2][j], board[3][j])) {
        return true;
      }
    }
    if (equals4(board[0][0], board[1][1], board[2][2], board[3][3])) {
      return true;
    }
    if (equals4(board[0][3], board[1][2], board[2][1], board[3][0])) {
      return true;
    }
  }

  const tieChecker = function() {
    let blankBlock = 0;
    for (let m = 0; m < 4; m++) {
      for (let n = 0; n < 4; n++) {
        if (board[m][n] === '') {
          blankBlock += 1;
        }
      }
    }
    if (blankBlock === 0) {
      return true;
    }
  }

  



});