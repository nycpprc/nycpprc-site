# nycpprc.org

Static GitHub Pages site. `.github/workflows/deploy.yml` publishes the `site/` folder on every push to `main`. There is no build step.

Visitors are sent to the public NYCPPRC group on Gnosis Events:

https://gnosis.events/g/reading-philosophy

GitHub Pages cannot send an HTTP 301 for page content. Every HTML file under `site/` is the same redirect page: a canonical link, a 0-second meta refresh, and `location.replace`. Search engines treat a 0-second meta refresh as a permanent redirect. `404.html` is that same page, so a path with no file still sends the browser to the group URL. GitHub responds with HTTP 404 for those unknown paths before the page runs.

`www.nycpprc.org` is not configured in this repo. `site/CNAME` is `nycpprc.org`. GitHub Pages HTTP 301s `www` to the apex, then the apex page sends the browser to the group URL. Both hosts end on https://gnosis.events/g/reading-philosophy.

Files kept because the host needs them, not as pages:

- `site/CNAME` — custom domain
- `site/robots.txt` and `site/sitemap.xml` — crawlers

The old marketing pages, the `/app/` bundle, privacy, terms, and `/dashboard/` are not served. An earlier `index.html` comment said not to redirect the homepage to gnosis.events. That note is superseded.

`scripts/update_meetup.py` still fetches Meetup JSON, but nothing on the site reads it. The scheduled workflow that committed that JSON is manual-only now, so it does not keep republishing `site/data`.
