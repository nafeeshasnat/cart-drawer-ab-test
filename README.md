# Cart drawer A/B test

Exercise a cart-drawer variation that recomputes shipping progress and its offer after every app render.

## Live demo
[Open the demo](https://nafeeshasnat.github.io/cart-drawer-ab-test/?v=b) · [Open control](https://nafeeshasnat.github.io/cart-drawer-ab-test/?v=control)

[![Playwright checks](https://github.com/nafeeshasnat/cart-drawer-ab-test/actions/workflows/qa.yml/badge.svg)](https://github.com/nafeeshasnat/cart-drawer-ab-test/actions/workflows/qa.yml)

## 30-second reviewer path
1. Begin at $40 with $35 remaining. Increase the folio quantity to unlock shipping at $80.
2. Decrease to one, add the $9 tabs and inspect the $49 total and $26 remaining.
3. Remove the tabs, close and reopen, then run init twice. Check that one offer returns.

## How the variation attaches
The mock app replaces its drawer markup on each change. B observes the stable host, pauses observation while it inserts its three parts (a free-shipping bar under the drawer header, an upsell card after the line items and a trust row under Checkout), and recomputes everything from the app's cart snapshot in cents. It publishes the remaining cents it computed to the reviewer panel. On a real store the snapshot would come from `/cart.js` or the cart app's update event.
The variation script installs one lifecycle object on window. Pasting the script starts it; repeated evaluation reuses the same object. Call `window.reedfoldVariation.init()` to activate it again. CSS is scoped to variation markup.

## How to disable
Choose **Disable variation**, or call `window.reedfoldVariation.destroy()`. This disconnects observation, aborts variation listeners and removes the injected UI. Select Control for a shareable control URL.

## Where the mock ends
Independent frontend demo. All products, identifiers and app behavior are fictional. State resets on reload. The app stores quantities in memory. USD prices are integer cents. The $75 threshold uses the merchandise subtotal before tax or discounts. The panel displays null shipping progress while B is disabled. The switch is for manual preview; there is no traffic allocation, analytics or measured lift.

## QA matrix
[Acceptance checks and observed environments](QA-MATRIX.md) · [Agency handoff](HANDOFF.md)

## Run locally
Serve the root with `python3 -m http.server 8080` and open `http://localhost:8080/?v=b`. No storefront build is needed.

For QA, install Node 22+, then run `npm install`, `npx playwright install chromium` and `npm test`. With no target supplied the runner starts a local HTTP server. To repeat the same tests against Pages, set `DEMO_BASE_URL=https://nafeeshasnat.github.io/cart-drawer-ab-test/` before running `npm test`.
