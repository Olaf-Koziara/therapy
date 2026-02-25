from playwright.sync_api import sync_playwright
import time

def verify_patient_form_a11y():
    print("Starting accessibility verification for Patient Form...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to Patients page...")
            page.goto("http://localhost:3000/dashboard/patients")

            # Wait for the page to load, check for the button
            page.wait_for_selector("button:has-text('Dodaj Pacjenta')")
            print("Found 'Dodaj Pacjenta' button.")

            page.click("button:has-text('Dodaj Pacjenta')")
            page.wait_for_selector("text=Nowy Pacjent")
            print("Dialog opened.")

            # Attempt to find inputs by label
            # If labels are not associated, get_by_label will fail to find the input
            # or it might find the label element itself but not the input if implementation is wrong.
            # But get_by_label looks for associated control.

            print("Attempting to fill form using labels...")

            try:
                page.get_by_label("Imię", exact=True).fill("Jan")
                print("SUCCESS: Found 'Imię' input by label.")
            except Exception as e:
                print(f"FAILURE: Could not find 'Imię' input by label. Error: {e}")

            try:
                page.get_by_label("Nazwisko", exact=True).fill("Kowalski")
                print("SUCCESS: Found 'Nazwisko' input by label.")
            except Exception as e:
                print(f"FAILURE: Could not find 'Nazwisko' input by label. Error: {e}")

            try:
                page.get_by_label("Telefon", exact=True).fill("123456789")
                print("SUCCESS: Found 'Telefon' input by label.")
            except Exception as e:
                print(f"FAILURE: Could not find 'Telefon' input by label. Error: {e}")

            try:
                page.get_by_label("PESEL", exact=True).fill("90010112345")
                print("SUCCESS: Found 'PESEL' input by label.")
            except Exception as e:
                print(f"FAILURE: Could not find 'PESEL' input by label. Error: {e}")

            # Check for placeholder existence (visual polish check)
            # We can check if the input has a placeholder attribute
            try:
                # Assuming we found it by label (if not, this check is moot but we can try locator)
                # If get_by_label failed above, we try to find the input by other means to check placeholder
                # But since we want to enforce label association, let's just use the locator from label if possible.
                # If verify fails above, we know we need to fix it.

                # Let's check if the input associated with "Imię" has a placeholder "Jan"
                # This part only runs if get_by_label works
                placeholder = page.get_by_label("Imię", exact=True).get_attribute("placeholder")
                if placeholder:
                     print(f"INFO: 'Imię' placeholder is '{placeholder}'")
                else:
                     print("INFO: 'Imię' has no placeholder.")
            except:
                pass

        except Exception as e:
            print(f"Script error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_patient_form_a11y()
