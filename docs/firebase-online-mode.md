# Firebase Online Mode Setup

Online mode uses Firebase Auth and Firestore directly from the static GitHub Pages app.

## Firebase project setup

1. Create or open the Firebase project for this app.
2. Enable **Authentication**.
3. In **Authentication > Sign-in method**, enable **Anonymous**.
4. In **Authentication > Settings > Authorized domains**, add:
   - `localhost`
   - `127.0.0.1`
   - `ryan-xin.github.io`
5. Create a Firestore database.
6. Deploy the Firestore rules from `firestore.rules`:

   ```sh
   firebase deploy --only firestore:rules
   ```
7. Confirm the web app config in `index.html` matches the active Firebase project.

## Firestore model

Online rooms are stored under `games/{gameId}`. Each room is a reusable room for exactly two anonymous players.

The room URL includes the game ID:

```text
https://ryan-xin.github.io/tictactoe/?game=<gameId>
```

## Manual verification

1. Serve the app locally.
2. Open one browser window and choose **Online**.
3. Confirm the modal shows a URL with `?game=`.
4. Copy that URL into a second browser profile or private window.
5. Confirm both windows show the same board and the second window joins as the other player.
6. Make a move in the first window and confirm it appears in the second.
7. Confirm the first window cannot make a second move immediately.
8. Make a move in the second window and confirm it appears in the first.
9. Open the same room URL in a third browser profile and confirm it shows the room as full.
10. Finish a round and confirm the outcome and scores appear in both player windows.
11. Restart the round and confirm the room URL stays the same.
12. Smoke test local 1 on 1 mode.
13. Smoke test AI mode.

## Security boundary

The Firebase web config is public client configuration, not a private secret. The security boundary is anonymous Firebase Auth plus `firestore.rules`.

The current rules reject:

- unauthenticated writes
- writes from non-participants
- joining a room that already has two players
- moves by the wrong player
- moves that change more than one board cell
- moves into occupied cells
- deletes
