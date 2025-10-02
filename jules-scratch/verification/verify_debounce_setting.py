import re
from playwright.sync_api import sync_playwright, Page, expect

def verify_debounce_setting(page: Page):
    """
    This test verifies that the user can change the debounce delay
    in the settings panel.
    """
    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:3000")

    # The page might redirect to /new, so we wait for the load state to be 'load'
    page.wait_for_load_state('load')

    # If it's the first time, we'll be on the /new page.
    # Click "Start from scratch" to load the main editor.
    if "/new" in page.url:
        page.get_by_role("button", name="Start from scratch").click()

    # 2. Act: Open the settings panel.
    # The settings button is an icon button. We find it by its content.
    settings_button = page.get_by_text("settings")
    settings_button.click()

    # 3. Assert: Check if the new input option is visible and has the correct default value.
    # The label is "Auto-generate delay (ms)"
    delay_input = page.get_by_label("Auto-generate delay (ms)")

    # Check that the input is visible
    expect(delay_input).to_be_visible()

    # Check that the default value is 400 for desktop
    expect(delay_input).to_have_value("400")

    # 4. Act: Change the value of the input.
    delay_input.fill("1000")

    # 5. Assert: Check if the value was updated.
    expect(delay_input).to_have_value("1000")

    # 6. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_debounce_setting(page)
        finally:
            browser.close()

if __name__ == "__main__":
    main()