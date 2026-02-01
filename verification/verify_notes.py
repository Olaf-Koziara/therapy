import time
from playwright.sync_api import sync_playwright
from datetime import datetime

def verify_notes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Go to Calendar (to ensure we have an appointment or create one)
        print("Navigating to Calendar...")
        page.goto("http://localhost:3000/dashboard/calendar")

        # Create appointment if needed (simplified, assuming clean state or just create one)
        # Check if we have an appointment at 10:00 today. If not, create.
        today = datetime.now().strftime("%Y-%m-%d")

        # Try to find a slot or just create one at 10:00
        page.get_by_role("button", name="Nowa Wizyta").click()
        page.wait_for_selector("text=Umów wizytę")

        # Select patient
        page.click("button[role='combobox']")
        page.click("div[role='option']:first-child")

        page.fill("input[type='date']", today)
        page.fill("input[type='time']", "10:00")
        page.get_by_role("button", name="Zapisz wizytę").click()

        # Wait for dialog close
        try:
            page.wait_for_selector("text=Umów wizytę", state="hidden", timeout=10000)
        except:
            pass # Maybe it failed because conflict, ignore for now and try to click existing

        print("Opening Appointment Details...")
        page.wait_for_selector(".bg-blue-100:has-text('10:00')")
        page.click(".bg-blue-100:has-text('10:00')")

        page.wait_for_selector("text=Szczegóły wizyty")

        # 2. Add Note to Appointment
        print("Adding Appointment Note...")
        page.fill("textarea", "To jest notatka do wizyty testowej.")
        page.click("button:has-text('Zapisz notatkę')")

        # Dialog should close
        page.wait_for_selector("text=Szczegóły wizyty", state="hidden")
        print("Appointment Note saved.")

        # 3. Verify Note in Appointment Details
        print("Verifying Appointment Note persistence...")
        page.click(".bg-blue-100:has-text('10:00')")
        page.wait_for_selector("text=Szczegóły wizyty")

        if page.is_visible("text=To jest notatka do wizyty testowej."):
            print("SUCCESS: Appointment note is visible.")
        else:
            print("FAILURE: Appointment note not found.")
            page.screenshot(path="verification/note_failure_1.png")

        # Close dialog
        page.keyboard.press("Escape")

        # 4. Go to Patient Page
        print("Navigating to Patient Page...")
        page.goto("http://localhost:3000/dashboard/patients")

        page.wait_for_selector("text=Pacjenci")
        # Click the first "Szczegóły" button.
        page.click("button:has-text('Szczegóły')")

        page.wait_for_selector("text=Dokumentacja Medyczna")

        # 5. Verify Appointment Note in Patient History
        print("Verifying Appointment Note in Patient Timeline...")
        if page.is_visible("text=To jest notatka do wizyty testowej."):
             print("SUCCESS: Appointment note visible in Patient history.")
        else:
             print("FAILURE: Appointment note not found in Patient history.")
             page.screenshot(path="verification/note_failure_2.png")

        # 6. Add General Note
        print("Adding General Note...")
        # Since NoteEditor for New Note is at the top, we just look for textarea that is empty?
        # Or look for "Nowa notatka" section
        page.fill(".space-y-4:has-text('Nowa notatka') textarea", "To jest notatka ogólna pacjenta.")
        page.click(".space-y-4:has-text('Nowa notatka') button:has-text('Zapisz notatkę')")

        page.wait_for_timeout(2000) # Wait for revalidate

        # 7. Check if new note appeared in the list below "Historia notatek"
        if page.is_visible("text=To jest notatka ogólna pacjenta."):
             print("SUCCESS: General note added and visible.")
        else:
             print("FAILURE: General note not found.")
             page.screenshot(path="verification/note_failure_3.png")

        browser.close()

if __name__ == "__main__":
    verify_notes()
