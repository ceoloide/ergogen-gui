import { test, expect } from '@playwright/test';

test.describe('GitHub Gist Integration', () => {
  test('should load config from a Gist URL', async ({ page }) => {
    // Navigate to the welcome page
    await page.goto('/');

    // The Gist URL to test with. This should be a real Gist with a YAML file.
    const gistUrl = 'https://gist.github.com/keyboard-magpie/3ad232a93427357564d508205822361b';

    // Find the input field and the load button
    const githubInput = page.locator('input[placeholder="GitHub repo, Gist, or direct file URL"]');
    const loadButton = page.locator('button:has-text("Load")');

    // Fill in the Gist URL and click the load button
    await githubInput.fill(gistUrl);
    await loadButton.click();

    // Wait for navigation to the main editor page and for the editor to be populated
    await page.waitForURL('/');

    const editor = page.locator('.monaco-editor');
    await expect(editor).toBeVisible();

    // Check that the editor content is not empty
    const editorText = await editor.innerText();
    expect(editorText.trim()).not.toBe('');

    // You could also add more specific assertions here,
    // for example, checking for a specific string from the Gist's YAML content.
    // For this example, we'll just check that it's not empty.
    expect(editorText).toContain('points:');
  });
});