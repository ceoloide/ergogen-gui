from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")
        page.wait_for_selector('[data-testid="download-row-stl-a_case"]')
        page.screenshot(path="jules-scratch/verification/initial_state.png")

        # Click the generate button
        page.click('button:has-text("Generate")')

        # Wait for the download button to be enabled
        page.wait_for_selector('[data-testid="download-row-stl-a_case"]:not([disabled])')
        page.screenshot(path="jules-scratch/verification/final_state.png")

        browser.close()

run()
