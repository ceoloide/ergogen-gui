from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the page with the specified github repo
    page.goto("http://localhost:3000/?github=github.com/ceoloide/corney-island", wait_until='networkidle')

    # Set the local storage key
    page.evaluate("() => { localStorage.setItem('ergogen:config:jscadPreview', 'true'); }")

    # Reload the page to apply the local storage change
    page.reload(wait_until='networkidle')

    # Find the list item containing the text "corney_island_bottom_tray.jscad"
    # and then find the preview button within that list item.
    preview_button = page.locator("li:has-text('corney_island_bottom_tray.jscad')").locator("button[aria-label='Preview']")

    # Click the preview button
    preview_button.click()

    # Wait for the canvas to be visible
    canvas = page.locator("canvas")
    expect(canvas).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
