# stignore.io

Generate modular [Syncthing `.stignore`](https://docs.syncthing.net/users/ignoring.html) files in browser or through a plain-text API.

Site uses plain HTML, CSS, and JavaScript. Deployment to Cloudflare works using GitHub actions. One Cloudflare Worker handles API requests; Workers Static Assets serves UI directly. No framework, database, tracking, remote fonts, or runtime storage.

Project generated with extensive help of GPT 5.6 Sol (medium to very high).

## API

**Request comma-separated block IDs:**

```sh
curl -fsSL \
  "https://your-host.example/api?patterns=windows,unity" \
  --output .stignore
```

Successful response uses `Content-Type: text/plain; charset=utf-8` and contains only `.stignore` content:

```text
//---Windows-Specific---//
(?d)desktop.ini
(?d)Thumbs.db

//---Unity-Generated---//
/[Ll]ibrary
/[Tt]emp
```

- Requested order is preserved because Syncthing uses first matching pattern.
- Duplicate IDs after first occurrence are removed.
- Unknown IDs are skipped and reported in a leading Syncthing comment.
- Missing input or a request containing no known IDs returns `400`.
- Methods other than `GET` return `405`.

**List available block IDs:**

```sh
curl -fsSL "https://your-host.example/api/list"
```

Response is one comma-separated line in catalog order.

## Edit or add ignore blocks

Edit `public/js/blocks.js`. Each entry contains:

```js
{
  id: "windows",
  name: "Windows Temp Files",
  title: "//---Windows-Specific---//",
  patterns: `(?d)desktop.ini
(?d)Thumbs.db`
}
```

IDs must be unique lowercase slugs. Titles must start with `//`. Build tests reject malformed entries before deployment.

Suggestions as pull-requests welcome!

## Local development

Requirements: Node.js 24 and npm.

```sh
npm ci
npm test
npm run dev
```

Wrangler prints local URL, normally `http://localhost:8787`. Full deployment validation:

```sh
npm run validate
```

`validate` runs Node tests and a Cloudflare deployment dry-run. Wrangler version is exact-pinned in `package.json` and `package-lock.json`.