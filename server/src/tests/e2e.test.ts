//Please be noticed!!!!!!!!

// if you are running this test locally, you have to build the project before the test
// you can do it with the command yarn build

// if you are running this test in devcontainer, you have to run client dev server before the test
// you can do it with the command yarn start in the client terminal

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
