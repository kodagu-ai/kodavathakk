#!/usr/bin/env python3
"""Render each overlay card in overlays.html to a transparent 1080x1920 PNG
(the end card is opaque)."""
import pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent.resolve()
CARDS = ["t1", "t2", "t3", "t4", "t5", "end"]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    page.goto(f"file://{HERE}/overlays.html", wait_until="networkidle")
    page.wait_for_timeout(2500)  # webfonts
    for cid in CARDS:
        el = page.locator(f"#{cid}")
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(150)
        el.screenshot(
            path=str(HERE / f"overlay-{cid}.png"),
            omit_background=(cid != "end"),
        )
        print(f"overlay-{cid}.png")
    browser.close()
