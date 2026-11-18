(() => {
  let remaining = null;
  function inspect() {
    const snapshot = window.cartApp.snapshot();
    document.querySelector('#payload').textContent = JSON.stringify({ ...snapshot, remaining_cents: remaining }, null, 2);
    document.querySelector('#status').textContent = remaining === null ? 'Shipping calculation inactive' : 'USD · amounts in cents';
  }
  document.addEventListener('cart:rendered', inspect);
  document.addEventListener('reedfold:shipping', event => { remaining = event.detail; inspect(); });
  inspect();
})();
