from playwright.sync_api import sync_playwright
import time

def verify_unit_input():
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

        # Check for Grid Size input
        input_locator = page.get_by_label("Grid Size")
        if input_locator.is_visible():
            val = input_locator.input_value()
            print(f"Initial Grid Size: {val}")
        else:
            print("Grid Size input NOT found")
            return

        # Check Unit Button
        # It has aria-label="Change unit"
        unit_btn = page.get_by_label("Change unit")
        if unit_btn.is_visible():
            txt = unit_btn.text_content()
            print(f"Initial Unit: {txt}")

            # Click to cycle
            unit_btn.click()
            time.sleep(0.2)
            print(f"Unit after click: {unit_btn.text_content()}")

            # Reset to U (mm -> U -> u -> mm? No, U -> u -> mm -> U)
            # Default is U. Click -> u.
            # Click again -> mm.
            # Click again -> U.
            unit_btn.click() # mm
            unit_btn.click() # U
            time.sleep(0.2)
            print(f"Unit reset to: {unit_btn.text_content()}")
        else:
            print("Unit button NOT found")

        # Check Arrows
        # Increase value
        # Initial 1 U. Step 0.125 U.
        increase_btn = page.get_by_label("Increase value")
        if increase_btn.is_visible():
            increase_btn.click()
            time.sleep(0.2)
            val = input_locator.input_value()
            print(f"Value after increase: {val} (Expected 1.125)")

            # Decrease back
            decrease_btn = page.get_by_label("Decrease value")
            decrease_btn.click()
            time.sleep(0.2)
            val = input_locator.input_value()
            print(f"Value after decrease: {val} (Expected 1)")
        else:
            print("Arrow buttons NOT found")

        # Capture screenshot
        print("Capturing screenshot...")
        page.screenshot(path="verification/unit_input.png")
        print("Screenshot saved to verification/unit_input.png")

        browser.close()

if __name__ == "__main__":
    verify_unit_input()
