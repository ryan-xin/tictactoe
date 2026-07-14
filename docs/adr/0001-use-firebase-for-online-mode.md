# Use Firebase for Online Mode

The online mode will stay on Firebase, using a new Firebase project if the old one is inactive. Firebase is already the app's backend integration, its free Spark plan is enough for portfolio-safe casual play, and anonymous authentication plus Firestore Security Rules directly address room membership and move authorization. Supabase and Cloudflare Durable Objects remain viable alternatives, but switching providers would add migration work without solving the core one-global-game design issue by itself.
