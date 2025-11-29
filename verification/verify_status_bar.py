from playwright.sync_api import sync_playwright
import time

def verify_status_bar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # Listen for console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

        print("Navigating to /interactive-layout...")
        page.goto("http://localhost:3000/interactive-layout")

        # Wait for page load
        try:
            page.wait_for_selector("text=Ergogen", timeout=5000)
            print("Page loaded.")
        except:
             print("Page load timeout.")

        # Check for Status Bar elements
        print("Checking status bar elements...")

        # Check if overlay is blocking
        if page.locator("#webpack-dev-server-client-overlay").count() > 0:
             print("Webpack Overlay Detected!")
             frame = page.locator("#webpack-dev-server-client-overlay").content_frame
             if frame:
                  print(f"Error: {frame.locator('body').inner_text()}")

        if page.get_by_text("Zoom: 100%").is_visible():
             print("Zoom level found.")
        else:
             print("Zoom level NOT found.")

        if page.get_by_text("Keys: 15").is_visible():
             print("Keys count found.")
        else:
             print("Keys count NOT found.")

        # Check Mouse Coordinates
        print("Moving mouse to center...")
        page.mouse.move(640, 360)
        time.sleep(0.5)

        mouse_text_element = page.locator("text=Mouse:")
        if mouse_text_element.count() > 0:
             text = mouse_text_element.text_content()
             print(f"Status Bar Text: '{text}'")
        else:
             print("Mouse label not found")

        # Capture screenshot
        print("Capturing screenshot...")
        page.screenshot(path="verification/status_bar.png")
        print("Screenshot saved to verification/status_bar.png")

        browser.close()

if __name__ == "__main__":
    verify_status_bar()
