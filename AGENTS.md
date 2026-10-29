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
- `quad-k.css` `@import`s Google Fonts over the network, and `tree-scan.css`
  references a Wikimedia image URL, so those two look better online.

## Known pre-existing content gaps (not setup problems)

- **No images in the repo.** There is no `img/` directory, yet the pages request
  `img/QKlogo.jpg` (favicon + Broom product) and `img/ai-palm-fruit.svg` (hero
  background). Four product cards also point at local Windows paths like
  `c:\Users\QUAD K\Pictures\less5%.jpg`, which can never resolve over HTTP. All
  six product images currently render as empty placeholders.
- **`join-us.html` is missing its opening markup.** The file starts at
  `<div class="value-list">` with a stray `</section>`, so it has no `<header>`,
  no `<main>` opening tag and no hero — the page renders with no navigation.
  The closing tags at the bottom are intact.

## Verifying

`curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3000/`
should return `200 text/html; charset=utf-8`. Each page and asset should be 200
with the matching content type, and `/join-us.html`, `/tree-scan.html` should
both render. The cart button and "add to basket" toast on the home page work
entirely client-side.
