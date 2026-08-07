#!/usr/bin/env python3
"""Render the 30s caption cards (EN + KN) and both end cards."""
import pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent.resolve()
CARDS = ["en1","en2","en3","en4","en5","kn1","kn2","kn3","kn4","kn5","endEn","endKn"]

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1080,"height":1920}, device_scale_factor=1)
    pg.goto(f"file://{HERE}/overlays30.html", wait_until="networkidle")
    pg.wait_for_timeout(3000)
    for cid in CARDS:
        el = pg.locator(f"#{cid}")
        el.scroll_into_view_if_needed()
        pg.wait_for_timeout(120)
        el.screenshot(path=str(HERE / f"ov30-{cid}.png"), omit_background=not cid.startswith("end"))
        print(f"ov30-{cid}.png")
    b.close()
