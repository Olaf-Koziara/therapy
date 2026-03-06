from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # We will insert a patient directly into the DB to avoid UI test flakiness
    import subprocess
    import json
    subprocess.run(["npx", "tsx", "-e", """
        import db from './lib/db';
        db.tenant.findFirst().then(tenant => {
            db.patient.create({
                data: {
                    firstName: 'Test',
                    lastName: 'Patient',
                    phone: '123456789',
                    gdprConsent: true,
                    tenant: { connect: { id: tenant.id } }
                }
            }).then(p => {
                 const now = new Date();
                 db.appointment.create({
                     data: {
                         startDateTime: now,
                         endDateTime: new Date(now.getTime() + 3600000),
                         type: 'KONSULTACJA',
                         price: 100,
                         status: 'SCHEDULED',
                         patient: { connect: { id: p.id } },
                         tenant: { connect: { id: tenant.id } }
                     }
                 }).then(() => console.log('created'));
            });
        });
    """], check=True)

    page.goto("http://localhost:3000/dashboard/calendar")
    page.wait_for_selector("button.border-l-4")

    button = page.locator("button.border-l-4").first
    button.focus()
    page.screenshot(path="verification/calendar_focus.png")

    button.click()
    page.wait_for_selector("text=Szczegóły wizyty")

    payment_button = page.locator("button:has-text('Nieopłacona'), button:has-text('Opłacona')").first
    payment_button.focus()
    page.screenshot(path="verification/dialog_focus.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
