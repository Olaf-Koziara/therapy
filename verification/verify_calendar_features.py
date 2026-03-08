import time
from playwright.sync_api import sync_playwright
from datetime import datetime

def verify_calendar_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Waiting for server...")
        for i in range(30):
            try:
                page.goto("http://localhost:3000/dashboard/calendar")
                break
            except Exception as e:
                time.sleep(1)
                if i == 29:
                    raise e

        print("Server ready. Creating Appointment...")

        # 1. Create Appointment
        page.get_by_role("button", name="Nowa Wizyta").click()
        page.wait_for_selector("text=Umów wizytę")
        page.click("button[role='combobox']")
        page.click("div[role='option']:first-child")

        today = datetime.now().strftime("%Y-%m-%d")
        page.fill("input[type='date']", today)
        page.fill("input[type='time']", "12:00")
        page.get_by_role("button", name="Zapisz wizytę").click()

        # Increased timeout and more specific wait
        try:
            page.wait_for_selector("text=Umów wizytę", state="hidden", timeout=60000)
        except Exception as e:
            page.screenshot(path="verification/error_dialog_stuck.png")
            print("Dialog did not close!")
            raise e

        print("Appointment created. Testing Details Dialog...")

        # 2. Click Appointment to Open Details
        page.wait_for_selector(".bg-blue-100")
        page.click(".bg-blue-100:has-text('12:00')")

        page.wait_for_selector("text=Szczegóły wizyty")
        page.screenshot(path="verification/details_dialog.png")
        print("Details dialog opened.")

        # 3. Test Edit
        page.click("button:has-text('Edytuj wizytę')")
        page.wait_for_selector("text=Edytuj wizytę")
        page.fill("input[type='time']", "13:00")
        # Ensure it clicks the correct save button, not the save note button
        page.get_by_role("button", name="Zapisz", exact=True).click()

        page.wait_for_selector("text=Edytuj wizytę", state="hidden", timeout=60000)
        page.wait_for_selector(".bg-blue-100:has-text('13:00')")
        page.screenshot(path="verification/calendar_edited.png")
        print("Appointment edited successfully.")

        # 4. Test Delete
        page.click(".bg-blue-100:has-text('13:00')")
        page.wait_for_selector("text=Szczegóły wizyty")

        page.on("dialog", lambda dialog: dialog.accept())
        page.click("button:has-text('Usuń')")

        page.wait_for_selector(".bg-blue-100:has-text('13:00')", state="hidden")
        page.screenshot(path="verification/calendar_deleted.png")
        print("Appointment deleted successfully.")

        browser.close()

if __name__ == "__main__":
    verify_calendar_features()
