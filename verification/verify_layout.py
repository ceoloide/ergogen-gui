import time
from playwright.sync_api import sync_playwright

def verify_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Large viewport
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # Listen for console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

        print("Navigating to /interactive-layout...")
        page.goto("http://localhost:3000/interactive-layout")

        # Wait for potential errors to appear
        time.sleep(2)

        # Check for overlay
        overlay = page.locator("#webpack-dev-server-client-overlay")
        if overlay.count() > 0:
            print("Webpack overlay detected.")
            # Try to get content inside the iframe
            try:
                # access the iframe content
                frame = overlay.content_frame
                if frame:
                    error_text = frame.locator("body").inner_text()
                    print(f"Overlay Error Text: {error_text}")
            except Exception as e:
                print(f"Could not read overlay text: {e}")

            # Remove the overlay
            print("Removing overlay...")
            page.evaluate("document.getElementById('webpack-dev-server-client-overlay').remove()")

        # Wait for the page to load - check for the App Name in the header
        try:
            page.wait_for_selector("text=Ergogen", timeout=5000)
            print("Page loaded (Header found).")
        except:
            print("Page load timed out or header not found.")

        # Check for Panels
        print("Checking for panels...")

        # Tools Panel Check
        if page.locator("button[title='Select Tool']").is_visible():
            print("Tools panel visible (Select Tool button found).")
        else:
            print("Tools panel NOT visible.")

        # Properties Panel Check - look for GRID heading
        if page.get_by_role("heading", name="GRID").is_visible():
            print("Properties panel visible (GRID heading found).")
        else:
            print("Properties panel NOT visible (GRID heading NOT found).")

        # Check for Canvas
        if page.locator("canvas").count() > 0:
            print("Canvas element found.")
        else:
            print("Canvas element NOT found.")

        # Check Properties Interactions
        print("Interacting with properties...")

        # 1. Toggle Grid
        grid_label = page.get_by_text("Show Grid")
        grid_input = page.locator("#showGrid") # The hidden input

        if grid_label.is_visible():
            print("Grid label found.")
            # Check initial state (should be checked)
            if grid_input.is_checked():
                print("Grid is enabled by default.")
            else:
                print("Grid is disabled by default.")

            # Click the label to toggle
            grid_label.click()
            time.sleep(0.5)
            print(f"Grid toggled. Now checked: {grid_input.is_checked()}")

            # Click again to restore
            grid_label.click()
        else:
            print("Grid label NOT found.")

        # 2. Unit/Size Logic
        size_input = page.get_by_label("Grid Size")
        unit_select = page.get_by_label("Grid Unit")

        if size_input.is_visible() and unit_select.is_visible():
             # Initial State: 1 U
             val = size_input.input_value()
             unit = unit_select.input_value()
             print(f"Initial State: {val} {unit}")

             # Change Unit to mm
             print("Changing unit to mm...")
             unit_select.select_option("mm")
             time.sleep(0.2)
             val = size_input.input_value()
             print(f"Value in mm: {val} (Expected ~19.05)")

             # Set to 10 mm
             print("Setting size to 10 mm...")
             size_input.fill("10")

             # Change Unit to U
             print("Changing unit back to U...")
             unit_select.select_option("U")
             time.sleep(0.2)
             val = size_input.input_value()
             print(f"Value in U: {val} (Expected ~0.525)")

        else:
             print("Grid Size input or Unit selector NOT found.")

        # Capture screenshot
        print("Capturing screenshot...")
        page.screenshot(path="verification/layout_editor.png")
        print("Screenshot saved to verification/layout_editor.png")

        browser.close()

if __name__ == "__main__":
    verify_layout()
