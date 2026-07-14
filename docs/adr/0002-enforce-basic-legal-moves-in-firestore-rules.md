# Enforce Basic Legal Moves in Firestore Rules

Online mode targets portfolio-safe casual play, so Firestore Security Rules should enforce room membership and basic legal moves rather than relying only on the browser UI. Rules should reject writes from non-participants, moves by the wrong player, moves that change more than one cell, and moves into occupied cells. The client may still compute display state such as messages and winner highlights, but obvious room overwrites should be rejected at the data boundary.
