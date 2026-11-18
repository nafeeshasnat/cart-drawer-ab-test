# Agency handoff

**Change.** B adds a free-shipping progress bar under the drawer header, a one-click upsell card after the line items (hidden once the add-on is in the cart) and a trust row under Checkout. All three are rebuilt from the current cart snapshot after every app render.

**Target.** This repo's fictional drawer host and mock cart API. Preview with `?v=b`. Review control with `?v=control`. No automatic launch.

**Events.** The app handles quantity changes and publishes cart:rendered. B invokes the app add method and emits reedfold:shipping with remaining cents for inspection. No analytics tags fire.

**Rollback.** Disable variation in the toolbar or call `window.reedfoldVariation.destroy()`. No theme changes are needed to restore control.

**Limits.** Local fictional data; no merchant API, payment, analytics or traffic assignment. Physical-device testing is pending. Recheck selectors, plan eligibility, app events and the agreed browser matrix before adapting to a different environment.
