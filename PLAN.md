# sync-ignore.io implementation plan

## Summary

Build a dependency-light Cloudflare Worker application containing both parts of the product:

- A static, responsive Web UI built with HTML, CSS, and browser-native JavaScript.
- A real HTTP API at `/api?patterns=windows,unity` that returns generated `.stignore` content as `text/plain; charset=utf-8`.

Cloudflare Workers Static Assets serves the UI without invoking Worker code. Only `/api` and `/api/*` run the Worker, keeping static traffic outside the Workers Free request quota. Source lives in one GitHub repository. GitHub Actions verifies every pull request and automatically deploys each passing commit on `main` to Cloudflare.

No framework, database, client analytics, remote fonts, or runtime storage. Block catalog remains an editable JavaScript module.

## Application and API

### Project shape

Use this small structure:

```text
public/
  index.html
  styles.css
  js/
    app.js
    blocks.js
    generator.js
src/
  worker.js
test/
  generator.test.js
.github/
  workflows/ci-deploy.yml
  dependabot.yml
package.json
package-lock.json
wrangler.jsonc
README.md
```

`public/js/blocks.js` and `public/js/generator.js` must be environment-neutral ES modules. Browser UI, Worker, and Node tests import the same modules, avoiding duplicated catalogs or generation rules. Wrangler bundles these modules into Worker while also publishing them as static browser assets.

### Editable block model

Export one ordered `IGNORE_BLOCKS` array. Each entry has:

```js
{
  id: "windows",
  name: "Windows Temp Files",
  title: "//---Windows-Specific---//",
  patterns: `(?d)desktop.ini
(?d)Thumbs.db
(?d)$RECYCLE.BIN`
}
```

Validate catalog once at module initialization:

- IDs are unique, lowercase ASCII slugs matching `[a-z0-9-]+`.
- `name`, `title`, and `patterns` are non-empty strings.
- Titles begin with `//`, making them valid Syncthing comments.
- Patterns use LF internally; trailing whitespace and trailing blank lines are normalized by generator.
- Validation throws with block index and offending field, causing tests and deployment verification to fail early.

Starter catalog contains five reviewed blocks:

1. `windows` — Windows Temp Files
2. `macos` — macOS Metadata Files
3. `linux` — Linux Temp Files
4. `unity` — Unity Generated Files
5. `unrealengine` — Unreal Engine Generated Files

Use patterns agreed in original plan:

```text
//---Windows-Specific---//
(?d)desktop.ini
(?d)Thumbs.db
(?d)ehthumbs.db
(?d)$RECYCLE.BIN
(?d)System Volume Information

//---macOS-Specific---//
(?d).DS_Store
(?d).AppleDouble
(?d)._*
(?d).LSOverride
(?d).Spotlight-V100
(?d).TemporaryItems
(?d).Trashes
(?d).fseventsd
(?d).com.apple.timemachine.donotpresent

//---Linux-Specific---//
(?d)*~
(?d).directory
(?d).Trash-*

//---Unity-Generated---//
/[Ll]ibrary
/[Tt]emp
/[Oo]bj
/[Bb]uild
/[Bb]uilds
/[Ll]ogs
/[Uu]ser[Ss]ettings
/[Mm]emoryCaptures
/[Rr]ecordings

//---Unreal-Engine-Generated---//
/.vs
/Binaries
/DerivedDataCache
/Intermediate
/Saved
/*.VC.db
/*.opensdf
/*.sdf
/*.sln
/*.suo
```

Keep block order exactly as selected. Syncthing uses first-match-wins semantics, so generator must never sort selected blocks or individual patterns.

### Generator behavior

Expose pure functions for catalog lookup, input normalization, and output generation:

- Parse comma-separated IDs, trim whitespace, compare case-insensitively, remove duplicates after first occurrence, and preserve request order.
- Join each block as `title + LF + normalized patterns`.
- Separate blocks with one blank line and terminate non-empty output with exactly one LF.
- Skip unknown IDs. If known blocks remain, prepend `// WARNING: Unknown block IDs skipped: id1, id2`, followed by one blank line.
- Reject missing/empty `patterns`, or requests where no known IDs remain, with HTTP `400` and concise `text/plain` usage/error output.

