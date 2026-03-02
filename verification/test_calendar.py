from playwright.sync_api import sync_playwright

def test_calendar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/dashboard/calendar")
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/calendar.png")
        browser.close()

if __name__ == "__main__":
    test_calendar()
