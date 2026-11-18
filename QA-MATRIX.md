# Acceptance matrix

Observed on 18 November 2026 by running `tests/acceptance.spec.js` with Playwright 1.61.1 in Chrome for Testing 153 (headless) against a local static server. Each check ran in two projects: desktop 1280×800 and Pixel 7 emulation at 390×844 (emulation, not a real phone). Every test also fails on any page error or console error. Result: 22 of 22 passed.

| Environment | Action | Expected | Observed | Pass/Fail | Limitation |
|---|---|---|---|---|---|
| Desktop + mobile emulation | 1. First open with one $40 folio | $35 remaining | "$35.00 to free shipping", progress value 4000, `remaining_cents` 3500 | Pass | |
| Desktop + mobile emulation | 2. Increase folio to 2 | Threshold crossed upwards | "Free shipping unlocked", `total_price` 8000 | Pass | |
| Desktop + mobile emulation | 3. Increase, then decrease | Remaining amount returns | "$35.00 to free shipping" | Pass | |
| Desktop + mobile emulation | 4. Add the $9 tabs from the upsell | Total and bar update, offer hides | "$26.00 to free shipping", `total_price` 4900, offer hidden | Pass | |
| Desktop + mobile emulation | 5. Add tabs, then remove them | Offer returns once | 1 bar, 1 offer, `total_price` 4000 | Pass | |
| Desktop + mobile emulation | 6. Remove the folio (empty cart) | Full threshold remaining | "$75.00 to free shipping", state `{"items":[],"item_count":0,"total_price":0,"remaining_cents":7500}` | Pass | |
| Desktop + mobile emulation | 7. Close, then reopen the drawer | No duplicates | 0 bars while closed, 1 bar and 1 offer after reopening | Pass | |
| Desktop + mobile emulation | 8. Ten app re-renders | One set, no observer loop | 1 bar, 1 offer, 10 refreshes, no further refresh after two frames | Pass | |
| Desktop + mobile emulation | 9. Run init twice, add tabs | One set, one add | 1 set, `item_count` 2 | Pass | |
| Desktop + mobile emulation | 10. Disable, then increase quantity | Original drawer, no shipping calculation | 0 B elements, `total_price` 8000, `remaining_cents` null | Pass | |
| Desktop + mobile emulation | 11. Keyboard: increase, close, reopen | Works by keyboard, focus returns, no horizontal scroll | Unlocked message; focus on Open cart, then on Close cart; 1 set; page width within viewport | Pass | Focus order checked, not screen-reader output |
| GitHub Pages (live) | Same 11 checks against the live site via the workflow's `pages` target (GitHub Actions, Playwright Chromium, desktop + mobile emulation) | All pass | 22 of 22 passed on 19 November 2026 ([run](https://github.com/nafeeshasnat/cart-drawer-ab-test/actions/runs/44361818773)) | Pass | Emulation, not a real phone |
| Physical phone | All checks in portrait and landscape | All pass | Pending – Nafees to verify on a real device | Pending | Not yet observed |
