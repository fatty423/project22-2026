# Project22 — Claude Code Context

Non-profit (founded by Jeff Kingsford) addressing veteran/first-responder suicide
("22" = the 22+ who take their own lives daily). Drives donations and a veteran
training pipeline tied to ESS Academy. Site: project22.us.

Migrated off Bolt.new to Claude Code management (June 2026). The repo is the source
of truth; Bolt is no longer used for this site.

## Stack
- Vite 5 + React 18 + TypeScript + Tailwind 3 + React Router 7
- Supabase backend (project ref `ugpespppwgymcbksybgb`): 25 tables, baseline migration
  in `supabase/migrations/`, 5 Edge Functions in `supabase/functions/`
- Stripe payments (**LIVE mode**) for one-time + recurring donations
- Target host: Netlify (build `npm run build`, publish `dist`, SPA via `public/_redirects`)

## Commands
- `npm install` — install deps
- `npm run dev` — local dev server (Vite)
- `npm run build` — production build → `dist/` (this is the "publish" build)
- `npm run typecheck` — `tsc --noEmit` (note: build does NOT run tsc)
- `npm run lint` — eslint

## Architecture
- `src/App.tsx` — all routes (~46). Public site, donor portal, hero (veteran) portal, admin dashboard.
- `src/pages/` — page components; `src/pages/admin/` (13 admin screens); `src/pages/hero/` (veteran portal)
- `src/components/` — shared UI; `ui/` primitives, `portal/`, `patches/`
- `src/lib/` — `supabase.ts` (client + data access), `stripe.ts`, `auth.tsx`, `email.ts`, etc.
- `src/stripe-config.ts` — Stripe product/price IDs (LIVE)
- `supabase/functions/` — `stripe-checkout`, `stripe-webhook`, `stripe-portal`, `send-email`, `manage-admin-user`

## Guardrails
- **Stripe is LIVE.** Do not modify `src/stripe-config.ts`, `src/lib/stripe.ts`, or the
  Stripe/admin Edge Functions without explicit owner approval. Never run live test charges.
- Secrets: only the Supabase anon key + URL belong in `.env` (gitignored). Service-role and
  Stripe secret keys live in Supabase Edge Function env, not here.
- Work on a feature branch; only merge to `main` after `npm run build` passes and a visual check.

## Git Workflow (Jeff + Jake collaboration)

**Core rule: never commit or push directly to `main`.** All work goes through a feature branch
and a reviewed pull request.

### Before starting any work
1. `git switch main`
2. `git pull origin main` — grab anything the other person merged
3. Confirm `git status` is clean before branching

### Branch naming
- `feat/<description>`, `fix/<description>`, `content/<description>`
- Prefix with initials when both people are active: `jake/feat/hero-section`, `jeff/fix/nav`
- One branch per logical change — don't pile unrelated edits

### While working
- Stage specific files (`git add <files>`), not `git add .`
- Push early: `git push -u origin <branch-name>`
- No force-push on shared branches (use `--force-with-lease` only on your own branch if truly needed)

### Keeping your branch current
Before testing or opening a PR:
1. `git fetch origin`
2. `git merge origin/main` (or `git rebase origin/main` if the branch hasn't been shared)
3. Resolve conflicts deliberately — show both sides, ask before discarding anyone's changes

### Merging to main
1. Open a PR on GitHub (never merge locally and push to main)
2. The other person reviews before merge
3. `npm run build` must pass
4. After merge, delete the branch: `git push origin --delete <branch>` + `git branch -d <branch>`

### Hard stops — ask before doing any of these
- Committing or pushing to `main` directly
- `git push --force` or any history rewrite on a shared branch
- `git reset --hard`, `git checkout .`, or anything that discards uncommitted work
- Deleting branches that have not been merged
- Resolving a merge conflict by overwriting the other person's changes

## Known TODO
- 6 referenced images are missing from `public/` (incl. site logo `MangoRecorder801780436.png`
  and both Doc Sclater images). Recover from the live site before DNS cutover. See migration notes.
