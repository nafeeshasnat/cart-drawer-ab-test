(() => {
  if (window.reedfoldVariation) {
    window.reedfoldVariation.init();
    return;
  }
  const threshold = 7500;
  const upsellId = 6202;
  let observer;
  let active = false;
  let bar;
  let offer;
  let trust;
  let listeners;
  function clear() {
    listeners?.abort();
    bar?.remove();
    offer?.remove();
    trust?.remove();
    bar = offer = trust = null;
  }
  function build(view, cart, remaining) {
    const money = window.cartApp.money;
    bar = document.createElement('section');
    bar.className = 'reedfold-shipping';
    bar.innerHTML = `<strong class="reedfold-message"></strong>
      <progress aria-label="Free shipping progress" max="${threshold}"></progress>
      <small>Free shipping on orders over ${money(threshold)}</small>`;
    bar.querySelector('.reedfold-message').textContent = remaining
      ? `${money(remaining)} to free shipping` : 'Free shipping unlocked';
    bar.classList.toggle('is-unlocked', !remaining);
    bar.querySelector('progress').value = Math.min(cart.total_price, threshold);

    offer = document.createElement('section');
    offer.className = 'reedfold-offer';
    offer.innerHTML = `<span class="reedfold-thumb" aria-hidden="true"></span>
      <div><small>Pairs well with your folio</small><b>Trellis tabs</b><span>Paper dividers · ${money(900)}</span></div>
      <button type="button">Add tabs</button>`;
    offer.hidden = cart.items.some(item => item.id === upsellId);

    trust = document.createElement('ul');
    trust.className = 'reedfold-trust';
    trust.innerHTML = '<li>30-day returns</li><li>Secure checkout</li><li>Ships in 2 days</li>';

    listeners = new AbortController();
    offer.querySelector('button').addEventListener('click', () => {
      window.cartApp.addTabs();
      document.querySelector('#drawer-host [aria-label="Remove Trellis tabs"]')?.focus();
    }, { signal: listeners.signal });

    const head = view.querySelector('.drawer-head');
    const lines = view.querySelector('.drawer-lines');
    const foot = view.querySelector('.drawer-foot');
    head ? head.after(bar) : view.prepend(bar);
    (lines || view).append(offer);
    (foot || view).append(trust);
  }
  function refresh() {
    // Do not observe our own insertions or focus restoration.
    observer.disconnect();
    const host = document.querySelector('#drawer-host');
    const view = host?.querySelector('[data-cart-view]');
    const cart = window.cartApp?.snapshot();
    if (cart) {
      const remaining = Math.max(0, threshold - cart.total_price);
      document.dispatchEvent(new CustomEvent('reedfold:shipping', { detail: remaining }));
      if (view && !view.contains(bar)) {
        clear();
        build(view, cart, remaining);
      } else if (!view) clear();
    }
    observer.observe(host || document.documentElement, { childList: true, subtree: true });
  }
  function init() {
    if (active) return;
    active = true;
    observer = new MutationObserver(refresh);
    refresh();
  }
  function destroy() {
    active = false;
    observer?.disconnect();
    clear();
    document.dispatchEvent(new CustomEvent('reedfold:shipping', { detail: null }));
  }
  window.reedfoldVariation = { init, destroy };
  init();
})();
