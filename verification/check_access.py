from playwright.sync_api import sync_playwright

def check_access():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000/dashboard/patients")
            print(f"Title: {page.title()}")
            print(f"URL: {page.url}")
            page.screenshot(path="verification/access_check.png")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    check_access()
