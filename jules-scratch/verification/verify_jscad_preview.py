from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        page.goto("http://localhost:3000")
        time.sleep(5) # wait for the app to load

        # Wait for the main page to load
        expect(page.locator("h2:has-text('Ergogen')")).to_be_visible()

        # 1. Click the settings button
        page.locator("button:has-text('settings')").click()

        # 2. Click the "JSCAD Preview" checkbox
        page.get_by_label("JSCAD Preview (experimental)").check()

        # 3. Go back to the main view
        page.locator("button:has-text('keyboard_alt')").click()

        # 4. Click the "Generate" button
        page.locator("button:has-text('Generate')").click()

        time.sleep(5) # Wait for ergogen to process

        # 5. In the "Downloads" panel, click on `case.jscad`
        downloads_panel = page.locator("text=Downloads")
        expect(downloads_panel).to_be_visible(timeout=15000)

        case_jscad_link = page.locator("a:has-text('case.jscad')")
        expect(case_jscad_link).to_be_visible()
        case_jscad_link.click()

        # 6. Wait for the canvas element to appear
        canvas_element = page.locator("canvas")
        expect(canvas_element).to_be_visible(timeout=15000)

        # 7. Take a screenshot
        page.screenshot(path="jules-scratch/verification/jscad_preview.png")

        print("Screenshot saved to jules-scratch/verification/jscad_preview.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
        print("Error screenshot saved to jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
