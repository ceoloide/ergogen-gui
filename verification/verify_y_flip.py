from playwright.sync_api import sync_playwright
import time

def verify_y_flip():
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

        # Center (approx)
        cx, cy = 640, 360
        page.mouse.move(cx, cy)
        time.sleep(0.5)

        # Get Mouse Coords from Status Bar
        # Format: "Mouse: x, y"
        def get_coords():
            txt = page.locator("text=Mouse:").text_content()
            # Parse "Mouse: 1.23, 4.56"
            parts = txt.replace("Mouse:", "").strip().split(",")
            return float(parts[0]), float(parts[1])

        x0, y0 = get_coords()
        print(f"Center: {x0}, {y0}")

        # Move UP (decrease screen Y)
        print("Moving UP...")
        page.mouse.move(cx, cy - 50) # 50px up
        time.sleep(0.2)
        x_up, y_up = get_coords()
        print(f"Up: {x_up}, {y_up}")

        if y_up > y0:
            print("SUCCESS: Y increased when moving UP.")
        else:
            print("FAILURE: Y did not increase when moving UP.")

        # Move DOWN (increase screen Y)
        print("Moving DOWN...")
        page.mouse.move(cx, cy + 50) # 50px down (from center)
        time.sleep(0.2)
        x_down, y_down = get_coords()
        print(f"Down: {x_down}, {y_down}")

        if y_down < y0:
            print("SUCCESS: Y decreased when moving DOWN.")
        else:
            print("FAILURE: Y did not decrease when moving DOWN.")

        browser.close()

if __name__ == "__main__":
    verify_y_flip()
