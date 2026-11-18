(() => {
  const host = document.querySelector('#drawer-host');
  const products = [
    { id: 6201, title: 'Reedfold folio', price: 4000 },
    { id: 6202, title: 'Trellis tabs', price: 900 }
  ];
  const quantities = new Map([[6201, 1]]);
  const money = cents => (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  let open = true;

  function snapshot() {
    const items = products.filter(product => quantities.has(product.id)).map(product => {
      const quantity = quantities.get(product.id);
      return { ...product, quantity, line_price: product.price * quantity };
    });
    return {
      items, item_count: items.reduce((sum, item) => sum + item.quantity, 0),
      total_price: items.reduce((sum, item) => sum + item.line_price, 0)
    };
  }
  function line(item) {
    return `<div class="line"><span class="thumb thumb-${item.id}" aria-hidden="true"></span>
      <div class="line-body"><div class="line-top"><strong>${item.title}</strong><span>${money(item.line_price)}</span></div>
        <div class="row"><div class="stepper"><button data-action="minus" data-id="${item.id}" aria-label="Decrease ${item.title}">−</button>
          <span>${item.quantity}</span><button data-action="plus" data-id="${item.id}" aria-label="Increase ${item.title}">+</button></div>
          <button class="link" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.title}">Remove</button></div></div></div>`;
  }
  function render() {
    const cart = snapshot();
    host.innerHTML = open ? `<section data-cart-view>
      <div class="drawer-head"><h2>Your cart <span>(${cart.item_count})</span></h2>
        <button data-action="close" aria-label="Close cart">×</button></div>
      <div class="drawer-lines">${cart.items.map(line).join('') || '<p class="empty">Your cart is empty.</p>'}</div>
      <div class="drawer-foot"><p class="subtotal">Subtotal <strong>${money(cart.total_price)}</strong></p>
        <button class="primary" disabled>Checkout</button><small class="note">Checkout is outside this demo.</small></div>
      </section>` : '';
    document.dispatchEvent(new CustomEvent('cart:rendered', { detail: cart }));
  }
  function change(id, quantity) {
    if (!products.some(product => product.id === id)) return;
    if (quantity > 0) quantities.set(id, quantity);
    else quantities.delete(id);
    render();
  }
  host.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === 'close') {
      open = false;
      render();
      document.querySelector('#open-cart').focus();
      return;
    }
    const key = Number(id);
    const quantity = quantities.get(key) || 0;
    change(key, action === 'remove' ? 0 : quantity + (action === 'plus' ? 1 : -1));
    (host.querySelector(`[data-action="${action}"][data-id="${id}"]`) || host.querySelector('[data-action=close]'))?.focus();
  });
  document.querySelector('#open-cart').onclick = () => {
    open = true;
    render();
    host.querySelector('[data-action=close]').focus();
  };
  window.cartApp = { snapshot, render, money, addTabs: () => change(6202, 1) };
  render();
})();
