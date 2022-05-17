import puppeteer, { Browser } from "puppeteer";

let browser: Browser;

describe("Complete e2e test", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({args:["--no-sandbox"]});
  });
  afterAll(async () => {
    await browser.close();
  });
  test("Startup logs and static route check", async () => {
    const page = await browser.newPage();
    await page.goto("http://localhost:1337");
    const pageName = await page.title();
    expect(pageName).toBe("Webapp template");
  }, 20000);
});
