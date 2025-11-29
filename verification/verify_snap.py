from playwright.sync_api import sync_playwright
import time

def verify_snap():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        print("Navigating to /interactive-layout...")
        page.goto("http://localhost:3000/interactive-layout")

        # Wait for page load
        try:
            page.wait_for_selector("text=Ergogen", timeout=5000)
            print("Page loaded.")
        except:
             print("Page load timeout.")

        # Enable Snap to Grid
        # The switch label is "Snap to Grid"
        print("Enabling Snap to Grid...")
        snap_label = page.get_by_text("Snap to Grid")
        snap_label.click()
        time.sleep(0.5)

        # Check if Snap Status appears
        print("Checking for Snap status...")
        # Move mouse to trigger update
        page.mouse.move(640, 360)
        time.sleep(0.2)

        snap_status = page.locator("text=Snap:")
        if snap_status.count() > 0:
             text = snap_status.text_content()
             print(f"Snap Status Found: '{text}'")

             # Verify coordinate is close to 0,0 or multiple of 2.38
             # Center (640, 360) -> 0,0 snapped.
             # Move slightly
             page.mouse.move(645, 360) # +5 pixels. +5 mm (k=1).
             # 5 / 2.38 = 2.1. Should snap to 2.38 (2.38mm / 19.05 = 0.125 U)
             time.sleep(0.2)
             text = snap_status.text_content()
             print(f"Snap Status Moved: '{text}'")
        else:
             print("Snap Status NOT found.")

        # Capture screenshot
        print("Capturing screenshot...")
        page.screenshot(path="verification/snap_grid.png")
        print("Screenshot saved to verification/snap_grid.png")

        browser.close()

if __name__ == "__main__":
    verify_snap()
