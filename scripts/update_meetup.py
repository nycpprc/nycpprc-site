#!/usr/bin/env python3
"""Fetch NYC Philosophy & Psychology Meetup events (no login) -> site/data/events.json + hosts.json.
Primary: Meetup public GraphQL (https://www.meetup.com/gql2). Fallback: __NEXT_DATA__ Apollo state on the events page.
Usage: python3 scripts/update_meetup.py [--out site/data] [--months 6]"""
import json, re, sys, argparse, urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

GROUP = "reading-philosophy"
UA = {"User-Agent": "Mozilla/5.0 (nycpprc site updater)", "Content-Type": "application/json"}
Q = """query($u:String!,$s:EventStatus,$c:String,$sort:SortOrder){groupByUrlname(urlname:$u){name
 events(status:$s,first:50,after:$c,sort:$sort){totalCount pageInfo{hasNextPage endCursor}
 edges{node{id title eventUrl dateTime endTime isOnline eventType status going{totalCount}
 eventHosts{memberId name memberPhoto{id highResUrl}} venue{name address city state}}}}}}"""

def gql(variables):
    req = urllib.request.Request("https://www.meetup.com/gql2", headers=UA,
        data=json.dumps({"query": Q, "variables": variables}).encode())
    d = json.load(urllib.request.urlopen(req, timeout=30))
    if d.get("errors"): raise RuntimeError(d["errors"])
    return d["data"]["groupByUrlname"]["events"]

def fetch(status, sort, stop=None, max_pages=20):
    out, cur = [], None
    for _ in range(max_pages):
        ev = gql({"u": GROUP, "s": status, "c": cur, "sort": sort})
        nodes = [e["node"] for e in ev["edges"]]
        out += nodes
        if not ev["pageInfo"]["hasNextPage"] or (stop and nodes and stop(nodes[-1])): break
        cur = ev["pageInfo"]["endCursor"]
    return out

def fallback_upcoming():
    html = urllib.request.urlopen(urllib.request.Request(
        f"https://www.meetup.com/{GROUP}/events/", headers={"User-Agent": UA["User-Agent"]}), timeout=30).read().decode()
    a = json.loads(re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S).group(1))["props"]["pageProps"]["__APOLLO_STATE__"]
    ref = lambda r: a.get(r["__ref"]) if r else None
    res = []
    for k, v in a.items():
        if not k.startswith("Event:") or v.get("status") != "ACTIVE": continue
        hosts = []
        for h in v.get("eventHosts") or []:
            m = a.get(f"Member:{h['memberId']}", {})
            ph = ref(m.get("memberPhoto")) or {}
            hosts.append({"memberId": h["memberId"], "name": m.get("name", ""), "memberPhoto": {"highResUrl": ph.get("highResUrl")}})
        res.append({**v, "eventHosts": hosts, "venue": ref(v.get("venue"))})
    return res

def slim(e):
    v = e.get("venue") or {}
    venue = "Online" if e.get("isOnline") or v.get("name") == "Online event" else ", ".join(
        x for x in [v.get("name"), v.get("address"), None if (v.get("city") or "") in (v.get("address") or "") else v.get("city")] if x)
    return {"id": e["id"], "title": e["title"], "start": e["dateTime"], "end": e.get("endTime"),
            "online": bool(e.get("isOnline")), "venue": venue, "url": e.get("eventUrl") or f"https://www.meetup.com/{GROUP}/events/{e['id']}/",
            "going": (e.get("going") or {}).get("totalCount"),
            "hosts": [h.get("name") for h in e.get("eventHosts") or []]}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default=str(Path(__file__).resolve().parent.parent / "site/data"))
    ap.add_argument("--months", type=int, default=6); args = ap.parse_args()
    now = datetime.now(timezone.utc); cutoff = now - timedelta(days=30 * args.months)
    src = "graphql"
    try:
        upcoming = fetch("ACTIVE", "ASC")
        past = fetch("PAST", "DESC", stop=lambda n: datetime.fromisoformat(n["dateTime"]) < cutoff)
    except Exception as ex:
        print("GraphQL failed, using __NEXT_DATA__ fallback:", ex, file=sys.stderr)
        try:
            src, upcoming, past = "next_data", fallback_upcoming(), []
        except Exception as ex2:
            sys.exit(f"ERROR: fallback also failed ({ex2}); existing data left untouched")
    upcoming = sorted([e for e in upcoming if datetime.fromisoformat(e["dateTime"]) >= now - timedelta(hours=3)], key=lambda e: e["dateTime"])
    hosts = {}
    for e in past + upcoming:
        t = datetime.fromisoformat(e["dateTime"])
        if t < cutoff or t > now: continue
        for h in e.get("eventHosts") or []:
            r = hosts.setdefault(h["memberId"], {"memberId": h["memberId"], "name": h.get("name"),
                 "photo": (h.get("memberPhoto") or {}).get("highResUrl"), "eventsHosted": 0, "lastHosted": None,
                 "profileUrl": f"https://www.meetup.com/members/{h['memberId']}/"})
            r["eventsHosted"] += 1
            if not r["lastHosted"] or e["dateTime"] > r["lastHosted"]: r["lastHosted"] = e["dateTime"]
    out = Path(args.out)
    if not upcoming and not hosts:
        sys.exit("ERROR: scrape returned no upcoming events and no hosts; refusing to overwrite existing data")
    out.mkdir(parents=True, exist_ok=True)
    meta = {"generated": now.isoformat(timespec="seconds"), "source": src, "group": f"https://www.meetup.com/{GROUP}/"}
    (out / "events.json").write_text(json.dumps({**meta, "upcoming": [slim(e) for e in upcoming]}, indent=2, ensure_ascii=False))
    hl = sorted(hosts.values(), key=lambda h: (-h["eventsHosted"], h["name"] or ""))
    (out / "hosts.json").write_text(json.dumps({**meta, "windowMonths": args.months, "pastEventsScanned": len(past) if src == "graphql" else None,
        "note": None if src == "graphql" else "Fallback mode: past events unavailable; host counts incomplete.", "hosts": hl}, indent=2, ensure_ascii=False))
    print(f"[{src}] {len(upcoming)} upcoming, {len(past)} past scanned, {len(hl)} active hosts -> {out}")

if __name__ == "__main__": main()
