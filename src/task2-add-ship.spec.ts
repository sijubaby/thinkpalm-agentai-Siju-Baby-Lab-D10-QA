import { test, expect } from '@playwright/test';

const BASE_URL = 'https://rest-hour-qa.synergymarinetest.com';

const testData = {
  username: process.env.USERNAME || 'your_username',
  password: process.env.PASSWORD || 'your_password',

  shipName: `QA Ship ${Date.now()}`,
  validIMO: `${Math.floor(1000000 + Math.random() * 9000000)}`,
  invalidIMO: 'ABC123',

  validShipEmail: 'ship@test.com',
  invalidShipEmail: 'invalidmail',

  notificationEmail: 'notify@test.com'
};

test.describe('Task2 - Add Ship Automation', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto(BASE_URL);

    await page.locator('#Input_Username').fill(testData.username);
    await page.locator('#Input_Password').fill(testData.password);

    await page.getByRole('button', { name: /login/i }).click();

    await page.waitForLoadState('networkidle');
  });

  test('TC_SHIP_001 - Add ship with valid mandatory details', async ({ page }) => {

    await navigateToAddShip(page);

    await fillMandatoryFields(page);

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.getByText(/Ship Added Successfully/i)
    ).toBeVisible();
  });

  test('TC_SHIP_002 - Mandatory validation for Company field', async ({ page }) => {

    await navigateToAddShip(page);

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.getByText(/company/i)
    ).toBeVisible();
  });

  test('TC_SHIP_003 - Invalid IMO validation', async ({ page }) => {

    await navigateToAddShip(page);

    await page.getByTestId('vesselImo').fill(testData.invalidIMO);

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.getByText(/invalid/i)
    ).toBeVisible();
  });

});

async function navigateToAddShip(page: any) {

  await page.getByRole('button', { name: /Ship/i }).click();

  await page.getByRole('button', { name: /Add Ship/i }).click();

  await page.waitForLoadState('networkidle');
}

async function fillMandatoryFields(page: any) {

  await page.locator('div')
    .filter({ hasText: 'Select Company' })
    .getByRole('combobox')
    .click();

  await page.keyboard.type('QA Company');

  await page.keyboard.press('Enter');

  await page.locator('input.date-picker-input:not([disabled])')
    .first()
    .fill('31/12/2026');

  await page.getByTestId('vesselName')
    .fill(testData.shipName);

  await page.getByTestId('vesselImo')
    .fill(testData.validIMO);

  await page.getByRole('textbox', { name: 'Ship Email' })
    .fill(testData.validShipEmail);

  await page.locator(
    'input[name=\"escallationEmailDocument[0].id\"]'
  ).fill(testData.notificationEmail);
}
