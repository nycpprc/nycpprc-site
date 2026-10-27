# nycpprc static site
Plain HTML/CSS/JS. No build step. Deploy this folder as is.

- Homepage: `index.html` sends `/` (nycpprc.org and www.nycpprc.org) to the public preview at `/app/preview/`. GitHub Pages cannot send an HTTP redirect, so the page uses a meta refresh plus `location.replace`. The members app at `/app/` is unchanged.
- Beta: `app/preview/index.html` draws a small Beta label beside the club name on that preview only. The next `publish-web` from nycpprc-app overwrites that shell. Put the same label in the app’s public home (`preview.web.tsx` / `PublicHome`) so it survives the next publish.
- Marketing backup: `/legacy/` is a snapshot of the previous marketing site, including the old homepage (`https://nycpprc.org/legacy/`). FAQ, host, donate, contact, newsletter, and partner stay at their current URLs. `/home`, `/about`, and `/events` redirect to `/legacy/` because those URLs were aliases of the old homepage. Privacy and terms stay at `/privacy/` and `/terms/`.
- Revert the homepage: copy `legacy/index.html` over `index.html`. To make `/home`, `/about`, and `/events` follow `/` again, point those redirect files back at `/`.
- Local preview: `python3 -m http.server` in this folder.
- Refresh Meetup data: `python3 ../scripts/update_meetup.py` writes data/events.json and data/hosts.json (standard library only). Run it on a schedule, e.g. a daily GitHub Action that commits the changes.
- News: edit data/news.json. The News section is on the snapshotted marketing homepage (legacy/index.html), which reads legacy/data/news.json. The Meetup sync still writes data/events.json and data/hosts.json at the site root; the legacy copy is the snapshot from the cutover.
- Text: edit the HTML pages directly. FAQ = faq.html; forms = host.html and contact.html (partner.html and partner/ only redirect to contact.html).
- Newsletter (Mailchimp): the live form is in newsletter.html. The snapshotted homepage form is in legacy/index.html.
