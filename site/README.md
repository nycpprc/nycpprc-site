# nycpprc static site
Plain HTML/CSS/JS. No build step. Deploy this folder as is.

- Homepage: `index.html` is the NYCPPRC marketing page (the same copy that was parked at `/legacy/`). `/` on nycpprc.org serves it. www.nycpprc.org is a GitHub Pages 301 to the apex, so it gets the same page. This file must not redirect to gnosis.events.
- Members app: `/app/` goes to https://gnosis.events/ (that URL is the account screen). `/app/preview/` keeps the path and goes to https://gnosis.events/preview (the public club page inside Gnosis Events). `/app/sign-in/` goes to https://gnosis.events/sign-in and keeps its query string and hash. `/app/sign-up/` and `/app/login/` go to https://gnosis.events/sign-in, which is the only account screen. Any other `/app/**` path is forwarded by `404.html` to the same path on https://gnosis.events (`/app/rooms` becomes `/chat`). GitHub Pages cannot send an HTTP redirect, so these pages use a meta refresh plus `location.replace`.
- One marketing home: `/legacy/` redirects to `/`. The old homepage aliases `/home`, `/about`, and `/events` also redirect to `/`. Other `/legacy/` pages redirect to the live FAQ, host, donate, contact, and newsletter URLs. Privacy and terms stay at `/privacy/` and `/terms/`.
- Local preview: `python3 -m http.server` in this folder.
- Refresh Meetup data: `python3 ../scripts/update_meetup.py` writes data/events.json and data/hosts.json (standard library only). Run it on a schedule, e.g. a daily GitHub Action that commits the changes. The homepage reads those files.
- News: edit data/news.json. The News section on the homepage reads it.
- Text: edit the HTML pages directly. FAQ = faq.html; forms = host.html and contact.html (partner.html and partner/ only redirect to contact.html).
- Newsletter (Mailchimp): the live form is in newsletter.html and on the homepage.
