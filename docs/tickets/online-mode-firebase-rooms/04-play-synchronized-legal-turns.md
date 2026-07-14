## Parent

Part of #1.

## What to build

Let the two participants take turns on the shared board while both browsers stay synchronized. Wrong-turn moves should be blocked, and occupied cells should not be overwritten.

## Acceptance criteria

- [ ] The first legal move appears in both participants' browsers.
- [ ] The current turn advances after each legal move.
- [ ] A participant cannot move when it is not their turn.
- [ ] A participant cannot overwrite an occupied cell.
- [ ] Board updates come from the room state, not local-only state.
- [ ] Local 1 on 1 and AI mode still work after online turn handling changes.

## Blocked by

- #4
