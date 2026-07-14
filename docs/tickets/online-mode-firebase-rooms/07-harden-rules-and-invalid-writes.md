## Parent

Part of #1.

## What to build

Harden Firestore Security Rules and verification so obvious invalid online room writes are rejected at the data boundary.

## Acceptance criteria

- [ ] Non-participants cannot write to a reusable room.
- [ ] The wrong participant cannot write a move out of turn.
- [ ] A move cannot change more than one board cell.
- [ ] A move cannot write into an occupied cell.
- [ ] Participants cannot arbitrarily edit roles, scores, or room ownership.
- [ ] Allowed writes for room creation, joining, legal moves, and new rounds are covered by verification.

## Blocked by

- #4
- #5
- #6
