from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000/dashboard/calendar")
    page.wait_for_timeout(2000)

    # Note from image: the appointment shows up as "Kowalski" in the grid under the time.
    appointment = page.locator("text=Kowalski").first
    if appointment.is_visible():
        appointment.click()
        page.wait_for_timeout(1000)

        # Verify the dialog opened
        page.wait_for_selector("text=Szczegóły wizyty")

        # Locate our new accessible toggle by role
        toggle = page.get_by_role("switch")

        # Verify it exists and screenshot
        toggle.wait_for(state="visible")

        # Focus it to show the focus-visible styles using keyboard
        page.keyboard.press("Tab") # May need a few tabs depending on DOM order, let's just use focus()
        toggle.focus()
        page.wait_for_timeout(1000)
        page.screenshot(path="/app/verification/screenshots/toggle_focused.png")

        # Click it to test interactivity
        toggle.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="/app/verification/screenshots/toggle_clicked.png")

        # Click again to revert
        toggle.click()
        page.wait_for_timeout(1000)

        # Screenshot of the full dialog for final verification
        page.screenshot(path="/app/verification/screenshots/dialog_final.png")
    else:
        print("No appointments found with text 'Kowalski'.")

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
