from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000")

    # Click the "Generate" button
    generate_button = page.get_by_role("button", name="Generate")
    generate_button.click()

    # Wait for the confetti animation
    page.wait_for_timeout(1000)

    # Click it again to check for the error
    generate_button.click()
    page.wait_for_timeout(1000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
