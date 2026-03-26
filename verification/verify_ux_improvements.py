from playwright.sync_api import Page, expect, sync_playwright

def verify_feature(page: Page):
  # Use exact matching to avoid locator collision
  page.goto("http://localhost:3000/dashboard/patients")
  page.wait_for_timeout(500)

  # Test AddPatientDialog loading and error state
  page.get_by_role("button", name="Dodaj Pacjenta").click()
  page.wait_for_timeout(500)

  page.wait_for_selector("text=Nowy Pacjent")

  page.fill("input >> nth=0", "Jan")
  page.fill("input >> nth=1", "Kowalski")
  page.fill("input >> nth=2", "123456789")
  page.check("input[type='checkbox']")

  page.get_by_role("button", name="Zapisz", exact=True).click()

  page.wait_for_timeout(200)
  page.screenshot(path="verification/patient_loading.png")

  page.wait_for_selector("text=Nowy Pacjent", state="hidden")
  page.wait_for_timeout(500)

  # Navigate to calendar to test AddAppointmentDialog
  page.goto("http://localhost:3000/dashboard/calendar")
  page.wait_for_timeout(500)

  page.get_by_role("button", name="Nowa Wizyta").click()
  page.wait_for_selector("text=Umów wizytę")
  page.wait_for_timeout(500)

  page.click("button[role='combobox']")
  page.click("div[role='option']:first-child")

  page.fill("input[type='date']", "2025-01-01")
  page.fill("input[type='time']", "10:00")

  page.get_by_role("button", name="Zapisz wizytę").click()
  page.wait_for_timeout(200)
  page.screenshot(path="verification/appointment_loading.png")

  page.wait_for_selector("text=Umów wizytę", state="hidden")
  page.wait_for_timeout(500)

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(record_video_dir="verification/video")
    page = context.new_page()
    try:
      verify_feature(page)
    except Exception as e:
      print(f"Error: {e}")
    finally:
      context.close()
      browser.close()