### HTTP API contract

Accept both `/api` and `/api/`; canonical examples use `/api`:

```text
GET /api?patterns=windows,unity
```

Successful response:

```http
HTTP/2 200
Content-Type: text/plain; charset=utf-8
Content-Disposition: inline; filename=".stignore"
Access-Control-Allow-Origin: *
Cache-Control: public, max-age=300
X-Content-Type-Options: nosniff
```

Behavior:

- `GET` generates output.
- Other methods return `405`, `Allow: GET`, and `text/plain` error text.
- Malformed/missing input returns `400`.
- Unknown IDs follow skip-and-warn behavior above.
- Unexpected errors return `500` without stack traces or catalog internals.
- API has no cookies, authentication, request body, database, or outbound subrequests.

Configure `wrangler.jsonc` with `public` as assets directory, an `ASSETS` binding, and `run_worker_first` limited to `/api` and `/api/*`. Worker delegates every non-API request to `env.ASSETS.fetch(request)`. This preserves unlimited direct static delivery if API reaches Cloudflare Free daily limit.

## Web UI

- Start with centered heading and editable multiselect combobox. Accept only catalog entries; do not allow arbitrary patterns through keyword input.
- Match unselected suggestions against ID and human-readable name, case-insensitively. Rank prefix matches before substring matches, retaining catalog order within each rank.
- Render accepted blocks as name chips with labeled remove buttons. Empty-input `Backspace` removes last chip; repeated presses continue backward.
- Support pointer selection plus `ArrowDown`, `ArrowUp`, `Enter`, `Escape`, focus/blur, and click-outside behavior. Keep DOM focus in input and expose active option with `aria-activedescendant`.
- Use correct combobox/listbox roles, `aria-expanded`, `aria-controls`, option selection state, visible labels, focus styles, and polite live status announcements.
- First accepted block moves combobox upward and reveals output; removing final block reverses transition. Respect `prefers-reduced-motion`.
- Generate output locally using shared generator for immediate updates. Show it in read-only monospace textarea with adjacent Copy button. Clipboard failure selects text and gives manual-copy instruction.
- Store selection in `?patterns=...`. Add/remove actions create history entries; reload and `popstate` restore selection. Unknown URL IDs are announced, skipped, and removed immediately with `history.replaceState`.
- Responsive layout supports phone and desktop widths, keyboard-only use, light/dark system themes, zoom, and long output without horizontal page overflow.

## Secure GitHub Actions deployment

Interpret “GitHub worker” as a GitHub Actions workflow running on a GitHub-hosted Ubuntu runner. Do not install a self-hosted runner on root server.

### Workflow design

Create one `.github/workflows/ci-deploy.yml` workflow:

- Trigger verification on `pull_request` targeting `main` and on pushes to `main`.
- Allow `workflow_dispatch`, but gate deployment with `github.ref == 'refs/heads/main'`.
- Set workflow-level `permissions: contents: read`; grant no write permission to `GITHUB_TOKEN`.
- Verification job checks out exact triggering commit, installs locked packages with `npm ci`, runs unit tests, validates catalog, and runs `wrangler deploy --dry-run`.
- Deployment job runs only after successful verification, only for `push`/manual events on `main`, and uses GitHub `production` environment.
- Serialize production deployments with one concurrency group and `cancel-in-progress: false`, preventing overlapping or half-cancelled releases.
- Checkout same immutable `github.sha`, repeat `npm ci`, and run `npm run deploy`; never deploy mutable branch working state.
- After deployment, smoke-test stable `SITE_URL`: homepage returns `200`; `/api?patterns=windows` returns `200`, `text/plain`, expected title, and expected pattern. Retry short-lived edge propagation failures, then fail workflow visibly.
- Cloudflare deployment is atomic. Failed smoke test leaves workflow red; README documents rollback to previous Worker version from Cloudflare dashboard. Do not build automatic rollback credentials into v1.

### Credential and supply-chain controls

