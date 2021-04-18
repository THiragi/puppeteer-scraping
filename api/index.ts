import { VercelRequest, VercelResponse } from "@vercel/node";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { url = "https:takahira.io" } = req.query;
  const urlString = typeof url === "string" ? url : url[0];
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });
  const page = await browser.newPage();
  await page.goto(urlString);
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    title: document.title,
    deviceScaleFactor: window.devicePixelRatio,
  }));
  console.log("Dimensions:", dimensions);

  await browser.close();

  res.send(`a page title is ${dimensions.title}`);
};
