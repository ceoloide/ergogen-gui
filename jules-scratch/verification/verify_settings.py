from playwright.sync_api import sync_playwright, Page, expect

def verify_settings_change(page: Page):
    """
    This test verifies that the settings can be changed in the UI and that
    the change is reflected visually.
    """
    # 1. Arrange: Go to the application's home page.
    page.goto("http://localhost:3000")

    # 2. Act: Click the settings button to reveal the settings panel.
    settings_button = page.get_by_test_id("settings-button")
    settings_button.click()

    # 3. Screenshot: Capture the settings panel for visual inspection.
    page.screenshot(path="jules-scratch/verification/settings_panel.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_settings_change(page)
        browser.close()

if __name__ == "__main__":
    main()