from playwright.sync_api import sync_playwright

def test_keyboard_focus():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/dashboard/calendar")

        # Wait for calendar to load
        page.wait_for_selector("text=Godz")

        # We need to create an appointment first so it shows up on the calendar
        page.get_by_role("button", name="Nowa Wizyta").click()
        page.wait_for_selector("text=Umów wizytę")
        page.click("button[role='combobox']")
        page.click("div[role='option']:first-child")

        # Set date to today and time to 12:00
        from datetime import datetime
        today = datetime.now().strftime("%Y-%m-%d")
        page.fill("input[type='date']", today)
        page.fill("input[type='time']", "12:00")
        page.get_by_role("button", name="Zapisz wizytę").click()
        page.wait_for_selector("text=Umów wizytę", state="hidden")

        # Wait for the appointment to appear on the calendar
        page.wait_for_selector(".bg-blue-100:has-text('12:00')")

        # Focus the appointment button using keyboard (Tab) until we hit it
        # Since it's a <button> now, it should be reachable via Tab
        # We'll just press Tab multiple times and check if any element with our class gets focus
        for _ in range(20):
            page.keyboard.press("Tab")
            is_focused = page.evaluate("document.activeElement.classList.contains('bg-blue-100')")
            if is_focused:
                break

        # Take a screenshot to show the focus ring
        page.screenshot(path="verification/calendar_focus.png")

        # Press Enter to open the dialog
        page.keyboard.press("Enter")
        page.wait_for_selector("text=Szczegóły wizyty")

        # Verify the quick payment toggle focus
        # It's the button with the text "Nieopłacona" or "Opłacona"
        # We'll Tab to it
        for _ in range(10):
            page.keyboard.press("Tab")
            active_text = page.evaluate("document.activeElement.innerText")
            if "opłacona" in (active_text or "").lower():
                break

        page.screenshot(path="verification/dialog_payment_focus.png")

        browser.close()

if __name__ == "__main__":
    test_keyboard_focus()
