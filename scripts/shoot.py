import sys
from playwright.sync_api import sync_playwright
jobs=[a.split('=',1) for a in sys.argv[1:]]  # out=url
with sync_playwright() as p:
    b=p.chromium.launch()
    for out,url in jobs:
        mobile='mobile' in out
        pg=b.new_page(viewport={'width':390,'height':844} if mobile else {'width':1440,'height':900},device_scale_factor=2 if mobile else 1)
        try: pg.goto(url,wait_until='networkidle',timeout=45000)
        except Exception as e: print('warn',url,e)
        pg.wait_for_timeout(1500); pg.screenshot(path=out,full_page=True); print('saved',out)
    b.close()
