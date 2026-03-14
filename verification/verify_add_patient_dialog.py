from playwright.sync_api import sync_playwright

def verify_dialog():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:3000/dashboard/patients")

        page.click("button:has-text('Dodaj Pacjenta')")
        page.wait_for_selector("text=Nowy Pacjent")

        # Use an exact locator to avoid matching the table header in the background
        page.get_by_role("dialog").get_by_text("Imię", exact=True).click()
        is_first_name_focused = page.evaluate("document.activeElement.id === 'firstName'")
        print(f"Imię input focused by clicking label: {is_first_name_focused}")

        page.get_by_role("dialog").get_by_text("Nazwisko", exact=True).click()
        is_last_name_focused = page.evaluate("document.activeElement.id === 'lastName'")
        print(f"Nazwisko input focused by clicking label: {is_last_name_focused}")

        page.fill("input#firstName", "Jan")
        page.fill("input#lastName", "Testowy")
        page.fill("input#phone", "123456789")
        page.check("input[type='checkbox']")

        # We will pause the transition somehow to take screenshot of loading state?
        # Alternatively, we just take screenshot before
        page.screenshot(path="verification/add_patient_dialog_before_submit.png")
        print("Screenshot saved to verification/add_patient_dialog_before_submit.png")

        browser.close()

if __name__ == "__main__":
    verify_dialog()
