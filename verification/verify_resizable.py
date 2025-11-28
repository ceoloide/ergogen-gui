from playwright.sync_api import sync_playwright

def verify_resizable():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        print("Navigating to /interactive-layout...")
        page.goto("http://localhost:3000/interactive-layout")

        # Wait for page load
        page.wait_for_selector("text=Ergogen")

        # Check Tools Panel
        tools_panel = page.get_by_test_id("tools-panel")
        if tools_panel.is_visible():
            print("Tools panel is visible.")

            # Check for resize handle
            handle = page.get_by_test_id("tools-panel-resize-handle")
            if handle.count() == 0:
                print("SUCCESS: Resize handle NOT found for Tools panel.")
            else:
                print("FAILURE: Resize handle FOUND for Tools panel.")
        else:
             print("Tools panel NOT visible.")

        browser.close()

if __name__ == "__main__":
    verify_resizable()
