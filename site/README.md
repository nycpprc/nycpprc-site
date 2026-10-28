# nycpprc static site
Plain HTML/CSS/JS. No build step. Deploy this folder as is.

- Homepage: `index.html` is the Gnosis Events marketing page. NYCPPRC (the NYC Plato & Philosophy Reading Club) is the featured group, at `/#club` and `/groups/nycpprc/`. The members app stays at `/app/`. The public app preview stays at `/app/preview/`. The app shell still says NYCPPRC until the next `publish-web` from nycpprc-app.
- Beta: `app/preview/index.html` draws a small Beta label beside the club name on that preview only. The next `publish-web` from nycpprc-app overwrites that shell. Put the same label in the app’s public home (`preview.web.tsx` / `PublicHome`) so it survives the next publish.
- Domain: GitHub Pages `CNAME` stays `nycpprc.org`. `gnosis.events` is the upcoming product domain and is not attached here. nycpprc.org remains the NYCPPRC group address.
- Marketing backup: `/legacy/` is a snapshot of the previous NYCPPRC marketing site, including the old homepage (`https://nycpprc.org/legacy/`). FAQ, host, donate, contact, newsletter, and partner stay at their current URLs. `/home` redirects to `/`. `/about` redirects to `/#club`. `/events` redirects to `/#upcoming`. Privacy and terms stay at `/privacy/` and `/terms/`.
- Revert the homepage to the old club marketing page: copy `legacy/index.html` over `index.html`. To send `/` to the app preview again, restore the meta-refresh `index.html` from git history.
- Local preview: `python3 -m http.server` in this folder.
- Refresh Meetup data: `python3 ../scripts/update_meetup.py` writes data/events.json and data/hosts.json (standard library only). Run it on a schedule, e.g. a daily GitHub Action that commits the changes.
- News: edit data/news.json. The News section is on the snapshotted marketing homepage (legacy/index.html), which reads legacy/data/news.json. The Meetup sync still writes data/events.json and data/hosts.json at the site root; the legacy copy is the snapshot from the cutover.
- Text: edit the HTML pages directly. FAQ = faq.html; forms = host.html and contact.html (partner.html and partner/ only redirect to contact.html).
- Newsletter (Mailchimp): the live form is in newsletter.html. The snapshotted homepage form is in legacy/index.html.
