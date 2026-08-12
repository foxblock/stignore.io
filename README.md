# stignore.io

Generate modular [Syncthing `.stignore`](https://docs.syncthing.net/users/ignoring.html) files in browser or through a real plain-text API.

Site uses plain HTML, CSS, and JavaScript. One Cloudflare Worker handles API requests; Workers Static Assets serves UI directly. No framework, database, tracking, remote fonts, or runtime storage.

## API

Request comma-separated block IDs:

```sh
curl -fsSL \
  "https://your-host.example/api?patterns=windows,unity" \
  --output .stignore
```

List available block IDs:

```sh
curl -fsSL "https://your-host.example/api/list"
```

Response is one comma-separated line in catalog order.

Successful response uses `Content-Type: text/plain; charset=utf-8` and contains only `.stignore` content:

```text
//---Windows-Specific---//
(?d)desktop.ini
(?d)Thumbs.db

//---Unity-Generated---//
/[Ll]ibrary
/[Tt]emp
```

Available IDs: `windows`, `macos`, `linux`, `unity`, and `unrealengine`.

- Requested order is preserved because Syncthing uses first matching pattern.
- Duplicate IDs after first occurrence are removed.
- Unknown IDs are skipped and reported in a leading Syncthing comment.
- Missing input or a request containing no known IDs returns `400`.
- Methods other than `GET` return `405`.

## Edit ignore blocks

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

IDs must be unique lowercase slugs. Titles must start with `//`. Multiline template literals keep patterns readable. Build tests reject malformed entries before deployment; page loads use catalog directly.

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

## First Cloudflare deployment

GitHub Actions owns production deployment. Local Cloudflare login is not required.

1. Create free Cloudflare account and enable desired `workers.dev` account subdomain under **Workers & Pages**.
2. Find Account ID in Cloudflare dashboard.
3. Create custom Cloudflare API token. Limit resource to target account and grant only **Account → Workers Scripts → Edit**. Do not use Global API Key. Set token expiration to about 180 days.
4. In GitHub repository, create environment named `production`.
5. Restrict environment deployment branches to `main`. Do not add required reviewer if deployment must remain automatic.
6. Add environment secret `CLOUDFLARE_API_TOKEN`.
7. Add environment variable `CLOUDFLARE_ACCOUNT_ID`.
8. Add environment variable `SITE_URL`, initially `https://stignore-io.<account-subdomain>.workers.dev` using exact URL shown by Cloudflare.
9. Push protected `main` branch or run **CI and Deploy** manually while viewing `main`.

Workflow verifies tests and deployment bundle first, deploys exact verified commit, then smoke-tests live homepage and API. Pull requests never receive Cloudflare credential and never deploy.

### Custom domain

Attach custom domain through Cloudflare dashboard under Worker **Settings → Domains & Routes**. Dashboard creates DNS and certificate without widening CI token. Update GitHub `production` variable `SITE_URL` to final HTTPS origin. No repository change required.

## GitHub security setup

Repository settings complete controls that workflow file cannot enforce:

- Protect `main`: require pull request, require `Verify` status check, block force pushes and deletion.
- Enable GitHub secret scanning and push protection when available.
- Under Actions policy, allow GitHub-created actions only. Workflow uses only `actions/checkout` and `actions/setup-node`.
- Review Dependabot PRs; never auto-merge dependency or action updates.
- Keep `production` environment restricted to `main`.

Workflow defense details:

- `GITHUB_TOKEN` has only `contents: read`.
- Action releases are pinned to reviewed full commit SHAs.
- Checkout does not persist Git credentials.
- Node and Wrangler versions are exact-pinned.
- `npm ci --ignore-scripts` installs lockfile without dependency lifecycle scripts.
- Cloudflare secret is passed only to deployment step.
- Production deployments are serialized and never cancelled midway.
- Pull requests use `pull_request`, never privileged `pull_request_target`.

### Rotate deployment token

Before token expiry:

1. Create replacement token with same account restriction and **Workers Scripts → Edit** permission.
2. Replace `CLOUDFLARE_API_TOKEN` in GitHub `production` environment.
3. Run **CI and Deploy** manually against `main`.
4. Confirm smoke test passes.
5. Revoke old token in Cloudflare.

If token leaks, revoke it first, create replacement, update environment secret, and redeploy. API itself holds no secrets.

### Roll back

Cloudflare keeps Worker versions. In Cloudflare dashboard, open Worker **Deployments**, select last known-good version, and roll it back. Then revert faulty Git commit through normal pull request so next automatic deployment does not reintroduce failure.

## Free-tier behavior

Only `/api` and `/api/*` invoke Worker. Homepage, CSS, and browser JavaScript are direct static assets. If account exceeds current Workers Free daily compute-request quota, API fails until quota reset while UI remains available. Cloudflare does not automatically upgrade free account.
