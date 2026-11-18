const { test, expect } = require('./fixture');

const button = (p, name) => p.getByRole('button', { name, exact: true });
const click = (p, name) => button(p, name).click();
const message = p => p.locator('.reedfold-message');
const state = async p => JSON.parse(await p.locator('#payload').innerText());
async function oneSet(p) {
  await expect(p.locator('progress')).toHaveCount(1);
  await expect(button(p, 'Add tabs')).toHaveCount(1);
}
test.beforeEach(async ({ page }) => { await page.goto('./?v=b'); });

test('01 First open shows 3500 cents remaining', async ({ page }) => {
  await expect(message(page)).toHaveText('$35.00 to free shipping');
  await expect(page.locator('progress')).toHaveJSProperty('value', 4000);
  expect((await state(page)).remaining_cents).toBe(3500);
});
test('02 Quantity crosses threshold upwards', async ({ page }) => {
  await click(page, 'Increase Reedfold folio');
  await expect(message(page)).toHaveText('Free shipping unlocked');
  expect((await state(page)).total_price).toBe(8000);
});
test('03 Decreasing restores remaining amount', async ({ page }) => {
  await click(page, 'Increase Reedfold folio');
  await click(page, 'Decrease Reedfold folio');
  await expect(message(page)).toHaveText('$35.00 to free shipping');
});
test('04 Upsell updates total and hides offer', async ({ page }) => {
  await click(page, 'Add tabs');
  await expect(button(page, 'Add tabs')).toHaveCount(0);
  await expect(message(page)).toHaveText('$26.00 to free shipping');
  expect((await state(page)).total_price).toBe(4900);
});
test('05 Removing upsell restores offer', async ({ page }) => {
  await click(page, 'Add tabs');
  await click(page, 'Remove Trellis tabs');
  await oneSet(page);
  expect((await state(page)).total_price).toBe(4000);
});
test('06 Empty cart returns full threshold', async ({ page }) => {
  await click(page, 'Remove Reedfold folio');
  await expect(message(page)).toHaveText('$75.00 to free shipping');
  expect(await state(page)).toEqual({items: [], item_count: 0, total_price: 0, remaining_cents: 7500});
});
test('07 Close and reopen mounts a single set', async ({ page }) => {
  await click(page, 'Close cart');
  await expect(page.locator('progress')).toHaveCount(0);
  await click(page, 'Open cart');
  await oneSet(page);
});
test('08 Ten renders settle without further observer activity', async ({ page }) => {
  await page.evaluate(() => {
    window.refreshCount = 0;
    document.addEventListener('reedfold:shipping', () => window.refreshCount++);
  });
  for (let i = 0; i < 10; i++) await click(page, 'Simulate app re-render');
  await oneSet(page);
  expect(await page.evaluate(() => window.refreshCount)).toBe(10);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await page.evaluate(() => window.refreshCount)).toBe(10);
});
test('09 Double init is safe', async ({ page }) => {
  await click(page, 'Run init twice');
  await oneSet(page);
  await click(page, 'Add tabs');
  expect((await state(page)).item_count).toBe(2);
});
test('10 Disable restores original drawer', async ({ page }) => {
  await click(page, 'Disable variation');
  await click(page, 'Increase Reedfold folio');
  await expect(page.locator('.reedfold-shipping')).toHaveCount(0);
  expect(await state(page)).toMatchObject({ total_price: 8000, remaining_cents: null });
});
test('11 Keyboard changes cart and can reopen it', async ({ page }) => {
  await button(page, 'Increase Reedfold folio').focus();
  await page.keyboard.press('Enter');
  await expect(message(page)).toHaveText('Free shipping unlocked');
  await button(page, 'Close cart').focus();
  await page.keyboard.press('Enter');
  await expect(button(page, 'Open cart')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(button(page, 'Close cart')).toBeFocused();
  await oneSet(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
