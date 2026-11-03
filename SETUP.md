# LabBuddy authentication setup (GitHub Pages + Supabase)

This implementation keeps the existing static GitHub Pages hosting. Supabase provides identity, email verification, Google OAuth, password recovery, per-user database storage and row-level authorization.

## 1. Create and configure Supabase

1. Create a project at https://supabase.com/dashboard.
2. Open **Project Settings → API** and copy the Project URL and publishable/anon key.
3. Edit `config.js`:
   - `supabaseUrl`: your project URL.
   - `supabaseAnonKey`: the publishable/anon key.
   - Keep `siteUrl` as `https://labbuddy.work.gd`.
4. Never use the `service_role` key in browser JavaScript, GitHub Pages, or this repository.
5. In **SQL Editor**, run the complete `supabase/schema.sql` file.

The anon/publishable key is expected to be visible in a static frontend. Security depends on RLS policies, not hiding that key.

## 2. Supabase URL configuration

In **Authentication → URL Configuration** set:

- Site URL: `https://labbuddy.work.gd`
- Additional Redirect URLs:
  - `https://labbuddy.work.gd/**`
  - `https://www.labbuddy.work.gd/**` (only if you use this hostname)
  - `http://localhost:5500/**` (local development, optional)

Use the exact production domain that GitHub Pages serves. Do not use a wildcard domain outside your control.

## 3. Enable email/password and verification

In **Authentication → Providers → Email**:
- Enable Email provider.
- Enable email confirmations.
- Configure SMTP for production delivery. Supabase's built-in email service is rate-limited and intended for testing.
- Set the confirmation email redirect to your site if the template requires a redirect URL.

The signup flow sends a verification email. A user without a verified email should not be treated as fully onboarded.

## 4. Configure Google sign-in

1. In Google Cloud Console create an OAuth client ID of type **Web application**.
2. Add the Supabase callback URL shown in Supabase **Authentication → Providers → Google** to Google's Authorized redirect URIs. It typically looks like `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.
3. Add your production site origin `https://labbuddy.work.gd` to Authorized JavaScript origins where requested.
4. Paste the Google Client ID and Client Secret into Supabase's Google provider settings and enable the provider.
5. Save and test the Google flow on the production domain.

Do not put the Google Client Secret in this repository.

## 5. Deploy to GitHub Pages

Copy the new files into the repository root while preserving existing `index.html`, `styles.css`, `script.js`, `favicon.svg`, and `CNAME`. Replace the existing `index.html` and append the small navigation changes below. Add the new `auth.css`, `config.js`, `auth-client.js`, `signin.*`, `signup.*`, `forgot-password.*`, `update-password.*`, `dashboard.*`, and `supabase/schema.sql` files.

### Add links to existing landing page

In the existing `index.html`, inside `.site-nav`, add:
```html
<a href="signin.html">Sign in</a>
```
Change the existing `.nav-cta` link to:
```html
<a class="nav-cta" href="signup.html">Get started <span aria-hidden="true">↗</span></a>
```
Change the two existing "Enter Lab" / "Explore the Labs" / "Enter LabBuddy" calls to `dashboard.html` only if you want all lab entry points to require sign-in. The dashboard page itself checks the Supabase session; the data tables enforce per-user access with RLS.

Append to the existing `styles.css`:
```css
@import url('auth.css');
```
Prefer instead adding `<link rel="stylesheet" href="auth.css">` to each new page, as already done in these files.

The new pages reference `config.js` and `auth-client.js` from the site root. GitHub Pages will publish them automatically after commit.

## 6. Password recovery

The recovery link redirects to `update-password.html`. Ensure that URL is in Supabase's redirect allowlist and that the email template uses the Supabase recovery link (`{{ .ConfirmationURL }}`).

## 7. Verify before launch

Test in a private/incognito browser:
- Email signup, confirmation email and first login.
- Wrong password and unknown email errors.
- Google signup/login and return to dashboard.
- Forgot password, open email link, set new password, sign in.
- Sign out and direct navigation to `dashboard.html` redirects to sign-in.
- Create a note and mark a mission complete.
- Create a second user and verify they cannot read, update or delete the first user's rows (test via Supabase client/API, not only the UI).
- Verify anonymous requests cannot read `profiles`, `notes` or `lab_progress`.

## Security and scope notes

- GitHub Pages serves static files; it cannot protect a static HTML file from being downloaded. This implementation protects the account dashboard UX and, critically, all user data at the database layer with Supabase RLS. Never put confidential content or secrets in static files.
- The mission cards are starter dashboard content, not isolated remote lab environments. Real lab provisioning, privileged operations and secret-bearing APIs need a trusted server/Worker and server-side authorization.
- Keep Supabase RLS enabled. Do not create permissive `using (true)` policies for user tables.
- Add rate limiting/CAPTCHA in Supabase Auth settings if abuse becomes a concern.
- Configure a custom SMTP provider before public launch.
