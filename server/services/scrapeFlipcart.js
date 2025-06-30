import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function autoScroll(page) {
  // (autoScroll function remains the same as before)
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

const scrapeFlipkart = async (searchQuery) => {
  let browser;
  let page;
  console.log(`🚀 Starting generic scraper for: "${searchQuery}"`);

  try {
    browser = await puppeteer.launch({ /* ...launch options remain the same... */ });
    page = await browser.newPage();
    // ... all the page.set* options remain the same ...
    await page.setViewport({ width: 1440, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
    });


    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Gracefully handle "No results found" page
    const noResultsSelector = 'div._16VZrA';
    const noResults = await page.$(noResultsSelector); // Use .$ to check for existence without erroring
    if (noResults) {
      console.log(`No results found for "${searchQuery}".`);
      await browser.close();
      return []; // Return an empty array
    }

    await autoScroll(page);
    console.log('Scrolling complete.');

    // ✅ GENERALIZED SELECTORS: We wait for ANY of the known container layouts to appear.
    const productContainerSelector = 'a.CGtC98, div._1AtVbE, div._2kHMtA';
    console.log(`Waiting for any known product container: "${productContainerSelector}"`);
    await page.waitForSelector(productContainerSelector, { timeout: 20000 });
    console.log('Product containers found! Extracting data...');

    const products = await page.evaluate((selector) => {
      const results = [];
      const productCards = document.querySelectorAll(selector);

      productCards.forEach(card => {
        // ✅ GENERALIZED INNER SELECTORS: We look for ANY of the known class names for each element.
        const titleElement = card.querySelector('div.KzDlHZ, div._4rR01T, .s1Q9rs');
        const priceElement = card.querySelector('div.Nx9bqj, div._30jeq3');
        const imageElement = card.querySelector('img.DByuf4, img._396cs4');
        
        // The link can be the card itself if it's an `<a>` tag, or a child `<a>` tag.
        const link = card.tagName === 'A' ? card.href : card.querySelector('a')?.href;

        if (titleElement && priceElement && imageElement && link) {
          results.push({
            title: titleElement.innerText.trim(),
            price: priceElement.innerText.trim(),
            link,
            image: imageElement.src
          });
        }
      });
      return results;
    }, productContainerSelector);

    console.log(`✅ Extracted ${products.length} products.`);
    await browser.close();
    return products;

  } catch (error) {
    console.error(`Scraper failed for "${searchQuery}": ${error.message}`);
    if (browser) await browser.close();
    return []; // Always return an array, even on error.
  }
};

export default scrapeFlipkart;