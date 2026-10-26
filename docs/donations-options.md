# NYCPPRC donations & memberships: options (researched 2026-10-11)

**Goal:** a custom, on-brand donation/membership UI embedded in nycpprc.org (custom amounts, monthly/annual tiers, organizer picker, links in post-event emails), with ~85/15 organizer/group attribution and an organizer dashboard fed by an API or webhooks. If a fee isn't listed it is marked **unknown**.

## Recommendation (short)
1. **Now, if tax-deductibility isn't urgent:** form a **NY LLC (or an unincorporated group with an EIN)** and use **Stripe Checkout/Elements + Stripe Connect Express**. This is the only option here that fully meets the UI and per-organizer split goals: the site's own pages, `metadata.organizer_id`, destination charges with `application_fee` of 15%, Stripe Billing for monthly/annual plans, and webhooks feeding a small organizer dashboard (or Express's hosted dashboard). Payments are **not** tax-deductible. Watch out for NY publication cost (~$1.2k–$1.8k in NYC).
2. **If deductibility matters:** **NY not-for-profit corp + 501(c)(3) via 1023-EZ** (~$375 in govt fees plus CHAR410). Same Stripe stack (Stripe Connect is fine for nonprofits). Note: a charity paying organizers 85% of donations is a **private-benefit/inurement risk**. Organizers must be paid reasonable pay for services they provide (as contractors, with 1099-NEC), not a commission on gifts. Get a lawyer's view before using an 85/15 donation split.
3. **Fiscal sponsors (Fractured Atlas, HCB, SGF, PPF)** are quick to start but **you pay through their gateway**. The UI is their hosted or embeddable page, and you can't do per-organizer revenue splits. Payouts go to the project, and the project then pays its contractors. The one partial exception is Social Good Fund, which reportedly sets up a Stripe account for the project and provides an API key (confirm with them).

## Comparison
| | Fee | Own Stripe / custom embedded UI? | Organizer split | Data API/webhooks | Tax-deductible |
|---|---|---|---|---|---|
| Fractured Atlas | 8% admin fee incl. card processing; $25 dispute fee (+$25 if lost) | No. Their General Support page with a "Share/Embed" snippet; editable ask, default amounts, giving levels, all staff-reviewed (1–2 business days; levels within 5) | No. Fund releases go to the project via Stripe Connect (1–2 days review + 1–3 days transfer; documentation required for releases ≥$5k) | CSV export only; no public API found | Yes |
| Hack Club HCB (The Hack Foundation) | 7% flat incl. processing | Their donation page, "customizable and embeddable" form; all funds must run through HCB | No (project-level) | Read-only public API v3 (/donations, /transactions) only if Transparency Mode is on; no webhooks found | Yes |
| Social Good Fund | 8% (Model A) / 6.5% (Model C) + $29/mo (refunded if ≥$5k raised/yr) | Reportedly can set up a project Stripe account + API key (unverified, confirm) | Unknown | Possibly via Stripe | Yes |
| Players Philanthropy Fund | 6% on deposits + possible other fees (unknown) | Unknown | Unknown | Unknown | Yes |
| Open Collective | OCF (the US 501(c)(3) host) shut down 9/30/2024. Open Source Collective is 10%, open source only, 501(c)(6), not deductible | Platform's own pages | Expense-based payouts | GraphQL API (platform) | Not via an active US charitable host found |
| Own NY NFP + 501(c)(3) | NY DOS $75; 1023-EZ $275 (1023 $600); CHAR410 $25; Stripe standard fees (rate not verified here) | **Full** (Stripe Elements/Checkout/Billing) | Possible via Connect, but see the inurement caveat | **Full** (Stripe API + webhooks) | Yes, once approved |
| Own NY LLC + Stripe Connect | NY DOS $200 + publication (Manhattan ~$1,795; other boroughs ~$1,195–$1,745, per a vendor) + $50 certificate of publication | **Full** | **Full** (destination charges + application fee) | **Full** | **No** |

## Key facts and sources
- Fractured Atlas: 8% fee, no separate card fee: https://fracturedatlas.zendesk.com/hc/en-us/articles/115001290913-Administrative-Fees ; disputes/online gifts: https://fracturedatlas.zendesk.com/hc/en-us/articles/115001321293-Credit-Debit-Card-Donations ; payouts via Stripe Connect: https://fracturedatlas.zendesk.com/hc/en-us/articles/4405438561051-Setting-Up-Fund-Transfers-With-Stripe-Connect ; fund releases go to the project only, and the project issues tax docs to its contractors: https://fracturedatlas.zendesk.com/hc/en-us/articles/15598551795099-Fund-Release-FAQs ; page editing/CSV/embed snippet: https://fracturedatlas.zendesk.com/hc/en-us/articles/360050882714-How-Do-I-Edit-My-General-Support-Page ; giving levels: https://fracturedatlas.zendesk.com/hc/en-us/articles/360050882914
- HCB 7% fee incl. processing: https://help.hcb.hackclub.com/en/articles/15410000-how-do-i-set-up-and-share-my-donation-page ; all funds through HCB: https://help.hcb.hackclub.com/en/articles/15409723 ; API: https://help.hcb.hackclub.com/en/articles/15410633-how-do-i-use-the-hcb-api , https://hcb.hackclub.com/docs/api/v3 ; embeddable form: https://hackclub.com/fiscal-sponsorship/about/
- Social Good Fund rates: https://www.socialgoodfund.org/fiscal-sponsorship/sponsorship-rates/ , https://www.socialgoodfund.org/fiscal-sponsorship/faq/
- PPF 6%: https://ppf.org/faqs/
- OCF ended: https://opencollective.com/foundation ; host list/fees: https://github.com/opencollective/documentation/blob/main/fiscal-hosts/fiscal-hosts.md ; OSC: https://opencollective.com/OPENSOURCE
- Directory for other sponsors: https://www.fiscalsponsordirectory.org
- 1023-EZ $275 / 1023 $600: https://www.irs.gov/charities-non-profits/form-1023-and-1023-ez-amount-of-user-fee ; eligibility (≤$50k projected annual gross receipts, ≤$250k assets): https://www.irs.gov/about-irs/streamlining-the-1023-a-success-story , https://www.irs.gov/instructions/i1023ez . IRS timeline: not verified (unknown).
- NY NFP $75: https://dos.ny.gov/certificate-incorporation-domestic-not-profit-corporations-0 ; CHAR410 $25 (from search summary; verify at https://www.charitiesnys.com)
- NY LLC $200 + publication: https://dos.ny.gov/forming-limited-liability-company-new-york ; LLC Law §206: https://law.justia.com/codes/new-york/llc/article-2/206/ ; publication prices (vendor): https://www.llcpublishers.com/pricing
- Stripe Connect Express 1099: the platform is responsible for 1099 filing and needs W-9/tax info from connected accounts: https://support.stripe.com/express/questions/1099-tax-forms-for-stripe-express-users

## Paying organizers: legal/tax notes
- Payments to US organizers for services are generally 1099-NEC income for them. With Connect Express, **the group (the platform) is the filer**, and Stripe collects the tax info and can file the 1099s.
- Under a fiscal sponsor, the project pays organizers as contractors from released funds and must issue the 1099s itself (Fractured Atlas FAQ).
- 501(c)(3): pay must be reasonable and tied to services. A commission tied to donations raises inurement/private-benefit risk; get legal advice.
- LLC: donations are ordinary business income, not charitable gifts, and the 15% kept by the group is taxable income.

## Suggested architecture (static GitHub Pages site)
Static pages on nycpprc.org (tiers, custom amount, organizer picker via `?organizer=slug` in post-event emails) → a small serverless function (e.g., Cloudflare Worker/Netlify function) creates a Stripe Checkout Session (mode `payment` or `subscription`) with `transfer_data.destination` = the organizer's Express account and `application_fee_percent`/`application_fee_amount` = 15% → Stripe webhooks write to a datastore → organizer login (Express dashboard link via Login Links API, or a custom page). Stripe's processing rates were not verified in this research.
