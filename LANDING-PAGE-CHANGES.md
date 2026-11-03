# Landing page integration

The existing homepage should remain intact. Apply these exact changes to `index.html`:

1. In `<nav id="site-nav"...>`, add `<a href="signin.html">Sign in</a>`.
2. Change `.nav-cta` from `href="#labs"` to `href="signup.html"` and its label to `Get started`.
3. Change the primary hero action `href="#labs"` to `href="dashboard.html"` and label to `Open your workspace`.
4. Change the final CTA `href="#labs"` to `href="dashboard.html"` and label to `Open LabBuddy`.
5. Keep the informational section anchors and footer unchanged.

Add this to `index.html` head:
```html
<link rel="stylesheet" href="auth.css">
```
The auth stylesheet only adds auth/dashboard-specific rules; it does not restyle the existing landing page.
