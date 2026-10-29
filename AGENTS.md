# AGENTS.md

## What this project is

QUAD K is a **static marketing site**: plain HTML, CSS and vanilla JS. There is
no build step, no package manager, no bundler, no tests, and no backend. Nothing
needs installing or compiling.

Pages:

- `QUAD K.HTML` — home / shop. Served at `/` (note the space and uppercase `.HTML`
  in the filename).
- `tree-scan.html` — camera / photo upload screening tool.
- `join-us.html` — story + join form.

All pages share `quad-k.css`. `join-us.html` adds `join-us.css`, `tree-scan.html`
adds `tree-scan.css`. Only `quad-k.js` and `tree-scan.js` are separate scripts;
`join-us.html` has its form handler inline.

There is no server-side code: the order and join forms just build a `wa.me`
WhatsApp deep link, and the tree scanner keeps everything in the browser
(`getUserMedia` + canvas). No credentials or environment variables are needed.

`join-us.html` and `tree-scan.html` share the home page's header, footer and
form language, so all three read as one site.

## Running it

```sh
docker compose -f docker-compose.base44.yml up -d
```

Then open <http://localhost:3000/>. Because the source is bind-mounted and nginx
serves files straight from disk, **editing any HTML/CSS/JS shows on reload with
no rebuild**. Only restart (`docker compose ... restart web`) after changing
`.base44/nginx.conf` or `.base44/site.conf`.

## Non-obvious quirks

- **The home page is `QUAD K.HTML`**, not `index.html`. `.base44/site.conf`
  points the `index` directive at that exact filename, and because nginx's
  `mime.types` only maps lowercase extensions, `.base44/nginx.conf` adds
  `types { text/html HTML; }`. Without that the browser downloads the page
  instead of rendering it. Keep both in sync if the filename changes.
- **nginx's worker runs as `user root` inside the container.** The sandbox
  checkout is owned by root with mode `0700`, so the default non-root worker
  cannot traverse the bind mount and every request 403s/404s with
  "Permission denied". This is container-local only.
- The whole repo root is mounted at `/srv/site`, so new pages need no compose
  change. `.base44/site.conf` denies dotfiles so `/.git` and `/.base44` are not
  web-reachable.
- **Fonts are system-only** (`Impact` → `Arial Black` → `Arial`). The design
  deliberately ships no web-font `@import`, so nothing waits on Google Fonts.
- **All imagery is hosted, not local.** There is no `img/` directory: pages load
  photos from the Base44 media library on `media.base44.com` (palm-fruit hero,
  one still life per product tier, broom). Do not reintroduce local
  `c:\Users\...` paths — those never resolve over HTTP.

## Design system ("Market Stall")

`quad-k.css` is the shared poster system used by all three pages: acid lime
`#EAFB4B`, forest `#123524`, hot orange `#FF6B3D`, heavy grotesque type, 3-4px
borders with hard offset shadows, rotated "ticket" cards, and a marquee band.

- Base styles are written for the mobile width (764px) and a
  `@media (min-width:900px)` block widens the stage and takes the shelf to 3-up.
  Keep both branches in the same language when editing.
- `quad-k.js` is coupled to the design class names on the home page: `.ad`
  (add to basket), `.cnt` (counter), `.b` (basket button), `.copy-button`,
  `.fm` (form) and `.msg` (form status). Renaming any of those in the HTML
  silently breaks the cart and forms — update the script in the same change.
- `.msg` is hidden by default (`.msg { display:none }`) and shown by JS after a
  successful submit; `tree-scan.js` drives `#report` the same way.

## Verifying

`curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3000/`
should return `200 text/html; charset=utf-8`. Each page and asset should be 200
with the matching content type, and `/join-us.html`, `/tree-scan.html` should
both render.

Interactive behaviour to exercise in the browser (all client-side, nothing
persists):

- Home: an add button (`.ad`) increments the basket counter and raises the
  toast; the basket button opens a `wa.me` link.
- Join us: submitting the form opens WhatsApp and reveals `.msg`.
- Tree scanner: picking a "visible sign" and submitting renders `#report` with
  the chosen location and signs. Camera capture needs a real camera permission.
