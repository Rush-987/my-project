# LabBuddy Authentication Package

This package adds Supabase email/password + Google authentication to the existing GitHub Pages site, plus account dashboard, password recovery, private notes and progress tracking protected by database Row Level Security.

## Quick start
1. Extract this package into a temporary folder.
2. Copy all files/folders into the root of your existing `Rush-987/my-project` repository, preserving the existing landing page and `CNAME`.
3. From the repository root, run `python3 apply_landing_patch.py` to add Sign in/Get started navigation and point the main CTA buttons to the protected dashboard. The patch is idempotent.
4. Follow `SETUP.md`: create a Supabase project, configure `config.js`, run `supabase/schema.sql`, set redirect URLs, enable email verification and configure Google OAuth.
5. Commit and push the updated repository to GitHub Pages.

## Files
- `config.js` — public Supabase URL and publishable/anon key placeholders.
- `auth-client.js` — shared browser client and UI helpers.
- `signin.html/js`, `signup.html/js` — email/password and Google auth.
- `forgot-password.html/js`, `update-password.html/js` — recovery flow.
- `dashboard.html/js` — session-gated workspace, private notes and progress.
- `auth.css` — styling consistent with the existing dark/cyan LabBuddy theme.
- `supabase/schema.sql` — profile trigger, data tables, grants and RLS policies.
- `SETUP.md` — provider setup, deployment and test checklist.
- `apply_landing_patch.py` — non-destructive homepage integration patch.

## Important
The frontend is static. GitHub Pages cannot prevent someone from downloading public HTML/JS files. Private user data is protected by Supabase RLS. Do not place secrets, private content, privileged API keys, or service-role credentials in this repository. Real privileged lab provisioning needs a trusted backend.
