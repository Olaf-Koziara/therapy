from playwright.sync_api import sync_playwright, expect

def verify_add_patient_dialog():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:3001")

            print("Opening dialog...")
            page.get_by_role("button", name="Dodaj Pacjenta").click()

            print("Verifying inputs via labels...")
            # Use exact=True to avoid matching "Imię opiekuna..."
            page.get_by_label("Imię", exact=True).fill("Jan")
            page.get_by_label("Nazwisko").fill("Kowalski")
            page.get_by_label("Telefon").fill("123456789")
            page.get_by_label("Email (opcjonalnie)").fill("jan@example.com")

            print("Taking screenshot...")
            page.screenshot(path="verification/add_patient_dialog.png")
            print("Verification successful!")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_add_patient_dialog()