- Create a custom Cloudflare API token, never global API key.
- Restrict token to target Cloudflare account and only `Workers Scripts: Edit`. Configure custom domain/DNS once through Cloudflare dashboard so CI token needs no DNS, Zone, Workers Routes, billing, KV, R2, or token-management permission.
- Store token only as `CLOUDFLARE_API_TOKEN` GitHub `production` environment secret. Store non-secret `CLOUDFLARE_ACCOUNT_ID` and `SITE_URL` as environment variables.
- Restrict `production` environment deployment branches to `main`. Never expose environment or repository secrets to pull-request jobs.
- Never use `pull_request_target`, echo secrets, pass secrets through command-line arguments, upload environment dumps, or persist credentials in artifacts.
- Use GitHub-maintained `actions/checkout` and `actions/setup-node` only. Pin each to reviewed full commit SHA with version comment; do not use floating tags.
- Pin Node 24 and exact Wrangler version. Commit `package-lock.json`; run repository-local Wrangler through npm scripts, not unpinned `npx` downloads or global installation.
- Add weekly Dependabot checks for npm and GitHub Actions. Dependency/action updates arrive as reviewed PRs, run full verification, and never auto-merge.
- Configure repository Actions policy to allow GitHub-authored actions only. Protect `main` against force-push/deletion and require passing verification before merge.
- Give Cloudflare token a 180-day expiry. README documents rotation: create replacement with identical narrow scope, replace environment secret, run manual main deployment, then revoke old token.

This follows GitHub guidance to minimize `GITHUB_TOKEN` permissions, isolate deployment secrets in environments, and pin actions to full SHAs. Cloudflare currently requires an API token for Wrangler-based GitHub Actions deployment; no supported Cloudflare workload-identity/OIDC exchange is assumed.

## Tests and acceptance

Use Node built-in test runner; add no test framework.

Automated tests cover:

- Catalog schema, unique IDs, title comments, and LF normalization.
- Single/multiple block output, selection order, duplicate removal, exact blank-line separation, and final LF.
- Mixed known/unknown IDs, all-unknown input, missing input, and case/whitespace normalization.
- Worker status, method handling, response headers, CORS, errors, and static delegation using small request/environment stubs.
- Query parsing and serialization as pure browser-independent helpers.

Manual browser acceptance covers:

- Pointer and complete keyboard combobox flows.
- Chip removal and empty-input Backspace.
- First/last selection transitions and reduced-motion behavior.
- URL reload, sharing, browser Back/Forward, and unknown URL IDs.
- Copy success/fallback, responsive layouts, system themes, 200% zoom, and visible focus.
- Current Chrome, Firefox, Safari, and Edge.

Deployment acceptance requires:

- Pull requests run verification without Cloudflare secret access and never deploy.
- Failed tests/dry-run block deployment.
- Passing `main` commit deploys automatically from GitHub-hosted runner.
- Production smoke test proves UI and real `text/plain` API.
- `curl -fsSL "$SITE_URL/api?patterns=windows,unity" -o .stignore` creates valid UTF-8/LF file.
- Static UI remains available when Worker quota is exhausted; API fails closed until quota reset.

## Assumptions and one-time setup

- Repository will be public or otherwise have GitHub Actions/environment features enabled.
- Cloudflare Workers Free is initial target. Static requests remain direct; expected API traffic stays below current 100,000 Worker requests/day account limit.
- Initial deployment uses generated `workers.dev` hostname. Custom domain is attached manually later and `SITE_URL` is updated.
- User completes one-time external setup: create Cloudflare account, create narrow API token, create GitHub `production` environment/secrets/variables, configure branch/environment protections, and attach custom domain. README provides exact checklist.
- No GitHub Pages deployment remains. GitHub stores source and runs CI/CD; Cloudflare hosts both static site and API.

## References

- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers pricing and free limits](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare API token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/)
- [GitHub Actions deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments)
- [GitHub Actions security hardening](https://docs.github.com/en/code-security/tutorials/secure-your-organization/protect-against-threats)
- [Syncthing ignore patterns](https://docs.syncthing.net/users/ignoring.html)
