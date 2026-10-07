# Price Check

A reaction-time game: an item goes on sale with a fair, crossed-out original
price above it. Most of the time the deal is honest — hit **Deal's Good**
before the timer runs out. But sometimes the sale price jumps up mid-round;
catch it and hit **Discard** within a few seconds, or it costs you a life.
The round timer shortens every round. Prices are in ₱ (Philippine pesos).

Plain HTML/CSS/JS — no build step, no server, no dependencies to install.

## Putting it on GitHub (easiest path)

1. Create a new repo on GitHub and upload everything in this folder
   (drag the whole folder onto the "Add file → Upload files" page, or use
   `git` — see below).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch",
   pick the `main` branch and `/ (root)`, then Save.
4. GitHub gives you a live URL (usually
   `https://<your-username>.github.io/<repo-name>/`) within a minute or two.

No server, no PHP, no database — just static files.

### Pushing with git instead

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Adding your own items

Edit `assets/js/items.js` — it's a plain array, open it in any text editor:

```js
{ name: "Wireless Headphones", price: 300, image: "headphones.png" },
```

- `price` is the sale price in whole pesos (the crossed-out original price
  is calculated automatically as a fair 8-20% markup over whatever the
  current sale price is — see `assets/js/config.js`).
- `image` is just a filename; drop the matching PNG into
  `assets/img/items/`. If it's missing, a placeholder icon shows instead
  so the game doesn't break.

## Adding your own UI art

Drop PNGs into `assets/img/ui/` with these exact names and they'll be
picked up automatically (all optional — the game has CSS fallbacks for
every one of them):

- `heart-full.png` / `heart-empty.png` — the lives indicator
- `item-frame.png` — background behind each item's photo
- `background.png` — full-page background, behind the game card

## Tuning the game

All the numbers — timer length, how fast it shortens, markup range, jump
size, jump timing windows, reaction window, starting lives — live in
`assets/js/config.js` with comments explaining each one.

## Adding music and sound effects

Drop audio files into `assets/audio/` and point to them in
`assets/js/audio-config.js` (defaults already match this layout, so if you
use the same filenames you don't need to touch the config at all):

- `assets/audio/bgm.mp3` — background music, loops automatically once the
  player hits Start (browsers block autoplay before that, so it starts on
  the first click)
- `assets/audio/sfx/buy.mp3` — plays the instant you hit "Deal's Good", regardless of outcome
- `assets/audio/sfx/discard.mp3` — plays the instant you hit "Discard", regardless of outcome
- `assets/audio/sfx/exit.mp3` — plays when hitting "Exit"
- `assets/audio/sfx/click.mp3` — generic click, used for Start, Play
  Again, Save score, and the Settings button/menu
- `assets/audio/sfx/correct.mp3` — plays right after, once the round resolves, if your call was right
- `assets/audio/sfx/wrong.mp3` — plays if your call was wrong (lost a heart)
- `assets/audio/sfx/timeout.mp3` — plays if you ran out the clock or missed the reaction deadline without answering

Any file that's missing just stays silent — nothing breaks. MP3, WAV, or
OGG all work; just update the filename/extension in `audio-config.js` if
you use something other than `.mp3`.

Players adjust music and SFX volume from the gear (⚙) icon in the header;
their choice is remembered per-browser between visits.

## Editing the text

Every label, heading, and button in the game lives in `assets/js/text.js`
— open it and edit the values on the right of each line. Nothing else
needs to change; the page pulls all its text from that one file on load.

## The leaderboard

Scores save to the browser's `localStorage`, so it's a personal high-score
list on whatever device/browser someone plays on — not shared between
players. That's the trade-off of having no server; if you want a real
shared leaderboard later, that would need a small backend.

## Running it locally

Just double-click `index.html` — no server needed, it opens straight in
your browser.

## Project layout

```
index.html                 The whole page
assets/css/style.css        Styling
assets/js/config.js          Tunable game numbers (edit this)
assets/js/items.js           Your item list (edit this)
assets/js/text.js            Every piece of UI text (edit this)
assets/js/audio-config.js    Audio file paths + default volumes (edit this)
assets/js/audio.js           Audio playback logic (only touch if changing behavior)
assets/js/game.js            Game logic (only touch if changing mechanics)
assets/img/items/            Your item PNGs go here
assets/img/ui/               Optional UI PNGs go here
assets/audio/                Your BGM/SFX files go here
```
