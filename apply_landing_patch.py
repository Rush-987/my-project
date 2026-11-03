#!/usr/bin/env python3
"""Patch the existing LabBuddy homepage without replacing its visual design."""
from pathlib import Path
import re

p = Path("index.html")
if not p.exists():
    raise SystemExit("Run this script from the repository root (index.html not found).")
html = p.read_text(encoding="utf-8")

if 'href="signin.html"' not in html:
    html = html.replace(
        '<a href="#about">About</a>',
        '<a href="#about">About</a>\n        <a href="signin.html">Sign in</a>',
        1
    )

html = html.replace(
    '<a class="nav-cta" href="#labs">Enter Lab <span aria-hidden="true">↗</span></a>',
    '<a class="nav-cta" href="signup.html">Get started <span aria-hidden="true">↗</span></a>',
    1
)
html = html.replace(
    '<a class="button button-primary" href="#labs">Explore the Labs <span>→</span></a>',
    '<a class="button button-primary" href="dashboard.html">Open your workspace <span>→</span></a>',
    1
)
html = html.replace(
    '<a class="button button-primary" href="#labs">Enter LabBuddy <span>→</span></a>',
    '<a class="button button-primary" href="dashboard.html">Open LabBuddy <span>→</span></a>',
    1
)

if 'href="auth.css"' not in html:
    html = html.replace(
        '<link rel="stylesheet" href="styles.css">',
        '<link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="auth.css">',
        1
    )

p.write_text(html, encoding="utf-8")
print("Patched index.html. Existing layout, content, styles.css and script.js are preserved.")
