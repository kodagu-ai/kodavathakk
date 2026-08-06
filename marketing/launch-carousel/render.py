#!/usr/bin/env python3
"""Render each .slide div in slides.html to a 1080x1350 PNG."""
import pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent.resolve()

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 1500}, device_scale_factor=1)
    page.goto(f"file://{HERE}/slides.html", wait_until="networkidle")
    page.wait_for_timeout(2500)  # let webfonts settle
    slides = page.locator(".slide")
    n = slides.count()
    for i in range(n):
        el = slides.nth(i)
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        el.screenshot(path=str(HERE / f"slide-{i+1:02d}.png"))
        print(f"slide-{i+1:02d}.png")
    browser.close()
