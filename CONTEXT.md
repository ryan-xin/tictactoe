# Tic Tac Toe

This context describes the game modes and board rules for the browser tic-tac-toe game.

## Language

**AI mode**:
A game mode where Player One is controlled by the human and Player Two is controlled by the computer.
_Avoid_: vs Robot, robot mode

**Online mode**:
A game mode where two remote human players share the same game state through a generated room URL.
_Avoid_: global game, shared gameData game

**Portfolio-safe casual play**:
An online play quality bar where room isolation and basic move authorization matter, but server-enforced anti-cheat is not the goal.
_Avoid_: cheat-resistant real play, ranked play

**Anonymous player**:
A remote human player identified by an anonymous authentication ID for room membership and move authorization.
_Avoid_: signed-up user, account

**Display name**:
A player-provided label shown in the game UI that does not determine authorization.
_Avoid_: username, account name

**Reusable room**:
An online room where the same two players can play multiple rounds while keeping the same room URL and match results.
_Avoid_: one-off game link, global room

**Two-player room**:
An online room that can be joined by exactly two anonymous players; additional visitors are not participants.
_Avoid_: spectator room, open lobby

**3x3 board**:
A board with nine cells where a player wins by claiming three cells in one row, column, or diagonal.
_Avoid_: Grid One

**4x4 board**:
A board with sixteen cells where a player wins by claiming four cells in one row, column, or one of the two main diagonals.
_Avoid_: Grid Two
