from playwright.sync_api import sync_playwright

def run_cuj(page):
    # 1. Start application context and navigate
    page.goto("http://localhost:3000/dashboard")
    page.wait_for_timeout(2000)

    # Take a screenshot to see what's loaded
    page.screenshot(path="/app/verification/screenshots/dashboard_load.png")

    # If the page structure is different, click the first appointment block directly
    # In fullcalendar or daypicker, it might just be the text "Jan Kowalski"
    appointment = page.locator("text=Jan Kowalski").first
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
        print("No appointments found with text 'Jan Kowalski'.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/app/verification/videos")
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
