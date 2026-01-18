import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Use the stealth plugin to make Puppeteer harder to detect
puppeteer.use(StealthPlugin());

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// Reusable browser launch configuration to keep code DRY
const launchConfig = {
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
};

// Scrapes a list of products from a search query page
export const searchProducts = async (searchQuery) => {
  let browser;
  let page;
  console.log(`Starting search scrape for: "${searchQuery}"`);

  try {
    browser = await puppeteer.launch(launchConfig);
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Improved User Agent to look more human
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    await autoScroll(page);

    const productContainerSelector = [
      "div.jIjQ8S", 
      "div.tUxRFH", 
      "div._1AtVbE", 
      "div.slAVV4",
      "div._4ddWXP", 
    ].join(", ");

    console.log(`Waiting for product containers...`);
    await page.waitForSelector(productContainerSelector, { timeout: 20000 });

    const products = await page.evaluate((selector) => {
      const results = [];
      const cards = document.querySelectorAll(selector);

      cards.forEach((card) => {
        // Find Title: tries the new 'RG5Slk' class first, then older ones
        const titleEl = card.querySelector(
          "div.RG5Slk, div.KzDlHZ, a.wjcEIp, a.s1Q9rs, div._4rR01T",
        );

        // Find Price: tries the new 'hZ3P6w' class first
        const priceEl = card.querySelector(
          "div.hZ3P6w, div.Nx9bqj, div._30jeq3",
        );

        // Find Image: tries 'UCc1lI' first
        const imageEl = card.querySelector(
          "img.UCc1lI, img.DByuf4, img._396cs4",
        );

        //Find Link: look for the anchor tag wrapping the product
        const linkEl = card.querySelector("a.k7wcnx, a.VJA3rP, a._1fQZEK");

        if (titleEl && priceEl && imageEl && linkEl) {
          results.push({
            title: titleEl.innerText.trim(),
            price: priceEl.innerText.trim(),
            link: linkEl.href,
            image: imageEl.src,
          });
        }
      });
      return results;
    }, productContainerSelector);

    console.log(`Successfully extracted ${products.length} products.`);
    return products;
  } catch (error) {
    console.error(`Search scraper failed: ${error.message}`);
    if (page) await page.screenshot({ path: "debug_error.png" });
    return [];
  } finally {
    if (browser) await browser.close();
  }
};

// Scrapes just the price from a single product detail page URL
export const getLivePrice = async (productUrl) => {
  if (!productUrl) return null;

  let browser;
  let page;
  console.log(`💡 Getting live price from: ${productUrl.substring(0, 70)}...`);

  try {
    browser = await puppeteer.launch(launchConfig);
    page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: "networkidle2", timeout: 20000 });

    // A list of all known price selectors on a product detail page
    const priceSelectors = [
      "div._30jeq3._16Jk6d", // The most common price selector
      "div.C7GNYd", // A new possible selector
      "div.Nx9bqj._4b5DiR", // A selector sometimes reused from search
    ];

    let priceString = null;
    for (const selector of priceSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 }); // Wait briefly for each selector
        priceString = await page.$eval(selector, (el) => el.innerText);
        if (priceString) {
          console.log(
            `[SCRAPER] Success! Found price using selector: "${selector}"`,
          );
          break; // Exit loop once a price is found
        }
      } catch (e) {
        // This is expected if a selector isn't found, so we just continue
      }
    }

    if (!priceString) {
      throw new Error("Could not find any known price selector on the page.");
    }

    return Number(priceString.replace(/[^0-9]/g, ""));
  } catch (error) {
    console.error(
      `❌ Live price scraper failed for ${productUrl}:`,
      error.message,
    );
    if (page) {
      await page.screenshot({ path: "price_scraper_failure.png" });
      console.log(
        "📸 Screenshot of failed page saved to price_scraper_failure.png",
      );
    }
    return null;
  } finally {
    if (browser) await browser.close();
  }
};
