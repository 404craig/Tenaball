# Switching on sign-in and online games

Sign-in and online games use Firebase, Google's free app backend. Until a Firebase project is connected, Tenaball works exactly as before: no sign-in screen and no online button.

All of this can be done on the free Spark plan. You need a Google account, and for Sign in with Apple, a paid Apple Developer account (see step 5).

## 1. Create the project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and choose **Create a project**. Call it `tenaball`. Google Analytics isn't needed.
2. On the project's home page, click the web icon (`</>`) to **add a web app**. Call it `Tenaball`, leave Firebase Hosting unticked, and register it.
3. Firebase shows a `firebaseConfig` block. Copy it. It looks like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIza…",
     authDomain: "tenaball-xxxx.firebaseapp.com",
     projectId: "tenaball-xxxx",
     storageBucket: "tenaball-xxxx.firebasestorage.app",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```

   These values are safe to publish. They identify the project, and the security rules in step 4 decide what anyone can read or write.

## 2. Turn on the sign-in methods

In **Build › Authentication**, click **Get started**, then on the **Sign-in method** tab turn on:

- **Email/Password** (just the first switch; passwordless email link isn't used)
- **Google** (pick a support email and save)
- **Anonymous**. This is how guests join online games, so it's needed even if you only want guests.
- **Apple** (see step 5)

Then on the **Settings** tab, under **Authorized domains**, click **Add domain** and add `404craig.github.io`.

## 3. Create the database

In **Build › Firestore Database**, click **Create database**. Choose a location near your players (for the UK, `europe-west2 (London)`) and start in **production mode**.

## 4. Publish the security rules

In Firestore, open the **Rules** tab, replace everything there with the contents of [`firestore.rules`](../firestore.rules) from this repository, and click **Publish**.

These rules make sure:

- only you can read or change your own stats
- only a room's host can start it, change question, move to the next round or close it
- players can only add themselves to a lobby, and only while it's still in the lobby
- every move is sent as the player who made it, in order, and can't be edited afterwards

## 5. Sign in with Apple

Apple only lets apps offer Sign in with Apple through a paid [Apple Developer Program](https://developer.apple.com/programs/) membership (£79 or $99 a year). Without one, leave Apple switched off in Firebase: the button stays on the sign-in screen, but tapping it shows "That sign-in option isn't switched on yet."

With a membership, Firebase's guide [Authenticate using Apple with JavaScript](https://firebase.google.com/docs/auth/web/apple) has the full steps. In short:

1. In the Apple Developer site, under **Certificates, Identifiers & Profiles**, create a **Services ID** (for example `uk.co.tenaball.signin`) and turn on **Sign in with Apple** for it.
2. Configure it with the domain `tenaball-xxxx.firebaseapp.com` and the return URL `https://tenaball-xxxx.firebaseapp.com/__/auth/handler` (use your project's `authDomain`).
3. Create a **Key** with Sign in with Apple enabled and download it.
4. In Firebase, open the **Apple** sign-in method and enter the Services ID, your Apple Team ID, the Key ID and the key file's contents.

## 6. Connect the game

Open `index.html`, search for `const FIREBASE_CONFIG = null;`, and replace `null` with the object from step 1:

```js
const FIREBASE_CONFIG = {
  apiKey: "AIza…",
  authDomain: "tenaball-xxxx.firebaseapp.com",
  projectId: "tenaball-xxxx",
  storageBucket: "tenaball-xxxx.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
```

Commit it to `main`, and once GitHub Pages updates, the game shows the sign-in screen on first visit and **Play online with friends** on the home screen.

## How it works

- **Accounts.** Players sign in with Apple, Google or an email and password, or play as a guest. Signed-in players' stats are saved to their account (`users/{uid}`), so they follow them to any device. Guests' stats stay on their phone, as before.
- **Online games.** The host picks the settings on the home screen, taps **Play online with friends**, then **Create a game**. The lobby shows a 5-letter code and an **Invite players** button that shares a link (`…/Tenaball/?room=CODE`). Friends open the link, sign in or play as a guest, and appear in everyone's lobby straight away. With 2 to 4 players in, the host taps **Start game**.
- **Playing.** Everyone plays on their own phone. Each move (a guess, a pass, a timeout, or the host's reveal, question change, next round or skip) is added to a numbered move log in the room, and every phone replays the same log through the game's own rules, so all the boards stay identical. Only the player whose turn it is can guess or pass. The host can skip a player who has gone quiet. A player who reloads, or whose phone sleeps, catches up from the log.
- **After the game.** The host can tap **Play again** to take everyone back to the lobby for another game, or leave, which closes the game for everyone.

## Limits

- The free Spark plan allows 50,000 database reads and 20,000 writes a day. One online game with 3 players uses roughly 200 writes and 1,000 reads, so that's plenty for family use.
- Old rooms stay in the database. They're tiny, but you can delete them from the Firestore console now and then, or set a TTL policy on `rooms` if you ever need to.
- If the host's phone drops out, the game waits for them. Other players can leave and start a new game.
