from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Wait for the app to start and go to the calendar page
    page.goto("http://localhost:3000/dashboard/calendar")

    # Wait for the calendar grid to load
    page.wait_for_selector("text=Godz")

    # Check if there is a button for an appointment or if we can see the buttons
    # Take a screenshot of the calendar week view
    page.screenshot(path="verification/calendar.png")

    # Find the appointment button and click it to open the details dialog
    appointment_buttons = page.locator("button.border-l-4")
    if appointment_buttons.count() > 0:
        appointment_buttons.first.click()
        page.wait_for_selector("text=Szczegóły wizyty")

        # Take a screenshot of the details dialog
        page.screenshot(path="verification/dialog.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
