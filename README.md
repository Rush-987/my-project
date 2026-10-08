# LabBuddy Website

Modern static landing page for **labbuddy.work.gd**.

## Files

- `index.html` — page structure and content
- `styles.css` — responsive visual system, animations and layout
- `script.js` — mobile menu, reveal animations, terminal typing effect and dynamic year
- `favicon.svg` — lightweight site favicon
- `CNAME` — GitHub Pages custom-domain file for `labbuddy.work.gd`

## Deploy with GitHub Pages

1. Create a GitHub repository and upload these files to the publishing branch.
2. In **Settings → Pages**, enable GitHub Pages and select the publishing source.
3. Set the custom domain to `labbuddy.work.gd`.
4. At your DNS provider, configure the `labbuddy` subdomain as a CNAME pointing to your GitHub Pages hostname (`YOUR-USERNAME.github.io`).
5. Enable **Enforce HTTPS** in GitHub Pages when the certificate becomes available.

GitHub's current Pages documentation confirms that custom subdomains use a CNAME at the DNS provider and that the custom domain is configured in repository Pages settings.
