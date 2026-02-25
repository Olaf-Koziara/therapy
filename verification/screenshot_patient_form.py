from playwright.sync_api import sync_playwright
import time

def screenshot_patient_form():
    print("Starting screenshot verification for Patient Form...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to Patients page...")
            page.goto("http://localhost:3000/dashboard/patients")

            # Open dialog
            page.click("button:has-text('Dodaj Pacjenta')")
            page.wait_for_selector("text=Nowy Pacjent")

            # Fill some fields to show labels work and placeholders are visible
            page.get_by_label("Imię", exact=True).click() # Focus to show ring?

            # Take screenshot of the dialog
            # Locate the dialog content
            dialog = page.locator("div[role='dialog']")
            dialog.screenshot(path="verification/patient_form_dialog.png")
            print("Screenshot saved to verification/patient_form_dialog.png")

        except Exception as e:
            print(f"Script error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    screenshot_patient_form()
