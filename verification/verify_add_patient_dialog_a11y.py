from playwright.sync_api import Page, expect, sync_playwright

def verify_a11y_labels(page: Page):
    page.goto("http://localhost:3000/dashboard/patients")

    # Open dialog
    page.get_by_role("button", name="Dodaj Pacjenta").click()
    page.wait_for_selector("text=Nowy Pacjent")

    # Check if inputs are correctly associated with labels by clicking the labels
    # Clicking a valid label should focus the corresponding input

    labels_to_test = [
        ("Imię", "firstName"),
        ("Nazwisko", "lastName"),
        ("Telefon", "phone"),
        ("Email (opcjonalnie)", "email"),
        ("PESEL", "pesel"),
        ("Data Urodzenia", "birthDate"),
        ("Imię opiekuna (dla dzieci)", "guardianName"),
    ]

    for label_text, input_id in labels_to_test:
        label = page.locator(f"label:has-text('{label_text}')").first
        # Click the label
        label.click()
        # Verify the corresponding input is focused
        focused_id = page.evaluate("document.activeElement.id")
        if focused_id != input_id:
            print(f"FAILED: Label '{label_text}' did not focus input '{input_id}'. Focused: '{focused_id}'")
            page.screenshot(path="verification/a11y_fail.png")
            return
        print(f"SUCCESS: Label '{label_text}' focused input '{input_id}'.")

    # Take a screenshot of the open dialog
    page.screenshot(path="verification/add_patient_dialog_a11y.png")
    print("All labels are correctly associated with their inputs.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_a11y_labels(page)
        finally:
            browser.close()
