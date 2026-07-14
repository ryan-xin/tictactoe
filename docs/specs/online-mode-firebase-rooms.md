# Online Mode Firebase Rooms Spec

## Problem Statement

Online mode currently does not provide reliable portfolio-safe casual play. The current Firebase project appears inactive or inaccessible, and online game state is modeled as one shared online state. That means remote players cannot create isolated friend matches, multiple pairs of players would overwrite each other, and the security boundary is unclear because the client writes shared game state directly.

## Solution

Rebuild online mode as a static GitHub Pages experience backed by a fresh Firebase project. Online mode will use anonymous Firebase Auth, reusable room URLs, per-room Firestore documents, and Firestore Security Rules that enforce room membership and basic legal moves. A player can create a room, copy the generated room URL, invite one friend, and play multiple rounds in that same two-player room without colliding with other online games.

## User Stories

1. As a player, I want to create an online room, so that I can invite a friend to play remotely.
2. As a player, I want the room URL to include a room identifier, so that my friend joins my specific reusable room.
3. As a player, I want the copied URL to point to the current reusable room, so that I do not send a generic site URL.
4. As a player, I want to join a room from a shared URL, so that I can enter the same game as my friend.
5. As the first player in a room, I want to be assigned one side, so that online mode knows which moves I am allowed to make.
6. As the second player in a room, I want to be assigned the other side, so that both players have distinct roles.
7. As a third visitor to a full room, I want to see that the room is full, so that I understand why I cannot play.
8. As a player, I want my browser to use anonymous identity automatically, so that I do not need to create an account.
9. As a player, I want to optionally enter a display name, so that the game UI feels personal.
10. As a player, I want display names not to control authorization, so that changing a label cannot steal a side.
11. As a player, I want the board to update when my friend moves, so that we both see the same game state.
12. As a player, I want only the current player to move, so that turns are respected.
13. As a player, I want occupied cells to stay locked, so that neither player can overwrite a previous move.
14. As a player, I want a move to affect only one cell, so that the room state cannot be replaced with arbitrary board changes.
15. As a player, I want win and tie states to appear for both players, so that the round outcome is clear.
16. As a player, I want the reusable room to support a new round, so that I can keep playing with the same friend.
17. As a player, I want scores to persist across rounds in the same reusable room, so that the match result is preserved.
18. As a player, I want a restart or new-round action to reset the board without changing the room URL, so that the invitation remains valid.
19. As a player, I want online mode to continue supporting the 3x3 board, so that the existing core game remains available online.
20. As a player, I want online mode to continue supporting the 4x4 board if practical within the same model, so that online mode matches local mode.
21. As a player, I want token selection to be reflected consistently for both players, so that the room UI does not diverge.
22. As a player, I want local 1 on 1 mode to keep working, so that online changes do not break local play.
23. As a player, I want AI mode to keep working, so that online changes do not affect the computer opponent mode.
24. As a maintainer, I want online state isolated by room, so that concurrent games do not overwrite each other.
25. As a maintainer, I want Firestore Security Rules to reject non-participant writes, so that random visitors cannot modify a room.
26. As a maintainer, I want Firestore Security Rules to reject wrong-turn writes, so that the database enforces basic move authorization.
27. As a maintainer, I want Firestore Security Rules to reject multi-cell board mutations, so that obvious overwrites are blocked.
28. As a maintainer, I want Firebase configuration to be easy to replace, so that a deactivated project can be swapped without code surgery.
29. As a maintainer, I want Firebase setup steps documented, so that the project can be restored later without guessing.
30. As a maintainer, I want one browser-level test seam for online mode, so that future changes can verify the real user flow.

## Implementation Decisions

- Stay on Firebase for online mode.
- Use a fresh Firebase project if the existing project is inactive.
- Keep the app static on GitHub Pages with no custom backend or serverless function for now.
- Use anonymous Firebase Auth to identify participants.
- Keep display names as UI labels only; authorization must use anonymous identity.
- Replace the one shared online state with per-room Firestore documents.
- Generate a room identifier when a player creates an online room.
- Store the room identifier in the online room URL.
- Treat an online room as a reusable room for multiple rounds between the same two anonymous players.
- Limit each reusable room to exactly two participants.
- Show a full-room state to additional visitors rather than allowing spectator writes.
- Store board state, participant identities, current turn, status, winner, scores, board size, token selection, and timestamps in the room state.
- Use transactions or equivalent atomic Firestore operations when joining a room and making moves.
- Keep local 1 on 1 mode and AI mode separate from online persistence.
- Firestore Security Rules must enforce participant membership.
- Firestore Security Rules must enforce basic legal moves: correct player, one changed cell, empty destination cell, and no arbitrary score or role edits.
- Client-side code may compute friendly UI messages and winner highlights.
- The database remains the source of truth for shared online state.
- Firebase setup documentation must include anonymous auth, Firestore, security rules, and required config replacement.
- The implementation should be surgical: replace online-mode persistence and URL handling without opportunistically refactoring unrelated game logic.

## Testing Decisions

- The best test checks external behavior, not implementation details: two browser clients create and join a reusable room, exchange legal turns, see synchronized board state, and reject invalid writes.
- Prefer one high-level browser-driven online-room test seam over many low-level tests.
- Because the app is static and currently has no test harness, introduce the smallest practical test setup for online mode.
- The preferred automated seam is a browser test against local Firebase emulators for Auth and Firestore.
- The browser test should cover room creation, room join, third visitor blocked, legal move sync, wrong-turn rejection, occupied-cell rejection, and new-round reuse.
- If emulator setup is too heavy for the first implementation pass, add a documented manual verification script with exact steps and expected Firestore/UI outcomes, then follow up with automation.
- Regression verification must include local 1 on 1 mode and AI mode smoke checks.
- Firestore rules should be tested with representative allowed and denied writes when rules testing support is available.

## Out of Scope

- Full cheat-resistant server-owned game adjudication.
- A custom backend or serverless function.
- Required sign-up, email login, or social login.
- Spectator support.
- Matchmaking or public lobbies.
- Ranked play.
- Chat.
- Payments or paid Firebase features.
- A full rewrite of the jQuery game architecture.
- Mobile-responsive redesign unless required by the online flow.

## Further Notes

- The exposed Firebase web API key is not treated as a secret. Security depends on Firebase Auth, Firestore Security Rules, and reasonable API key restrictions in the Firebase/Google Cloud console.
- The old Firebase project may be inactive. The implementation should assume the Firebase configuration may need to be replaced with a new project.
- The existing online modal and copy URL behavior should change from a generic site URL to a generated room URL.
- The current README already notes that online turn control was unfinished; this spec resolves that by making turn ownership part of shared room state and Firestore rule validation.
