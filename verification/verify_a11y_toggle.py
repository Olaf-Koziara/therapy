from playwright.sync_api import sync_playwright

def run_cuj(page):
    # 1. Start application context and navigate
    page.goto("http://localhost:3000/dashboard")
    page.wait_for_timeout(1000)

    # Note: If DB is empty, the dashboard might not load appointments or even basic user setup.
    # Seed data if necessary, or check if the app gracefully loads. We will click to open a dialog.

    # We need to find an appointment and click it to open the dialog, OR
    # Alternatively, create a mock UI directly in the script if navigating the full app is too complex due to auth/DB constraints,
    # but let's try the real app first.

    # 1.a Wait for UI
    page.wait_for_selector("text=Gabinet", timeout=10000)
    page.wait_for_timeout(1000)

    # Click first available appointment to open dialog
    # We will look for an element with text that looks like a patient name or an appointment block
    appointment = page.locator(".bg-blue-100").first
    if appointment.is_visible():
        appointment.click()
        page.wait_for_timeout(1000)

        # Verify the dialog opened
        page.wait_for_selector("text=Szczegóły wizyty")

        # Locate our new accessible toggle by role
        toggle = page.get_by_role("switch")

        # Verify it exists and screenshot
        toggle.wait_for(state="visible")

        # Focus it to show the focus-visible styles
        toggle.focus()
        page.wait_for_timeout(500)
        page.screenshot(path="/app/verification/screenshots/toggle_focused.png")

        # Click it
        toggle.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="/app/verification/screenshots/toggle_clicked.png")
    else:
        print("No appointments found. Make sure DB is seeded.")

if __name__ == "__main__":
    import os
    os.makedirs("/app/verification/videos", exist_ok=True)
    os.makedirs("/app/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/app/verification/videos")
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
