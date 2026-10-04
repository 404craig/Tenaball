# Switching on accounts and online games

Tenaball's accounts (email and 4-digit PIN), stats that follow a player to any phone, and online games run on a small server in the `server/` folder. It runs on Cloudflare's free plan. Until it's connected, the game works exactly as before: no sign-in screen and no online button.

You'll need a free Cloudflare account ([dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)) made with a personal email, and the `server/` folder on the `main` branch of this repository.

## 1. Connect Cloudflare to the repository

1. In the Cloudflare dashboard, open **Workers & Pages** and choose **Create**.
2. Choose **Import a repository** (it may say **Connect to Git**), then **GitHub**, and let Cloudflare see the `404craig/Tenaball` repository.
3. On the set-up screen:
   - **Project name:** `tenaball` (it must match `name` in `server/wrangler.toml`)
   - **Production branch:** `main`
   - Open the advanced settings and set **Root directory** (sometimes called **Path**) to `server`
   - **Build command:** leave empty
   - **Deploy command:** `npx wrangler deploy`
4. Choose **Deploy**. The first time, Cloudflare may ask you to pick a `workers.dev` subdomain, for example your name. The server's address is then `https://tenaball.<subdomain>.workers.dev`.

From now on, every change to `server/` on `main` deploys itself.

## 2. Add the two secrets

In **Workers & Pages**, open **tenaball**, then **Settings**, then **Variables and Secrets** (the worker's own list, not the one under **Build**). Add two entries of type **Secret**:

| Name | Value |
| --- | --- |
| `PIN_SECRET` | A long random phrase, at least 16 characters, for example five random words. It scrambles every PIN. |
| `ADMIN_PASSWORD` | A password for the admin page, at least 8 characters. |

Save and deploy when it asks. Secrets added here reach the running server straight away, and deploys keep them.

Keep `PIN_SECRET` somewhere safe and **never change it** once people have accounts: changing it makes every existing PIN stop working (you'd have to reset each one).

**If a later build ever loses the secrets** (`/status` says `"missing"` after a deploy; Cloudflare's GitHub builds have been known to do this), there's a fallback: add the same two secrets under **Settings**, then **Build**, then **Variables and secrets**, and change the **Deploy command** to `npm run deploy`. That runs `server/deploy.mjs`, which uploads the two secrets with every new version.

## 3. Check it's running

Open `https://tenaball.<subdomain>.workers.dev/status`. Both lists should say `"set"` for `PIN_SECRET` and `ADMIN_PASSWORD` (it never shows the values). Then open `/admin` on the same address and sign in with your admin password.

## 4. Point the game at the server

Send the server's address to Claude, or open `index.html`, search for `const TENABALL_SERVER = null;`, and replace `null` with the address in quotes:

```js
const TENABALL_SERVER = "https://tenaball.<subdomain>.workers.dev";
```

Once that's on `main` and GitHub Pages has updated, the game shows the sign-in screen on first visit and the **H2H online** door on the home screen.

If the game is ever served from another address (a custom domain, for example), add it to `ALLOWED_ORIGINS` in `server/wrangler.toml`, separated by a comma.

## Resetting a forgotten PIN

Open `https://tenaball.<subdomain>.workers.dev/admin`, sign in with your admin password, search for the player's email or name, and choose **Set new PIN**. They're signed out on every phone and can sign in with the new PIN. The same page can unlock an account early or delete one.

## How it works

- **Accounts:** a name, an email and a 4-digit PIN. The email isn't checked; it's the player's username. PINs are stored scrambled with the `PIN_SECRET` and a random salt per account, never as the PIN itself.
- **Wrong PINs:** after 5 wrong PINs the account is locked for 15 minutes. One device is also stopped after 20 wrong tries in an hour, across all accounts. Both numbers are in `server/wrangler.toml`.
- **Staying signed in:** each phone stays signed in until the player signs out, and a player can be signed in on several phones at once.
- **Guests:** play everything, including online games. Their stats stay on their phone. A guest who makes an account can add those stats to it.
- **Online games:** each game is a room on the server. The host shares an invite link or 5-letter code, friends appear in everyone's lobby as they join (2 to 4 players), and the host starts. The room puts every move in a single order and every phone replays the same list, so the boards always match. A phone that drops out or reloads catches up by itself. Rooms nobody has used for a day are deleted.

## Limits

The free plan allows 100,000 requests a day. A sign-in, a saved result or a new game is one request each, and live game messages count as 1 request per 20, so family use stays far below the limit. Cloudflare doesn't pause the server when it's quiet.
