from playwright.sync_api import sync_playwright
import time
import json

# Simple config with a key
CONFIG_YAML = """
points:
  zones:
    matrix:
      columns:
        col1:
      rows:
        row1:
          tags:
            key: true
"""

def verify_viz_mode():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})

        # Set config
        # Value must be JSON stringified string if it's a string in TS useLocalStorage?
        # App.tsx: useLocalStorage<string>(...).
        # So we store the raw YAML string as a JSON string?
        # "value" -> "\"value\""

        config_json = json.dumps(CONFIG_YAML)

        context.add_init_script(f"""
            localStorage.setItem('ergogen:config', {json.dumps(config_json)});
        """)

        page = context.new_page()

        print("Navigating to /interactive-layout...")
        page.goto("http://localhost:3000/interactive-layout")

        try:
            page.wait_for_selector("text=Visualization", timeout=10000)
            print("Visualization selector found.")
        except:
            print("Selector not found.")

        # Select Visual Mode
        print("Selecting Visual Mode...")
        page.get_by_label("Visualization Mode").select_option("visual")
        time.sleep(1)
        page.screenshot(path="verification/viz_visual.png")
        print("Screenshot saved: verification/viz_visual.png")

        # Select Wireframe Mode
        print("Selecting Wireframe Mode...")
        page.get_by_label("Visualization Mode").select_option("wireframe")
        time.sleep(1)
        page.screenshot(path="verification/viz_wireframe.png")
        print("Screenshot saved: verification/viz_wireframe.png")

        browser.close()

if __name__ == "__main__":
    verify_viz_mode()
