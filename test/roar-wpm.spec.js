// tests/roar-wpm.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('RoarWPM E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Load the local HTML file directly
    const filePath = `file://${path.resolve(__dirname, '../index (1).html')}`;
    await page.goto(filePath);
  });

  test('should accept a username and update the sidebar', async ({ page }) => {
    // Wait for the username modal to be visible
    const usernameInput = page.locator('#usernameInput');
    await expect(usernameInput).toBeVisible();

    // Fill in the username and save
    await usernameInput.fill('SpeedyBear');
    await page.locator('#saveUsernameBtn').click();

    // Verify the modal hides and the sidebar updates
    await expect(page.locator('#usernameModal')).toHaveClass(/hidden/);
    await expect(page.locator('#sidebarTitle')).toHaveText("SpeedyBear's Scores");
  });

  test('should adjust the timer using the slider', async ({ page }) => {
    // Bypass username for this test by simulating local storage
    await page.evaluate(() => localStorage.setItem('BearPawTypeUsername', 'TestUser'));
    await page.reload();

    // Check default timer label is 60s
    await expect(page.locator('#timerLabel')).toHaveText('Test Duration: 60s');

    // Change slider value to 30
    const slider = page.locator('#timerSlider');
    await slider.fill('30');
    // Dispatch input event to trigger the JS listener
    await slider.dispatchEvent('input');

    await expect(page.locator('#timerLabel')).toHaveText('Test Duration: 30s');
    await expect(page.locator('#activeTimerText')).toHaveText('30');
  });

  test('should simulate typing and start the test', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('BearPawTypeUsername', 'TestUser'));
    await page.reload();

    // Press a key to start the test
    await page.keyboard.press('a');

    // The active timer container should become visible
    await expect(page.locator('#activeTimerContainer')).toHaveClass(/visible/);
    
    // The Start Test button text should change to 'Restart'
    await expect(page.locator('#restartBtn')).toHaveText('Restart');
  });

  test('should show Caps Lock warning', async ({ page }) => {
    // Turn on CapsLock
    await page.keyboard.down('CapsLock');
    await page.keyboard.up('CapsLock');
    
    // Check if the warning becomes visible
    await expect(page.locator('#capsWarning')).toBeVisible();
  });
});
