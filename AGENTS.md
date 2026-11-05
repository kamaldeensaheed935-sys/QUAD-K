# QUAD K — repo notes

Static marketing site: plain HTML/CSS/JS, no build step, no package manager, no backend.

## Run

```
docker compose -f docker-compose.base44.yml up -d
```

`web` is `nginx:alpine` serving the repo root (bind-mounted, read-only) on host port **3000**,
configured by `nginx.base44.conf` (no-store caching so edits appear on reload, dotfiles denied).

## Quirks

- The homepage **must** be `index.html`. It was previously committed as `QUAD K.HTML`
  (space in the name, uppercase `.HTML`), which no web server serves at `/` — that was the
  startup failure. Keep all internal links lowercase and extension-correct; the container
  filesystem is case-sensitive.
- Pages: `index.html` (shop/cart/join form), `join-us.html` (story page), `tree-scan.html`
  (camera tool). Each page loads `quad-k.css`; the last two add their own stylesheet.
- `quad-k.js` is only loaded by `index.html` and assumes every element it queries exists there.
- Product photography was imported with absolute Windows paths (`c:\Users\...`) that can never
  resolve on a server. They now point at `img/palm-oil.svg`; replace with real photos in
  `img/` when available. `img/QKlogo.svg` is the favicon; `img/ai-palm-fruit.svg` is the hero
  background referenced from `quad-k.css`.

## Verify

`curl -fsS http://localhost:3000/ | head` should return the homepage markup, and
`curl -o /dev/null -w '%{http_code}' http://localhost:3000/img/palm-oil.svg` should be `200`.
