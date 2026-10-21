# nycpprc static site
Plain HTML/CSS/JS. No build step. Deploy this folder as is.

- Preview: `python3 -m http.server` in this folder.
- Refresh Meetup data: `python3 ../scripts/update_meetup.py` writes data/events.json and data/hosts.json (standard library only). Run it on a schedule, e.g. a daily GitHub Action that commits the changes.
- News: edit data/news.json. The News section appears on the home page only when it has items.
- Text: edit the HTML pages directly. FAQ = faq.html; forms = host.html and contact.html (partner.html and partner/ only redirect to contact.html).
- Newsletter (Mailchimp): in index.html and newsletter.html, replace REPLACE_DC / REPLACE_U / REPLACE_LIST_ID in the form action and honeypot name with values from your Mailchimp embedded-form code, then remove data-placeholder="true". Until then, submitting shows a "coming soon" message.
